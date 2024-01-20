import React from 'react';

import { Card, BaseProps, Clickable, Text, Flex, Modal } from '/src/libs/atoms';

import { Published } from './published';
import { useApi } from '/src/api';
import { Post } from '/src/libs/types';

import { Link } from '/src/components/link';
import { Tag, TagsInput, TAG_COLOR } from '/src/components/tags-input';

import { LinkExternal } from '@styled-icons/boxicons-regular/LinkExternal';

import { ohthisrussian } from './utils';

const stripFromTags = (s: string) => 
    s?.slice().replace(/<\/?[^>]+(>|$)/g, "") ?? '';

export const Result = ({ item, ...props }: { item: Post } & BaseProps) => {
    const api = useApi();
    const [viewCounted, setViewCounted] = React.useState(false);
    const [visible, setVisible] = React.useState(false);

    const open = React.useCallback(() => {
        const postId = item._id;
        // window.open(item.link, '_blank');
        setVisible(true);

        if (!viewCounted) {
            api.view(postId).then(() => {
                setViewCounted(true);
            }).catch((err) => {
                console.error(err);
                // TODO notification
            });
        }
    }, [setVisible, viewCounted, setViewCounted, item]);

    const close = React.useCallback((e) => {
        e?.stopPropagation();
        setVisible(false);
    }, [setVisible]);

    const titleStripped = React.useMemo(() => stripFromTags(item.title), [item]);
    const contentStripped = React.useMemo(() => stripFromTags(item.preview), [item]);

    const viewsCount = (
        <Text size="14px" weight="400"><strong>{item.views || 0}</strong> {
            ohthisrussian(item.views || 0, 'просмотр', 'просмотра', 'просмотров') 
        }</Text>
    );

    const [tags, setTags] = React.useState(Array.isArray(item.tags) ? item.tags : []);

    const updateTags = React.useCallback(() => {
        api.posts.tags.list(item._id).then(setTags).catch((err) => {
            console.error(err);
            // TODO notify
        });
    }, [item]);

    const removeTag = React.useCallback((name: string) => {
        api.posts.tags.detach(item._id, name).then(() => {
            updateTags();
        }).catch((err) => {
            console.error(err);
            // TODO notify
        });
    }, [item]);
        
    const attachTag = React.useCallback((name: string) => {
        api.posts.tags.attach(item._id, name).then(() => {
            updateTags();
        }).catch((err) => {
            console.error(err);
            // TODO notify
        });
    }, [item, updateTags]);

    return (
        <Clickable onClick={open} w="calc(50% - 6px)"background="#e7e7e7" p="12px 16px" radius="8px" {...props}>
            <Text line="1.2" mb="8px" size="22px" weight="800">{titleStripped}</Text>
            <Text mb="12px" size="16px" weight="400">{contentStripped.substr(0, 250)}...</Text>

            <Flex mb="16px" justify="flex-start" gap="8px">
                {tags.map((tag) => (
                    <Tag key={tag} color={TAG_COLOR}>
                        <Text size="12px" weight="800" color="#ffffff">{tag}</Text>
                    </Tag>
                ))}
            </Flex>

            <Flex gap="24px" justify="flex-start">
                <Published date={item.pubDate} />

                {viewsCount}
            </Flex>

            {visible && (
                <Modal name="view" onClose={close}>
                    <Card mw="600px" background="#e7e7e7" p="16px" radius="8px">
                        <Text line="1.2" mb="12px" size="22px" weight="800" dangerouslySetInnerHTML={{ __html: item.title }} />

                        <Text mb="12px" size="16px">
                            Если ссылка не открылась в новой вкладке,&nbsp;
                            <Link color="#cccccc" href={item.link}>нажмите сюда <LinkExternal size="18px" color="#333" /></Link>
                        </Text>

                        <Text mb="12px" size="16px">
                            Помогите другим пользователям быстрее найти эту статью, дав свою оценку и проставив тэги.
                        </Text>

                        <TagsInput canCreate={true} mb="12px" value={tags} onRemove={removeTag} onAttach={attachTag} />

                        <Flex mt="24px" gap="24px" justify="flex-start">
                            <Published date={item.pubDate} />

                            {viewsCount}
                        </Flex>
                    </Card>
                </Modal>
            )}
        </Clickable>
    );
};
import React from 'react';

import { Base, BaseProps, Clickable, Text, Flex, Modal } from '/src/libs/atoms';

import { Published } from './published';
import { useApi } from '/src/api';

import { ohthisrussian } from './utils';

export type Item = {
    _id: string;
    title: string;
    content: string;
    pubDate: string;
    link: string;
    views: number;
};

const stripFromTags = (s: string) => 
    s.slice().replace(/<\/?[^>]+(>|$)/g, "");

export const Result = ({ item, ...props }: { item: Item } & BaseProps) => {
    const api = useApi();
    const [visible, setVisible] = React.useState(false);

    const open = React.useCallback(() => {
        const postId = item._id;
        // window.open(item.link, '_blank');
        setVisible(true);

        api.view(postId).then(console.log).catch(console.log);
    }, [setVisible, item]);

    const close = React.useCallback(() => {
        setVisible(false);
    }, []);

    const titleStripped = React.useMemo(() => stripFromTags(item.title), [item]);
    const contentStripped = React.useMemo(() => stripFromTags(item.content), [item]);
    // const contentPreview = contentStripped.length > 260 ? contentStripped.slice(0, 260) + '...'

    const viewsCount = (
        <Text size="14px" weight="400"><strong>{item.views || 0}</strong> {
            ohthisrussian(item.views || 0, 'просмотр', 'просмотра', 'просмотров') 
        }</Text>
    );

    return (
        <Clickable onClick={open} w="calc(50% - 6px)"background="#e7e7e7" p="12px 16px" radius="8px" {...props}>
            <Text line="1.2" mb="8px" size="22px" weight="800">{titleStripped}</Text>
            <Text mb="12px" size="16px" weight="400">{contentStripped.substr(0, 250)}...</Text>

            <Flex gap="24px" justify="flex-start">
                <Published date={item.pubDate} />

                {viewsCount}
            </Flex>

            {visible && (
                <Modal name="view" onClose={close}>
                    <Clickable mw="600px" background="#e7e7e7" p="16px" radius="8px">
                        <Text line="1.2" mb="8px" size="22px" weight="800" dangerouslySetInnerHTML={{ __html: item.title }} />

                        <Base mh="500px" style={{ overflowY: 'auto' }}>
                            <Text 
                                weight="400" 
                                style={{ fontSize: '12px' }} 
                                dangerouslySetInnerHTML={{ __html: item.content }}
                            />
                        </Base>

                        <Flex mt="24px" gap="24px" justify="flex-start">
                            <Published date={item.pubDate} />

                            {viewsCount}
                        </Flex>
                    </Clickable>
                </Modal>
            )}
        </Clickable>
    );
};
import React from 'react';

import { Base,  Container, Text, Flex, Clickable } from '/src/libs/atoms';
import { LineInput } from '/src/libs/inputs';

import { useApi } from '/src/api';

import { Published } from './components/published';
import { Footer } from './components/footer';

const PAGE_SIZE = 10;

export default () => {
    const api = useApi();

    const [query, setQuery] = React.useState('');
    const [data, setData] = React.useState([] as any[]);
    const [count, setCount] = React.useState(0);

    const search = React.useCallback(() => {
        api.search(query, 0).then(({ count, data }) => {
            setData(data);
            setCount(count);
        }).catch((err) => {
            // TODO notify
        });
    }, [query, setData, setCount]);

    const more = React.useCallback(() => {
        api.search(query, Math.floor(data.length / PAGE_SIZE)).then(({ count, data }) => {
            setData(($) => $.concat(data));
            setCount(count);
        }).catch((err) => {
            // TODO notify
        });
    }, [data, query, setData, setCount]);

    return (
        <Container p="128px 0">
            <Flex dir="column" mw="800px" m="0px auto">
                <Base mb="32px" >
                    <Text align="center" size="52px" weight="800">RSS поиск</Text>
                    <Text align="center" size="18px" weight="400">Ищите блог посты по RSS лентам</Text>
                </Base>

                <LineInput mb="20px" value={query} onChange={setQuery} background="#e7e7e7" placeholder="Ваш запрос" size="16px" />

                <Flex mb="64px" gap="12px">
                    <Clickable onClick={search} background="#e7e7e7" p="8px 12px" radius="4px">
                        <Text size="16px" weight="800">Поиск</Text>
                    </Clickable>

                    {/* <Clickable background="#e7e7e7" p="8px 12px" radius="4px">
                        <Text size="16px" weight="800">Мне повезет</Text>
                    </Clickable> */}
                </Flex>

                <Base mb="20px" w="100%">
                    <Flex gap="12px" isWrap w="100%" justify="flex-start" align="flex-start">
                        {data.map((item) => (
                            <Clickable key={item._id} w="calc(50% - 6px)"background="#e7e7e7" p="12px 16px" radius="8px">
                                <Text line="1.2" mb="8px" size="22px" weight="800">{item.title}</Text>
                                <Text mb="12px" size="16px" weight="400">{item.content.substr(0, 200)}</Text>

                                <Flex gap="24px" justify="flex-start">
                                    <Published date={item.pubDate} />
                                    <Text size="14px" weight="400"><strong>0</strong> просмотров</Text>
                                </Flex>
                            </Clickable>
                        ))}
                    </Flex>
                </Base>
                
                {data.length < count && (
                    <Flex gap="12px">
                        <Clickable onClick={more} background="#e7e7e7" p="8px 12px" radius="4px">
                            <Text size="16px" weight="800">Ещё</Text>
                        </Clickable>
                    </Flex>
                )}

                <Footer mt="64px" />
            </Flex>
        </Container>
    );
};

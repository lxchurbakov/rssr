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
    const [data, setData] = React.useState(null as any);
    const [count, setCount] = React.useState(0);
    const [time, setTime] = React.useState(0);

    const search = React.useCallback(() => {
        api.search(query, 0).then(({ count, data, time }) => {
            setData(data);
            setCount(count);
            setTime(time);
        }).catch((err) => {
            // TODO notify
        });
    }, [query, setData, setCount, setTime]);

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
                    <Text align="center" size="18px" weight="400">Ищите посты по RSS лентам блогов</Text>
                </Base>

                <Base w="100%" mb="64px">
                    <Flex gap="12px">
                        <LineInput onEnter={search} w="100%" value={query} onChange={setQuery} background="#e7e7e7" placeholder="Ваш запрос" size="16px" />

                        <Clickable onClick={search} background="#e7e7e7" p="7px 12px" radius="4px">
                            <Text size="16px" weight="800">Поиск</Text>
                        </Clickable>
                    </Flex>

                    {data !== null && (
                        <Base mt="12px">
                            <Text size="14px" weight="400">Найдено {count} результатов ({(time / Math.pow(10, 9)).toFixed(4)}s)</Text>
                        </Base>
                    )}
                </Base>

                <Base mb="20px" w="100%">
                    <Flex gap="12px" isWrap w="100%" justify="flex-start" align="flex-start">
                        {(data || []).map((item) => (
                            <Clickable key={item._id} w="calc(50% - 6px)"background="#e7e7e7" p="12px 16px" radius="8px">
                                <Text line="1.2" mb="8px" size="22px" weight="800">{item.title}</Text>
                                <Text mb="12px" size="16px" weight="400">{item.content.substr(0, 250)}...</Text>

                                <Flex gap="24px" justify="flex-start">
                                    <Published date={item.pubDate} />
                                    <Text size="14px" weight="400"><strong>0</strong> просмотров</Text>
                                </Flex>
                            </Clickable>
                        ))}
                    </Flex>
                </Base>
                
                {(data || []).length < count && (
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

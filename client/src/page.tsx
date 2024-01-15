import React from 'react';

import { Base,  Container, Text, Flex, Clickable } from '/src/libs/atoms';
import { LineInput } from '/src/libs/inputs';
import { Link } from '/src/components/link';

import { useApi } from '/src/api';

export default () => {
    const [query, setQuery] = React.useState('');

    const [results, setResults] = React.useState([
        { title: 'Как правильно срать', content: 'Вы неправильно какаете. Надо правильно' },
        { title: 'Как правильно срать', content: 'Вы неправильно какаете. Надо правильно' },
        { title: 'Как правильно срать', content: 'Вы неправильно какаете. Надо правильно' },
        { title: 'Как правильно срать', content: 'Вы неправильно какаете. Надо правильно' },
    ] as any);

    const api = useApi();

    const performSearch = React.useCallback(() => {
        api.search(query).then((data) => {
            setResults(data);
        }).catch(console.log);
    }, [api, query, setResults]);

    return (
        <Container p="128px 0">
                <Flex dir="column" mw="800px" m="0px auto">
                    <Base mb="32px" >
                        <Text size="52px" weight="800">RSS поиск</Text>
                        <Text size="18px" weight="400">Ищите блог посты по RSS лентам</Text>
                    </Base>

                    <LineInput mb="20px" value={query} onChange={setQuery} background="#e7e7e7" placeholder="Ваш запрос" size="16px" />

                    <Flex mb="64px" gap="12px">
                        <Clickable onClick={performSearch} background="#e7e7e7" p="8px 12px" radius="4px">
                            <Text size="16px" weight="800">Поиск</Text>
                        </Clickable>

                        {/* <Clickable background="#e7e7e7" p="8px 12px" radius="4px">
                            <Text size="16px" weight="800">Мне повезет</Text>
                        </Clickable> */}
                    </Flex>

                    <Base mb="20px" w="100%">
                        <Flex gap="12px" isWrap w="100%">
                            {results.map((item) => (
                                <Clickable w="calc(50% - 6px)"background="#e7e7e7" p="12px 16px" radius="8px">
                                    <Text line="1.2" mb="8px" size="22px" weight="800">{item.title}</Text>
                                    <Text mb="12px" size="16px" weight="400">{item.content.substr(0, 200)}</Text>

                                    <Flex gap="24px" justify="flex-start">
                                        <Text size="14px" weight="400">Опубликовано <strong>2</strong> часа назад</Text>
                                        <Text size="14px" weight="400"><strong>0</strong> просмотров</Text>
                                    </Flex>
                                </Clickable>
                            ))}
                        </Flex>
                    </Base>

                    <Flex mb="64px" gap="12px">
                        <Clickable background="#e7e7e7" p="8px 12px" radius="4px">
                            <Text size="16px" weight="800">Ещё</Text>
                        </Clickable>
                    </Flex>

                    <Flex gap="32px">
                        <Text size="14px" weight="400">
                            Создано для&nbsp;
                            <Link href="https://gist.github.com/lxchurbakov/5e855f20a70d09e60e25431265666162">
                                Vas3k Indiehacker Jam
                            </Link>
                            
                        </Text>

                        <Link href="https://gist.githubusercontent.com/lxchurbakov/5e855f20a70d09e60e25431265666162/raw/b061668cdae57526a9d63c69b999187db0740828/feeds.json">
                            <Text size="14px" weight="400">Сурс фидов</Text>
                        </Link>
                    </Flex>
                </Flex>
        </Container>
    );
};

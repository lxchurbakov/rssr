import _ from 'lodash';
import React from 'react';

import { Base,  Container, Text, Flex, Clickable } from '/src/libs/atoms';
import { LineInput } from '/src/libs/inputs';

import { Link } from '/src/components/link';
import { TagsInput } from '/src/components/tags-input';
import { useTicker } from '/src/libs/hooks';

import { useApi } from '/src/api';

import { Footer } from './components/footer';
import { Sorter } from './components/sorter';
import { Result } from './components/result';

const PAGE_SIZE = 10;

const fill = <T,>(size: number, predicate: (index: number) => T): T[] => {
    return new Array(size).fill(0).map((_, index) => predicate(index));
};

export default () => {
    const api = useApi();
    const ticker = useTicker();

    // Search parameters (input data)
    const [sort, setSort] = React.useState(['pubDate', -1] as [string, number]);
    const [query, setQuery] = React.useState('');
    const [tagsQuery, setTagsQuery] = React.useState([]);
    const [pages, setPages] = React.useState(0);
    
    // Search outcome (output data)
    const [dataQuery, setDataQuery] = React.useState(null);
    const [data, setData] = React.useState(null as any);
    const [count, setCount] = React.useState(0);
    const [time, setTime] = React.useState(0);

    // Main search function
    const search = React.useCallback(async () => {
        console.log('search', query, tagsQuery, sort);

        // Since we are going all declarative way:
        // we should firstly figure out what pages
        // we need if we already have data. - idea 
        // here that it should not fetch more than
        // 1 page at once
        const pagesToFetch = (() => {
            if (dataQuery === query) { // the query didn't change
                console.log(pages, data.length)
                return fill(pages, ($) => $).filter(($) => {
                    return $ * PAGE_SIZE <= data.length;

                    // 0 * 10 < 10 = false

                });
            }

            // Otherwise (if the query has changed)
            // we simply return the pages that were
            // requested
            return fill(pages, ($) => $);
        })();

        // console.log(pagesToFetch)

        // Now: we proced to fetch all the pages and
        // merge them with the stuff we already have
        const newData = await Promise.all(pagesToFetch.map(async (page) => {
            const { count, time, data } = await api.posts.search(query, page, sort, tagsQuery);

            return { count, time, data, page };
        }));

        // console.log(newData)

        // Now we can save the time (the biggest one)
        // and do the same for count (though it should be same)
        setTime(Math.max(...newData.map(({ time }) => time)));
        setCount(Math.max(...newData.map(({ count }) => count)));

        setData(($) => {
            // Since we know that data will always start from
            // beginning we can assume $ fills N first pages
            const oldPages = _.chunk($, PAGE_SIZE);
            const maxPage = Math.max(...newData.map(({ page }) => page));
            const newPages = fill(maxPage + 1, (index) => {
                return newData.find(($) => $.page === index)?.data ?? null;
            });

            const mergedPages = newPages.map((page, index) => {
                return page || oldPages[index];
            });

            // console.log({ oldPages, maxPage, newPages, mergedPages })

            setData(mergedPages.reduce((acc, page) => acc.concat(page), []));
        }); 

        setDataQuery(query);
    }, [data, sort, query, tagsQuery, dataQuery, pages, setTime, setCount, setData, setDataQuery]);

    // Now we proceed to perform search every time something 
    // changes - tags, sort or tags, but not the query
    React.useEffect(() => {
        if (pages > 0) {
            search();
        }
    }, [ticker, pages, sort, tagsQuery]);

    const mainTrigger = React.useCallback(() => {
        setPages(1);
        ticker.update();
    }, [ticker, setPages]);

    const secondTrigger = React.useCallback(() => {
        setPages(($) => $ + 1);
    }, [setPages]);

    const [tagsSearchVisible, setTagsSearchVisible] = React.useState(false);

    const showTagsSearch = React.useCallback(() => {
        setTagsSearchVisible(true);
    }, [setTagsSearchVisible]);

    const hideTagsSearch = React.useCallback(() => {
        setTagsSearchVisible(false);
        setTagsQuery([]);
    }, [setTagsQuery, setTagsSearchVisible]);

    const attachTagQuery = React.useCallback((name: string) => {
        setTagsQuery(($) => $.concat([name]));
        // setTimeout(() => search(), 1);
    }, [search, setTagsQuery]);

    const detachTagQuery = React.useCallback((name: string) => {
        setTagsQuery(($) => $.filter(($$) => $$ !== name));
        // search();
    }, [search, setTagsQuery]);

    return (
        <Container p="128px 0">
            <Flex dir="column" mw="800px" m="0px auto">
                <Base mb="32px" >
                    <Text align="center" size="52px" weight="800">RSS поиск</Text>
                    <Text align="center" size="18px" weight="400">Ищите посты по RSS лентам блогов</Text>
                </Base>

                <Base w="100%" mb="64px">
                    <Flex gap="12px">
                        <LineInput onEnter={mainTrigger} w="100%" value={query} onChange={setQuery} background="#e7e7e7" placeholder="Ваш запрос" size="16px" />

                        <Clickable onClick={mainTrigger} background="#e7e7e7" p="7px 12px" radius="4px">
                            <Text size="16px" weight="800">Поиск</Text>
                        </Clickable>
                    </Flex>

                    {tagsSearchVisible && (
                        <TagsInput mt="8px" canCreate={false} value={tagsQuery} onAttach={attachTagQuery} onRemove={detachTagQuery} />
                    )}

                    {data !== null && (
                        <Flex mt="12px" justify="space-between" align="center">
                            <Flex gap="8px">
                                <Base>
                                    <Text size="14px" weight="400">Найдено {count} результатов ({(time / Math.pow(10, 9)).toFixed(4)}s)</Text>
                                </Base>
                                
                                <Text size="14px" weight="400">
                                    {tagsSearchVisible ? (
                                        <Link onClick={hideTagsSearch}>
                                            Убрать тэги 
                                        </Link>
                                    ) : (
                                        <Link onClick={showTagsSearch}>
                                            Добавить тэги к поиску
                                        </Link>
                                    )}                                    
                                </Text>
                            </Flex>

                            <Sorter value={sort} onChange={setSort} />
                        </Flex>
                    )}
                </Base>

                <Base mb="20px" w="100%">
                    <Flex gap="12px" isWrap w="100%" justify="flex-start" align="flex-start">
                        {(data || []).map((item) => (
                            <Result item={item} key={item._id} />
                        ))}
                    </Flex>
                </Base>
                
                {(data || []).length < count && (
                    <Flex gap="12px">
                        <Clickable onClick={secondTrigger} background="#e7e7e7" p="8px 12px" radius="4px">
                            <Text size="16px" weight="800">Ещё</Text>
                        </Clickable>
                    </Flex>
                )}

                <Footer mt="64px" />
            </Flex>
        </Container>
    );
};

import React from 'react';

import { Flex, Text } from '/src/libs/atoms';
import { Link } from '/src/components/link';

// TODO to env
const JAM_LINK = 
    'https://gist.github.com/lxchurbakov/5e855f20a70d09e60e25431265666162';

const FEEDS_SOURCE_LINK = 
    'https://gist.githubusercontent.com/lxchurbakov/5e855f20a70d09e60e25431265666162/raw/cade6bcf2d9ee7580a6fb7249e81ae60b8910062/feeds.json';

export const Footer = ({ ...props }) => {
    return (
        <Flex gap="32px" {...props}>
            <Text size="14px" weight="400">
                Создано для&nbsp;
                <Link href={JAM_LINK}>
                    Vas3k Indiehacker Jam
                </Link>
                
            </Text>

            <Link href={FEEDS_SOURCE_LINK}>
                <Text size="14px" weight="400">Сурс фидов</Text>
            </Link>
        </Flex>
    );
};

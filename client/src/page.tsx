import React from 'react';

import { Container, Text } from '/src/libs/atoms';

export default () => {
    return (
        <Container p="128px 0">
            <Text size="52px" weight="800">RSS поиск</Text>
            <Text size="18px" weight="400">Ищите блог посты по RSS лентам</Text>
        </Container>
    );
};

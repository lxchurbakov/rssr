import React from 'react';
import styled from 'styled-components';

import { BaseProps, Absolute, Card } from '/src/libs/atoms';
import { colors } from '/src/libs/theme';

const DropdownWrap = styled(Card)`
    box-shadow: 0 0 4px 0 rgba(0,0,0,.12);
`;

export type PositionProps = {
    left?: string;
    right?: string;
    top?: string;
    bottom?: string;
};

export const Dropdown = ({ 
    children, background, left, top, right, bottom, radius, ...props 
}: React.PropsWithChildren<{ background?: string, radius?: string } & PositionProps & BaseProps>) => {
    return (
        <Absolute {...{ left, right, top, bottom }}>
            <DropdownWrap background={background || colors.white} {...props}>
                {children}
            </DropdownWrap>
        </Absolute>
    );
};

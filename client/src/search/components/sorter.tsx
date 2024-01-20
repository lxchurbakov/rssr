import React from 'react';
import styled from 'styled-components';

import { Base, Absolute, Relative, Clickable, Card, Text } from '/src/libs/atoms';

import { Link } from '/src/components/link';
import { Dropdown } from '/src/components/dropdown';

import { useClickOutside } from '/src/libs/hooks';

export type Value = [string, number];
export type Option<T> = { label: string, value: T };
export type Options<T> = Option<T>[];

const compare = (a: Value, b: Value) => {
    return a[0] === b[0] && a[1] === b[1] ? 0 : 1;  
};

const OPTIONS = [
    { label: 'новые', value: ['pubDate', -1] },
    { label: 'старые', value: ['pubDate', 1] },
    { label: 'наиболее просмотренные', value: ['views', -1] },
    { label: 'наименее просмотренные', value: ['views', 1] },
] as Options<Value>;

const Option = styled(Clickable)`
    display: block;

    &:hover {
        background: #f0f0f0;
    }
`;

export const Sorter = ({ value, onChange, ...props }) => {
    const [visible, setVisible] = React.useState(false);

    const open = React.useCallback(() => setVisible(true), [setVisible]);
    const close = React.useCallback(() => setVisible(false), [setVisible]);

    const title = React.useMemo(() => OPTIONS.find(($) => compare($.value, value) === 0)?.label || 'по беспределу', [value])

    return (
        <Relative ref={useClickOutside(close)} {...props}>
            <Text size="14px" weight="400">
                Сначала <Link onClick={open}>{title}</Link>
            </Text>

            {visible && (
                <Dropdown top="32px" right="0" w="200px" radius="8px" background="#ffffff">
                    {OPTIONS.map((option) => (
                        <Option p="4px 12px" key={option.value} onClick={() => onChange(option.value)}>
                            <Text size="14px" weight="400">
                                {option.label}
                            </Text>
                        </Option>
                    ))}
                </Dropdown>
            )}
        </Relative>
    );
};
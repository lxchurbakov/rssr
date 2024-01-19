import React from 'react';
import styled from 'styled-components';

import { BaseProps, Relative, Base, Flex, Text, Card, Clickable } from '/src/libs/atoms';
import { LineInput } from '/src/libs/inputs';
import { Dropdown } from '/src/components/dropdown';
import { Option, Input } from '/src/libs/types';

import { useApi } from '/src/api';

import { CloseOutline } from '@styled-icons/evaicons-outline/CloseOutline';

const TAG_COLOR = '#3f51b5';

const Option = styled(Clickable)`
    display: block;

    &:hover {
        background: #cccccc;
    }
`;

export const Tag = ({ color, children, onRemove, ...props }: React.PropsWithChildren<{ color: string, onRemove?: () => void }> & BaseProps) => {
    return (
        <Card p="2px 6px" radius="4px" background={color} {...props}>
            <Flex>
                <Base>
                    {children}
                </Base>
                
                {onRemove && (
                    <Clickable onClick={onRemove}>
                        <CloseOutline size="18px" color="#ffffff" />
                    </Clickable>
                )}
            </Flex>
        </Card>
    );
};

export const TagsInput = ({ value, onRemove, onAttach, ...props }: { value: string[], onRemove: (name: string) => void, onAttach: (name: string) => void } & BaseProps) => {
    const api = useApi();
    const [query, setQuery] = React.useState('');

    const remove = React.useCallback((index: number) => {
        onRemove(value[index]);
    }, [onRemove, value]);

    const [visible, setVisible] = React.useState(false);

    const show = React.useCallback(() => setVisible(true), [setVisible]);
    const hide = React.useCallback(() => setTimeout(() => setVisible(false), 100), [setVisible]);

    const [options, setOptions] = React.useState([] as Option[]);

    const updateOptions = React.useCallback(() => {
        api.tags.search(query).then((tags) => {
            setOptions(tags.map((tag) => ({
                label: tag.name,
                value: tag.name,
            })))
        }).catch((err) => {
            // TODO add notifications
        });
    }, [query, setOptions]);

    React.useEffect(() => {
        updateOptions();
    }, [query]);

    // Create new tag (we also should update the 
    // list of tags we have found)
    const create = React.useCallback(() => {
        api.tags.create(query).then(() => {
            updateOptions();
            onAttach(query);
        }).catch((err) => {
            // TODO add notifications
        });
    }, [query, updateOptions]);

    console.log(value)

    return (
        <Base {...props}>
            <Base mb="12px">
                <Flex justify="flex-start" gap="8px">
                    {value.map((tag, index) => (
                        <Tag color={TAG_COLOR} onRemove={() => remove(index)}>
                            <Text size="12px" weight="800" color="#ffffff">{tag}</Text>
                        </Tag>
                    ))}
                </Flex>
            </Base>

            <LineInput 
                value={query} 
                onChange={setQuery} 
                background="#dddddd" 
                color="#333" 
                placeholder="Название тэга"
                onFocus={show}
                onBlur={hide}
            />

            <Relative>
                {visible && query.length > 0 && (
                    <Dropdown top="8px" left="0" w="100%" radius="8px" background="#dddddd">
                        {options.map((option) => (
                            <Option onClick={() => onAttach(option.value)} key={option.value} p="8px">
                                <Tag color={TAG_COLOR}>
                                    <Text size="12px" weight="800" color="#ffffff">{option.label}</Text>
                                </Tag>
                            </Option>
                        ))}

                        <Option p="8px" onClick={create}>
                            <Text size="14px" weight="800" color="#333333">
                                Создать тэг&nbsp;&nbsp;
                                
                                <Tag color={TAG_COLOR}>
                                    <Text size="12px" weight="800" color="#ffffff">{query}</Text>
                                </Tag>
                            </Text>
                        </Option>
                    </Dropdown>
                )}
            </Relative>
        </Base>
    );  
};

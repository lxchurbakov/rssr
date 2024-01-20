import React from 'react';
import { createPortal } from 'react-dom';
import styled, { css } from 'styled-components';

import { CloseOutline } from '@styled-icons/evaicons-outline/CloseOutline';

import * as theme from './theme';
import { useListener } from './hooks';

export type PropsOf<T> = T extends React.FC<infer P> ? P : never;

export type BaseProps = {
    p?: string;
    pt?: string;
    pl?: string;
    pr?: string;
    pb?: string;
    m?: string;
    mt?: string;
    mr?: string;
    mb?: string;
    ml?: string;
    w?: string;
    h?: string;
    mw?: string;
    mh?: string;
};

export const Base = styled.div<BaseProps>`
    padding: ${props => props.p};
    padding-top: ${props => props.pt};
    padding-right: ${props => props.pr};
    padding-left: ${props => props.pl};
    padding-bottom: ${props => props.pb};
    margin: ${props => props.m};
    margin-top: ${props => props.mt};
    margin-right: ${props => props.mr};
    margin-left: ${props => props.ml};
    margin-bottom: ${props => props.mb};
    width: ${props => props.w};
    height: ${props => props.h};
    max-width: ${props => props.mw};
    max-height: ${props => props.mh};

    box-sizing: border-box;
`;

export const Flex = styled(Base)<{
    dir?: 'row' | 'column';
    align?: 'center' | 'flex-start' | 'flex-end';
    justify?: 'center' | 'flex-start' | 'flex-end' | 'space-around' | 'space-between';
    isWrap?: boolean;
    gap?: string;
}>`
    display: flex;
    flex-direction: ${props => props.dir || 'row'};
    align-items: ${props => props.align || 'center'};
    justify-content: ${props => props.justify || 'center'};
    flex-wrap: ${props => props.isWrap ? 'wrap' : 'nowrap'};
    gap: ${props => props.gap || '0'};
`;

export const Text = styled(Base)<{ size?: string, weight?: string, color?: string, line?: string }>`
    font-family: Manrope, sans;
    font-size: ${props => props.size || '16px'};
    font-weight: ${props => props.weight || 400};
    color: ${props => props.color || theme.colors.text};
    line-height: ${props => props.line || '1.6'};
    text-align: ${props => props.align};
`;

export const Mono = styled(Text)`
    font-family: Monospace;
`;

export const Image = styled.img<BaseProps>`
    padding: ${props => props.p};
    padding-top: ${props => props.pt};
    padding-right: ${props => props.pr};
    padding-left: ${props => props.pl};
    padding-bottom: ${props => props.pb};
    margin: ${props => props.m};
    margin-top: ${props => props.mt};
    margin-right: ${props => props.mr};
    margin-left: ${props => props.ml};
    margin-bottom: ${props => props.mb};
    width: ${props => props.w};
    height: ${props => props.h};
    max-width: ${props => props.mw};
    max-height: ${props => props.mh};

    box-sizing: border-box;
    object-fit: cover;
`;

export const Card = styled(Base)<{ background?: string, border?: string, radius?: string, hideOverflow?: boolean, block?: boolean, shadow?: string }>`
    display: ${props => props.block ? 'block' : 'inline-block'};
    background: ${props => props.background || 'none'};
    border: ${props => props.border || 'none'};
    border-radius: ${props => props.radius || '0px'};
    overflow: ${props => props.hideOverflow ? 'hidden' : 'visible'};
    box-shadow: ${props => props.shadow || 'none'};
`;

export const Clickable = styled(Card)`
    cursor: pointer;
    user-select: none;

    &:active {
        transform: translateY(1px);
    }
`;

export const Container = ({ children, ...props }: { children: any } & PropsOf<typeof Flex>) => {
    return (
        <Flex {...props}>
            <Base w="100%" mw="1280px" p="0 20px">
                {children}
            </Base>
        </Flex>
    )
};

export const Disabled = styled(Base)<{ disabled: boolean }>`
    ${props => props.disabled && css`
        opacity: .5;
        pointer-events: none;
    `};
`;

const ModalCard = styled(Card)`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 50;
    overflow: hidden;
`;

const CloseModal = styled(Clickable)`
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 51;
`;

const modals = document.getElementById('modals');

export const Modal = ({ name, onClose, children, ...props }: React.PropsWithChildren<{ onClose?: (e?: any) => void, name: string } & BaseProps>) => {
    useListener(window, 'keydown', (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    }, [onClose]);

    return createPortal((
        <ModalCard background="#ffffff99" {...props}>
            {onClose && (
                <CloseModal onClick={onClose}>
                    <Flex dir="column">
                        <CloseOutline size={32} color="#333" />
                        <Text size="14px" color="#333" weight="400">ESC</Text>
                    </Flex>
                </CloseModal>
            )}
            
            <Flex w="100%" h="100%" justify="center" align="center">
                {children}
            </Flex>
        </ModalCard>
    ), modals, name);
};

export const Relative = styled(Base)`
    position: relative;
`;

export const Absolute = styled(Base)`
    position: absolute;
    top: ${props => props.top};
    left: ${props => props.left};
    right: ${props => props.right};
    bottom: ${props => props.bottom};
`;
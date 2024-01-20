import React from 'react';

import { Text } from '/src/libs/atoms';

import { ohthisrussian } from './utils';

const MINUTE = 1000 * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const MONTH = DAY * 30;
const YEAR = MONTH * 12;

const timeage = (date: Date) => {
    const now = new Date();
    const diff = (base) => Math.floor((now.getTime() - date.getTime()) / (base));

    const config = [
        [YEAR, ($) => `${$} ${ohthisrussian($, 'год', 'года', 'лет')} назад`],
        [MONTH, ($) => `${$} ${ohthisrussian($, 'месяц', 'месяца', 'месяцев')} назад`],
        [DAY, ($) => `${$} ${ohthisrussian($, 'день', 'дня', 'дней')} назад`],
        [HOUR, ($) => `${$} ${ohthisrussian($, 'час', 'часа', 'часов')} назад`],
        [MINUTE, ($) => `${$} ${ohthisrussian($, 'минуту', 'минуты', 'минут')} назад`],
    ] as any;

    for (let i = 0; i < config.length; ++i) {
        const $ = diff(config[i][0]);

        if ($ > 0) {
            return config[i][1]($);
        }
    }

    return null;
};

export const Published = ({ date, ...props }) => {
    const text = React.useMemo(() => timeage(new Date(date)), [date]);

    return (
        <Text size="14px" weight="400" {...props}>
            Опубликовано <strong>{text}</strong>
        </Text>
    );
};

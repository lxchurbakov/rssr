export const ohthisrussian = ($: number, f1: string, f2: string, f3: string) => {
    if ($ > 10 && $ < 15) {
        return f3; // 11/12/13/14 лет назад
    }

    if ($ % 10 === 1) {
        return f1; // 1/21/31 год назад
    }

    if ($ % 10 > 1 && $ % 10 < 5) {
        return f2; // 22 года назад - 24 года назад
    }

    return f3; // 15/25/35 (X6/X7/X8/X9/X0) лет назад
};

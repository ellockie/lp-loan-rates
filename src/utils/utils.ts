const constrainValue = (value: number, minVal: number, maxVal: number): number => {
    return isNaN(value)
        ? minVal
        : value > maxVal
            ? maxVal
            : value < minVal
                ? minVal
                : value;
};

const getDateString = (month: number): string => {
    const year = new Date().getFullYear();
    const currentMonth = new Date().getUTCMonth();
    const day = new Date().getUTCDay() + 1;

    return (new Date(Date.UTC(year, currentMonth + month, day))).toLocaleDateString();
};

export const utils = {
    constrainValue,
    getDateString
};

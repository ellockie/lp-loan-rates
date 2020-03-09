export const constrainValue = (value: number, minVal: number, maxVal: number): number => {
    return isNaN(value)
        ? minVal
        : value > maxVal
            ? maxVal
            : value < minVal
                ? minVal
                : value;
};
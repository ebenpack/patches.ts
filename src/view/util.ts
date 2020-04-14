const positionIO = (count: number, index: number): number => {
    const increment = 1.0 / (count + 1);
    return increment * (index + 1);
};

export const calculateTopOffset = (
    height: number,
    bodyPercentage: number,
    count: number,
    index: number
): number =>
    height * (1 - bodyPercentage) +
    height * bodyPercentage * positionIO(count, index);

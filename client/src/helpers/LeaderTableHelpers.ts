export function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}
export const daysWithOutGame = (startDate: Date) => {
    const dateNow = new Date();
    // @ts-ignore
    const diffTime = Math.abs(dateNow - new Date(startDate));
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export const tableTimeWithoutGame = (startDate: string) => {
    const dateNow = new Date();
    // @ts-ignore
    const diffTime = Math.abs(dateNow - new Date(startDate));

    if(Math.floor(diffTime / (1000 * 60 * 60)) < 24) {
        return Math.floor(diffTime / (1000 * 60 * 60)) + ' ч.'
    }
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + ' д.';
}

export const isPossibleUpdateTables = (lastUpdate: Date) : {isPossible: boolean, diffHours: number} => {
    const dateNow = new Date();
    // @ts-ignore
    const differenceTime = Math.abs(new Date() - lastUpdate) / 36e5;
    return {
        isPossible: differenceTime > 24,
        diffHours: Math.round(24 - differenceTime)
    };
}
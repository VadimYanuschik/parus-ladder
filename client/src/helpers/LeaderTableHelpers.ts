export function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}
export const daysWithOutGame = (startDate: Date) => {
    const dateNow = new Date();
    // @ts-ignore
    const diffTime = Math.abs(dateNow - startDate);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}
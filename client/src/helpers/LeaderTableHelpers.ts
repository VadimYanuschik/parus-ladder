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

export const tableTimeWithoutGame = (startDate: Date) => {
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

let ranks = [
    {
        lowerRange: 0,
        upperRange: 3,
        rankName: 'Рядовой'
    },
    {
        lowerRange: 4,
        upperRange: 10,
        rankName: 'Ефрейтор'
    },
    {
        lowerRange: 11,
        upperRange: 20,
        rankName: 'Мл. Сержант'
    },
    {
        lowerRange: 21,
        upperRange: 40,
        rankName: 'Сержант'
    },
    {
        lowerRange: 41,
        upperRange: 60,
        rankName: 'Ст. Сержант'
    },
    {
        lowerRange: 61,
        upperRange: 100,
        rankName: 'Старшина'
    }
]

export const calculateRank = (startDate: Date) : string => {
    const timeWithOutGame = tableTimeWithoutGame(startDate)

    let userRank = ranks.find(rank => {
        if(timeWithOutGame.includes('ч')) {
            return ranks[0].rankName;
        }
        let daysCount = parseInt(timeWithOutGame.split(' ')[0])

        if(rank.lowerRange <= daysCount && daysCount <= rank.upperRange) {
            return rank.rankName;
        }
    })

    return userRank ? userRank.rankName : ranks[0].rankName;
}
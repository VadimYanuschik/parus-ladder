export interface UserProps {
    isVerified: boolean,
    name: string,
    startDate: Date,
    game: string
}

export interface TableProps {
    name: string,
    items: UserProps[]
}
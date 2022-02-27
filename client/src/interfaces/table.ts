import {UserProps} from "./user";

export interface TableProps {
    name: string,
    items: UserProps[]
}

export interface TablesProps {
    tables: TableProps[],
    isLoading: boolean
}

export interface SteamPlayCheckerProps {
    name: string,
    game: string,
    withOutGameDays: number
}
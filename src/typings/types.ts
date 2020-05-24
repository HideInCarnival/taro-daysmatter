export type commemoration = {
    id: string,
    title: string,
    ctime: string,
    type: string,
    aimDate: string,
    isTop: boolean,
    backgroundUrl: string,
    remarks: string,
    isTransverse: boolean
}
export interface DaysType {
    name: string,
    default: boolean
}
export interface InitConfig {
    defaultBg: string[],
    eventArr: commemoration[],
    daysType: DaysType[],
    mainFormat: string
}

export enum moveDerection {
    left,
    right
}
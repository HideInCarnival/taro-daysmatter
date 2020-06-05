import Taro from '@tarojs/taro'
import { DaysType } from '../../typings/types'
export const SETTYPES: string = "setTypes";

export function createSetTypesAction(daysType: DaysType[]) {
    const action = {
        type: SETTYPES,
        payload: daysType
    }
    return async function(dispatch) {
        dispatch(action)
        await Taro.setStorage({
            key: "daysType",
            data: daysType
        })
    }
    // return {
    //     type: SETTYPES,
    //     payload: daysType
    // }
}
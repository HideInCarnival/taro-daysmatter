import Taro from '@tarojs/taro'
export const SETBGS: string = "setBgs";

export function createSetBgsAction(bgs: string[]) {
    const action = {
        type: SETBGS,
        payload: bgs
    }
    return async function(dispatch) {
        dispatch(action)
        await Taro.setStorage({
            key: "backgrounds",
            data: bgs
        })
    }
    // return {
    //     type: SETBGS,
    //     payload: bgs
    // }
}
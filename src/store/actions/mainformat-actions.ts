import Taro from '@tarojs/taro'

export const SETFORMAT: string = "setFormat";
export function createSetMainFormatAction(format: string) {
    const action = {
        type: SETFORMAT,
        payload: format
    }
    return async function(dispatch) {
        dispatch(action)
        await Taro.setStorage({
            key: "mainFormat",
            data: format
        })
    }
    // return {
    //     type: SETFORMAT,
    //     payload: format
    // }
}
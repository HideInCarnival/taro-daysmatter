import { commemoration } from '../../typings/types'
import Taro from '@tarojs/taro'
export const SETEVENTS: string = "setEvents";

export function createSetEventsAction(events: commemoration[]) {
    const action = {
        type: SETEVENTS,
        payload: events
    }
    return async function(dispatch) {
        dispatch(action)
        await Taro.setStorage({
            key: "events",
            data: events
        })
    }
    // return {
    //     type: SETEVENTS,
    //     payload: events
    // }
}
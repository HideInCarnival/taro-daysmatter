import initConfig from '../../init.config'
import { SETEVENTS } from '../constants'
const initialState = initConfig.eventArr

export default (state = initialState, { type, payload }) => {
    switch (type) {

    case SETEVENTS:
        return payload ? [...payload] : state
    default:
        return state
    }
}

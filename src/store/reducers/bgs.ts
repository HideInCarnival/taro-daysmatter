import initConfig from '../../init.config'
import { SETBGS } from '../constants'
const initialState = initConfig.defaultBg

export default (state = initialState, { type, payload }) => {
    switch (type) {

    case SETBGS:
        return payload ? [...payload] : state
    default:
        return state
    }
}
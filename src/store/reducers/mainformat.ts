import initConfig from '../../init.config'
import { SETFORMAT } from '../constants'
const initialState = initConfig.mainFormat

export default (state = initialState, { type, payload }) => {
    switch (type) {

    case SETFORMAT:
        return payload ? payload : state
    default:
        return state
    }
}
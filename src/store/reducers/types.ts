import initConfig from '../../init.config'
import { SETTYPES } from '../constants'
const initialState = initConfig.daysType

export default (state = initialState, { type, payload }) => {
    switch (type) {

    case SETTYPES:
        return payload ? [...payload] : state

    default:
        return state
    }
}
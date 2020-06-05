import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './reducers'
const middlewears = [
    thunkMiddleware
]

export default function configStore() {
    const store = createStore(rootReducer, applyMiddleware(...middlewears))
    return store
}
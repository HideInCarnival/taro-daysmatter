import Taro, { Component, Config } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import Index from './pages/index'
import initConfig from './init.config'
import './app.styl'
import 'taro-ui/dist/style/index.scss'
import configStore from './store'
// actions
import {createSetBgsAction} from './store/actions/bgs-actions'
import {createSetEventsAction} from './store/actions/events-actions'
import {createSetMainFormatAction} from './store/actions/mainformat-actions'
import {createSetTypesAction} from './store/actions/types-actions'
const store = configStore();
// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }
class App extends Component {
  constructor() {
    super()
    this.init()
  }
  async checkStorage(name: string) {
    const result = await Taro.getStorage({
      key: name
    })
    return result;
  }
  async init() {
    try {
      const result = await this.checkStorage('backgrounds');
      store.dispatch(createSetBgsAction(result.data));
    } catch (error) {
      if (error) {
        await Taro.setStorage({
            key: 'backgrounds',
            data: initConfig.defaultBg
        })
      }
    }

    try {
      const result = await this.checkStorage('events');
      store.dispatch(createSetEventsAction(result.data));
    } catch (error) {
      if (error) {
        await Taro.setStorage({
            key: 'events',
            data: initConfig.eventArr
        })
      }
    }

    try {
      const result = await this.checkStorage('daysType');
      store.dispatch(createSetTypesAction(result.data));
    } catch (error) {
      if (error) {
        await Taro.setStorage({
            key: 'daysType',
            data: initConfig.daysType
        })
      }
    }

    try {
      const result = await this.checkStorage('mainFormat');
      store.dispatch(createSetMainFormatAction(result.data));
    } catch (error) {
      if (error) {
        await Taro.setStorage({
            key: 'mainFormat',
            data: initConfig.mainFormat
        })
      }
    }
  }
  componentDidMount () {
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/index/index',
      'pages/typeChoose/typeChoose',
      'pages/preview/preview',
      'pages/largerView/largerView',
      'pages/addDay/addDay'
    ],
    window: {
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'DaysMatter',
      navigationBarTextStyle: 'black'
    }
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))

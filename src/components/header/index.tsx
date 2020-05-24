import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.styl'
import 'taro-ui/dist/style/components/icon.scss'
export default function Header(props) {
    let extraItem = (
        <View className="extra" onClick={props.extraFunc} >
            { props.iconClass && <View className={`extra-icon at-icon ${props.iconClass}`} />}
            <View className="extra-text">
                {props.extraText}
            </View>
        </View>
    );
    return (
        <View className="header">
            <View className="header-text">
                {props.headerText}
            </View>
            { props.isExtra === true ? extraItem : null}
        </View>
    )
}
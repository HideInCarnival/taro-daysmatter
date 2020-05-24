import Taro, { useState } from '@tarojs/taro'
import { View, Input } from '@tarojs/components'
import './index.styl'
import 'taro-ui/dist/style/components/icon.scss'

export default function TypeItem(props) {
    return (
        <View className="type-item" onClick={props.onClick}>
            <View className="type-title">
                { !props.default && props.editing === true ? <Input className="edt-input" onInput={props.onInput} value={props.typeName} /> : props.typeName}
            </View>
            <View onClick={props.delete} className={`at-icon ${!props.editing && props.choose === true ? 'at-icon-check-circle choose' : ''} ${!props.default && props.editing ? 'at-icon-close-circle delete' : ''}`} />
         </View>
    )
}
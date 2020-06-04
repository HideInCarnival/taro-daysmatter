import Taro from '@tarojs/taro'
import { View, Image, ScrollView } from '@tarojs/components'
import './index.styl'
import 'taro-ui/dist/style/components/icon.scss'
export default function AddPic (props) {
    const onChange = async (index) => {
       if(props.handleClick) props.handleClick(index);
    }
    let imgItems = null;
    if(props.backgrounds) {
        const backgrounds = props.backgrounds;
        imgItems = backgrounds.map((ele, index) => {
            return (
                <Image  onClick={() => {onChange(index)}} key={ele} className={`pic-item ${props.activeBg === ele ? 'active': ''}`} src={ele} />
            )
        })
    }
    return(
        <View className={`img-area ${props.size || 'large'}`}>
            <View className="add-pic" onClick={props.onAdd}>
            <View>
                <View className='at-icon at-icon-add' />
            </View>
            <View>添加</View>
            </View>
            <ScrollView scrollX={true} className="choose_pic">
                {imgItems}
            </ScrollView>
        </View>
    )
}
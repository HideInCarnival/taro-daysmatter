import Taro, { useState, useRouter, useScope, useEffect } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './preview.styl'
import { getDaysDis, formatToday, transDate } from '../../utils/timeFormat';
export default function Preview() {
    const $scope = useScope();
    const $router = useRouter();
    const [eventData, setEventData] = useState({
        title: '',
        aimDate: '',
        isTransverse: true,
        remarks: '',
        backgroundUrl: ''
    })
    useEffect(() => {
        let {isTransverse} = $router.params;
        let bIsTransverse = true;
        if(isTransverse === 'true') {
            bIsTransverse = true;
        }else {
            bIsTransverse = false
        }
        const tmpInfo = {...$router.params, isTransverse: bIsTransverse}
        setEventData({
            ...eventData,
            ...tmpInfo
        })
    }, [])
    
    const toTransverse = () => {
        setEventData({
            ...eventData,
            isTransverse: true
        })
    }
    const toPortrait = () => {
        setEventData({
            ...eventData,
            isTransverse: false
        })
    }
    const saveFormat = () => {
        const eventChannel = $scope.getOpenerEventChannel();
        eventChannel.emit('setNewEventData', {newData: this.state.eventData})
        Taro.navigateBack({
            delta: 1
        })
    }
    const daysDis = getDaysDis(eventData.aimDate, formatToday("YYYY-MM-DD"));
    const dateFromTrans = transDate(eventData.aimDate, 'YYYY年M月D日' ,true);
    return (
        <View className="preview" style={{ backgroundImage: `url(${eventData.backgroundUrl})` }}>
            <View className="mask">
                <View className="header">
                    预览图片
                </View>
                <View className="window">
                    <View className={`pic ${eventData.isTransverse===true?'heng':'shu'}`} style={{ backgroundImage: `url(${eventData.backgroundUrl})` }}>
                        <View className="remark">{eventData.remarks}</View>
                        <View className="title">
                            <View className="tittle_text">{eventData.title}</View>
                            <View className="dis">{ daysDis >= 0 ? '还有' : '已经'}</View>
                        </View>
                        <View className="daysNum">
                            <View>{daysDis < 0 ? - daysDis : daysDis}</View>
                            <View className="icon">Days</View>
                        </View>
                        <View className="date">
                            <View className="time">
                                起始日: {dateFromTrans} 
                            </View>
                        </View>
                    </View>
                </View>
                <View className="formatChoose">
                    <View className={eventData.isTransverse===true?'active': ''} onClick={toTransverse}>文字横向</View>
                    <View className={eventData.isTransverse==true?'':'active'} onClick={toPortrait}>文字纵向</View>
                </View>
                <View className="footer">
                    <View className="save" onClick={saveFormat}>确定</View>
                </View>
            </View>
        </View>
    )
}
import Taro, { useEffect , useState, useRouter} from '@tarojs/taro'
import { useSelector } from '@tarojs/redux'
import { View } from '@tarojs/components'
import initConfig from '../../init.config';
import { transDate, formatToday, getDaysDis } from '../../utils/timeFormat'
import { InitConfig } from '../../typings/types'
import './largerView.styl'
export default function LargerView() {
    const $router = useRouter();
    const events = useSelector(state => (state as InitConfig).eventArr)
    const [thisEvent, setThisEvent] = useState(initConfig.eventArr[0])
    let [dateFromTrans, daysDis] = handleDate();
    useEffect(() => {
        const setEvent = () => {
            const query = $router.params;
            const tmpEvents = events.filter(ele => query.id === ele.id);
            if(tmpEvents.length > 0) {
                setThisEvent(tmpEvents[0]);
            }
        }
        setEvent();
    }, [events])

    useEffect(() => {
        [dateFromTrans, daysDis] = handleDate();
    }, [thisEvent.aimDate])

    const edit = () => {
        Taro.navigateTo({
            url: `../addDay/addDay?id=${thisEvent.id}`
        })
    }

    function handleDate() {
        const dateFromTrans = transDate(thisEvent.aimDate, 'YYYY年M月D日' ,true);
        const daysDis = getDaysDis(thisEvent.aimDate, formatToday("YYYY-MM-DD"));
        return [dateFromTrans, daysDis];
    }
    return (
        <View className="largerView" style={{backgroundImage: `url(${thisEvent.backgroundUrl})`}}>
            <View className="header">
                <View onClick={edit}>编辑</View>
            </View>
            <View className={`window ${thisEvent.isTransverse ? 'heng' : 'shu'}`}>
                <View className="remark">{thisEvent.remarks}</View>
                <View className="text">
                    <View className="title">
                    <View>{thisEvent.title}</View>
                        <View>{ daysDis >= 0 ? '还有' : '已经'}</View>
                    </View>
                    <View className="daysNum">
                    <View>{daysDis < 0 ? - daysDis : daysDis}</View>
                        <View className="icon">Days</View>
                    </View>
                    <View className="date">
                        <View className="time">
                            起始日：{dateFromTrans}
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}
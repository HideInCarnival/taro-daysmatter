import Taro, { useState, useEffect, useRouter } from '@tarojs/taro'
import { useDispatch, useSelector } from '@tarojs/redux'
import { View, Form, Input, Picker, Textarea, Button } from '@tarojs/components'
import { AtList, AtListItem } from 'taro-ui'
import { formatToday, createUniqueID } from '../../utils/timeFormat'
import AddPic from '../../components/addPic'
import { createSetEventsAction } from '../../store/actions/events-actions'
import { createSetBgsAction } from '../../store/actions/bgs-actions'
import { InitConfig } from '../../typings/types'
import './addDay.styl'
export default function AddDay() {
    const today = formatToday('YYYY-MM-DD')
    const dispatch = useDispatch()
    const $router = useRouter()
    const id = $router.params.id;
    const typeRange = useSelector(state => (state as InitConfig).daysType)
    const backgrounds = useSelector(state => (state as InitConfig).defaultBg)
    const events = useSelector(state => (state as InitConfig).eventArr)
    const mainFormat = useSelector(state => (state as InitConfig).mainFormat)
    const [eventData, setEventData] = useState({
        id: createUniqueID(),
        title: '',
        ctime: today,
        aimDate: today,
        type: typeRange[0]['name'],
        isTop: false,
        backgroundUrl: 'http://q9zrzlbr5.bkt.clouddn.com/bg1.jpg',
        remarks: '',
        isTransverse: true
    });
    // getTypeRange
    useEffect(() => {
        const editEvent = async () => {
            if(events.length > 0) {
                const goodEvent = events.filter(ele => ele.id === id)
                setEventData(goodEvent[0])
            }
        }
        if(id) {
            editEvent();
        }
    }, [])
    

    const onDateChange = e => {
        setEventData({
            ...eventData,
            aimDate: e.target.value
        })
    }
    
    const isTopChange = e => {
        setEventData({
            ...eventData,
            isTop: e.target.value
        })
    }
    const onTitleChange = e => {
        setEventData({
            ...eventData,
            title: e.target.value
        })
    }

    const changeType = () => {
        Taro.navigateTo({
            url: `../typeChoose/typeChoose?type=${eventData.type}`,
            events: {
                getNewType(data) {
                    setEventData({
                        ...eventData,
                        type: data.type.name
                    })
                }
            }
        })
    }

    const onRemarksChange = e => {
        setEventData({
            ...eventData,
            remarks: e.target.value
        })
    }

    const formSubmit = async () => {
        if(id) {
            let tmpEvents = [...events]
            for(let i = 0;i < tmpEvents.length; i++) {
                if(tmpEvents[i].id === id) {
                    tmpEvents[i] = eventData
                }
            }
            dispatch(createSetEventsAction(tmpEvents))
        }else {
            if (events) {
                dispatch(createSetEventsAction([...events, eventData]))
            }else {
                console.log('without an event array!');
            }
        }
        Taro.reLaunch({
            url: '../index/index'
        })
    }

    const deleteEvent = async () => {
        if (id) {
            const newEvents = events.filter(ele => ele.id !== id);
            dispatch(createSetEventsAction(newEvents))
            Taro.reLaunch({
                url: '../index/index'
            })
        }
        return false
    }
    const addNewBg = async () => {
        const res = await Taro.chooseImage({
          count: 1,
          sourceType: ['album']
        });
        const tempPicPath = res.tempFilePaths[0];
        const newBgs = [...backgrounds, tempPicPath];
        dispatch(createSetBgsAction(newBgs))
    }
    const toPreview = (index) => {
        Taro.navigateTo({
            url: `../preview/preview?backgroundUrl=${backgrounds[index]}&title=${eventData.title}&aimDate=${eventData.aimDate}&remarks=${eventData.remarks}&isTransverse=${eventData.isTransverse}`,
            events: {
                setNewEventData(data) {
                    setEventData({
                        ...eventData,
                        ...data.newData
                    })
                }
            }
        })
    }
    return (
        <View className="addDay" style={{backgroundImage: `url(${mainFormat})`, backgroundSize: "cover"}}>
            <View className="add_form">
                <Form onSubmit={formSubmit}>
                    <View className="title">
                         <Input auto-focus name="title" onInput={(e) => {onTitleChange(e)}} value={eventData.title} placeholder="点击这里输入事件名称" confirm-type="done" type="text" placeholder-class="holder" /*bindinput="getContent"*/ ></Input>
                    </View>
                    <View className="aimDay">
                        <View>
                            <Picker name="aimDate" mode="date" value={eventData.aimDate} onChange={onDateChange}>
                                <AtList hasBorder={false}>
                                    <AtListItem hasBorder={false} title="目标日" extraText={eventData.aimDate}></AtListItem>
                                </AtList>
                            </Picker>
                        </View>
                    </View>
                    <View className="type">
                        <AtList hasBorder={false}>
                            <AtListItem
                                onClick={changeType}
                                arrow="right"
                                hasBorder={false}
                                title='分类'
                                extraText={eventData.type}
                            />
                        </AtList>
                    </View>
                    <View className="setTop">
                        <AtList hasBorder={false}>
                            <AtListItem
                                hasBorder={false}
                                title="置顶"
                                isSwitch
                                switchColor='rgb(100,200,100)'
                                switchIsCheck={eventData.isTop}
                                onSwitchChange={isTopChange}
                            />
                        </AtList>
                    </View>
                    <View className="format">
                        <View className="text">版式</View>
                        <AddPic size="large" handleClick={toPreview} activeBg={eventData.backgroundUrl} backgrounds={backgrounds} onAdd={addNewBg} />
                    </View>
                    <View className="remarks">
                        <Textarea name="remarks" value={eventData.remarks} onInput={(e) => {onRemarksChange(e)}} className="writeArea" showConfirmBar={false} maxlength={30} placeholder="备注:(请输入少于30个字符)" placeholder-class="holder"></Textarea>
                    </View>
                    <Button formType="submit">保存</Button>
                    {id ? <Button className="btn-delete" onClick={deleteEvent}>删除事件</Button>: null}
                </Form>
            </View>
        </View>
    )
}

AddDay.config = {
    "navigationBarTitleText": "添加事件"
}
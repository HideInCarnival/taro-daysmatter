import Taro, { useState, useEffect, useRouter } from '@tarojs/taro'
import { View, Form, Input, Picker, ScrollView, Textarea, Image, Button } from '@tarojs/components'
import { AtList, AtListItem } from 'taro-ui'
import { formatToday, createUniqueID } from '../../utils/timeFormat'
import './addDay.styl'
import initConfig from '../../init.config'
export default function AddDay() {
    const today = formatToday('YYYY-MM-DD')
    const $router = useRouter()
    const id = $router.params.id;
    const [typeRange, setTypeRange] = useState(initConfig.daysType)
    const [backgrounds, setBackgrounds] = useState(initConfig.defaultBg)
    const [events, setEvents] = useState(initConfig.eventArr)
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
        const getRangeType = async () => {
            const result = await Taro.getStorage({key: 'daysType'});
            setTypeRange(result.data)
        }
        const getBgs = async () => {
            const result = await Taro.getStorage({key: 'backgrounds'});
            setBackgrounds(result.data)
        }
        const editEvent = async () => {
            const result = await Taro.getStorage({key: 'events'});
            const events = result.data;
            setEvents(result.data);
            if(events.length > 0) {
                const goodEvent = events.filter(ele => ele.id === id)
                setEventData(goodEvent[0])
            }
        }
        getRangeType();
        getBgs();
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
        const events = await Taro.getStorage({
            key: 'events'
        })
        if(id) {
            let tmpEvents = [...events.data]
            for(let i = 0;i < tmpEvents.length; i++) {
                if(tmpEvents[i].id === id) {
                    tmpEvents[i] = eventData
                }
            }
            await Taro.setStorage({
                key: 'events',
                data: tmpEvents
            })
        }else {
            if (events.data) {
                await Taro.setStorage({
                    key: 'events',
                    data: [...events.data, eventData]
                })
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
            await Taro.setStorage({
                key: 'events',
                data: newEvents
            })
            Taro.reLaunch({
                url: '../index/index'
            })
        }
        return false
    }

    const toPreview = (index) => {
        setEventData({
            ...eventData,
            backgroundUrl: backgrounds[index]
        })
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
    const imgItems = backgrounds.map((ele, index) => {
        return (
            <Image onClick={() => {toPreview(index)}} key={ele} className={`pic-item ${eventData.backgroundUrl === ele ? 'active': ''}`} src={ele} />
        )
    })
    return (
        <View className="addDay" style={{backgroundImage: "url(http://q9zrzlbr5.bkt.clouddn.com/bg1.jpg)", backgroundSize: "cover"}}>
            <View className="header">添加新的纪念日</View>
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
                        <View className="pics">
                            <View className="add_pic">
                                <View>
                                    <View className='at-icon at-icon-add'></View>
                                </View>
                                <View>添加</View>
                            </View>
                            <ScrollView scrollX={true} className="choose_pic">
                                {imgItems}
                            </ScrollView>
                        </View>
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
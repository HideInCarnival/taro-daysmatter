import Taro, {useState, useEffect} from '@tarojs/taro'
import { View, Text, ScrollView, Image, Button} from '@tarojs/components'
import { judgeMoveDeg, judgeMoveDerection } from '../../utils/judgeMoveAction'
import { getDaysDis, formatToday, transDate } from '../../utils/timeFormat'
import { moveDerection, commemoration } from '../../typings/types'
import initConfig from '../../init.config'
import './index.styl'

export default function Index() {
  const today = formatToday('YYYY-MM-DD');
  const com: commemoration[] = [];
  const [isFormat, setIsFormat] = useState(false);
  const [events, setEvents] = useState(initConfig.eventArr);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [mainFormat, setMainFormat] = useState('');
  const [backgrounds, setBackgrounds] = useState(initConfig.defaultBg);
  const [daysType, setDaysType] = useState(initConfig.daysType);
  const [chooseType, setChooseType] = useState(0);
  const [topList, setTopList] = useState(com);
  const [normalList, setNormalList] = useState(com);

  useEffect(() => {
    const getDefaultFormat = async () => {
      const result = await Taro.getStorage({
        key: 'mainFormat'
      })
      setMainFormat(result.data);
    }

    const getEventData = async () => {
      const result = await Taro.getStorage({key: 'events'});
      setEvents(result.data);
    }

    const getBgs = async () => {
      const result = await Taro.getStorage({key: 'backgrounds'});
      setBackgrounds(result.data)
    }

    const getTypes = async () => {
      const result = await Taro.getStorage({
        key: 'daysType'
      })
      setDaysType([{name: '全部'},...result.data]);
    }

    getDefaultFormat();
    getTypes();
    getBgs();
    getEventData();
  }, [])

  useEffect(() => {
    setTopNormal();
  }, [events])

  const slideToRight = () => {
    setIsFormat(true)
  }

  const slideToLeft = () => {
    setIsFormat(false)
  }

  const getTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setStartY(e.touches[0].clientY);
  }

  const judgeMoveAction = (e) => {
    const moveDisX = e.touches[0].clientX - startX;
    const moveDisY = e.touches[0].clientY - startY;
    // judge move degree
    const ifEffectiveMove = judgeMoveDeg(moveDisX, moveDisY);
    // judge move derection
    if (ifEffectiveMove) {
      const derection = judgeMoveDerection(moveDisX);
      switch (derection) {
        case moveDerection.left: 
          slideToLeft();
          break;
        case moveDerection.right:
          slideToRight();
          break;
      }
    }
  }

  const changeFormat = async (index) => {
    setMainFormat(backgrounds[index]);
    await Taro.setStorage({
      key: 'mainFormat',
      data: backgrounds[index]
    })
  }

  const setTopNormal = () => {
    const top: commemoration[] = [];
    const normal: commemoration[] = [];
    events.forEach(ele => {
      if (ele.isTop) {
        top.push(ele)
      }
        normal.push(ele)
    });
    setTopList(top);
    setNormalList(normal);
  }

  const changeType = async (e, index) => {
    e.stopPropagation();
    setChooseType(index);
    const top: commemoration[] = [];
    const normal: commemoration[] = [];
    events.forEach(ele => {
      if(index === 0) {
        ele.isTop && top.push(ele);
        normal.push(ele);
      } else {
          if (ele.isTop) {
            top.push(ele)
          }
          if(ele.type === daysType[index].name) {
            normal.push(ele)
          }
        }
    });
    setTopList(top);
    setNormalList(normal);
  }

  // addEvent
  const addEvent = () => {
    Taro.navigateTo({
      url: '../addDay/addDay'
    })
  }

  // to larger view
  const toLargerView = (ele) => {
    Taro.navigateTo({
      url: `../largerView/largerView?id=${ele.id}`
    })
  }
  const imgItems = backgrounds.map((ele, index) => {
    return (
        <Image  onClick={() => {changeFormat(index)}} key={ele} className={`pic-item ${mainFormat === ele ? 'active': ''}`} src={ele} />
    )
  })

  const typeItems = daysType.map((ele, index) => {
    return (
      <View className="type-item-wrapper" key={ele.name}>
        <View className="type-item" onClick={(e) => {changeType(e, index)}}>
          <View className="type-icon at-icon at-icon-sketch" />
          <Text>{ ele.name }</Text>
          {daysType[chooseType].name === ele.name ? <View className="type-icon checked at-icon at-icon-check-circle" /> : null}
        </View>
      </View>
    )
  })

  const topItemList = topList.map((ele) => {
    const daysDis = getDaysDis(ele.aimDate, today);
      return (
        <View className="event-item" onClick={()=> {toLargerView(ele)}} key={ele.id}>
          <View className="title">{ele.title}{daysDis > 0 ? '还有' : '已经'}</View>
          <View className="daysNum">
            <Text className="dis">{daysDis < 0 ? - daysDis : daysDis}</Text>
            <Text className="icon">Days</Text>
          </View>
          <View className="date">
            {transDate(ele.aimDate, 'YYYY.M.D', true)}
          </View>
        </View>
      )
  })

  const normalItemList = normalList.map((ele) => {
    const daysDis = getDaysDis(ele.aimDate, today);
    return (
      <View key={ele.id} className="event-item" onClick={()=> {toLargerView(ele)}}>
        <View className="top-row row">
          <View className="title">{ele.title}{daysDis > 0 ? '还有' : '已经'}</View>
          <View className="dis">{daysDis < 0 ? - daysDis : daysDis}</View>
        </View>
        <View className="down-row row">
          <View className="date">{transDate(ele.aimDate, 'YYYY.M.D', true)}</View>
          <View>Days</View>
        </View>
      </View>
    )
  })

    return (
      <View className="days-matter">
        <View className={`inner-moveable ${isFormat === true ? 'slide-right' : ''}`} onTouchMove={e => {judgeMoveAction(e)}} onTouchStart={e => {getTouchStart(e)}}>
          <View className="format-set" style={{backgroundImage: `url(${mainFormat})`, backgroundSize: '100vw 100vh'}}>
            <View className="format-set-wrapper">
            <View className="header-wrapper">
              <View className="close-wrapper">
                <View className="close at-icon at-icon-close-circle" />
              </View>
            </View>
              <View className="type-list">
                { typeItems }
              </View>
              <View className="format-area">
                <View className="title">
                  <View className="title-icon at-icon at-icon-camera" />
                  <Text>版式</Text>
                </View>
                <View className="img-area">
                  <View className="add-pic">
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
              <Button className="add" onClick={addEvent}>+  添加事件</Button>
            </View>
          </View>
          <View className="main-content" style={{backgroundImage:`url(${mainFormat})`, backgroundSize: 'cover'}}>
            <View className="header">
              <View className="logo">倒数日</View>
              <View className="add" onClick={addEvent}>+添加</View>
            </View>
            <View className="body">
              <ScrollView className="items" scrollY={true}>
                <View className="top-list">
                  { topItemList }
                </View>
                <View className="normal">
                  { normalItemList }
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      </View>
    )
}
import Taro, { useState, useEffect, useRouter, useScope } from '@tarojs/taro'
import { View, Button} from '@tarojs/components'
import Header from '../../components/header'
import TypeItem from '../../components/typeItem'
import initConfig from '../../init.config'
import './typeChoose.styl'
export default function TypeChoose() {
    const router = useRouter();
    const scope = useScope();
    const [isEdit, setIsEdit] = useState(false);
    const [typeList, setTypeList] = useState(initConfig.daysType);
    const [activeIndex, setActiveIndex] = useState(0)
    useEffect( () => {
        // get daystype
        const getTypes = async () => {
            const result = await Taro.getStorage({
                key: 'daysType'
            })
            const daysType = result.data;
            setTypeList(daysType);
        }
        const setFirstTag = () => {
            const firstType = router.params.type;
            for (let i = 0; i < typeList.length; i++) {
                if(typeList[i].name === firstType) {
                    setActiveIndex(i);
                }
            }
        }
        getTypes();
        setFirstTag();
    }, [])

    const editTypeList = () => {
        setIsEdit(true);
    }
    const completeEdit = async () => {
        setIsEdit(false);
        await Taro.setStorage({
            key: 'daysType',
            data: typeList
        })
    }
    const addType = () => {
        editTypeList();
        const tmpArr = [...typeList];
        const tmpItem = {
            name: '新类型',
            default: false
        }
        tmpArr.push(tmpItem);
        setTypeList(tmpArr);
    }

    const deleteType = async (e, index) => {
        if(!isEdit) return
        e.stopPropagation();
        let tmpArr = [...typeList];
        tmpArr.splice(index, 1);
        setTypeList(tmpArr);
        await Taro.setStorage({
            key: 'daysType',
            data: tmpArr
        })
    }

    const chooseType = (index) => {
        if (isEdit) { return }
        setActiveIndex(index);
        const eventChannel = scope.getOpenerEventChannel();
        eventChannel.emit('getNewType', {type: typeList[index]})
    }

    const typeListInput = (e, index) => {
        const tmpArr = typeList;
        tmpArr[index].name = e.target.value
        setTypeList(tmpArr);
    }

    const renderType = typeList.map( (ele, index) => (
        <TypeItem onClick={() => chooseType(index)} onInput={(e) => {typeListInput(e, index)}} editing={isEdit} key={ele.name} delete={(e)=>{deleteType(e, index)}} typeName={ele.name} choose={activeIndex===index?true:false} default={ele.default} />
    ))

    return (
        <View className="type-choose" style={{backgroundImage: "url(http://q9zrzlbr5.bkt.clouddn.com/bg1.jpg)", backgroundSize: 'cover'}}>
            <Header headerText="分类" isExtra={ true } extraText={isEdit===true? '完成':'编辑'} iconClass={isEdit===true ? '': 'at-icon-menu' }  extraFunc={isEdit===true? completeEdit:editTypeList} />
            <View className="type-list">
                { renderType }
            </View>
            <View className="btn-wrapper">
                <Button className="add-type" onClick={addType}>添加新分类</Button>
            </View>
        </View>
    )
}
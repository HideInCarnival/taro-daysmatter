import Taro, { useState, useEffect, useRouter, useScope } from '@tarojs/taro'
import { useDispatch, useSelector } from '@tarojs/redux'
import { View, Button} from '@tarojs/components'
import Header from '../../components/header'
import TypeItem from '../../components/typeItem'
import { createSetTypesAction } from '../../store/actions/types-actions'
import { InitConfig } from '../../typings/types'
import './typeChoose.styl'
export default function TypeChoose() {
    const dispatch = useDispatch()
    const router = useRouter();
    const scope = useScope();
    const [isEdit, setIsEdit] = useState(false);
    const typeList = useSelector(state => (state as InitConfig).daysType)
    const mainFormat = useSelector(state => (state as InitConfig).mainFormat)
    const [activeIndex, setActiveIndex] = useState(0)
    useEffect( () => {
        const setFirstTag = () => {
            const firstType = router.params.type;
            for (let i = 0; i < typeList.length; i++) {
                if(typeList[i].name === firstType) {
                    setActiveIndex(i);
                }
            }
        }
        // getTypes();
        setFirstTag();
    }, [])

    const editTypeList = () => {
        setIsEdit(true);
    }
    const completeEdit = async () => {
        setIsEdit(false);
        dispatch(createSetTypesAction(typeList))
    }
    const addType = () => {
        editTypeList();
        const tmpArr = [...typeList];
        const tmpItem = {
            name: '新类型',
            default: false
        }
        tmpArr.push(tmpItem);
        dispatch(createSetTypesAction(tmpArr))
    }

    const chooseType = (index) => {
        if (isEdit) { return }
        setActiveIndex(index);
        const eventChannel = scope.getOpenerEventChannel();
        eventChannel.emit('getNewType', {type: typeList[index]})
    }

    const deleteType = async (e, index) => {
        if(!isEdit) return
        e.stopPropagation();
        let tmpArr = [...typeList];
        tmpArr.splice(index, 1);
        dispatch(createSetTypesAction(tmpArr))
        setActiveIndex(index - 1)
    }

    const typeListInput = (e, index) => {
        const tmpArr = [...typeList];
        tmpArr[index].name = e.target.value
        dispatch(createSetTypesAction(tmpArr))
    }

    const renderType = typeList.map( (ele, index) => (
        <TypeItem onClick={() => chooseType(index)} onInput={(e) => {typeListInput(e, index)}} editing={isEdit} key={ele.name} delete={(e)=>{deleteType(e, index)}} typeName={ele.name} choose={activeIndex===index?true:false} default={ele.default} />
    ))

    return (
        <View className="type-choose" style={{backgroundImage: `url(${mainFormat})`, backgroundSize: 'cover'}}>
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

TypeChoose.config = {
    "navigationBarTitleText": "选择分类"
}
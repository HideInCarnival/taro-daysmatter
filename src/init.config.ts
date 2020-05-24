import { InitConfig } from './typings/types'
import { createUniqueID } from './utils/timeFormat'
import moment from 'moment'

const getNewYearDate = () => {
    const momentYear = moment().year();
    return `${momentYear + 1}-01-01`
}
getNewYearDate();
const initConfig: InitConfig = {
    defaultBg: ['http://q9zrzlbr5.bkt.clouddn.com/bg1.jpg', 'http://q9zrzlbr5.bkt.clouddn.com/bg2.jpg', 'http://q9zrzlbr5.bkt.clouddn.com/test.jpg'],
    eventArr: [
        {
            id: createUniqueID(),
            title: '新年',
            ctime: moment().format('YYYY-MM-DD'),
            aimDate: getNewYearDate(),
            type: '生活',
            isTop: true,
            backgroundUrl: 'http://q9zrzlbr5.bkt.clouddn.com/bg1.jpg',
            remarks: '',
            isTransverse: true
        }
    ],
    daysType: [
        {
            name: '生活',
            default: true
        },
        {
            name: '工作',
            default: true
        },
        {
            name: '纪念日',
            default: true
        }
    ],
    mainFormat: 'http://q9zrzlbr5.bkt.clouddn.com/bg1.jpg'
}
export default initConfig;
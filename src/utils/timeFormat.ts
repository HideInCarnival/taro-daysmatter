import moment from 'moment';
// const moment = require("moment");
import UUID from 'uuid-js';
export function formatToday(format: string): string {
    return moment().format(format)
}

export function createUniqueID(): string {
    const uuid1 = UUID.create(1);
    return uuid1.toString();
}

export function getDaysDis(t1: string, t2: string) {
    const day1 = moment(t1);
    const day2 = moment(t2);
    return day1.diff(day2, 'days');
}

export function transDate(date: string, format: string, ifWeek: boolean): string {
    const d = moment(date)
    const weekDay = ['星期天','星期一','星期二','星期三','星期四','星期五','星期六']
    if (!ifWeek) {
        return d.format(format);
    }
    const day = d.day();
    return d.format(format) + ' ' + weekDay[day] ;
}
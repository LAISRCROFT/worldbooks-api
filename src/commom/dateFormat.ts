const date = new Date()
const timeZone = 'America/Sao_Paulo'
import { addHours, subHours, format } from 'date-fns'

// var format = require('date-fns/format')
var formatZone = require('date-fns-format-zone')(format)

let currentDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss')

let currentDateInt = formatZone(addHours(date, -4), 'ddMMyyyy', {
    zone: timeZone
})

export = {
    currentDate: format(subHours(new Date(), 3), 'yyyy-MM-dd HH:mm:ss'),
    currentDateInt: format(subHours(new Date(), 3), 'ddMMyyyy')
}
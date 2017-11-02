const {cityCodes} = require('../utils/data')
const request = require('../utils/request')
const _ = require('lodash')
module.exports = {
    getWeather: async ctx => {
        const {cityName = '珠海', townName} = ctx.query
        const cities = cityCodes.filter(city => {
            return !townName ? city.cityName === cityName : city.cityName === cityName && city.townName === townName
        })
        let townID = ''
        if(!_.isEmpty(cities)) {
            townID = cities[0].townID           
        }
        if (townID) {
            const response = await request.get(`/all?city=${townID}`)
            const {status, data} = response
            return status === 200 ? ctx.success({data: data.weather[0]}) : ctx.error({msg: 'bad request', code: 1011, status})
        } else {
            ctx.error({msg: 'area not found', code: 1006, status: 404})            
        }
    } 
}
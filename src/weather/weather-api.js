const config = require('../config')
const request = require('request')



const getWeather = (req, res) => {
    const weatherUrl = config.DARK_SKY_URL
    const weatherKey = process.env.DARK_SKY_KEY
    const lat = req.query.lat
    const lng = req.query.lng
    const url = `${weatherUrl}${weatherKey}/${lat},${lng}`

    request.get(url, (error, res, body) => {
        if(error) {
            return console.error(error)
        }
    }).pipe(res)
}


module.exports = getWeather
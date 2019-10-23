const config = require('../config')
const request = require('request')



const getWeather = (req, res) => {
    const weatherUrl = config.DARK_SKY_URL
    const weatherKey = process.env.DARK_SKY_KEY
    const lat = req.query.lat
    const lng = req.query.lng
    // const lat=47.6062
    // const lng=-122.3321
    const url = `${weatherUrl}${weatherKey}/${lat},${lng}`
    
    console.log(url)

    request.get(url, (error, res, body) => {
        if(error) {
            return console.error(error)
        }
        console.log(JSON.parse(body))

    }).pipe(res)
}


module.exports = getWeather
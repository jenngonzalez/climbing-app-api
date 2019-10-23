const config = require('../config')
const request = require('request')



const getClimbs = (req, res) => {
    const climbsUrl = config.MOUNTAIN_PROJECT_URL
    const climbsKey = process.env.MOUNTAIN_PROJECT_KEY
    const lat = req.query.lat
    const lng = req.query.lng
    // const lat=47.6062
    // const lng=-122.3321

    const url = `${climbsUrl}?lat=${lat}&lon=${lng}&maxDistance=50&minDiff=V0&maxDiff=V15&key=${climbsKey}`
    
    console.log(url)

    request.get(url, (error, res, body) => {
        if(error) {
            return console.error(error)
        }
        console.log(JSON.parse(body))

    }).pipe(res)
}


module.exports = getClimbs
const config = require('../config')
const request = require('request')



const getNearbyClimbs = (req, res) => {
    const climbsUrl = config.MOUNTAIN_PROJECT_URL
    const climbsKey = process.env.MOUNTAIN_PROJECT_KEY
    const lat = req.query.lat
    const lng = req.query.lng

    const url = `${climbsUrl}?lat=${lat}&lon=${lng}&maxResults=100&maxDistance=200&minDiff=V0&maxDiff=V15&key=${climbsKey}`

    request.get(url, (error, res, body) => {
        if(error) {
            return console.error(error)
        }
    }).pipe(res)
}


module.exports = getNearbyClimbs
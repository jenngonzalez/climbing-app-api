module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DARK_SKY_URL: 'https://api.darksky.net/forecast/',
    MOUNTAIN_PROJECT_URL: 'https://www.mountainproject.com/data/get-routes-for-lat-lon',
    DB_URL: process.env.DATABASE_URL || '',
    JWT_SECRET: process.env.JWT_SECRET || '',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '',
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api'
}
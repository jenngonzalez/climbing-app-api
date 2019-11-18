module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DARK_SKY_URL: 'https://api.darksky.net/forecast/',
    MOUNTAIN_PROJECT_URL: 'https://www.mountainproject.com/data/get-routes-for-lat-lon',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://ascend_admin@localhost/ascend_db',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://ascend_admin@localhost/ascend_db_test',
    JWT_SECRET: process.env.JWT_SECRET || 'WBbDbNXhTLxDkzz63PsZAIIIjakdE7IODHTmujkuTmsZfJyzXA1ICYCg5fcVwDN8f/aGBmidsZRU7e4YiasTK28rvX71o969H+dfEppcVauhEY+3P87en0TriMR+Q+Gls3IKZhwTbEu0ptdynmTbNBqsCMWLa+TU7S+khFcOIvDsAed0vr5vVrAHEULBTEeEtJrColFHIdvaThWOasq8hxsH2mMDh3Hxz1r/Eu673VJowUMxn29oZmDVnsNAKPmg8wAa4aCrdj5TNfBEx/Ya1q1JhuAeJX2AIQ4Bx1ik6iWeHQxcDBeP2+y+579kpQRI8O8uch//G53hFxPkviJceg==',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '5h',
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api'
}
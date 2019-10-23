const express = require('express')
const path = require('path')
const UsersService = require('./users-service')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
    .post('/', jsonBodyParser, (req, res, next) => {
        const { email, password } = req.body
        for (const field of ['email', 'password'])
            if(!req.body[field])
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })

        const passwordError = UsersService.validatePassword(password)

        if(passwordError)
            return res.status(400).json({
                error: passwordError
            })

        UsersService.emailInUse(
            req.app.get('db'),
            email
        ) .then(emailInUse => {
            if(emailInUse)
                return res.status(400).json({
                    error: 'Email already in use'
                })
                return UsersService.hashPassword(password)
                        .then(hashedPassword => {
                            const newUser = {
                                email,
                                password: hashedPassword
                            }
                            return UsersService.insertUser(
                                req.app.get('db'),
                                newUser
                            ) .then(user => {
                                res
                                    .status(201)
                                    .location(path.posix.join(req.originalUrl, `${user.email}`)).json(UsersService.serializeUser(user))
                            })
                        })
                        .catch(next)
            })
    })

    module.exports = usersRouter
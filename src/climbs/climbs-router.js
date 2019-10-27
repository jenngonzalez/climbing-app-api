const express = require('express')
const path = require('path')
const ClimbsService = require('./climbs-service')
const AuthService = require('../auth/auth-service')
const { requireAuth } = require('../middleware/jwt-auth')

const climbsRouter = express.Router()
const jsonBodyParser = express.json()


climbsRouter
    .route('/')
    .post(requireAuth, jsonBodyParser, (req, res, next) => {
        const { date, location, climb_name, climb_grade, user_status, image } = req.body
        const newClimb = { date, location, climb_name, climb_grade, user_status, image }

        for (const field of ['location', 'climb_name', 'climb_grade', 'user_status'])
            if (!req.body[field])
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })

        newClimb.user_id = req.user.id

        ClimbsService.insertClimb(
            req.app.get('db'),
            newClimb
        )
            .then(climb => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${climb.id}`))
                    .json(ClimbsService.serializeClimb(climb))
            })
            .catch(next)
    })

climbsRouter
    .route('/:email')
    .all(checkUserExists)
    .get(requireAuth, (req, res, next) => {
        ClimbsService.getClimbsByEmail(
            req.app.get('db'),
            req.params.email
        )
            .then(climbs => {
                if(!climbs) {
                    return res.status(404).json({
                        error: { Message: `Sorry, no climbs have been saved yet.` }
                    })
                }
                res.json(climbs)
            })
            .catch(next)
    })

climbsRouter
    .route('/:email/:climb')
    .all(checkUserExists)
    .delete(requireAuth, (req, res, next) => {
        // deletes a climb based on that climb's ID
        ClimbsService.deleteClimb(
            req.app.get('db'),
            req.params.climb,
            req.params.email
        )
            .then(numRowsAffected => {
                res
                    .status(204)
                    .end()
            })
            .catch(next)
    })
    .patch(jsonBodyParser, requireAuth, (req, res, next) => {
            // TODO STRETCH GOAL
    })



/* async/await syntax for promises */
async function checkUserExists(req, res, next) {
    try {
      const email = await AuthService.getUserWithEmail(
        req.app.get('db'),
        req.params.email
      )
      // how else to get email? pull from JWT sub?
  
      if (!email)
        return res.status(404).json({
          error: `User doesn't exist`
        })
  
      res.email = email
      next()
    } catch (error) {
        console.log(error)
      next(error)
    }
  }

module.exports = climbsRouter
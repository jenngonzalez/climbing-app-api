const knex = require('knex')
const bcrypt = require('bcryptjs')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Users Endpoints', function() {
    let db

    const { testUsers } = helpers.makeAscendFixtures()
    const testUser = testUsers[0]

    before('make knex instance', () => {
        db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL,
    })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`POST /api/users`, () => {
        context(`User Validation`, () => {
            beforeEach('insert users', () =>
                helpers.seedUsers(
                db,
                testUsers,
                )
            )

            const requiredFields = ['email', 'password']

            requiredFields.forEach(field => {
                const registerAttemptBody = {
                    email: 'testemail@email.com',
                    password: 'test password',
                }

                it(`responds with 400 required error when '${field}' is missing`, () => {
                    delete registerAttemptBody[field]

                    return supertest(app)
                        .post('/api/users')
                        .send(registerAttemptBody)
                        .expect(400, {
                            error: `Missing '${field}' in request body`,
                        })
                })
            })

            it(`responds 400 'Password must be longer than 8 characters' when less than 8 characters`, () => {
                const userShortPassword = {
                    email: 'testemail@email.com',
                    password: '1234567'
                }
                return supertest(app)
                    .post('/api/users')
                    .send(userShortPassword)
                    .expect(400, {
                        error: 'Password must be longer than 8 characters'
                    })
            })

            it(`responds 400 'Password must be less than 72 characters' when long password`, () => {
                const userLongPassword = {
                    email: 'testemail@email.com',
                    password: '*'.repeat(73),
                }
                return supertest(app)
                    .post('/api/users')
                    .send(userLongPassword)
                    .expect(400, { error: 'Password must be less than 72 characters' })
            })

            it(`responds 400 error when password starts with spaces`, () => {
                const userPasswordStartsSpaces = {
                    email: 'testemail@email.com',
                    password: ' 1Aa!2Bb@'
                }
                return supertest(app)
                    .post('/api/users')
                    .send(userPasswordStartsSpaces)
                    .expect(400, { error: 'Password must not start or end with empty spaces' })
            })

            it(`responds 400 error when password ends with spaces`, () => {
                const userPasswordEndsSpaces = {
                    email: 'testemail@email.com',
                    password: '1Aa!2Bb@ '
                }
                return supertest(app)
                    .post('/api/users')
                    .send(userPasswordEndsSpaces)
                    .expect(400, { error: 'Password must not start or end with empty spaces' })
            })

            it(`responds 400 error when password isn't complex enough`, () => {
                const userPasswordNotComplex = {
                    email: 'testemail@email.com',
                    password: 'abcabcabc',
                }
                return supertest(app)
                    .post('/api/users')
                    .send(userPasswordNotComplex)
                    .expect(400, { error: 'Password must contain at least 1 uppercase letter and at least 1 number' })
            })

            it(`responds 400 'Email already in use' when email isn't unique`, () => {
                const duplicateUser = {
                    email: testUser.email,
                    password: '11AAaa!!'
                }
                return supertest(app)
                    .post('/api/users')
                    .send(duplicateUser)
                    .expect(400, { error: `Email already in use` })
            })

    })

    context('Happy path', () => {
        it(`responds 201, serialized user, storing bcrypted password`, () => {
            const newUser = {
                email: 'testemail@email.com',
                password: '11AAaa!!'
            }
            return supertest(app)
                .post('/api/users')
                .send(newUser)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.have.property('id')
                    expect(res.body.email).to.eql(newUser.email)
                    expect(res.body).to.not.have.property('password')
                    expect(res.headers.location).to.eql(`/api/users/${res.body.email}`)
                })
                .expect(res => {
                    db
                        .from('ascend_users')
                        .select('*')
                        .where({ id: res.body.id })
                        .first()
                        .then(row => {
                            expect(row.email).to.eql(newUser.email)
                            return bcrypt.compare(newUser.password, row.password)
                        })
                        .then(compareMatch => {
                            expect(compareMatch).to.be.true
                        })
                })
        })
    })
  })
})
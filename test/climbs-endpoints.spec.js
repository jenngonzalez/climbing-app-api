const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Climbs Endpoints', function() {
    let db

    const { testUsers, testClimbs } = helpers.makeAscendFixtures()

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`GET /api/climbs/:email`, () => {
        beforeEach('insert users', () => {
            helpers.seedUsers(db, testUsers)
        })
        beforeEach('insert climbs', () => {
            helpers.seedClimbs(db, testUsers, testClimbs)
        })
        context('Given there are climbs in the database associated with that user', () => {
            it(`returns all climbs matching the user's email`, () => {
                userEmail = testUsers[0].email
                expectedClimb = [testClimbs[2]]
                return supertest(app)
                    .get(`/api/climbs/${userEmail}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(expectedClimb)
            })
        })
        })

    describe(`POST /api/climbs`, () => {
        beforeEach('insert users', () =>
            helpers.seedUsers(db, testUsers)
        )

        it(`creates a climb, responding with 201 and the new climb`, function() {
            const testUser = testUsers[0]
            const newClimb = {
                location: 'test location',
                climb_name: 'test climb name',
                climb_grade: 'V3',
                user_status: 'test user status'
            }
            return supertest(app)
                .post('/api/climbs')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send(newClimb)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.have.property('id')
                    expect(res.body.location).to.eql(newClimb.location)
                    expect(res.body.climb_name).to.eql(newClimb.climb_name)
                    expect(res.body.climb_grade).to.eql(newClimb.climb_grade)
                    expect(res.body.user_status).to.eql(newClimb.user_status)
                    expect(res.body.user.id).to.eql(testUser.id)
                    expect(res.headers.location).to.eql(`/api/climbs/${res.body.id}`)
                })
                .expect(res =>
                    db
                        .from('ascend_climbs')
                        .select('*')
                        .where({ id: res.body.id })
                        .first()
                        .then(row => {
                            expect(row.location).to.eql(newClimb.location)
                            expect(row.climb_name).to.eql(newClimb.climb_name)
                            expect(row.climb_grade).to.eql(newClimb.climb_grade)
                            expect(row.user_status).to.eql(newClimb.user_status)
                            expect(row.user_id).to.eql(testUser.id)
                        })
                )
        })

        const requiredFields = ['location', 'climb_name', 'climb_grade', 'user_status']

        requiredFields.forEach(field => {
            const postAttemptBody = {
                location: 'testLocation',
                climb_name: 'testClimbName',
                climb_grade: 'V2',
                user_status: 'testUserStatus'
            }

            it(`responds with 400 required error when '${field}' is missing`, () => {
                delete postAttemptBody[field]

                return supertest(app)
                    .post('/api/climbs')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .send(postAttemptBody)
                    .expect(400, {
                        error: `Missing '${field}' in request body`
                    })
            })
        })
    })

    describe(`DELETE /api/climbs/:email/:climb`, () => {
        beforeEach('insert users', () =>
            helpers.seedUsers(db, testUsers)
        )
        beforeEach('insert climbs', () => 
            helpers.seedClimbs(db, testUsers, testClimbs)
        )

        context(`Given there are climbs in the database associated with that user`, () => {
            it(`responds with 204 and removes the specified climb`, () => {
                const testUser = testUsers[0].email
                const idToRemove = 1
                const userClimbs = testClimbs.filter(climb => climb.user_id === testUsers[0].id)
                const expectedClimbs = userClimbs.filter(climb => climb.id !== idToRemove)
                return supertest(app)
                    .delete(`/api/climbs/${testUser}/${idToRemove}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(204)
                    .then(res => {
                        return supertest(app)
                            .get(`/api/climbs/${testUser}`)
                            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                            .expect(expectedClimbs)
                    })
            })
        })
    })

    describe.skip(`PATCH /api/climbs/:email/:climb`, () => {
        beforeEach('insert users', () => 
            helpers.seedUsers(db, testUsers)
        )
        beforeEach('insert climbs', () => 
            helpers.seedClimbs(db, testUsers, testClimbs)
        )

        context('Given there are climbs in the database associated with that user', () => {
            it('responds with 200 and updates the climb', () => {
                // TODO
            })

            it(`responds with 400 when given no required fields`, () => {
                // TODO
            })

            it(`responds with 200 when updating only a subset of fields`, () => {
                // TODO
            })
        })
    })
})
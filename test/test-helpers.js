const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


function makeUsersArray() {
  return [
    {
      id: 1,
      email: 'testemail1@email.com',
      password: 'Password1'
    },
    {
      id: 2,
      email: 'testemail2@email.com',
      password: 'Password2'
    },
    {
      id: 3,
      email: 'testemail3@email.com',
      password: 'Password3'
    },
  ]
}

function makeClimbsArray(users) {
    return [
        {
            id: 1,
            date: new Date('2029-01-22T16:28:32.615Z'),
            location: 'test location 1',
            climb_name: 'test name 1',
            climb_grade: 3,
            user_status: 'send',
            image: 'http://www.jpg.com',
            user_id: users[2].id
        },
        {
            id: 2,
            date: new Date('2029-01-22T16:28:32.615Z'),
            location: 'test location 2',
            climb_name: 'test name 2',
            climb_grade: 4,
            user_status: 'send',
            image: 'http://www.jpg.com',
            user_id: users[1].id
        },
        {
            id: 3,
            date: new Date('2029-01-22T16:28:32.615Z'),
            location: 'test location 3',
            climb_name: 'test name 3',
            climb_grade: 5,
            user_status: 'send',
            image: 'http://www.jpg.com',
            user_id: users[0].id
        }
    ]
}

function makeAscendFixtures() {
    const testUsers = makeUsersArray()
    const testClimbs = makeClimbsArray(testUsers)
    return { testUsers, testClimbs }
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }))
    return db.into('ascend_users').insert(preppedUsers)
        .then(() =>
        // update the auto sequence to stay in sync
            db.raw(
                `SELECT setval('ascend_users_id_seq', ?)`, [users[users.length -1].id]
            )
        )
}

function seedClimbs(db, users, climbs) {
    return db.into('ascend_climbs').insert(climbs)
        .then(() => 
        // update the auto sequence to stay in sync
            db.raw(
                `SELECT setval('ascend_climbs_id_seq', ?)`, [users[users.length -1].id]
            )
        )
}

function cleanTables(db) {
    return db.transaction(trx =>
      trx.raw(
        `TRUNCATE
            ascend_users,
            ascend_climbs
        `
      )
      .then(() =>
        Promise.all([
            trx.raw(`ALTER SEQUENCE ascend_users_id_seq minvalue 0 START WITH 1`),
            trx.raw(`ALTER SEQUENCE ascend_climbs_id_seq minvalue 0 START WITH 1`),
            trx.raw(`SELECT setval('ascend_users_id_seq', 0)`),
            trx.raw(`SELECT setval('ascend_climbs_id_seq', 0)`),
        ])
      )
    )
  }

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
        subject: `${user.email}`,
        algorithm: 'HS256'
    })
    return `Bearer ${token}`
}

module.exports = {
    makeUsersArray,
    makeClimbsArray,
    makeAscendFixtures,
    seedUsers,
    seedClimbs,
    cleanTables,
    makeAuthHeader
}
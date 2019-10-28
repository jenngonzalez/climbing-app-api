const xss = require('xss')

const ClimbsService = {

    getById(db, id) {
        return db
            .from('ascend_climbs AS climb')
            .select(
                'climb.id',
                'climb.date',
                'climb.location',
                'climb.climb_name',
                'climb.climb_grade',
                'climb.user_status',
                'climb.image',
                db.raw(
                    `json_strip_nulls(
                        row_to_json(
                            (SELECT tmp FROM (
                                SELECT
                                    usr.id,
                                    usr.email
                                ) tmp)
                        )
                    ) AS "user"`
                )
            )
            .leftJoin(
                'ascend_users AS usr',
                'climb.user_id',
                'usr.id',
            )
            .where('climb.id', id)
            .first()
    },

    getClimbsByEmail(db, email) {
        return db
            .from('ascend_climbs AS climb')
            .select(
                'climb.id',
                'climb.date',
                'climb.location',
                'climb.climb_name',
                'climb.climb_grade',
                'climb.user_status',
                'climb.image',
                'climb.user_id',
                // db.raw(
                //     `json_strip_nulls(
                //         row_to_json(
                //             (SELECT tmp FROM (
                //                 SELECT
                //                     usr.id
                //                 ) tmp)
                //         )
                //     ) AS "user"`
                // )
            )
            .leftJoin(
                'ascend_users AS usr',
                'climb.user_id',
                'usr.id'
            )
            .where('usr.email', email)
    },

    insertClimb(db, newClimb) {
        return db
            .insert(newClimb)
            .into('ascend_climbs')
            .returning('*')
            .then(([climb]) => climb)
            .then(climb =>
                ClimbsService.getById(db, climb.id)
            )
    },

    serializeClimb(climb) {
        const { user } = climb
        return {
            id: climb.id,
            date: new Date(climb.date),
            location: xss(climb.location),
            climb_name: xss(climb.climb_name),
            climb_grade: climb.climb_grade,
            user_status: xss(climb.user_status),
            image: xss(climb.image),
            user_id: climb.user_id,
            user: {
                id: user.id,
                email: user.email
            },
        }
    },

    deleteClimb(db, id) {
        return db
            .from('ascend_climbs')
            .where({ id })
            .delete()
    },

    updateClimb(db, id) {
        // TODO
    }
}


module.exports = ClimbsService
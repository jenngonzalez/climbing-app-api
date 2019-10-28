BEGIN;

TRUNCATE
    ascend_users,
    ascend_climbs
    RESTART IDENTITY CASCADE;

INSERT INTO ascend_users (email, password)
    VALUES
        ('user1@email.com', '$2a$12$fgEWnfm780lcAHmXZwcvG.165fP/MDc/3Hf0UlPMQ0p0jW45BB572'),
        ('user2@email.com', '$2a$12$sF30eHm10UhpiX9JoImIVuDshREmkcMJzPsusws0EGLhtRwx7M0Z.'),
        ('user3@email.com', '$2a$12$MoFQ.TKpDd.7RYLT2EO98ebTOsvb.5uC6qy38kwiWdiV3SORf8jVi');

INSERT INTO ascend_climbs (
    date,
    location,
    climb_name,
    climb_grade,
    user_status,
    image,
    user_id
) VALUES
    (
        '2019-10-16 12:00:00',
        'Gold Bar Boulders',
        'Midnight Lichen',
        4,
        'Project',
        'http://url.com/img.jpg',
        3
    ),
    (
        '2019-10-17 12:00:00',
        'Index',
        'Space Cadets',
        2,
        'Flash',
        'http://url.com/img.jpg',
        2
    ),
    (
        '2019-10-18 12:00:00',
        'Gold Bar Boulders',
        'Beam Me Up',
        2,
        'Send',
        'http://url.com/img.jpg',
        1
    );

COMMIT;
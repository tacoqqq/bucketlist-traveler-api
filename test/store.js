const STORE = {
    Users: [
        {
            id: 1,
            email: 'hello@gmail.com',
            password: '$2a$12$fdjh3g.QhwcEu7sQZbkzC.2qYZnc.hRbqPSfx4io/.phVmmqsB912',
            nickname: 'Corona',
            user_created_time: new Date().toISOString() 

        },
        {
            id: 2,
            email: 'test@gmail.com',
            password: '$2a$12$XBuTpkIBU3K8mxO/VGadu.9JU381HFiWhsyzEfTPciY2T09vCSc0S',
            nickname: 'Test',
            user_created_time: new Date().toISOString() 

        },
        {
            id: 3,
            email: 'daphnefang@gmail.com',
            password: '$2a$12$VyoPKDwms0blvpwFN1t9aOrLg8SHI9tDJv6crSEk4aJfXbG8kwEzq',
            nickname: 'Daphne',
            user_created_time: new Date().toISOString() 
        },
    ],

    Destinations: [
        {
            id: 1,
            destination: 'Taiwan',
            img: 'https://images.unsplash.com/photo-1519275565142-d81952f9e2d1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80',
            coordinate: '{"lat":23.6978, "lng":120.9605}',
            user_id: 1,
            destination_created_time: new Date().toISOString() 
        },       
        {
            id: 2,
            destination: 'Maldives',
            img: 'https://images.unsplash.com/photo-1516815231560-8f41ec531527?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1494&q=80',
            coordinate: '{"lat":3.2028, "lng":73.2207}',
            user_id: 1,
            destination_created_time: new Date().toISOString() 
        },      
        {
            id: 3,
            destination: 'Morocco',
            img: 'https://images.unsplash.com/photo-1540396610404-df314e8f8330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80',
            coordinate: '{"lat":31.7917, "lng":7.0926}',
            user_id: 1,
            destination_created_time: new Date().toISOString() 
        }, 
    ],

    todos: [
        {
            id: 1,
            user_id: 1,
            destination_id: 1,
            content: 'Eat XiaoLongBao',
            checked_active: false,
            todo_created_time: new Date().toISOString() 
        },
        {
            id: 2,
            user_id: 1,
            destination_id: 1,
            content: 'Drink Original Boba',
            checked_active: false,
            todo_created_time: new Date().toISOString() 
        },
        {
            id: 3,
            user_id: 1,
            destination_id: 2,
            content: 'Freediving',
            checked_active: false,
            todo_created_time: new Date().toISOString() 
        },
        {
            id: 4,
            user_id: 1,
            destination_id: 2,
            content: 'Dolphin Spotting',
            checked_active: false,
            todo_created_time: new Date().toISOString() 
        },
        {
            id: 5,
            user_id: 1,
            destination_id: 3,
            content: 'Explore Casablanca',
            checked_active: false,
            todo_created_time: new Date().toISOString() 
        },
        {
            id: 6,
            user_id: 1,
            destination_id: 3,
            content: 'See the Blue Village of Chefchaouen',
            checked_active: false,
            todo_created_time: new Date().toISOString() 
        },
    ]
}

module.exports = { STORE }
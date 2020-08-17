const xss = require("xss")

const DestinationService = {
    getAllDestinations(knex,userId){
        return knex('bucketlist_destinations')
            .select('*')
            .where('user_id',userId)
    },

    insertNewDestination(knex,destinationInfo){
        console.log('inside inserting destination')
        console.log(destinationInfo)
        return knex('bucketlist_destinations')
            .insert(destinationInfo)
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    deleteDestination(knex,destinationId){
        return knex('bucketlist_destinations')
            .where('id', destinationId)
            .delete()
    },

    isThereTheDestination(knex,destinationId){
        return knex('bucketlist_destinations')
            .select('*')
            .where('id', destinationId)
            .first()
    },

    sanitizeDestinationInfo(destinationInfo){
        return {
            id: destinationInfo.id,
            destination: xss(destinationInfo.destination),
            img: xss(destinationInfo.img),
            coordinate: xss(destinationInfo.coordinate),
            user_id: destinationInfo.user_id,
            destination_created_time: destinationInfo.destination_created_time
        }
    },


}

module.exports = DestinationService
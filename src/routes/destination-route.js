const express = require('express');
const DestinationService = require('../services/destination-service');
const ApiService = require('../services/api-service');
const { requireAuth } = require('../middleware/jwt-auth');
const path = require('path');
const destinationRouter = express.Router();
const bodyParser = express.json();

destinationRouter
    .route('/')
    .all(requireAuth)
    .get((req,res,next) => {
        const knexInstance = req.app.get('db')
        const { id } = req.user
        DestinationService.getAllDestinations(knexInstance,id)
            .then(allDestinationsFromThisUser => {
                res.json(allDestinationsFromThisUser)
            })   
            .catch(next)         
    })
    .post(bodyParser, (req,res,next) => {
        const { id } = req.user
        const { destination } = req.body

        if (!destination){
            res.statusMessage = `Missing destination!`
            return res.status(400).end()
        }

        ApiService.getCoordinates(destination)
            .then(response => {
                if (!response){
                    res.statusMessage = `Invalid destination entered for search.`
                    return res.status(400).end()
                }
                coordinate = response

                ApiService.getImages(destination)
                    .then(image => {
                        imageUrl = image ? image : 'https://images.unsplash.com/photo-1496950866446-3253e1470e8e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80'

                        const newDestination = {
                            destination,
                            img: imageUrl,
                            coordinate: JSON.stringify(coordinate),
                            user_id: id
                        }

                        const knexInstance = req.app.get('db')

                        DestinationService.insertNewDestination(knexInstance,newDestination)
                            .then(insertedDestination => {
                                return res
                                        .status(201)
                                        .location(path.posix.join(req.originalUrl, `/${insertedDestination.id}`))
                                        .json(DestinationService.sanitizeDestinationInfo(insertedDestination))
                            })
                            .catch(next)
                    })
                    .catch(next)
            })
            .catch(next)
        })

destinationRouter
    .route('/:destinationId')
    .all(requireAuth, (req,res,next) => {
        const user_id = req.user.id
        const destination_id = Number(req.params.destinationId)
        console.log(destination_id)
        DestinationService.isThereTheDestination(
            req.app.get('db'),
            destination_id
            )
            .then(response => {
                if (!response) {
                    res.statusMessage= 'Bad request: cannot find this destination!'
                    return res.status(404).end()
                }
                res.destination = response
                next();
            })
            .catch(next)        
    })
    .get((req,res,next) => {
        res.json(res.destination)
    })
    .delete((req,res,next) => {
        DestinationService.deleteDestination(
            req.app.get('db'),
            res.destination.id
        )
        .then(response => {
            res.status(204).end()
        })
        .catch(next)
    })


module.exports = destinationRouter
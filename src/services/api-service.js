const { GooglePlacesAPIKey } = require('../config')
const axios = require('axios')
const { response } = require('express')

const ApiService = {
    getCoordinates(destination){
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${destination}&key=${GooglePlacesAPIKey}`
        
        return axios.get(encodeURI(url))
            .then(res => {
                if(res.statusText !== 'OK'){
                    throw new Error(res.statusText)
                }
                return res.data
            })
            .then(resJson => {
                let locationCoordinates = resJson.results[0].geometry.location  
                return locationCoordinates
            })
            .catch(err => {
                console.log(err)
                //console.error(err.message)
            })

    },
    
    
    getImages(place){
        let polishedPlace = place.toLowerCase().split(' ').join('%20')
        const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${polishedPlace}&inputtype=textquery&fields=photos,geometry&key=${GooglePlacesAPIKey}`

        return axios.get(encodeURI(url))
            .then(res => {
                if(res.statusText !== 'OK'){
                    throw new Error(res.message)
                }
                return res.data
            })
            .then(resJson => {
                let locationPhotoReference = resJson.candidates[0].photos[0].photo_reference
                return locationPhotoReference
            })
            .then(reference => {
                const requestUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1600&photoreference=${reference}&key=${GooglePlacesAPIKey}`
                return requestUrl
            })
            .catch(err => {
                console.log(err)
            })
    }

}

module.exports = ApiService
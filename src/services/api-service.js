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
            })
    },
    
    
    getImages(place){
        //To get the place image, Google requires to make an API call to its Place API first and get a so-called "photo reference" 
        const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${place}&inputtype=textquery&fields=photos,geometry&key=${GooglePlacesAPIKey}`
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
                //use the "reference" to make another call to retrieve the image
                const requestUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1600&photoreference=${reference}&key=${GooglePlacesAPIKey}`
                return requestUrl
            })
            .catch(err => {
                console.log(err)
            })
    }

}

module.exports = ApiService
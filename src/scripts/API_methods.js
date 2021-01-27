import {
    blockPlaceUrl,
    getAllMoviesByPeriodUrl,
    getSeanceInfoUrl,
    getSeancePlacesInfoUrl,
    getSeancesByMovieAndDateUrl,
    unblockPlaceUrl
} from './API_URL'
import axios from 'axios'

function log(...args) {
    console.log("ApiMethodsUtil:", ...args);
}

class ApiMethodsUtils {

    static getSeanceInfoById(seanceId) {
        log('Start getting seance info by id:', seanceId);
        let myUrl = `${getSeanceInfoUrl}/${seanceId}`;

        return new Promise((resolve, reject) => {
            axios.get(myUrl)
                .then(response => {
                    log('Finish getting seance info by id:', seanceId)
                    resolve(response);
                })
                .catch(error => reject(error))
        })
    }

    static getSeancePlacesInfoById(seanceId) {
        log('Start getting seance places info by id:', seanceId);
        let myUrl = `${getSeancePlacesInfoUrl}/${seanceId}`;
        log('myUrl:', myUrl);

        return new Promise((resolve, reject) => {
            axios.get(myUrl)
                .then(response => {
                    log('Finish getting seance places info by id:', seanceId)
                    log(response)
                    resolve(response);
                })
                .catch(error => reject(error))
        })
    }

    static blockPlaces(requestBody) {
        log('Start blocking places.');
        return ApiMethodsUtils.blockUnblockPlaces(blockPlaceUrl, requestBody)
    }

    static unblockPlaces(requestBody) {
        log('Start unblocking places.');
        return ApiMethodsUtils.blockUnblockPlaces(unblockPlaceUrl, requestBody)
    }

    static blockUnblockPlaces(url, requestBody) {
        return new Promise((resolve, reject) => {
            axios.put(url, requestBody, {
                auth: {
                    username: "operator@gmail.com",
                    password: "password"
                }})
                .then(response => {
                    log("All Seances in all movie parks::", response);
                    resolve(response);
                })
                .then(blockedPlace => {
                    log('Finish blocking/unblocking places. ', blockedPlace)})
                .catch(error => reject(error))
        })
    }

    static getAllSeancesByMovieAndDate(movieId, dateAsString) {
        log('Start getting all Seances by movie and date.');
        let myUrl = `${getSeancesByMovieAndDateUrl}?movieId=${movieId}&date=${dateAsString}`;

        return new Promise((resolve, reject) => {
            axios.get(myUrl)
                .then(response => {
                    log("All Seances in all movie parks::", response);
                    resolve(response);
                })
                .then(() => log('Finish getting all Seances by movie and date.'))
                .catch(error => reject(error))
        })
    }

    static getTodayMovieList(startPeriodDateStr, endPeriodDateStr) {
        log(`getTodayMovieList by period ${startPeriodDateStr}-${endPeriodDateStr}`);
        let myUrl = `${getAllMoviesByPeriodUrl}?periodStart=${startPeriodDateStr}&periodEnd=${endPeriodDateStr}`;

        return new Promise((resolve, reject) => {
            axios.get(myUrl)
                .then(response => {
                    log("Today movies:", response);
                    log('Finish getting today movies list.')
                    resolve(response);
                })
                .catch(error => reject(error))
        })
    }
}


export default ApiMethodsUtils

import axios from 'axios'
import GeneralUtils from "./general-utils";

const serviceUrl: string = 'http://localhost:9000/movie-park/api';
const getSeanceInfoUrl: string = `${serviceUrl}/seances/info`;
const getSeancePlacesInfoUrl: string = `${serviceUrl}/seances/places/info`;
const blockPlaceUrl: string = `${serviceUrl}/seances/places/block`;
const unblockPlaceUrl: string = `${serviceUrl}/seances/places/unblock`;
const getSeancesByMovieAndDateUrl: string = `${serviceUrl}/seances/all-by-movie-and-date`;
const getAllMoviesByIdSetUrl: string = `${serviceUrl}/movies/all-by-id-set`;
const getAllMoviesByPeriodUrl: string = `${serviceUrl}/movies/all-by-period`;

function log(...args: any[]) {
    GeneralUtils.log("ApiMethodsUtil", ...args);
}

class SeanceInfo {
    seanceId: number;
    seanceDate: string;
    startTime: string;
    endTime: string;
    movieParkId: number;
    movieParkName: string;
    movieId: number;
    movieName: string;
    hallId: number;
    basePrice: number;
    vipPrice: number;

    constructor(seanceId: number, seanceDate: string,
                startTime: string, endTime: string,
                movieParkId: number, movieParkName: string,
                movieId: number, movieName: string,
                hallId: number, basePrice: number,
                vipPrice: number) {
        this.seanceId = seanceId;
        this.seanceDate = seanceDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.movieParkId = movieParkId;
        this.movieParkName = movieParkName;
        this.movieId = movieId;
        this.movieName = movieName;
        this.hallId = hallId;
        this.basePrice = basePrice;
        this.vipPrice = vipPrice;
    }
}

class SeancePlace {
    seanceId: number;
    placeId: number;
    blocked: boolean;

    constructor(seanceId: number,
                placeId: number,
                blocked: boolean) {
        this.seanceId = seanceId;
        this.placeId = placeId;
        this.blocked = blocked;
    }
}

class MovieInfo {
    movieId: number;
    movieName: string;
    imgList: string[];

    static of(movieId: number,
              movieName: string,
              imgList: string[]) {
        return new MovieInfo(movieId, movieName, imgList);
    }

    constructor(movieId: number,
                movieName: string,
                imgList: string[]) {
        this.movieId = movieId;
        this.movieName = movieName;
        this.imgList = imgList;
    }
}

const httpClient = axios.create();
httpClient.defaults.timeout = 5000;

class ApiMethodsUtils {

    public static getSeanceInfoById(seanceId: number): Promise<SeanceInfo> {
        log('Start getting seance info by id:', seanceId);
        let myUrl = `${getSeanceInfoUrl}/${seanceId}`;

        return new Promise((resolve, reject) => {
            httpClient.get(myUrl)
                .then(response => {
                    log('Finish getting seance info by id:', seanceId)
                    resolve(response as unknown as SeanceInfo);
                })
                .catch(error => reject(error))
        })
    }

    public static getSeancePlacesInfoById(seanceId: number): Promise<SeancePlace[]> {
        log('Start getting seance places info by id:', seanceId);
        let myUrl = `${getSeancePlacesInfoUrl}/${seanceId}`;
        log('myUrl:', myUrl);

        return httpClient.get(myUrl)
            .then(response => {
                log(`Finish getting seance places info by id = ${seanceId}:`, response)
                let result: SeancePlace[] = []
                response.data.forEach((key: SeancePlace) => {
                    result.push(key)
                })
                return result;
            })
            .catch(error => error)
    }

    public static blockPlaces(requestBody: Object) {
        log('Start blocking places.');
        return ApiMethodsUtils.blockUnblockPlaces(blockPlaceUrl, requestBody)
    }

    public static unblockPlaces(requestBody: Object) {
        log('Start unblocking places.');
        return ApiMethodsUtils.blockUnblockPlaces(unblockPlaceUrl, requestBody)
    }

    private static blockUnblockPlaces(url: string, requestBody: Object) {
        return httpClient.put(url, requestBody, {
            auth: {
                username: "operator@gmail.com",
                password: "password"
            }
        })
            .then(response => {
                log("All seances in all movie parks::", response);
                return response;
            })
            .then(blockedPlace => {
                log('Finish blocking/unblocking places. ', blockedPlace)
            })
            .catch(error => error)
    }

    public static getAllSeancesByMovieAndDate(movieId: number, dateAsString: string):
        Promise<Map<string, SeanceInfo[]>> {
        log('Start getting all seances by movie and date.');
        let myUrl = `${getSeancesByMovieAndDateUrl}?movieId=${movieId}&date=${dateAsString}`;

        return httpClient.get(myUrl)
            .then(response => {
                log("All seances by movie and date:", response.data);
                let result: Map<string, SeanceInfo[]> = new Map<string, SeanceInfo[]>();
                Object.keys(response.data).forEach((cinemaPark: string) => {
                    let seanceList: SeanceInfo[] = []
                    response.data[cinemaPark].forEach((seanceInfo: SeanceInfo) => {
                        seanceList.push(seanceInfo)
                    })
                    result.set(cinemaPark, seanceList);
                })
                return result;
            })
            .catch(error => error)
    }

    public static getAllMoviesByIdSet(idSet: Set<number>): Promise<Map<number, MovieInfo>> {
        log("getAllMoviesByIdSet", idSet);
        const myUrl = `${getAllMoviesByIdSetUrl}`;

        let idList: number[] = []
        idSet.forEach(id => idList.push(id))
        const requestBody = {"movieIdSet" : idList}
        log("requestBody", requestBody)

        return httpClient.post(myUrl, requestBody)
            .then(response => {
                log("All movies by id set response.data:", response.data);
                let result: Map<number, MovieInfo> = new Map<number, MovieInfo>();
                Object.keys(response.data).forEach((movieId: string) => {
                    let movieName: string = response.data[movieId].movieName
                    let imgList: string[] = response.data[movieId]["base64Images"].split("|")
                    result.set(parseInt(movieId), new MovieInfo(parseInt(movieId), movieName, imgList))
                })
                log("All movies by id set result:", result);
                return result;
            })
            .catch(error => error)
    }

    public static getMovieListByPeriod(startPeriodDateStr: string, endPeriodDateStr: string):
        Promise<Map<string, Map<number, string>>> {
        log(`getMovieListByPeriod by period ${startPeriodDateStr}-${endPeriodDateStr}`);
        let myUrl = `${getAllMoviesByPeriodUrl}?periodStart=${startPeriodDateStr}&periodEnd=${endPeriodDateStr}`;

        return httpClient.get(myUrl)
            .then(response => {
                log("Finish getting today movies list:", response.data);
                let result: Map<string, Map<number, string>> =
                    new Map<string, Map<number, string>>();
                Object.keys(response.data).forEach((date: string) => {
                    result.set(date, response.data[date] as Map<number, string>);
                })
                return result;
            })
            .catch(error => error)
    }
}


export default ApiMethodsUtils
export {
    SeanceInfo,
    SeancePlace,
    MovieInfo
}

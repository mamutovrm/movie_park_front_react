const serviceUrl = 'http://localhost:9000/movie-park/api';
const getSeanceInfoUrl = `${serviceUrl}/seances/info`;
const getSeancePlacesInfoUrl = `${serviceUrl}/seances/places/info`;
const blockPlaceUrl = `${serviceUrl}/seances/places/block`;
const unblockPlaceUrl = `${serviceUrl}/seances/places/unblock`;
const getSeancesByMovieAndDateUrl = `${serviceUrl}/seances/all-by-movie-and-date`;
const getAllMoviesByPeriodUrl = `${serviceUrl}/movies/all-by-period`;

export {
    getSeanceInfoUrl,
    getSeancePlacesInfoUrl,
    blockPlaceUrl,
    unblockPlaceUrl,
    getSeancesByMovieAndDateUrl,
    getAllMoviesByPeriodUrl
}
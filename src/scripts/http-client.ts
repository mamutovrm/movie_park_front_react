import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:9000/movie-park/api';
axios.defaults.timeout = 5000;

export default axios.create({
});

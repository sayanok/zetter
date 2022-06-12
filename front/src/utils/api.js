import { token } from '../api.js';
import { useNavigate } from 'react-router-dom';

export function useCallApi() {
    const navigate = useNavigate();

    function callApi(url, config = {}) {
        const authorization = token.value;

        if (!config.headers) {
            config.headers = {};
        }
        config.headers.Authorization = authorization;
        config.headers['Content-Type'] = 'application/json';

        if (authorization) {
            return fetch(url, config).then((response) => response.json());
        } else {
            console.log('ログインしてください');
            navigate('/login');
        }
    }

    return callApi;
}

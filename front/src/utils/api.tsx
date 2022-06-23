import { token } from '../api';
import { useNavigate } from 'react-router-dom';

const useCallApi = () => {
    const navigate = useNavigate();

    function callApi(url: string, config: { method?: string; headers?: Record<string, string>; body?: string }) {
        if (token.value) {
            if (!config.headers) {
                config.headers = {};
            }

            config.headers.Authorization = token.value;
            config.headers['Content-Type'] = 'application/json';
            return fetch(url, config).then((response) => response.json());
        } else {
            console.log('ログインしてください');
            navigate('/login');
        }
    }
    return callApi;
};

export default useCallApi;

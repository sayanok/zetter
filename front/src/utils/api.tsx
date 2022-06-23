import { token } from '../api';
import { useNavigate } from 'react-router-dom';

type CallApiType = (
    url: string,
    config?: { method?: string; headers?: Record<string, string>; body?: string }
) => Promise<any> | undefined;

function useCallApi(): CallApiType {
    const navigate = useNavigate();

    const callApi: CallApiType = (url, config = {}) => {
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
    };

    return callApi;
}

export default useCallApi;

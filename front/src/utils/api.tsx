import { token } from '../api';
import { useNavigate } from 'react-router-dom';
import { TweetType } from './types';

type CallApiType = (
    url: string,
    config?: { method?: string; headers?: Record<string, string>; body?: string }
) => Promise<any> | undefined;

export function useCallApi(): CallApiType {
    const navigate = useNavigate();
    const baseUrl = process.env.REACT_APP_BASE_URL;

    const callApi: CallApiType = (url, config = {}) => {
        if (token.value) {
            if (!config.headers) {
                config.headers = {};
            }
            config.headers.Authorization = token.value;
            config.headers['Content-Type'] = 'application/json';
            return fetch(baseUrl + url, config).then((response) => response.json());
        } else {
            console.log('ログインしてください');
            navigate('/login');
        }
    };

    return callApi;
}

export function useCallUpdateFavoriteApi(): (tweet: TweetType) => Promise<TweetType> | undefined {
    const callApi = useCallApi();

    function callUpdateFavoriteApi(tweet: TweetType) {
        return callApi('/', {
            method: 'PATCH',
            body: JSON.stringify({ tweet: tweet, order: tweet.isFavorite ? 'delete' : 'add' }),
        });
    }

    return callUpdateFavoriteApi;
}

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import useCallApi from './utils/api';
import { TweetType } from './utils/types';
import Profile from './Profile';
import TweetTrees from './TweetTrees';

const ProfilePage: React.FC = () => {
    const [tweetsListOfSpecificUser, setTweetsListOfSpecificUser] = useState<Array<TweetType>>([]);
    const callApi = useCallApi();
    const params = useParams();

    function getTweets(): Promise<Array<TweetType>> | undefined {
        return callApi('http://localhost:5000/api/zetter/specificUsersTweets/' + params.username);
    }

    return (
        <>
            <Profile />
            <TweetTrees
                tweetsList={tweetsListOfSpecificUser}
                setTweets={setTweetsListOfSpecificUser}
                getTweets={getTweets}
            />
        </>
    );
};

export default ProfilePage;

import React, { useState } from 'react';
import useCallApi from './utils/api';
import { TweetType } from './utils/types';
import Profile from './Profile';
import TweetTrees from './TweetTrees';

const ProfilePage: React.FC = () => {
    const [tweetsListOfSpecificUser, setTweetsListOfSpecificUser] = useState<Array<TweetType>>([]);
    const callApi = useCallApi();

    function getTweets(): Promise<Array<TweetType>> | undefined {
        return callApi('http://localhost:5000/api/zetter/specificUsersTweets');
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

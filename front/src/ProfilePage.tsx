import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCallApi } from './utils/api';
import { TweetType, ProfileType } from './utils/types';
import Profile from './Profile';
import TweetTrees from './TweetTrees';

type ProfilePageProps = { myProfile: ProfileType | undefined };

const ProfilePage: React.FC<ProfilePageProps> = (props) => {
    const [tweetsListOfSpecificUser, setTweetsListOfSpecificUser] = useState<Array<TweetType>>([]);
    const callApi = useCallApi();
    const params = useParams();

    function getAndSetTweets(): void {
        callApi('http://localhost:5000/api/zetter/specificUsersTweets/' + params.username)?.then(
            setTweetsListOfSpecificUser
        );
    }

    return (
        <>
            <Profile myProfile={props.myProfile} />
            <TweetTrees
                tweetsList={tweetsListOfSpecificUser}
                setTweets={setTweetsListOfSpecificUser}
                afterPostTweet={getAndSetTweets}
            />
        </>
    );
};

export default ProfilePage;

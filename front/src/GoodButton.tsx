import React, { useState } from 'react';

import Button from '@mui/material/Button';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';

const GoodButton: React.FC = () => {
    const [goodButtonState, setGoodButtonState] = useState<boolean>(false);

    function changeGoodButtonState(): JSX.Element {
        if (goodButtonState) {
            return <StarIcon />;
        } else {
            return <StarBorderIcon />;
        }
    }
    return (
        <>
<<<<<<< HEAD
            <Button variant="text" onClick={() => changeGoodButtonState()}></Button>
=======
            <Button variant="text" onClick={() => changeGoodButtonState()}>
                {}
            </Button>
>>>>>>> fb357cc... wip
        </>
    );
};

export default GoodButton;

import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import Button from '@mui/material/Button';

type FavButtonProps = {
    numberOfFavorite: number;
    isFavorite: boolean;
    onClick: () => void;
};

const FavButton: React.FC<FavButtonProps> = (props) => {
    const onClick = props.onClick;

    return (
        <>
            <Button
                variant="text"
                onClick={(e) => {
                    e.preventDefault();
                    onClick();
                }}
            >
                {props.isFavorite ? <StarIcon /> : <StarBorderIcon />}
            </Button>
            {props.numberOfFavorite}
        </>
    );
};

export default FavButton;

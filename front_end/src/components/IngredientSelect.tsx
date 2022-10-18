import {FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {FC, useState} from "react";

interface IngredientSelectProps {
    ingredient: any
}


export const IngredientSelect: FC<IngredientSelectProps> = (props) => {
    const {ingredient} = props;

    const [i, setIngredient] = useState('1');
    const handleChange = (event: SelectChangeEvent) => {
        setIngredient(event.target.value as string);
        // if(ingredient.)
    }

    const[error, setError] = useState(false);
    const displayError = () => {
        if(error){
            return <FormHelperText>Error</FormHelperText>
        }else{
            return;
        }
    }


    return (
        <>
            <InputLabel style={{paddingBottom: 20}}>{ingredient.Name}</InputLabel>
            <Select
                value={i}
                label={ingredient.Name}
                onChange={handleChange}
            >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={6}>6</MenuItem>
                <MenuItem value={7}>7</MenuItem>
                <MenuItem value={8}>8</MenuItem>
                <MenuItem value={9}>9</MenuItem>
                <MenuItem value={10}>10</MenuItem>
            </Select>
            {displayError()}
        </>


    );
};
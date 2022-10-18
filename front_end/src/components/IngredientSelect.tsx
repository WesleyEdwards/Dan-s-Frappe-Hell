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
        if(ingredient.Stock < event.target.value){
            setIsError(true)
        }else{
            setIsError(false)
        }
    }

    const[isError, setIsError] = useState(false);
    const displayError = () => {
        if(isError){
            return <FormHelperText>Sorry, we don't have enough {ingredient.Name} available. Please select a lower quantity.</FormHelperText>
        }else{
            return;
        }
    }


    return (
        <>
            <FormControl style={{width: 400, paddingBottom: 20}} error={isError}>
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
            </FormControl>
        </>


    );
};
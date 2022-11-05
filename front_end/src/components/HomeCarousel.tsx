import {FC} from "react";
import Carousel from 'react-material-ui-carousel';
import React from 'react';
import {Paper, Button, Container, Stack} from '@mui/material';


export const HomeCarousel: FC = () => {
    const imageUrls = [
        "https://st3.depositphotos.com/1773130/14406/i/450/depositphotos_144060381-stock-photo-iced-caramel-latte-coffee-in.jpg",
        "https://st.depositphotos.com/1177973/1803/i/600/depositphotos_18039843-stock-photo-fragrant-coffee-latte-in-glasses.jpg",
        "https://st3.depositphotos.com/3436901/14792/i/450/depositphotos_147924487-stock-photo-iced-caramel-coffee-frappe-with.jpg"];




    return (
        <Stack justifyContent="center">
            <Carousel navButtonsAlwaysVisible={true} sx={{width:600}}>
                {
                    imageUrls.map( (address) => <Item url={address} /> )
                }
            </Carousel>
        </Stack>
    );
}

function Item(props: { url: string})
{
    return (
        <div>
            <img alt="Picture of a frappe" src={props.url}/>
        </div>
    )
}

export default HomeCarousel;
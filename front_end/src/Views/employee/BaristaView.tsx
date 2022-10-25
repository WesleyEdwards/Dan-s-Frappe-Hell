import {Button, Container, Grid, Stack, Typography} from "@mui/material";
import React, {FC, useEffect, useState} from "react";
import {DFHeader} from "../../components/DFHeader";
import {getMenuItems, getOrdersByStatus, MenuItem, Order, updateOrder} from "../../sdk";
import {Loading} from "../../components/Loading";

export const BaristaView: FC = () => {

    const [menuitems, setMenuItems] = useState<MenuItem[]>([]);
    const [placedOrders, setPlacedOrders] = useState<Order[]>([])
    useEffect(() => {
        getMenuItems().then((res) => {
            setMenuItems(res);
            getOrdersByStatus("PLACED").then((red)=>{
                setPlacedOrders(red)
            })
        });
    }, []);

    if (menuitems.length === 0) return <Loading/>;

    const completeOrder = (order: Order) => {
        updateOrder(order.OrderId, order.Items, order.Favorite, "FINISHED").then((res) =>{
            getOrdersByStatus("PLACED").then((red)=>{
                setPlacedOrders(red)
            })
        })
    }


    return (
        <Container maxWidth="md">
            <Stack gap="2rem" justifyContent="center">
                <DFHeader title="Barista Portal"/>
                <Typography variant="h5" gutterBottom>Customer Orders</Typography>
                <Grid container rowSpacing={4} columnSpacing={{md: 8}}>
                    {placedOrders.map((order) => {
                        return (
                            <div>
                                <Typography>Order {order.OrderId}</Typography>
                                <Button onClick={()=>{completeOrder(order)}}>Mark as finished</Button>
                            </div>

                        );
                    })}
                </Grid>
            </Stack>
        </Container>
    );
};

export default BaristaView;

import {DFHeader} from "../../components/DFHeader";
import {Loading} from "../../components/Loading";
import { Button, Container, Grid, Stack, Typography } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { getMenuItems, getOrdersByStatus, updateOrder } from "../../api/api-functions";
import { MenuItem, Order} from "../../api/models";


export const CashierView: FC = () => {

    const [menuitems, setMenuItems] = useState<MenuItem[]>([]);
    const [finishedOrders, setFinishedOrders] = useState<Order[]>([])
    useEffect(() => {
        getMenuItems().then((res) => {
            setMenuItems(res);
        getOrdersByStatus("FINISHED").then((red)=>{
            setFinishedOrders(red)
            console.log("Finished Orders: " + finishedOrders)
        })
        });
    }, []);

    if (menuitems.length === 0) return <Loading/>;

    const completeOrder = (order: Order) => {
        updateOrder(order.OrderId, order.Items, order.Favorite, "FULFILLED").then((res)=>{
            getOrdersByStatus("FINISHED").then((red)=>{
                setFinishedOrders(red)
            })
        })
    }


    return (
        <Container maxWidth="md">
            <Stack gap="2rem" justifyContent="center">
                <DFHeader title="Cashier Portal"/>
                <Typography variant="h5" gutterBottom>Create Customer Orders</Typography>
                <Grid container rowSpacing={4} columnSpacing={{md: 8}}>
                    {menuitems.map((menuitem) => {
                        return (
                            <Grid item md={6}>
                            </Grid>
                        );
                    })}
                </Grid>
                <Typography variant="h5" gutterBottom>Customer Pickup</Typography>
                <Grid container rowSpacing={4} columnSpacing={{md: 8}}>
                    {finishedOrders.map((order) => {
                        return (
                            <div>
                                <Typography>Order {order.OrderId}</Typography>
                                <Button onClick={()=>{completeOrder(order)}}>Mark as completed</Button>
                            </div>

                        );
                    })}
                </Grid>
            </Stack>
        </Container>
    );
};

export default CashierView;

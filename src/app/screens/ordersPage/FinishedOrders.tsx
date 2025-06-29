import React, { useMemo } from "react";
import { Box, Stack } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveFinishedOrders } from "./selector";
import { serverApi } from "../../../lib/config";
import { Order, OrderItem } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";

/* REDUX SLICE & SELECTOR */
const finishedOrdersRetriever = createSelector(
    retrieveFinishedOrders, 
    (finishedOrders) => ({ finishedOrders})
);


export default function FinishedOrders() {
    const { finishedOrders } = useSelector(finishedOrdersRetriever);
  
    return (
        <TabPanel value={"3"}>
            <Stack>
                {finishedOrders.map((order: Order) => {
                    const subtotal = (order.orderTotal ?? 0) - (order.orderDelivery ?? 0);
                    const taxPrice = parseFloat((subtotal * 0.1).toFixed(2));
  
                    return (
                        <Box key={order._id} className={"order-main-box"}>
                            <Box className={"order-box-scroll"}>
                                {order?.orderItems?.map((item: OrderItem) => {
                                    const product: Product = order.productData
                                    .filter((ele: Product) => item.productId === ele._id)[0];
  
                                    const imagePath = product.productImages?.[0]
                                    ? `${serverApi}/${product.productImages[0]}`
                                    : "/icons/default-product.svg";
  
                                    return (
                                        <Box key={item._id} className={"orders-name-price"}>
                                            <img src={imagePath} alt="" className={"order-dish-img"} />
                                            <p className={"title-product"}>{product.productName}</p>
                                        
                                            <Box className={"price-box"}>
                                                <p>${item.itemPrice}</p>
                                                    <img src={"/icons/close.svg"} alt="" />
                                                <p>{item.itemQuantity}</p>
                                                    <img src={"/icons/pause.svg"} alt="" />
                                                <p style={{ marginLeft: "15px" }}>
                                                    ${item.itemQuantity * item.itemPrice}
                                                </p>
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </Box>
                            <Box className={"total-price-box"}>
                                <Box className={"box-total"}>
                                    <p>Subtotal:</p>
                                    <p>${subtotal.toFixed(2)}</p>
                                        <img src={"/icons/plus.svg"} alt="" style={{ marginLeft: "20px" }} />
  
                                    <p>Tax:</p>
                                    <p>${taxPrice.toFixed(2)}</p>
                                        <img src={"/icons/pause.svg"} alt="" style={{ marginLeft: "20px" }} />
  
                                    <p>Total:</p>
                                    <p>${(order.orderTotal + taxPrice).toFixed(2)}</p>
                                </Box>
                            </Box>
                        </Box>
                    );
                })}
                {!finishedOrders || (finishedOrders.length === 0 && (
                    <Box
                        display={"flex"}
                        flexDirection={"row"}
                        justifyContent={"center"}
                    >
                        <img
                            src={"/icons/noimage-list.svg"} alt="No finished orders"
                            style={{ width: 300, height: 300 }}
                        />
                    </Box>
                ))}
            </Stack>
        </TabPanel>
    );
}
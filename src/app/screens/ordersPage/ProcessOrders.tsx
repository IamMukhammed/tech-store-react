import React from "react";
import { Box, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import TabPanel from "@mui/lab/TabPanel";
import moment from "moment";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveProcessOrders } from "./selector";
import { Messages, serverApi } from "../../../lib/config";
import { Order, OrderItem, OrderUpdateInput } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import { useGlobals } from "../../hooks/useGlobals";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { T } from "../../../lib/types/common";
import OrderService from "../../services/OrderService";

/* REDUX SLICE & SELECTOR */
const processOrdersRetriever = createSelector(
    retrieveProcessOrders, 
    (processOrders) => ({ processOrders })
);

interface ProcessOrdersProps {
    setValue: (input: string) => void;
}

export default function ProcessOrders(props: ProcessOrdersProps) {
    const { setValue } = props;
    const { authMember, setOrderBuilder } = useGlobals();
    const { processOrders } = useSelector(processOrdersRetriever);

    /* HANDLERS */
    const finishOrderHandler = async (e: T) => {
        try {
            if(!authMember) throw new Error(Messages.error2);

            const orderId = e.target.value;
            const input: OrderUpdateInput = {
                orderId: orderId,
                orderStatus: OrderStatus.FINISH,
            };

            const confirmation = window.confirm("Have you received your order ?");
            if(confirmation) {
                const order = new OrderService();
                await order.updateOrder(input);
                // => PROCESS ORDERS
                setValue("3");
                // ORDER REBUILD
                setOrderBuilder(new Date());
            }

        } catch (err) {
            console.log(err);
            sweetErrorHandling(err).then();
        }
    };


    return (
        <TabPanel value={"2"}>
            <Stack>
                {processOrders?.map((order: Order) => {
                    const subtotal = (order.orderTotal ?? 0) - (order.orderDelivery ?? 0);
                    const taxPrice = parseFloat((subtotal * 0.1).toFixed(2));

                    return (
                        <Box key={order._id} className={"order-main-box"}>
                            <Box className={"order-box-scroll"}>
                                {order?.orderItems?.map((item: OrderItem) => {
                                    const product = order.productData.find(
                                        (ele: Product) => item.productId === ele._id
                                    );

                                    if (!product) return null;
                                        const imagePath = product.productImages?.[0]
                                        ? `${serverApi}/${product.productImages[0]}`
                                        : "/icons/default-product.svg";
                                    return (
                                        <Box key={item._id} className={"orders-name-price"}>
                                            <img src={ imagePath }
                                                className={"order-dish-img"}
                                            />
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
                                    <p>Price</p>
                                    <p>${subtotal.toFixed(2)}</p>
                                        <img src={"/icons/plus.svg"} alt="" style={{ marginLeft: "20px" }} />

                                    <p>Tax</p>
                                    <p>${taxPrice.toFixed(2)}</p>
                                        <img src={"/icons/pause.svg"} alt="" style={{ marginLeft: "20px" }} />

                                    <p>Total</p>
                                    <p>${(order.orderTotal + taxPrice).toFixed(2)}</p>
                                </Box>
                                <p className={"data-compl"}>
                                    {moment(order.createdAt).format("MM-DD-YY HH:mm")}
                                </p>
                                <Button
                                    value={order._id}
                                    className={"verify-button"} 
                                    variant="contained"
                                    onClick={finishOrderHandler}
                                >
                                    Confirm Delivery
                                </Button>
                            </Box>
                        </Box>
                    );
                })}

                { !processOrders ||
                ( processOrders.length === 0 && (
                    <Box display={"flex"} flexDirection={"row"} justifyContent={"center"}>
                        <img
                            src={"/icons/noimage-list.svg"} alt=""
                            style={{ width: 300, height: 300 }}
                        />
                    </Box>
                ))}
            </Stack>
        </TabPanel>
    );
}
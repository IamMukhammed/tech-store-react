import { useEffect, useState } from "react";
import { CartItem } from "../../lib/types/search";


const useBasket = () => {
    const cartJson: string | null = localStorage.getItem("cartData");
    const initialCart: CartItem[] = cartJson ? JSON.parse(cartJson) : [];

    const [cartItems, setCartItems] = useState<CartItem[]>(initialCart);


    /* HANDLERS */
    const updateCart = (updatedCart: CartItem[]) => {
        setCartItems(updatedCart);
        localStorage.setItem("cartData", JSON.stringify(updatedCart));
    };

    /* cartItems o'zgarganda localStorage ga avtomatik yozish uchun */
    useEffect(() => {
        localStorage.setItem("cartData", JSON.stringify(cartItems));
    }, [cartItems]);
    

    const onAdd = (input: CartItem) => {
        const exist: any = cartItems.find(
            (item: CartItem) => item._id === input._id
        );

        if(exist) {
            const cartUpdate = cartItems.map((item: CartItem) => 
                item._id === input._id 
                ? { ...exist, quantity: exist.quantity + 1 } 
                : item
            );
            setCartItems(cartUpdate);
            localStorage.setItem("cartData", JSON.stringify(cartUpdate));
        } else {
            const cartUpdate = [...cartItems, { ...input }];
            setCartItems(cartUpdate);
            localStorage.setItem("cartData", JSON.stringify(cartUpdate));
        }
    };

    const onRemove = (input: CartItem) =>{
        const exist: any = cartItems.find(
            (item: CartItem) => item._id === input._id
        );
        if(exist.quantity === 1) {
            const cartUpdate = cartItems.filter((item: CartItem) => item._id !== input._id);
            setCartItems(cartUpdate);
            localStorage.setItem("cartData", JSON.stringify(cartUpdate));
        } else {
            const cartUpdate = cartItems.map((item: CartItem) => 
                item._id === input._id 
                ? { ...exist, quantity: exist.quantity - 1 }
                : item
            );
            setCartItems(cartUpdate);
            localStorage.setItem("cartData", JSON.stringify(cartUpdate));
        }
    };

    const onDelete = (input: CartItem) => {
        const cartUpdate = cartItems.filter(
            (item: CartItem) => item._id !== input._id
        );
        setCartItems(cartUpdate);
        localStorage.setItem("cartData", JSON.stringify(cartUpdate));
    };

    const onDeleteAll = () => {
        setCartItems([]);
        localStorage.removeItem("cartData");
    }

    return {
        cartItems,
        onAdd,
        onRemove,
        onDelete,
        onDeleteAll,
    };
};

export default useBasket;

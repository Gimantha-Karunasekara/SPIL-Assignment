export const REFRESH_CART = "REFRESH_CART";
export const ADD_TO_CART = "ADD_TO_CART";
export const UPDATE_CART_ITEM = "UPDATE_CART_ITEM";
export const REMOVE_FROM_CART = "REMOVE_FROM_CART";


export const refreshCart = (products) => ({
    type: REFRESH_CART,
    payload: products,
});

export const addToCart = (product) => ({
    type: ADD_TO_CART,
    payload: product,
});

export const updateCartItem = ({id, quantity}) => ({
    type: UPDATE_CART_ITEM,
    payload: {
        id, quantity
    },
});

export const removeFromCart = (productId) => ({
    type: REMOVE_FROM_CART,
    payload: productId,
});
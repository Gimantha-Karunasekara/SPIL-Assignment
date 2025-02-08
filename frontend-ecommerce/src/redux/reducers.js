import { REFRESH_CART, ADD_TO_CART, UPDATE_CART_ITEM,REMOVE_FROM_CART } from "./actions";

const initialState = {
    products: [],
    cart: []
};

const reducer = (state = initialState, action) => {
    switch (action.type) {

        case REFRESH_CART:
                return { ...state, cart: action.payload || [] };

        case ADD_TO_CART:
            return { ...state, cart: [...state.cart, action.payload] };

        case REMOVE_FROM_CART:
            return {
                ...state,
                cart: state.cart.filter(item => item.id !== action.payload),
            };

        case UPDATE_CART_ITEM:
                return {
                    ...state,
                    cart: state.cart.map(item =>
                        item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
                    ),
                };

        default:
            return state;
    }
};

export default reducer;
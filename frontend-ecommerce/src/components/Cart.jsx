import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, IconButton, TextField, Divider, Snackbar, Alert, Toolbar, Button } from '@mui/material';
import { Delete, RemoveShoppingCart } from '@mui/icons-material';
import axios from 'axios';
import { refreshCart, removeFromCart, updateCartItem } from '../redux/actions';
import { useNavigate } from 'react-router';


function Cart() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [errorShow, setErrorShow] = useState(false);
    const [error, setError] = useState(null);

    const cart = useSelector(state => state.cart) || [];

    useEffect(() => {

        if (cart.length == 0) {
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/cart`)
                .then(function (response) {
                    if (response.status === 200) {
                        dispatch(refreshCart(response.data));
                    }
                })
                .catch(function (error) {
                    setErrorShow(true);
                    console.error("An error occured while fetching cart items", error);
                })
                .finally(function () {
                });
        }

    }, [dispatch]);

    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

    const handleQuantityChange = (id, quantity) => {
        if (quantity < 1) return;
        if (isNaN(quantity)) return;

        axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/Cart/update-quantity/${id}?newQuantity=${quantity}`)
            .then(function (response) {
                if (response.status === 200) {
                    dispatch(updateCartItem({ id, quantity }));
                }
            })
            .catch(function (error) {
                console.error("An error occured while updating cart items", error);
                setError(error.response.data);
                setErrorShow(true);
            })
    };

    const handleRemove = (id) => {
        axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/Cart/${id}`)
            .then(function (response) {
                if (response.status === 204) {
                    dispatch(removeFromCart(id));
                }
            })
            .catch(function (error) {
                setErrorShow(true);
                console.error("An error occured while removing cart item", error);
            })
    };

    const handleErrorClose = () => {
        setErrorShow(false);
        setError(null);
    };

    const handlePlaceOrder = () => {
        navigate('/orderConfirmation')
    }

    return (
        <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', p: 2 }}>
            <Toolbar />
            <Typography variant="h5" textAlign="center" fontWeight="bold">
                Shopping Cart
            </Typography>
            {cart.length === 0 ? (
                <Box textAlign="center" sx={{ mt: 4 }}>
                    <RemoveShoppingCart sx={{ fontSize: 60, color: 'gray' }} />
                    <Typography variant="body1" color="text.secondary">Your cart is empty</Typography>
                </Box>
            ) : (
                <>
                    <List>
                        {cart.map((item) => (
                            <React.Fragment key={item.id}>
                                <ListItem sx={{ display: 'flex', alignItems: 'center' }}>
                                    <ListItemText
                                        primary={item.productName}
                                        secondary={`$${item.price.toFixed(2)}`}
                                        sx={{ flex: 1, ml: 2 }}
                                    />
                                    <TextField
                                        label="Qty"
                                        type="number"
                                        variant="outlined"
                                        size="small"
                                        value={item.quantity}
                                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10))}
                                        sx={{ width: 100, textAlign: 'center' }}
                                    />
                                    <IconButton onClick={() => handleRemove(item.id)} color="error">
                                        <Delete />
                                    </IconButton>
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>

                    {/* Bottom bar  */}
                    <Box sx={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 10,
                        alignItems: 'center',
                        width: '100%',
                        mx: 'auto',
                        bgcolor: 'white',
                        boxShadow: 2,
                        py: 2,
                        textAlign: 'center',
                    }}>
                        <Typography variant="h6" fontWeight="bold">
                            Total: ${totalPrice}
                        </Typography>
                        <Button variant="contained" color="primary" fullWidth sx={{ width: '200px' }} onClick={handlePlaceOrder}>Place Order</Button>
                    </Box>
                </>
            )}

            {/* Error snackbar  */}
            <Snackbar
                open={errorShow}
                autoHideDuration={6000}
                onClose={handleErrorClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleErrorClose} severity="error" sx={{ width: '100%' }}>
                    {error ? error : "Unexpected Error occurred"}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default Cart;

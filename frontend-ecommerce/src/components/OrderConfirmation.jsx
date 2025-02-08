import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Typography, List, Toolbar, ListItem, ListItemText, Snackbar, Alert } from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { refreshCart } from '../redux/actions';
import axios from 'axios';



const OrderConfirmation = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cart = useSelector(state => state.cart);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [errorShow, setErrorShow] = useState(false);

    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

    const handleConfirmOrder = () => {

        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/Orders`)
            .then(function (response) {
                if (response.status === 200) {
                    dispatch(refreshCart([]));
                    setIsConfirmed(true);

                }
            })
            .catch(function (error) {
                setErrorShow(true);
                console.error("An error occured while placing order", error);
            })

    };

    const handleErrorClose = () => {
        setErrorShow(false);
    };

    const handleGoBack = () => {
        navigate('/');
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                textAlign: 'center',
                p: 2,
            }}
        >
            {isConfirmed ? (
                <>
                    <CheckCircleOutline sx={{ fontSize: 60, color: 'green' }} />
                    <Typography variant="h5" sx={{ mt: 2 }}>
                        Your order has been confirmed successfully!
                    </Typography>
                    <Button sx={{ marginTop: 5 }} variant="contained" color="primary" onClick={handleGoBack}>
                        Go Back
                    </Button>
                </>
            ) : (
                <>
                    <Typography variant="h4" gutterBottom>
                        Order Confirmation
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Total Price: ${totalPrice}
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            width: '100%',
                            maxWidth: 400,
                            mt: 2,
                            gap: 5
                        }}
                    >
                        <Button variant="outlined" onClick={handleGoBack}>
                            Go Back
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleConfirmOrder}
                        >
                            Confirm Order
                        </Button>
                    </Box>
                </>
            )}
            <Snackbar
                open={errorShow}
                autoHideDuration={6000}
                onClose={handleErrorClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleErrorClose} severity="error" sx={{ width: '100%' }}>
                    Unexpected Error occurred
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default OrderConfirmation
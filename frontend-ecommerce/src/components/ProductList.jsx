import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import { Grid2, Card, CardMedia, CardHeader, CardContent, Button, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, refreshCart } from '../redux/actions';

const placeholderImage = "https://images.unsplash.com/photo-1595246007497-15e0ed4b8d96?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

function ProductList() {

  const [errorShow, setErrorShow] = useState(false);
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const cart = useSelector(state => state.cart);

  useEffect(() => {

    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`)
      .then(function (response) {
        if (response.status === 200) {
          setProducts(response.data);
        }
      })
      .catch(function (error) {
        setErrorShow(true);
        console.error("An error occured while fetching products", error);
      })

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
    }

  }, [dispatch]);


  const handleOnAdd = (product) => {

    axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
      "productId": product.id,
      "productName": product.name,
      "price": product.price,
      "quantity": 1
    })
      .then(function (response) {
        if (response.status === 200) {
          console.log(response);
          dispatch(addToCart(response.data))
        }
      })
      .catch(function (error) {
        setErrorShow(true);
        console.log("Error occured while adding item to cart", error);
      })
      .finally(function () {
      });

  }

  const handleErrorClose = () => {
    setErrorShow(false);
  };


  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography variant="h4" textAlign={'center'}>All Products</Typography>
        <Typography variant="body1" textAlign={'center'}>
          These are all the products available to buy
        </Typography>
      </Box>
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Grid2 container spacing={10} justifyContent="center" sx={{ display: 'flex', justifyContent: 'center' }} >
          {products.map((product) => {
            const inCart = cart.some(item => item.productId === product.id);
            return (
              <Grid2 key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 3 }}>
                <Card sx={{ width: '95%', p: 1, boxShadow: 3 }}>
                  <CardMedia component="img" height="150" image={placeholderImage} alt={product.name} />
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">{product.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{product.description}</Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}><strong>Price:</strong> {product.price}</Typography>
                    <Typography variant="body2" color="success.main"><strong>{product.quantityInStock} in stock</strong></Typography>
                    {inCart ? <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled>Added to cart</Button> : product.quantityInStock > 0 ?
                      <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={() => handleOnAdd(product)}>Add to Cart</Button> :
                      <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled>Out of stock</Button>
                    }
                  </CardContent>
                </Card>
              </Grid2>
            )
          })}
        </Grid2>
      </Box>
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
  )
}

export default ProductList
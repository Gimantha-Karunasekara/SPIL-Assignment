import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router'
import ProductList from './components/ProductList'
import NavDrawer from './components/NavDrawer'
import Cart from './components/Cart'
import OrderConfirmation from './components/OrderConfirmation'

function App() {

  return (
    <>
      <NavDrawer />
      <Routes>
        <Route path='/' element={<ProductList />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/orderConfirmation' element={<OrderConfirmation />} />
      </Routes>
    </>
  )
}

export default App

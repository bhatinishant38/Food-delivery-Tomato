import express from 'express'
import { addToCart, fetchCart, removeFromCart } from '../controllers/cartController.js'
import { authMiddleware } from '../middleware/auth.js'


export const cartRouter =express.Router()

cartRouter.post('/add',authMiddleware,addToCart)
cartRouter.post('/remove',authMiddleware,removeFromCart)
cartRouter.post('/fetch',authMiddleware, fetchCart)
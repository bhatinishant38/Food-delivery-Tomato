import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'
import { foodRouter } from './routes/foodRoute.js'
import { userRouter } from './routes/userRoutes.js'
import 'dotenv/config'
import { cartRouter } from './routes/cartRoutes.js'
import { orderRouter } from './routes/orderRoutes.js'


//app config
const app = express()
const port = process.env.PORT ||5009

// middleware 
app.use(express.json())
app.use(cors())

//db connection
connectDB()

// api end-points
app.use('/api/food',foodRouter)
app.use('/images',express.static('uploads'))
app.use('/api/user',userRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)

app.get('/',(req,res,next)=>{
    res.send("API WORKING")
})


app.listen(port ,()=>{
    console.log(`server running on http://localhost:${port}`)
})


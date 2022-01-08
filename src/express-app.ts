import express , {Request , Response , Express} from 'express'
import ApiLayer from './api'
import morgan from 'morgan'
import helmet from 'helmet'
import amqp, { ConsumeMessage, Message } from 'amqplib'
//in here we will setup the rabbitMQ
import QueueConsumers from './queue'

export default async (app : Express) => {
    app.use(express.json())
    app.use(express.urlencoded({extended : false}))

    app.use(helmet())
    app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
    //connect admin queue here
    amqp.connect('amqp://localhost:5672').then(async (conn) => {
        const channel = await conn.createChannel()
        await channel.assertQueue('adminQueue')
        ApiLayer.AdminRoutes(app , channel)
        QueueConsumers(channel)
    })
    //use routes
     
    app.get('/' , async (req : Request, res : Response) => {
        res.status(200).send('hello')
    })
}
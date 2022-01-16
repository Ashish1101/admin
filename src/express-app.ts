import express , {Request , Response , Express} from 'express'
import ApiLayer from './api'
import morgan from 'morgan'
import helmet from 'helmet'
import amqp, { ConsumeMessage, Message } from 'amqplib'
import {DIRECT_EXCHANGE_TYPE , STUDENT_CRUD_EXCHANGE , CREATE_STUDENT_QUEUE, UPDATE_STUDENT_QUEUE , DELETE_STUDENT_QUEUE , CREATE_STUDENT_KEY , UPDATE_STUDENT_KEY , DELETE_STUDENT_KEY} from './queue/types'
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

        //CREATE AN EXCHANGE FOR STUDENT CRUD OPERATION
        await channel.assertExchange(STUDENT_CRUD_EXCHANGE , DIRECT_EXCHANGE_TYPE);

        //CREATE QUEUE FOR STUDENT CRUD
        await channel.assertQueue(CREATE_STUDENT_QUEUE)
        await channel.assertQueue(UPDATE_STUDENT_QUEUE)
        await channel.assertQueue(DELETE_STUDENT_QUEUE)


        //BIND STUDENT CRUD QUEUES TO EXCHANGE
        await channel.bindQueue(CREATE_STUDENT_QUEUE , STUDENT_CRUD_EXCHANGE , CREATE_STUDENT_KEY)
        await channel.bindQueue(UPDATE_STUDENT_QUEUE , STUDENT_CRUD_EXCHANGE , UPDATE_STUDENT_KEY)
        await channel.bindQueue(DELETE_STUDENT_QUEUE , STUDENT_CRUD_EXCHANGE , DELETE_STUDENT_KEY)
        
        ApiLayer.AdminRoutes(app , channel)
        QueueConsumers(channel)
    })
    //use routes
     
    app.get('/' , async (req : Request, res : Response) => {
        res.status(200).send('hello')
    })
}
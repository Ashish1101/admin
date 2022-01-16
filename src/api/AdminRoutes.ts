import { signin , addStudent} from '../services/Admin'
import {Request , Response, Express} from 'express'
import ValidationLayer from '../utils/ValidationLayer'
import verifyToken from '../utils/verifyJwtToken'
import { Channel } from 'amqplib';
const validations = new ValidationLayer()

const adminRoutes = (app : Express , channel : Channel) => {
//     app.post('/signup' , [validations.signup], async (req : Request, res : Response) => {
//         try {
//             console.log('hello from serivce layer')
//             const serviceLayerResponse = await signUp(req.body , channel)
//             console.log(serviceLayerResponse)
//             return res.status(200).json(serviceLayerResponse);
//         } catch (err) {
//             console.log('error in response layer signup' , err)
//         }
// })

app.post('/signin' ,  async (req : Request, res : Response) => {
    try {
        console.log('hello from serivce layer')
        const serviceLayerResponse = await signin(req.body)
        console.log(serviceLayerResponse)
        return res.status(200).json(serviceLayerResponse);
    } catch (err) {
        console.log('error in response layer signup' , err)
    }
 })

 app.post('/addStudent' , [verifyToken], async (req : Request , res : Response) => {
      try {
        const id = (req as any).user.id
        console.log(id)
        console.log('hello from serivce layer')
        const serviceLayerResponse = await addStudent({id , ...req.body } , channel)
        console.log(serviceLayerResponse)
        return res.status(200).json(serviceLayerResponse);
      } catch (err) {
        console.log('error in response layer addStudent' , err)
      }
 })
}


export default adminRoutes



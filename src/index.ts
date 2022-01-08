import dotenv from 'dotenv'
import express ,  {Request , Response} from 'express'
import databaseLayer from './database'
import expressApp from './express-app'


dotenv.config()
const app = express();


const startServer = async () => {
   databaseLayer.mongoDbConnection();
   await expressApp(app)
   app.listen(5002 , () => console.log('server is running'))
}

startServer()

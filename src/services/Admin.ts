//this file will contain all the controller related to superAdmin
import databaseLayer from '../database'
const AdminModel = databaseLayer.AdminModel
const repository = databaseLayer.repository
import {HashPassword , comparePassword} from '../utils/passwordHash'
import generateToken from '../utils/generateJwtToken'
import {isStudentPresent} from '../utils/CheckForStudent'
import { Channel } from 'amqplib'
import {STUDENT_CRUD_EXCHANGE , CREATE_STUDENT_KEY} from '../queue/types'

type AuthType = {
    email: string
    password: string,
    role? : string
}

type ReturnType = {
    message?: string,
    data?: object
} 

type StudentType = {
    name : string
    email : string
    mobileNumber : number
    fees : number
    address : string
    parentNumber : number
    dob : Date
    joinDate : Date
    id ?: string
}

// export const signUp = async (userInputs : AuthType , channel : Channel) : Promise<ReturnType | undefined> => {
//     const {email , password} = userInputs
//     try {
//         let superAdmin = await AdminModel.findOne({email:email});
//         if(superAdmin) {
//             // throw new Error('SuperAdmin already exists with this email')
//             return {message : "SuperAdmin already exists with this email"}
//         }
//         superAdmin = await AdminModel.create({
//             email : email,
//             password: password,
//             role : 'superAdmin'
//         })
         
//         //testing admin queue
//         //hash the password
//         let hashedPass = await HashPassword(password)
//         superAdmin.password = hashedPass
//         //save super admin in database
//         await superAdmin.save();
//         return {
//             message: "SuperAdmin Created.",
//             data : superAdmin
//         }
//     } catch (err) {
//         console.log('error in superAdmin signup',err)
//     }
// }

export const signin = async (userInputs : AuthType) : Promise<ReturnType | undefined> => {
   try {
       const {email , password} = userInputs;

       //login first find the superAdmin with the email
       const superAdmin = await AdminModel.findOne({email : email});
       if(!superAdmin) {
           return {message : "No superadmin with this email."}
       }
       //comparePassword
       let isPassMatched;
       if(superAdmin.password !== undefined) {
         isPassMatched = await comparePassword(password , superAdmin.password)
       }

       //if password not matched
       if(!isPassMatched) {
           return {message : "Information Incorrect."}
       }

       //jwt token
    //    console.log(typeof superAdmin.id)
    //    console.log(typeof superAdmin._id)
       const payload = {
           id : superAdmin._id,
           role : superAdmin.role as any
       }
       const token = generateToken(payload)

       return {message : "Login successfull." , data: {token , id : superAdmin._id}}
       
   } catch (err) {
    console.log('error in superAdmin signup',err)
   }
}

export const addStudent = async (userInputs : StudentType , channel : Channel ) : Promise<ReturnType |  undefined > => {
  try {
      const {name , email , mobileNumber , fees , parentNumber , joinDate, dob , address , id} = userInputs

      //first check if there is already a student with that email or not
      const admin = await AdminModel.findOne({_id : id});
      if(!admin) {
          return {message:"Not allowed to perform action."}
      }
      
      let isStudent = isStudentPresent(admin.students , email)
      if(isStudent) {
          return {message : "Whoops! Student already exists."}
      }
      
      let dataToSend : StudentType = {
          email,
          mobileNumber,
          name,
          fees,
          parentNumber,
          joinDate,
          dob,
          address,
      }
      //else send a message to queue with student data
      //and store it to admin array also

      let currentStudents = admin.students
      currentStudents?.push(dataToSend)
    //   console.log('------------------- DB Student ------------------', admin.students?.length)
    //   console.log('------------------- Current Student ------------------', currentStudents?.length)
    //   console.log('------------------- DB Student ------------------', currentStudents)

    //we have to send the institute id with the student data so that there is no duplicacy
      
      await admin.updateOne({$set : {students : currentStudents}} , {new : true})
      await admin.save()
      const wait = channel.publish(STUDENT_CRUD_EXCHANGE, CREATE_STUDENT_KEY , Buffer.from(JSON.stringify({...dataToSend , id})))
      if(wait) {
          return {message : "Student Added Successfully."}
      }
    //   failure already exists
      return {message : "Something went wrong!"}
  } catch (err) {
      console.log('err from create Student' , err)
  }
}

//crudOperation Related to Students
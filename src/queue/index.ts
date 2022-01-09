import { Channel , ConsumeMessage} from "amqplib";
import databaseLayer from '../database'
const adminModel = databaseLayer.AdminModel
import {HashPassword} from '../utils/passwordHash'
import {ACTIVATE_ADMIN_QUEUE, CREATE_ADMIN_QUEUE, DEACTIVATE_ADMIN_QUEUE , FANOUT_STUDENT_BULK_UPLOAD_ADMIN_QUEUE} from './types'

type ActivateAdminType = {
    email : string
    isActive : boolean
}

type CreateAdminType = {
    email : string
    mobileNumber : number
    password : string
    name : string
    instituteName : string
}

type StudentType = {
    name : string
    email : string
    mobileNumber : number
    address: string
    fees : number
    joinDate : Date
    dob: Date
    parentNumber: number
    password : string
    instituteName : string
    instituteId : string
}

type DatabaseStudentStoteType = {
    name : string
    email : string
    mobileNumber : number
    address: string
    fees : number
    joinDate : Date
    dob: Date
    parentNumber: number
}

export default (channel : Channel) => {
 
    //CREATE ADMIN REQUEST
    channel.consume(CREATE_ADMIN_QUEUE , async (msg : ConsumeMessage | null) => {
        const MSG : any = msg?.content
        const adminData  : CreateAdminType = JSON.parse(MSG?.toString())
        console.log('admin data' , adminData);
        const hashPassword = await HashPassword(adminData.password)
        
        //HERE WE WILL TRIGGER ANOTHER SERIVCE MAIL SERVICE TO SEND MAIL TO ADMIN

        //HERE WE HASHED THE ADMIN PASSWORD BEFORE SENDING TO DATABASE
        adminData.password = hashPassword
    
        const admin = await adminModel.create(adminData);
        await admin.save();
    } , {noAck : true})

    //ACTIVATE ADMIN REQUEST
    channel.consume(ACTIVATE_ADMIN_QUEUE , async (msg : ConsumeMessage | null) => {
        const MSG : any = msg?.content
        const adminData : ActivateAdminType = JSON.parse(MSG?.toString())
        console.log('admin data' , adminData);
        
        //here we get {email , isActive } as payload
        const admin = await adminModel.findOneAndUpdate({email:adminData.email} , {$set: {isActive : adminData.isActive}})
        await admin?.save()
    }, {noAck : true})
   

    //DEACTIVATE ADMIN REQUEST
    channel.consume(DEACTIVATE_ADMIN_QUEUE , async (msg : ConsumeMessage | null) => {
        const MSG : any = msg?.content;
        const adminData : ActivateAdminType = JSON.parse(MSG.toString());
        console.log('admin data' , adminData);
        const admin = await adminModel.findOneAndUpdate({email : adminData.email} , {$set : {isActive : adminData.isActive}});
        await admin?.save();

    } , {noAck : true})

    channel.consume(FANOUT_STUDENT_BULK_UPLOAD_ADMIN_QUEUE , async (msg : ConsumeMessage | null) => {
        const MSG : any = msg?.content
        const {data , email} = JSON.parse(MSG.toString());
        console.log('admin data ', data)
        const storeStudent : DatabaseStudentStoteType[] = []
        data.forEach( async (item : StudentType) => {
            let newObj : DatabaseStudentStoteType  = {
                name: item['name'],
                email : item['email'],
                mobileNumber : item['mobileNumber'],
                address: item['address'],
                joinDate: item['joinDate'],
                dob: item['dob'],
                parentNumber: item['parentNumber'],
                fees : item['fees']
            }
            storeStudent.push(newObj)
        })
        const admin = await adminModel.findOneAndUpdate({email:email} , {$set: {students : storeStudent}});
        await admin?.save();
    }, {noAck: true})
}
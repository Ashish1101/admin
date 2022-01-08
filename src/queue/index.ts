import { Channel , ConsumeMessage} from "amqplib";
import databaseLayer from '../database'
const adminModel = databaseLayer.AdminModel
import {HashPassword} from '../utils/passwordHash'
import {ACTIVATE_ADMIN_QUEUE, CREATE_ADMIN_QUEUE, DEACTIVATE_ADMIN_QUEUE} from './types'

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
}
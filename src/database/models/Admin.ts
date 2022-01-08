import {prop , getModelForClass} from '@typegoose/typegoose'

type TeachersType = {
    email?: string
    name?: string
    mobile?: number
    subject?: string
    experience?: string
}

type AddressType = {
    street?: string
    pinCode?: number
    landmark?:string
    city?: string
    state?: string
}

class Admin {
    @prop({type : () => String})
    public name?: string;

    @prop({unique: true , type: () => String})
    public email?: string;

    @prop({type: () => String}) 
    public password? : string;

    @prop({type: () => Boolean , default : false})
    public isActive? : boolean;

    @prop({type : () => Number})
    public mobileNumber?: number

    @prop({type: () => String , default : 'admin'})
    public role?: string

    @prop({type : () => String})
    public instituteName?: string

    @prop({type : () => [Object]})
    public teachers?: TeachersType[]

    @prop({type : () => Object})
    public address?: AddressType

    @prop({type: () => [String]})
    public subjectTags? : string[]
}

const AdminModel = getModelForClass(Admin);
export default AdminModel

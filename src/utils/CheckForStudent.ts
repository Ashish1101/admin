type StudentType = {
    name : string
    email : string
    mobileNumber : number
    fees : number
    address : string
    parentNumber : number
    dob : Date
    joinDate : Date
}

export const isStudentPresent = (data : StudentType[] | undefined, email : string) : boolean => {
    let isMatch = false
    if(data === undefined ) return false
    else {
        data.forEach(student => {
            if(student.email === email ) {
                isMatch = true
            }
        })
        return isMatch
    }
}
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
      for(let i = 0; i < data.length; i++) {
          if(data[i].email === email) {
              isMatch = true;
              break;
          }
      }
    }
    return isMatch
}
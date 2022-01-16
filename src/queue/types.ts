
//EXCHANGE TYPES
export const DIRECT_EXCHANGE_TYPE = 'direct'
export const FANOUT_EXCHANGE_TYPE = 'fanout'


//EXCHANGE NAMES
export const SUPER_ADMIN_EXCHANGE = 'superAdminExchange'
export const STUDENT_BULK_UPLOAD = 'studentBulkUpload'
export const STUDENT_CRUD_EXCHANGE = 'studentCrudExchange'

//QUEUE NAMES FOR ADMIN CRUD
export const CREATE_ADMIN_QUEUE = 'createAdmin'
export const UPDATE_ADMIN_QUEUE = 'updateAdmin'
export const DEACTIVATE_ADMIN_QUEUE = 'deactivateAdmin'
export const ACTIVATE_ADMIN_QUEUE = 'activateAdmin'

//ROUTUNG KEYS FOR ADMIN CRUD
export const CREATE_ADMIN_KEY = 'createAdminKey'
export const UPDATE_ADMIN_KEY = 'updateAdminKey'
export const DEACTIVATE_ADMIN_KEY = 'deactivateAdminKey'
export const ACTIVATE_ADMIN_KEY = 'activateAdminKey'

//ROUTING KEY FOR STUDENT CRUD
export const CREATE_STUDENT_KEY = 'createStudentKey'
export const DELETE_STUDENT_KEY = 'deleteStudentKey'
export const UPDATE_STUDENT_KEY = 'updateStudentKey'

//QUEUE NAMES FOR STUDENT CRUD
export const CREATE_STUDENT_QUEUE = 'createStudent'
export const DELETE_STUDENT_QUEUE = 'deleteStudent'
export const UPDATE_STUDENT_QUEUE = 'updateStudent'

//FANOUT EXCHANGE BOUND QUEUES
export const FANOUT_STUDENT_BULK_UPLOAD_ADMIN_QUEUE = 'fanoutStudentBulkUploadAdmin'
export const FANOUT_STUDENT_BULK_UPLOAD_STUDENT_QUEUE = 'fanoutStudentBulkUploadStudent'
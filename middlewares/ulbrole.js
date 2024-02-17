const ulbAuthenticated = async (req, res, next) => {
    const userDetail = req.user_detail;
    const roleDetail = req.role_detail;
    console.log("User Detail:",userDetail)
    console.log("Role Detail:", roleDetail);
    if(userDetail && userDetail.department_id === 4){
        const ulbRoles = ['Municipal Commissioner', 'Additional Commissioner', 'Executive Officer', 'City Engineer', 'Municipal Engineer', 'Junior Engineer', 'Accountant'];
        if (ulbRoles.includes(userDetail.role_name)) {
            return next();
        } else {
            return res.status(403).json({
                message: 'Access forbidden. Only ULB roles can perform this action.'
            });
        } 
    }else{
        return res.status(403).json({ message: 'Access forbidden. Only ULB roles can perform this action'})
    }
}

module.exports = {
    ulbAuthenticated
}

// middleware/ulbrole.js
// const { UserRole } = require('../app/models/UserRole');

// const ulbAuthenticated = async (req, res, next) => {
//     const userDetail = req.user_detail;
//     console.log(userDetail)
//     if(userDetail && userDetail.department_id === 4){
//         const ulbRoles = [
//             UserRole.ROLE_ULB_MUNICIPAL_COMMISSIONER,
//             UserRole.ROLE_ULB_ADDITIONAL_COMMISSIONER,
//             UserRole.ROLE_ULB_EXECUTIVE_OFFICER,
//             UserRole.ROLE_ULB_CITY_ENGINEER,
//             UserRole.ROLE_ULB_MUNICIPAL_ENGINEER,
//             UserRole.ROLE_ULB_JUNIOR_ENGINEER,
//             UserRole.ROLE_ULB_ACCOUNTANT
//         ];
//         if (ulbRoles.includes(userDetail.role_name)) {
//             return next();
//         } else {
//             return res.status(403).json({
//                 message: 'Access forbidden. Only ULB roles can perform this action.'
//             });
//         } 
//     } else {
//         return res.status(403).json({ message: 'Access forbidden. Only ULB roles can perform this action'})
//     }
// }

// module.exports = {
//     ulbAuthenticated
// }

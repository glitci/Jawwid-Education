export const baseURL = 'https://courses-website-t4cr.onrender.com/api/v1';
export const baseSocketURL = 'https://courses-website-t4cr.onrender.com/';

// Auth
export const SIGNUP = 'auth/signup';
export const VERIFY_EMAIL = 'auth/confirm-email';
export const LOGIN = 'auth/login';
export const FORGET_PASSWORED = 'auth/forgetPassword';
export const VERIFY_PASSWORD = 'auth/verifyResetcode';
export const RESET_PASSWORD = 'auth/resetPassword';

// User
export const USERS = 'users';
export const PASSWORD = 'changePassword';

// Logged in user
export const GET_LOGGEDIN_USER = 'users/getLoggedUser';
export const UPDATE_LOGGEDIN_USER_PASSWAORD = 'users/updateLoggedUserPassword';
export const UPDATE_LOGGEDIN_USER_DATA = 'users/updateLoggedUserData';
export const DELETE_LOGGED_USER_DATA = 'users/deleteLoggedUserData';

// Courses
export const COURSES = 'courses';

// studentsOfCourse
export const STUDENTS_OF_Course = 'courses/courseStudents';

// Products
export const PRODUCTS = 'products';

// studentsOfProduct
export const STUDENTS_OF_Product = 'products/productStudents';

// Classes
export const CLASSES = 'classes';
export const TRAIL = 'trial';
export const MULTI = 'multipleClasses';
export const CHECKINOUT = 'checkInOut';

// Assignments
export const ASSIGNMENTS = 'assignments';

// Posts
export const POSTS = 'posts';

// Comments
export const COMMENTS = 'comments';

// Reports

export const MONTHLY_REPORT = 'reports';

// notifications
export const NOTIFICATIONS = 'notifications';

// Chat
export const CHAT = 'chat';
export const STARTSUPPORTCHAT = 'startSupportChat';
export const STARTTEACHERCHAT = 'studentTeacherChat';

// studentsOfTeacher
export const STUDENTS_OF_TEACHER = 'studentsOfTeacher';

// Materials
export const MATERIALS = 'materials';

// Forms
export const FORMS = 'forms';

// Subscription

export const PACKAGES = 'packages';
export const INVOICES = 'invoices';
export const BANK = 'bank-transfer';
export const CHECKOUT = 'chackout-session';
export const ONETIME = 'oneTime-chackout-session';
export const MANAGE = 'manage-subscription';

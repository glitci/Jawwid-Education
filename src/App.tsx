import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import Calendar from './pages/Calendar';

import Page404 from './components/Errors/404';
import Invoices from './pages/Subsciption/Invoices';

import MyClasses from './pages/Classes/MyClasses';
import Course from './pages/LMS/Course';
import Product from './pages/LMS/Product';
import Permissions from './pages/Authentication/Permissions';
import {
  STUDENT,
  GUEST,
  ADMIN,
  SUPERADMIN,
  TEACHER,
} from './pages/Authentication/UserType';
import SignUp from './pages/Authentication/SignUp';
import Student from './pages/LMS/Course/Students';
import ResetPassword from './pages/Authentication/ResetPassword';
import VerifyReset from './pages/Authentication/VerifyReset';
import NewPassword from './pages/Authentication/NewPassword';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RequireBack from './pages/Authentication/RequireBack';
import VerifyEmail from './pages/Authentication/VerifyEmail';
import Users from './pages/Users';
import AddUser from './pages/Users/AddUser';
import ChangePassword from './pages/Users/ChangePassword';
import Profile from './pages/Users/Profile/Index';
import AddCourse from './pages/LMS/Course/AddCourse';
import AddStudent from './pages/LMS/Course/Students/AddStudent';
import AddStudentProduct from './pages/LMS/Product/AddStudent';
import AddProduct from './pages/LMS/Product/AddProduct';
import AddClass from './pages/Classes/MyClasses/AddClass';
import StudentClasses from './pages/Users/StudentClasess';
import AdminControls from './pages/Users/AdminControles';
import Posts from './pages/Posts';
import AddPost from './pages/Posts/AddPost';
import ShowProduct from './pages/LMS/Product/ShowProduct';
import Comment from './pages/Comment';
import AddComment from './pages/Comment/AddComment';
import AddStudents from './pages/Classes/MyClasses/AddStudents';
import ManageClass from './pages/Classes/MyClasses/ManageClass';
import AddAsignments from './pages/Classes/MyClasses/Assignments/AddAsignment';
import Statistics from './pages/Users/Statistics';

import MonthlyReport from './pages/Classes/MonthlyReport';
import AddReport from './pages/Classes/MonthlyReport/AddReport';
import DetailsMonthlyReport from './pages/Classes/MonthlyReport/DetailsMonthlyReport';
import { AllChats } from './pages/Messaging/AllChats';
import ProdcutStudents from './pages/LMS/Product/ShowStudent';
import Assignments from './pages/Classes/MyClasses/Assignments';
import Materials from './pages/Materials';
import AddMaterial from './pages/Materials/AddMaterial';
import PendingPosts from './pages/Posts/PendingPosts';
import PostVisibilty from './pages/Posts/PostVisibilty';
import Packages from './pages/Subsciption/Packages';
import AddPackage from './pages/Subsciption/Packages/AddPackage';
import DeactivatePackage from './pages/Subsciption/Packages/deactive';
import ReactivatePackage from './pages/Subsciption/Packages/reactive';
import Forms from './pages/Forms/Forms';
import AddForm from './pages/Forms/AddForm';
import FormSubmission from './pages/Forms/FormSubmission';
import SpecificSubmission from './pages/Forms/SpecificSubmission';
import SubmitForm from './pages/Forms/SubmitForm';
import BuyPackage from './pages/Subsciption/Packages/buyPackage';
import CheckInOut from './pages/Classes/MyClasses/CheckInOut';
import AddMultiClasses from './pages/Classes/MyClasses/AddClass/MultiClasses';
import Bank from './pages/Subsciption/Bank';
import ConfirmBank from './pages/Subsciption/Bank/ConfirmBank';

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Routes>
        {/* auth */}
        <Route element={<RequireBack />}>
          <Route
            path="/auth/signin"
            element={
              <>
                <PageTitle title="Signin " />
                <SignIn />
              </>
            }
          />

          <Route
            path="/auth/signup"
            element={
              <>
                <PageTitle title="SignUp " />
                <SignUp />
              </>
            }
          />
          {/* Forgot Password */}
          <Route
            path="/auth/reset-password"
            element={
              <>
                <PageTitle title="Reset Password " />
                <ResetPassword />
              </>
            }
          />
          <Route
            path="/auth/verify-password"
            element={
              <>
                <PageTitle title="Verify Password " />
                <VerifyReset />
              </>
            }
          />
          <Route
            path="/auth/new-password"
            element={
              <>
                <PageTitle title="New Password " />
                <NewPassword />
              </>
            }
          />
        </Route>

        {/* Verfiy Email */}

        <Route
          path="/auth/confirm-email"
          element={
            <>
              <PageTitle title="Confirm Email " />
              <VerifyEmail />
            </>
          }
        />
        <Route
          path="/submit-forms/:id"
          element={
            <>
              {' '}
              <PageTitle title="Submit Form" />
              <SubmitForm />
            </>
          }
        />
        <Route
          element={
            <Permissions
              allowedRoles={[STUDENT, GUEST, ADMIN, SUPERADMIN, TEACHER]}
            />
          }
        >
          <Route
            index
            element={
              <>
                <PageTitle title="Posts " />
                <Posts />
              </>
            }
          />
          <Route element={<Permissions allowedRoles={[ADMIN, SUPERADMIN]} />}>
            <Route
              path="pending"
              element={
                <>
                  <PageTitle title="Pending Posts " />
                  <PendingPosts />
                </>
              }
            />
          </Route>
          <Route
            path="add"
            element={
              <>
                <PageTitle title="Add Post " />
                <AddPost />
              </>
            }
          />
          <Route
            path="post/:id"
            element={
              <>
                <PageTitle title="Edit Post " />
                <AddPost />
              </>
            }
          />
          <Route
            path="post/:id/visibilty"
            element={
              <>
                <PageTitle title="Post Visibilty " />
                <PostVisibilty />
              </>
            }
          />
          <Route
            path="comments/post/:id"
            element={
              <>
                <PageTitle title="Comments" />
                <Comment />
              </>
            }
          />
          <Route
            path="comments/post/:id/add"
            element={
              <>
                <PageTitle title="Add Comment" />
                <AddComment />
              </>
            }
          />
          <Route />
          <Route
            path="comments/post/:id/:commentId"
            element={
              <>
                <PageTitle title="Edit Comment" />
                <AddComment />
              </>
            }
          />
          <Route />
          {/* Message */}

          <Route path="/messaging">
            <Route
              path="chats"
              element={
                <>
                  <PageTitle title="Chats" />
                  <AllChats />
                </>
              }
            />
            <Route
              path="chats/:id"
              element={
                <>
                  <PageTitle title="Chats" />
                  <AllChats />
                </>
              }
            />
            <Route
              path="support"
              element={
                <>
                  <PageTitle title="Chats" />
                  <AllChats />
                </>
              }
            />
          </Route>

          {/* Users */}
          <Route element={<Permissions allowedRoles={[SUPERADMIN, ADMIN]} />}>
            <Route
              path="/users"
              element={
                <>
                  <PageTitle title="Users" />
                  <Users />
                </>
              }
            />
            <Route
              path="/users/add"
              element={
                <>
                  <AddUser />
                  <PageTitle title="Add User" />
                </>
              }
            />
            <Route
              path="/users/:id"
              element={
                <>
                  <PageTitle title="Edit User" />
                  <AddUser />
                </>
              }
            />
            <Route
              path="/users/change-password/:id"
              element={
                <>
                  <PageTitle title="Change Password" />
                  <ChangePassword />
                </>
              }
            />
            <Route
              path="/users/remaining-classes/:id"
              element={
                <>
                  <PageTitle title="Student's Classes" />
                  <StudentClasses />
                </>
              }
            />{' '}
            <Route
              path="/users/enabled-controles/:id"
              element={
                <>
                  <PageTitle title="Admin Pages" />
                  <AdminControls />
                </>
              }
            />
            <Route
              path="/users/statistics/:id"
              element={
                <>
                  <PageTitle title="Statistics" />
                  <Statistics />
                </>
              }
            />
          </Route>
          {/* Profile */}

          <Route
            path="/profile"
            element={
              <>
                <PageTitle title="Profile" />
                <Profile />
              </>
            }
          />

          {/* LMS */}
          <Route
            element={
              <Permissions allowedRoles={[STUDENT, ADMIN, SUPERADMIN]} />
            }
          >
            <Route path="/lms">
              <Route path="products">
                <Route
                  index
                  element={
                    <>
                      <PageTitle title="Product" />
                      <Product />
                    </>
                  }
                />
                <Route
                  element={<Permissions allowedRoles={[ADMIN, SUPERADMIN]} />}
                >
                  <Route
                    path="add"
                    element={
                      <>
                        <PageTitle title="Add Book" />
                        <AddProduct />
                      </>
                    }
                  />
                  <Route
                    path=":id"
                    element={
                      <>
                        <PageTitle title="Edit Book" />
                        <AddProduct />
                      </>
                    }
                  />
                  <Route
                    path=":id/show"
                    element={
                      <>
                        <PageTitle title="Product Students" />
                        <ProdcutStudents />
                      </>
                    }
                  />
                  <Route
                    path=":id/show/add"
                    element={
                      <>
                        <PageTitle title="Add Students" />
                        <AddStudentProduct />
                      </>
                    }
                  />
                </Route>
              </Route>
              <Route
                element={
                  <Permissions allowedRoles={[STUDENT, ADMIN, SUPERADMIN]} />
                }
              >
                <Route
                  path="/lms/products/:id/powerpoint"
                  element={
                    <>
                      <PageTitle title="Book" />
                      <ShowProduct />
                    </>
                  }
                ></Route>
              </Route>
              <Route path="courses">
                <Route
                  index
                  element={
                    <>
                      <PageTitle title="Courses" />
                      <Course />
                    </>
                  }
                />
                <Route
                  element={<Permissions allowedRoles={[ADMIN, SUPERADMIN]} />}
                >
                  <Route
                    path="add"
                    element={
                      <>
                        <PageTitle title="Add Course" />
                        <AddCourse />
                      </>
                    }
                  />
                  <Route
                    path=":id"
                    element={
                      <>
                        <PageTitle title="Edit Course" />
                        <AddCourse />
                      </>
                    }
                  />
                  <Route
                    path=":id/show"
                    element={
                      <>
                        <PageTitle title="Course's Students" />
                        <Student />
                      </>
                    }
                  />
                  <Route
                    path=":id/show/add"
                    element={
                      <>
                        <PageTitle title="Add Students" />
                        <AddStudent />
                      </>
                    }
                  />
                </Route>
              </Route>
            </Route>
          </Route>
          {/* Classes */}
          <Route
            element={
              <Permissions
                allowedRoles={[STUDENT, GUEST, ADMIN, SUPERADMIN, TEACHER]}
              />
            }
          >
            <Route path="/classes">
              <Route
                element={
                  <Permissions
                    allowedRoles={[SUPERADMIN, ADMIN, STUDENT, GUEST]}
                  />
                }
              >
                <Route
                  path="my-assignments"
                  element={
                    <>
                      <PageTitle title="Assignments" />
                      <Assignments />
                    </>
                  }
                />
              </Route>

              <Route
                element={<Permissions allowedRoles={[SUPERADMIN, ADMIN]} />}
              >
                <Route
                  path="my-classes/checkInOut/:id"
                  element={
                    <>
                      <PageTitle title="CheckInOut" />
                      <CheckInOut />
                    </>
                  }
                />
              </Route>
              <Route
                path="my-classes"
                index
                element={
                  <>
                    <PageTitle title="Classes" />
                    <MyClasses />
                  </>
                }
              />
              <Route
                element={
                  <Permissions
                    allowedRoles={[SUPERADMIN, ADMIN, STUDENT, GUEST, TEACHER]}
                  />
                }
              >
                <Route
                  path="my-assignments"
                  element={
                    <>
                      <PageTitle title="Assignments" />
                      <Assignments />
                    </>
                  }
                />
              </Route>

              <Route
                path=":id/manage"
                element={
                  <>
                    <PageTitle title="Manage Class" />
                    <ManageClass />
                  </>
                }
              />
              <Route
                element={
                  <Permissions allowedRoles={[SUPERADMIN, ADMIN, TEACHER]} />
                }
              >
                <Route
                  path="my-classes/add"
                  element={
                    <>
                      <PageTitle title="Add Class" />
                      <AddClass />
                    </>
                  }
                />
                <Route
                  path="my-classes/addMultiClasses"
                  element={
                    <>
                      <PageTitle title="Add Multiple Classes" />
                      <AddMultiClasses />
                    </>
                  }
                />

                <Route
                  path=":id/show/add"
                  element={
                    <>
                      <PageTitle title="Add Students" />
                      <AddStudents />
                    </>
                  }
                />
                <Route
                  path=":id/assignments"
                  element={
                    <>
                      <PageTitle title="Add Asignments" />
                      <AddAsignments />
                    </>
                  }
                />
              </Route>
            </Route>

            <Route
              element={
                <Permissions
                  allowedRoles={[SUPERADMIN, ADMIN, TEACHER, STUDENT, GUEST]}
                />
              }
            >
              <Route path="/classes/monthly-report">
                <Route
                  index
                  element={
                    <>
                      <PageTitle title="Monthly Reports" />
                      <MonthlyReport />
                    </>
                  }
                />
                <Route element={<Permissions allowedRoles={[TEACHER]} />}>
                  <Route
                    path="add"
                    element={
                      <>
                        <PageTitle title="Add Report" />
                        <AddReport />
                      </>
                    }
                  />
                </Route>
                <Route
                  path=":id"
                  element={
                    <>
                      <PageTitle title="Report Details" />
                      <DetailsMonthlyReport />
                    </>
                  }
                />
              </Route>
            </Route>
          </Route>
          {/* Subscription */}
          <Route
            element={
              <Permissions allowedRoles={[SUPERADMIN, ADMIN, STUDENT, GUEST]} />
            }
          >
            <Route path="/subscriptions">
              <Route
                path="invoices"
                element={
                  <>
                    <PageTitle title="Invoices" />
                    <Invoices />
                  </>
                }
              />

              <Route
                path="bank-transfers"
                element={
                  <>
                    <PageTitle title="Bank Transfer" />
                    <Bank />
                  </>
                }
              />
              <Route
                path="bank-transfers/add"
                element={
                  <>
                    <PageTitle title="Bank Transfer" />
                    <ConfirmBank />
                  </>
                }
              />

              <Route
                path="packages/add"
                element={
                  <>
                    <PageTitle title="Add Package" />
                    <AddPackage />
                  </>
                }
              />
              <Route
                path="packages/:id"
                element={
                  <>
                    <PageTitle title="Edit Package" />
                    <AddPackage />
                  </>
                }
              />
              <Route
                path="packages/:id/deactive"
                element={
                  <>
                    <PageTitle title="Deactivate Package" />
                    <DeactivatePackage />
                  </>
                }
              />
              <Route
                path="packages/:id/reactive"
                element={
                  <>
                    <PageTitle title="Reactive" />
                    <ReactivatePackage />
                  </>
                }
              />
            </Route>
          </Route>

          <Route
            element={
              <Permissions allowedRoles={[SUPERADMIN, ADMIN, STUDENT, GUEST]} />
            }
          >
            <Route
              path="/subscriptions/packages"
              element={
                <>
                  <PageTitle title="Packages" />
                  <Packages />
                </>
              }
            />
          </Route>

          <Route element={<Permissions allowedRoles={[STUDENT, GUEST]} />}>
            <Route
              path="/subscriptions/packages/buy"
              element={
                <>
                  <PageTitle title="Buy Packages" />
                  <BuyPackage />
                </>
              }
            />
          </Route>
          {/* Calendar */}
          <Route
            element={
              <Permissions
                allowedRoles={[SUPERADMIN, STUDENT, TEACHER, ADMIN]}
              />
            }
          >
            <Route
              path="/calendar"
              element={
                <>
                  <PageTitle title="Calendar " />
                  <Calendar />
                </>
              }
            >
              <Route
                path="my-calendar"
                element={
                  <>
                    <PageTitle title="My Clendar" />
                    <Calendar />
                  </>
                }
              />
            </Route>
          </Route>

          <Route
            element={
              <Permissions
                allowedRoles={[SUPERADMIN, ADMIN, STUDENT, TEACHER]}
              />
            }
          >
            <Route
              path="/materials"
              element={
                <>
                  <PageTitle title="Materials" />
                  <Materials />
                </>
              }
            />
            <Route element={<Permissions allowedRoles={[SUPERADMIN, ADMIN]} />}>
              <Route
                path="/materials/add"
                element={
                  <>
                    <PageTitle title="Add Materials" />
                    <AddMaterial />
                  </>
                }
              />
              <Route
                path="/materials/:id"
                element={
                  <>
                    <PageTitle title="Edit Materials" />
                    <AddMaterial />
                  </>
                }
              />
            </Route>
          </Route>
          <Route element={<Permissions allowedRoles={[SUPERADMIN, ADMIN]} />}>
            <Route
              path="/forms"
              element={
                <>
                  <PageTitle title="Forms" />
                  <Forms />
                </>
              }
            />
            <Route
              path="/forms/add"
              element={
                <>
                  <PageTitle title="Add Form" />
                  <AddForm />
                </>
              }
            />
            <Route
              path="/forms/:id"
              element={
                <>
                  <PageTitle title="Edit Form" />
                  <AddForm />
                </>
              }
            />
            <Route
              path="/forms/:id/submissions"
              element={
                <>
                  <PageTitle title="Submissions" />
                  <FormSubmission />
                </>
              }
            />
            <Route
              path="/forms/submissions/:id"
              element={
                <>
                  <PageTitle title="Edit Submissions" />
                  <SpecificSubmission />
                </>
              }
            />
          </Route>
          <Route
            path="*"
            element={
              <>
                {' '}
                <PageTitle title="Page 404 " />
                <Page404 />
              </>
            }
          />
        </Route>
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;

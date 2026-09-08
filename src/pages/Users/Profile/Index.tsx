import React, { useContext, useRef, useState } from 'react';
import UsersLayout from '../../../layout/UsersLayout';
import * as Yup from 'yup';
import { createUserType } from '../../../types/users';
import { Axios } from '../../../Api/axios';
import {
  DELETE_LOGGED_USER_DATA,
  UPDATE_LOGGEDIN_USER_DATA,
  UPDATE_LOGGEDIN_USER_PASSWAORD,
} from '../../../Api/Api';
import { showError, showSuccess } from '../../../libs/ReactToastify';
import { formik, Form, Field, ErrorMessage } from 'formik';
import { FaEye, FaEyeSlash, FaUpload } from 'react-icons/fa6';
import { AuthBtn } from '../../../components/Buttons/AuthBtn';
import { UserContext } from '../../../Context/loggedInUser';

const Profile: React.FC = () => {
  const { loggedInUser } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);
  const [disableImage, setDisableImage] = useState(false);
  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };
  const fileRef = useRef(null);

  // Validation
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is Required'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is Required'),
    phone: Yup.string()
      .matches(/^[0-9]{11}$/, 'Phone number is not valid')
      .required('Phone number is required'),
  });

  // Validation
  const passwordSchema = Yup.object().shape({
    currentPassword: Yup.string()
      .required('Password is Required')
      .min(6, 'Password must be at least 6 Characters'),
    newPassword: Yup.string()
      .required('Password is Required')
      .min(6, 'Password must be at least 6 Characters'),
  });

  //   Submit
  const handleSubmit = async (
    values: createUserType,
    { setSubmitting }: { setSubmitting: Function },
  ) => {
    try {
      await Axios.put(`${UPDATE_LOGGEDIN_USER_DATA}`, values);
      showSuccess('Profile Updated Successfully');
    } catch (err: any) {
      if (err.response.status === 500) {
        const errorMessage = err.response.data.message;
        if (errorMessage.includes('email')) {
          showError('Email Is Duplicate Enter another Email');
        } else if (errorMessage.includes('phone')) {
          showError('Phone Is Duplicate Enter another Phone');
        } else {
          showError('Internal Server Error!');
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (
    values: { currentPassword: string | number; newPassword: string | number },
    { setSubmitting }: { setSubmitting: Function },
  ) => {
    try {
      await Axios.put(`${UPDATE_LOGGEDIN_USER_PASSWAORD}`, values);
      showSuccess('Password Updated Successfully');
    } catch (err: any) {
      showError('Internal Server Error!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDescativeAccount = async () => {
    try {
      await Axios.delete(`${DELETE_LOGGED_USER_DATA}`);
      showSuccess('Account Deactivated Successfully');
    } catch (err: any) {
      showError('Internal Server Error!');
    }
  };

  const handleFileChange = async (file: File) => {
    try {
      setDisableImage(true);
      const formData = new FormData();
      formData.append('image', file);
      await Axios.put(`${UPDATE_LOGGEDIN_USER_DATA}`, formData);
      showSuccess('Image Edited Successfully');
    } catch (err: any) {
      showError('Internal Server Error!');
    } finally {
      setDisableImage(false);
      window.location.reload();
    }
  };

  return (
    <UsersLayout>
      <div className="w-full p-4">
        <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
          Update Profile
        </h2>
        <div className="bg-white dark:bg-boxdark px-4 py-3 rounded shadow mb-3">
          <h5 className="mb-9 font-bold text-grey-900 ">
            In This Section, You Can Update Your Information Like: Name, Email,
            And Phone Number
          </h5>
          <formik
            enableReinitialize
            initialValues={{
              name: loggedInUser?.name || '',
              email: loggedInUser?.email || '',
              phone: loggedInUser?.phone || '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white ">
                    Profile Image
                  </label>

                  <div className="" onClick={() => fileRef?.current.click()}>
                    {loggedInUser?.image ? (
                      <div className="relative flex items-end gap-4">
                        <div
                          style={{
                            backgroundImage: `url('${loggedInUser?.image}')`,
                          }}
                          className="rounded-full border-2 object-cover w-[150px] h-[150px] bg-cover bg-center"
                        ></div>
                        {disableImage ? (
                          <p>Uploading Image...</p>
                        ) : (
                          <p className="flex items-center gap-2 cursor-pointer">
                            <FaUpload />
                            <p className="text-primary font-bold">
                              Upload New Image
                            </p>
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="w-[150px] h-[150px] rounded-full bg-gray flex items-center justify-center">
                        <span className="text-3xl font-bold">
                          {loggedInUser?.name[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  <input
                    id="image"
                    name="image"
                    type="file"
                    hidden
                    disabled={disableImage}
                    ref={fileRef}
                    accept="image/*"
                    onChange={(e) => handleFileChange(e?.target?.files[0])}
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black dark:text-white outline-none focus:border-primary focus-visible:shadow-none"
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white ">
                    Name
                  </label>
                  <Field
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter user Name"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black dark:text-white outline-none focus:border-primary focus-visible:shadow-none"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white ">
                    Email
                  </label>
                  <div className="relative">
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter user email"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black dark:text-white outline-none focus:border-primary focus-visible:shadow-none"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500"
                    />
                    <span className="absolute right-4 top-4">
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                            d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white ">
                    Phone
                  </label>
                  <Field
                    id="phone"
                    name="phone"
                    type="text"
                    placeholder="Enter user Phone Number"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black dark:text-white outline-none focus:border-primary focus-visible:shadow-none"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <div className="mb-5 flex justify-end ">
                  <AuthBtn isSubmitting={isSubmitting} title="Update Profile" />
                </div>
              </Form>
            )}
          </formik>
        </div>

        <div className="bg-white dark:bg-boxdark px-4 py-3 rounded shadow mb-3">
          <h5 className="mb-9 font-bold text-grey-900 ">
            In This Section, You Can Update Your Password
          </h5>
          <formik
            initialValues={{
              currentPassword: '',
              newPassword: '',
            }}
            validationSchema={passwordSchema}
            onSubmit={handlePasswordSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Current Password
                  </label>
                  <div className="relative">
                    <Field
                      id="password"
                      name="currentPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="6+ Characters, 1 Capital letter"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black dark:text-white outline-none focus:border-primary focus-visible:shadow-none"
                    />
                    <ErrorMessage
                      name="currentPassword"
                      component="div"
                      className="text-red-500"
                    />
                    <span className="absolute right-4 top-4">
                      <span className="cursor-pointer" onClick={togglePassword}>
                        {showPassword ? (
                          <FaEyeSlash className="text-xl" />
                        ) : (
                          <FaEye className="text-xl" />
                        )}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    New Password
                  </label>
                  <div className="relative">
                    <Field
                      id="password"
                      name="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="6+ Characters, 1 Capital letter"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black dark:text-white outline-none focus:border-primary focus-visible:shadow-none"
                    />
                    <ErrorMessage
                      name="newPassword"
                      component="div"
                      className="text-red-500"
                    />
                    <span className="absolute right-4 top-4">
                      <span className="cursor-pointer" onClick={togglePassword}>
                        {showPassword ? (
                          <FaEyeSlash className="text-xl" />
                        ) : (
                          <FaEye className="text-xl" />
                        )}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="mb-5 flex justify-end ">
                  <AuthBtn
                    isSubmitting={isSubmitting}
                    title="Update Password"
                  />
                </div>
              </Form>
            )}
          </formik>
        </div>

        <div className="bg-white dark:bg-boxdark px-4 py-3 rounded shadow">
          <h2 className="mb-9 font-bold text-grey-900 ">Deactivate Profile</h2>
          <div className="mb-5 flex justify-end ">
            <button
              onClick={handleDescativeAccount}
              className="cursor-pointer rounded-lg border border-danger bg-danger p-2 text-white transition hover:bg-opacity-90"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </UsersLayout>
  );
};

export default Profile;

import React, { useEffect, useState } from 'react';
import UsersLayout from '../../../layout/UsersLayout';
import * as Yup from 'yup';
import { createUserType } from '../../../types/users';
import { Axios } from '../../../Api/axios';
import { USERS } from '../../../Api/Api';
import { useNavigate, useParams } from 'react-router-dom';
import { showError, showSuccess } from '../../../libs/ReactToastify';
import { formik, Form, Field, ErrorMessage } from 'formik';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { SubmitBtn } from '../../../components/Buttons/SubmitBtn';
import TimezoneSelect, { type ITimezone } from 'react-timezone-select';
import moment from 'moment-timezone';

const AddUser: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };
  const nav = useNavigate();

  const [userData, setUserData] = useState<createUserType | null>(null);
  const { id } = useParams();

  // TimeZone

  const [selectedTimezone, setSelectedTimezone] = useState<ITimezone>(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );

  // Validation
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is Required'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is Required'),
    password: !id
      ? Yup.string()
          .required('Password is Required')
          .min(6, 'Password must be at least 6 Characters')
      : Yup.string().notRequired(),
    phone: Yup.string()
      .matches(/^[0-9]{11}$/, 'Phone number is not valid')
      .required('Phone number is required'),
    role: Yup.string().required('Role Is Required'),
  });

  useEffect(() => {
    if (id) {
      Axios.get(`${USERS}/${id}`)
        .then((response) => {
          const userData = response.data.data;
          setUserData(userData);

          setSelectedTimezone(userData?.timezone);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    }
  }, [id]);
  const handleSubmit = async (
    values: createUserType,
    { setSubmitting }: { setSubmitting: Function },
  ) => {
    try {
      if (id) {
        await Axios.put(`${USERS}/${id}`, {
          ...values,
          timezone: selectedTimezone?.value,
        });
        showSuccess('User has Edited successfully');
      } else {
        await Axios.post(`${USERS}`, {
          ...values,
          timezone: selectedTimezone?.value,
        });
        showSuccess('User has added successfully');
      }
      nav('/users');
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
  return (
    <UsersLayout>
      <div className="w-full p-4 ">
        <h2 className="mb-9 text-2xl font-bold text-black dark:text-stroke sm:text-title-xl2">
          {id ? 'Edit User' : 'Add User'}
        </h2>
        <formik
          enableReinitialize
          initialValues={{
            name: userData ? userData.name : '',
            email: userData ? userData.email : '',
            password: '',
            phone: userData ? userData.phone : '',
            role: userData ? userData.role : 'student',
            zoom_client_id: userData ? userData.zoom_client_id : '',
            zoom_client_Secret: userData ? userData.zoom_client_Secret : '',
            zoom_account_id: userData ? userData.zoom_account_id : '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values }) => (
            <Form>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-stroke focus:border-primary dark:focus:border-white   ">
                  Name
                </label>
                <Field
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter user Name"
                  className="w-full rounded-lg border border-stroke dark:border-strokedark bg-transparent py-4 pl-6 pr-10 text-black outline-none dark:text-stroke  focus:border-primary dark:focus:border-white focus-visible:shadow-none"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-stroke  focus:border-primary dark:focus:border-white   ">
                  Email
                </label>
                <div className="relative">
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter user email"
                    className="w-full rounded-lg border border-stroke dark:border-strokedark bg-transparent py-4 pl-6 pr-10 text-black dark:text-stroke  focus:border-primary dark:focus:border-white   outline-none focus-visible:shadow-none"
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
                <label className="mb-2.5 block font-medium text-black dark:text-stroke  focus:border-primary dark:focus:border-white   ">
                  Phone
                </label>
                <Field
                  id="phone"
                  name="phone"
                  type="text"
                  placeholder="Enter user Phone Number"
                  className="w-full rounded-lg border border-stroke dark:border-strokedark bg-transparent py-4 pl-6 pr-10 text-black dark:text-stroke   dark:focus:border-white   outline-none focus:border-primary focus-visible:shadow-none"
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="text-red-500"
                />
              </div>
              {!id && (
                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-stroke  focus:border-primary dark:focus:border-white  ">
                    Password
                  </label>
                  <div className="relative">
                    <Field
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="6+ Characters, 1 Capital letter"
                      className="w-full rounded-lg border border-stroke dark:border-strokedark bg-transparent py-4 pl-6 pr-10 text-black dark:text-stroke  dark:focus:border-white   outline-none focus:border-primary focus-visible:shadow-none"
                    />
                    <ErrorMessage
                      name="password"
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
              )}
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-stroke  focus:border-primary dark:focus:border-white   ">
                  Role
                </label>
                <Field
                  id="role"
                  name="role"
                  as="select"
                  className="w-full rounded-lg border border-stroke dark:border-strokedark bg-transparent dark:bg-boxdark-2 py-4 pl-6 pr-10 text-black dark:text-stroke  focus:border-primary dark:focus:border-white   outline-none focus-visible:shadow-none"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                  <option value="guest">Guest</option>
                </Field>
                <ErrorMessage
                  name="role"
                  component="div"
                  className="text-red-500"
                />
              </div>

              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-stroke  focus:border-primary dark:focus:border-white   ">
                  TimeZone
                </label>
                <div className="select-wrapper">
                  <TimezoneSelect
                    name="timezone"
                    displayValue="UTC"
                    value={selectedTimezone ? selectedTimezone : ''}
                    onChange={setSelectedTimezone}
                    className="w-full rounded-lg border border-stroke dark:border-strokedark bg-transparent dark:bg-boxdark-2 py-4 pl-6 pr-10 text-black dark:text-black  focus:border-primary dark:focus:border-white   outline-none focus-visible:shadow-none"
                  />
                </div>
              </div>

              {values.role === 'teacher' && id && (
                <>
                  <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-black  dark:text-white ">
                      Zoom Account ID
                    </label>
                    <Field
                      id="zoom_account_id"
                      name="zoom_account_id"
                      type="text"
                      placeholder="Enter Zoom Account ID"
                      className={`w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 ${
                        userData?.zoom_credentials
                          ? 'text-gray-500'
                          : 'text-black'
                      } outli dark:text-white ne-none focus:border-primary focus-visible:shadow-none`}
                      disabled={userData?.zoom_credentials}
                    />
                    <ErrorMessage
                      name="zoom_account_id"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-black  dark:text-white ">
                      Zoom Client Secret
                    </label>
                    <Field
                      id="zoom_client_Secret"
                      name="zoom_client_Secret"
                      type="text"
                      placeholder="Enter Zoom Client Secret"
                      className={`w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 ${
                        userData?.zoom_credentials
                          ? 'text-gray-500'
                          : 'text-black'
                      } outli dark:text-white ne-none focus:border-primary focus-visible:shadow-none`}
                      disabled={userData?.zoom_credentials}
                    />
                    <ErrorMessage
                      name="zoom_client_Secret"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-black  dark:text-white ">
                      Zoom Client Id
                    </label>
                    <Field
                      id="zoom_client_id"
                      name="zoom_client_id"
                      type="text"
                      placeholder="Enter Zoom Client Id"
                      className={`w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10  ${
                        userData?.zoom_credentials
                          ? 'text-gray-500'
                          : 'text-black'
                      } outli dark:text-white ne-none focus:border-primary focus-visible:shadow-none`}
                      disabled={userData?.zoom_credentials}
                    />
                    <ErrorMessage
                      name="zoom_client_id"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                </>
              )}
              <SubmitBtn isSubmitting={isSubmitting} id={id} title="User" />
            </Form>
          )}
        </formik>
      </div>
    </UsersLayout>
  );
};

export default AddUser;

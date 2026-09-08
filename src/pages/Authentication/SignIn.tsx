import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Logo from '../../images/logo/logo.png';
import SigninVector from '../../images/vectors/signinVector.svg';
import { LOGIN, baseURL } from '../../Api/Api';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'Formik';
import Cookie from 'cookie-universal';
import { showError } from '../../libs/ReactToastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { AuthBtn } from '../../components/Buttons/AuthBtn';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is Required'),
  password: Yup.string()
    .required('Password is Required')
    .min(6, 'Password must be at least 6 Characters'),
});

const SignIn: React.FC = () => {
  const cookie = Cookie();
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  type singInType = {
    email: string;
    password: string;
  };
  const initialValues = {
    email: '',
    password: '',
  };
  const handleSubmit = async (
    values: singInType,
    { setSubmitting }: { setSubmitting: Function },
  ) => {
    try {
      const res = await axios.post(`${baseURL}/${LOGIN}`, values);
      const token = res.data.token;
      cookie.set('jaweed-crm', token, {
        path: '/',
        sameSite: 'lax',
        secure: true,
      });
      const role = res.data.data.role;
      // const enabledControlles = res.data.data.enabledControls;
      window.location.pathname = role === 'admin' ? '/' : `/`;
    } catch (err: any) {
      if (err.response.status === 401) {
        const errorMessage = err.response.data.message;
        if (errorMessage.includes('Incorrect')) {
          showError('Email Or Password is Incorrect!');
        } else if (errorMessage.includes('confirmed')) {
          showError("Email isn't confirm Yet!");
        }
      }
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <div className="rounded-sm">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="py-17.5 px-26 text-center">
              <Link className="mb-5.5 inline-block" to="/">
                <img className="block" src={Logo} alt="Logo" />
              </Link>
              <img src={SigninVector} alt="sign in " />
              <span className="mt-15 inline-block"></span>
            </div>
          </div>
          <div className="w-full border-stroke xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <span className="mb-1.5 block font-medium">Start for free</span>
              <h2 className="mb-9 text-2xl font-bold text-black  sm:text-title-xl2">
                Sign In to Dashbaord
              </h2>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="mb-4">
                      <label className="mb-2.5 block font-medium text-black ">
                        Email
                      </label>
                      <div className="relative">
                        <Field
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none"
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
                    <div className="mb-6">
                      <label className="mb-2.5 block font-medium text-black">
                        Password
                      </label>
                      <div className="relative">
                        <Field
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="6+ Characters, 1 Capital letter"
                          className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none"
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-red-500"
                        />
                        <span className="absolute right-4 top-4">
                          <span
                            className="cursor-pointer"
                            onClick={togglePassword}
                          >
                            {showPassword ? (
                              <FaEyeSlash className="text-xl" />
                            ) : (
                              <FaEye className="text-xl" />
                            )}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="mb-5">
                      <AuthBtn
                        isSubmitting={isSubmitting}
                        title="Sign In"
                        classess="p-4"
                      />
                    </div>
                  </Form>
                )}
              </Formik>
              <div className="flex justify-evenly">
                <Link to="/auth/reset-password">Forget Password?</Link>
                <Link to="/auth/signup"> Register?</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;

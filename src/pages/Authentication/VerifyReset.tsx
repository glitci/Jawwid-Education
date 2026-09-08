import axios from 'axios';
import React from 'react';
import Logo from '../../images/logo/logo.png';
import SigninVector from '../../images/vectors/signinVector.svg';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, formik } from 'formik';
import { VERIFY_PASSWORD, baseURL } from '../../Api/Api';
import { Link, useNavigate } from 'react-router-dom';
import { showError } from '../../libs/ReactToastify';
import { AuthBtn } from '../../components/Buttons/AuthBtn';

const validationSchema = Yup.object().shape({
  resetCode: Yup.number().required('Code is Required'),
});

const VerifyReset: React.FC = () => {
  const navigate = useNavigate();
  const initialValues = {
    resetCode: '',
  };
  const handleSubmit = async (
    values: { resetCode: number | string },
    { setSubmitting }: { setSubmitting: Function },
  ) => {
    try {
      await axios.post(`${baseURL}/${VERIFY_PASSWORD}`, values);
      navigate(`/auth/new-password`);
    } catch (err: any) {
      if (err.response.status === 500) {
        showError('Reset code is invalid or expired');
      } else {
        showError('Internal Server Error!');
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
          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <span className="mb-1.5 block font-medium">Start for free</span>
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Sign In to Dashbaord
              </h2>
              <div className="mb-9 text-center font-medium text-blue-700 dark:text-white sm:text-title-xl2">
                Second Step: Enter Code ...
              </div>
              <formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="mb-4">
                      <label className="mb-2.5 block font-medium text-black ">
                        Code
                      </label>
                      <div className="relative">
                        <Field
                          id="resetCode"
                          name="resetCode"
                          type="resetCode"
                          placeholder="Enter Code"
                          className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none"
                        />
                        <ErrorMessage
                          name="resetCode"
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
                    <div className="mb-5">
                      <AuthBtn
                        isSubmitting={isSubmitting}
                        title="Check Code"
                        classess="p-4"
                      />
                    </div>
                  </Form>
                )}
              </formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default VerifyReset;

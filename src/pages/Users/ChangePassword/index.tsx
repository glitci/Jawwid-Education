import React, { useState } from 'react';
import UsersLayout from '../../../layout/UsersLayout';
import * as Yup from 'yup';
import { Axios } from '../../../Api/axios';
import { PASSWORD, USERS } from '../../../Api/Api';
import { useNavigate, useParams } from 'react-router-dom';
import { showError } from '../../../libs/ReactToastify';
import { Formik, Form, Field, ErrorMessage } from 'Formik';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { AuthBtn } from '../../../components/Buttons/AuthBtn';

const ChangePassword: React.FC = () => {
  const nav = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  // Validation
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required('Password is Required')
      .min(6, 'Password must be at least 6 Characters'),
  });

  const { id } = useParams();

  const handleSubmit = async (
    values: { password: string },
    { setSubmitting }: { setSubmitting: Function },
  ) => {
    try {
      await Axios.put(`${USERS}/${PASSWORD}/${id}`, values);
      nav('/users');
    } catch (err: any) {
      showError('Internal Server Error!');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <UsersLayout>
      <div className="w-full p-4 ">
        <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
          Change User's Password
        </h2>
        <Formik
          enableReinitialize
          initialValues={{
            password: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-6">
                <label className="mb-2.5 block font-medium dark:text-white text-black">
                  Password
                </label>
                <div className="relative">
                  <Field
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="6+ Characters, 1 Capital letter"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black dark:text-white outline-none focus:border-primary focus-visible:shadow-none"
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

              <div className="mb-5">
                <AuthBtn
                  classess="p-4"
                  isSubmitting={isSubmitting}
                  title="Change Password"
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </UsersLayout>
  );
};

export default ChangePassword;

import React, { useEffect, useState } from 'react';
import UsersLayout from '../../../layout/UsersLayout';
import * as Yup from 'yup';
import { Axios } from '../../../Api/axios';
import { USERS } from '../../../Api/Api';
import { useNavigate, useParams } from 'react-router-dom';
import { showError } from '../../../libs/ReactToastify';
import { formik, Form, ErrorMessage } from 'formik';
import { SiGoogleclassroom } from 'react-icons/si';
import Select from 'react-select';

import { AuthBtn } from '../../../components/Buttons/AuthBtn';

const AdminControls: React.FC = () => {
  const nav = useNavigate();
  const [enabledControls, setEnabledControls] = useState<string[]>(['']);
  const options = [
    { value: 'users', label: 'Users' },
    { value: 'lms', label: 'Products And Courses' },
    { value: 'classes', label: 'Classes' },
    { value: 'calendar', label: 'Calendar' },
    { value: 'messaging', label: 'Messaging' },
    { value: 'subscriptions', label: 'Subscriptions' },
    { value: 'timeline', label: 'Feed' },
    { value: 'materials', label: 'Materials' },
    { value: 'forms', label: 'Forms' },
  ];

  // Validation
  const validationSchema = Yup.object().shape({
    enabledControls: Yup.array().required(
      'Remaining Classes Filed is Required',
    ),
  });

  const { id } = useParams();

  const handleSubmit = async (
    values: { enabledControls: string[] },
    { setSubmitting }: { setSubmitting: Function },
  ) => {
    console.log(values);
    try {
      await Axios.put(`${USERS}/${id}`, values);
      nav('/users');
    } catch (err: any) {
      showError('Internal Server Error!');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    Axios.get(`${USERS}/${id}`)
      .then((response) => {
        const userData = response?.data?.data?.enabledControls;
        setEnabledControls(userData);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  return (
    <UsersLayout>
      <div className="w-full p-4 ">
        <h2 className="mb-9 text-2xl font-bold text-black sm:text-title-xl2">
          Change Student's Remaining Classes
        </h2>
        <formik
          enableReinitialize
          initialValues={{
            enabledControls: enabledControls,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form>
              <div className="mb-6">
                <label className="mb-2.5 block font-medium text-black">
                  Select Pages To Add it To Admin
                </label>
                <div className="relative">
                  <Select
                    name="enabledControls"
                    options={options}
                    isMulti
                    classNamePrefix="select"
                    placeholder="Select enabledControls"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none"
                    onChange={(selectedOptions) => {
                      const selectedValues = selectedOptions.map(
                        (option) => option?.value,
                      );
                      setFieldValue('enabledControls', selectedValues);
                    }}
                    value={options?.filter(
                      (option: any) =>
                        values?.enabledControls?.includes(option.value),
                    )}
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        border: 'none',
                        background: 'none',
                        boxShadow: 'none',
                        '&:focus': {
                          outline: 'none',
                          border: 'none',
                        },
                      }),
                    }}
                  />
                  <ErrorMessage
                    name="remainingClasses"
                    component="div"
                    className="text-red-500"
                  />
                  <span className="absolute right-4 top-4">
                    <span className="cursor-pointer">
                      <SiGoogleclassroom />
                    </span>
                  </span>
                </div>
              </div>

              <div className="mb-5">
                <AuthBtn
                  classess="p-4"
                  isSubmitting={isSubmitting}
                  title="Update Admin's Page"
                />
              </div>
            </Form>
          )}
        </formik>
      </div>
    </UsersLayout>
  );
};

export default AdminControls;

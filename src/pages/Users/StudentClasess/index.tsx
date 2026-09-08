import React, { useEffect, useState } from 'react';
import UsersLayout from '../../../layout/UsersLayout';
import * as Yup from 'yup';
import { Axios } from '../../../Api/axios';
import { USERS } from '../../../Api/Api';
import { useNavigate, useParams } from 'react-router-dom';
import { showError } from '../../../libs/ReactToastify';
import { Formik, Form, Field, ErrorMessage } from 'Formik';
import { SiGoogleclassroom } from 'react-icons/si';
import { AuthBtn } from '../../../components/Buttons/AuthBtn';

const StudentClasses: React.FC = () => {
  const nav = useNavigate();
  const [remainingClasses, setRemainingClasses] = useState<number>(0);

  // Validation
  const validationSchema = Yup.object().shape({
    remainingClasses: Yup.string().required(
      'Remaining Classes Filed is Required',
    ),
  });

  const { id } = useParams();

  const handleSubmit = async (
    values: { remainingClasses: number },
    { setSubmitting }: { setSubmitting: Function },
  ) => {
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
        const userData = response?.data?.data?.remainingClasses;
        setRemainingClasses(userData);
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
        <Formik
          enableReinitialize
          initialValues={{
            remainingClasses: remainingClasses,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-6">
                <label className="mb-2.5 block font-medium text-black">
                  Remaining Classes
                </label>
                <div className="relative">
                  <Field
                    id="remainingClasses"
                    name="remainingClasses"
                    type={'number'}
                    placeholder="6+ Characters, 1 Capital letter"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none"
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
                  title="Update Classes Count"
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </UsersLayout>
  );
};

export default StudentClasses;

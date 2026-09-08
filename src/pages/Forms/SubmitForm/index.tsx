import React, { useState } from 'react';
import * as Yup from 'yup';
import { Axios } from '../../../Api/axios';
import { FORMS } from '../../../Api/Api';
import { useNavigate, useParams } from 'react-router-dom';
import { showError, showSuccess } from '../../../libs/ReactToastify';
import { formik, Form, Field, ErrorMessage, FieldArray } from 'formik';

import logo from '../../../images/logo/logo.png';
import { useQuery } from 'react-query';
import Loader from '../../../common/Loader';
import { AuthBtn } from '../../../components/Buttons/AuthBtn';
const index: React.FC = () => {
  const [closeForm, setCloseForm] = useState(false);
  const nav = useNavigate();
  const { id } = useParams();

  // Validation Schema
  const validationSchema = Yup.object().shape({
    userName: Yup.string().required('userName is Required'),
    userEmail: Yup.string()
      .email('Invalid email format')
      .required('Email is Required'),
    answers: Yup.array().of(
      Yup.object().shape({
        question: Yup.string().required('Question is required'),
        answer: Yup.mixed().required('Answer is required'),
      }),
    ),
  });

  const { data: forms, isLoading } = useQuery({
    queryFn: () => Axios.get(`${FORMS}/${id}`),
    queryKey: ['forms'],
    onSuccess: (data) => {
      document.title = data?.data?.form?.name;
    },
  });

  const handleSubmit = async (
    values: any,
    { setSubmitting }: { setSubmitting: Function },
  ) => {
    try {
      console.log(values.answers);
      const formData = new FormData();
      formData.append('formId', id);
      formData.append('userName', values.userName);
      formData.append('userEmail', values.userEmail);

      for (let i = 0; i < values.answers.length; i++) {
        formData.append(`question[${i}]`, values.answers[i].question);
        formData.append(`answer[${i}]`, values.answers[i].answer);
      }

      await Axios.post(`${FORMS}/submit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      showSuccess('Thanks, For Sending The Form, We Will Contact You Later');
      setCloseForm(true);
    } catch (err: any) {
      showError(err.response.data.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full p-4">
          <div className="flex justify-center items-center flex-col gap-4">
            <img src={logo} />
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-stroke sm:text-title-xl2">
              {forms?.data?.form?.name}
            </h2>
          </div>
          <formik
            enableReinitialize
            initialValues={{
              userName: '',
              userEmail: '',
              answers:
                forms?.data?.form?.questions.map((question: any) => ({
                  question: question.title,
                  answer: '',
                })) || [],
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values, setFieldValue }) => (
              <Form className="sm:mx-10">
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-stroke focus:border-primary dark:focus:border-white">
                    User Name <span className="text-red-500">*</span>
                  </label>
                  <Field
                    id="userName"
                    name="userName"
                    type="text"
                    placeholder="Enter user Name"
                    className="w-full rounded-lg border border-stroke dark:border-strokedark bg-transparent py-4 pl-6 pr-10 text-black outline-none dark:text-stroke focus:border-primary dark:focus:border-white focus-visible:shadow-none"
                    disabled={closeForm}
                  />
                  <ErrorMessage
                    name="userName"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-stroke focus:border-primary dark:focus:border-white">
                    User Email <span className="text-red-500">*</span>
                  </label>
                  <Field
                    id="userEmail"
                    name="userEmail"
                    type="text"
                    placeholder="Enter user Email"
                    className="w-full rounded-lg border border-stroke dark:border-strokedark bg-transparent py-4 pl-6 pr-10 text-black outline-none dark:text-stroke focus:border-primary dark:focus:border-white focus-visible:shadow-none"
                    disabled={closeForm}
                  />
                  <ErrorMessage
                    name="userEmail"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                {forms?.data?.form?.questions.map(
                  (question: any, index: number) => (
                    <div className="mb-4" key={index}>
                      <label className="mb-2.5 block font-medium text-black dark:text-stroke focus:border-primary dark:focus:border-white">
                        {question.title}{' '}
                        {question.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>
                      {question.type === 'checkbox' ? (
                        <FieldArray
                          name={`answers.${index}.answer`}
                          render={(arrayHelpers) => (
                            <div>
                              {question.options.map(
                                (option: string, optIndex: number) => (
                                  <div
                                    key={optIndex}
                                    className="flex items-center"
                                  >
                                    <Field
                                      type="checkbox"
                                      name={`answers.${index}.answer`}
                                      value={option}
                                      className="mr-2"
                                    />
                                    <label>{option}</label>
                                  </div>
                                ),
                              )}
                            </div>
                          )}
                        />
                      ) : question.type === 'radio' ? (
                        <div>
                          {question.options.map(
                            (option: string, optIndex: number) => (
                              <div key={optIndex} className="flex items-center">
                                <Field
                                  type="radio"
                                  name={`answers.${index}.answer`}
                                  value={option}
                                  className="mr-2"
                                />
                                <label>{option}</label>
                              </div>
                            ),
                          )}
                        </div>
                      ) : question.type === 'select' ? (
                        <Field
                          as="select"
                          name={`answers.${index}.answer`}
                          className="w-full rounded-lg border border-stroke dark:border-strokedark bg-transparent py-4 pl-6 pr-10 text-black outline-none dark:text-stroke focus:border-primary dark:focus:border-white focus-visible:shadow-none"
                          disabled={closeForm}
                        >
                          <option value="">Select an option</option>
                          {question.options.map(
                            (option: string, optIndex: number) => (
                              <option key={optIndex} value={option}>
                                {option}
                              </option>
                            ),
                          )}
                        </Field>
                      ) : question.type === 'date' ? (
                        <Field
                          type="date"
                          name={`answers.${index}.answer`}
                          className="w-full rounded-lg border border-stroke dark:border-strokedark bg-transparent py-4 pl-6 pr-10 text-black outline-none dark:text-stroke focus:border-primary dark:focus:border-white focus-visible:shadow-none"
                          disabled={closeForm}
                        />
                      ) : question.type === 'file' ? (
                        <Field
                          type="file"
                          value={undefined}
                          name={`answers.${index}.answer`}
                          className="w-full rounded-lg border border-stroke dark:border-strokedark bg-transparent py-4 pl-6 pr-10 text-black outline-none dark:text-stroke focus:border-primary dark:focus:border-white focus-visible:shadow-none"
                          disabled={closeForm}
                          onChange={(e: any) => {
                            const file = e.currentTarget.files[0];
                            if (file) {
                              setFieldValue(`answers.${index}.answer`, file);
                            }
                          }}
                        />
                      ) : (
                        <Field
                          as={
                            question.type === 'textarea' ? 'textarea' : 'input'
                          }
                          name={`answers.${index}.answer`}
                          placeholder={`Enter answer for: ${question.title}`}
                          className="w-full rounded-lg border border-stroke dark:border-strokedark bg-transparent py-4 pl-6 pr-10 text-black outline-none dark:text-stroke focus:border-primary dark:focus:border-white focus-visible:shadow-none"
                          disabled={closeForm}
                        />
                      )}
                      {question.required && (
                        <ErrorMessage
                          name={`answers.${index}.answer`}
                          component="div"
                          className="text-red-500"
                        />
                      )}
                      <Field
                        type="hidden"
                        name={`answers.${index}.question`}
                        value={question.title}
                      />
                    </div>
                  ),
                )}
                {!closeForm ? (
                  <AuthBtn
                    isSubmitting={isSubmitting}
                    classess="py-4"
                    title="Submit Form"
                  />
                ) : (
                  <p>You Sent The Form, We Will Contact You Soon</p>
                )}
              </Form>
            )}
          </formik>
        </div>
      )}
    </>
  );
};

export default index;

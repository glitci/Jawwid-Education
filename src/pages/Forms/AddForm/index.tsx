import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { formik, Form, Field, ErrorMessage, FieldArray } from 'formik';

import { Axios } from '../../../Api/axios';

import { showError, showSuccess } from '../../../libs/ReactToastify';
import DefaultLayout from '../../../layout/DefaultLayout';
import { SubmitBtn } from '../../../components/Buttons/SubmitBtn';
import { FORMS } from '../../../Api/Api';
import { QuestionForm, createForm } from '../../../types/forms';
import { IoCloseCircle } from 'react-icons/io5';

const index: React.FC = () => {
  const nav = useNavigate();

  const [FormData, setFormData] = useState<createForm | null>(null);
  const { id } = useParams();

  console.log(FormData);

  // Validation
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is Required'),
    questions: Yup.array().of(
      Yup.object().shape({
        title: Yup.string().required('Question title is required'),
        type: Yup.string().required('Question type is required'),
        options: Yup.array().when('type', {
          is: (type: 'checkbox' | 'radio' | 'select') =>
            type === 'checkbox' || type === 'radio' || type === 'select',
          then: () =>
            Yup.array()
              .of(Yup.string().required('Option is required'))
              .min(1, 'At least one option is required'),
        }),
        required: Yup.boolean(),
      }),
    ),
  });
  useEffect(() => {
    if (id) {
      Axios.get(`${FORMS}/${id}`)
        .then((response) => {
          const FormData = response.data.form;
          setFormData(FormData);
        })
        .catch((error) => {
          console.error('Error fetching Form data:', error);
        });
    }
  }, [id]);

  const handleSubmit = async (
    values: createForm,
    { setSubmitting }: { setSubmitting: Function },
  ) => {
    console.log(values);
    try {
      if (id) {
        await Axios.put(`${FORMS}/${id}`, values);
        showSuccess('Form Edited successfully');
      } else {
        await Axios.post(`${FORMS}`, values);
        showSuccess('Form added successfully');
      }
      nav('/forms');
    } catch (err: any) {
      console.log(err);
      showError('Internal Server Error!');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="w-full p-4 ">
        <h2 className="mb-9 text-2xl font-bold text-black dark:text-stroke sm:text-title-xl2">
          {id ? 'Edit Form' : 'Add Form'}
        </h2>
        <formik
          enableReinitialize
          initialValues={{
            name: FormData ? FormData.name : '',
            questions: FormData ? FormData.questions : [],
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values }) => (
            <Form>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-stroke focus:border-primary dark:focus:border-white">
                  Form Name
                </label>
                <Field
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter Form Name"
                  className="w-full rounded-lg border border-stroke dark:border-strokedark bg-transparent py-4 pl-6 pr-10 text-black outline-none dark:text-stroke focus:border-primary dark:focus:border-white focus-visible:shadow-none"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <FieldArray name="questions">
                {({ remove, push }) => (
                  <div>
                    <label className="mb-2.5 block font-medium text-black dark:text-stroke focus:border-primary dark:focus:border-white">
                      Questions
                    </label>
                    {values.questions.length > 0 &&
                      values.questions.map(
                        (question: QuestionForm | any, index: number) => (
                          <div
                            className="mb-4 border border-primary border-opacity-30 rounded-md p-5 relative"
                            key={index}
                          >
                            <div className="flex space-x-4 pt-5">
                              <div className="w-full">
                                <Field
                                  name={`questions.${index}.title`}
                                  placeholder="Enter question title"
                                  className="w-full rounded-lg border border-stroke dark:border-strokedark bg-transparent py-4 pl-6 pr-10 text-black outline-none dark:text-stroke focus:border-primary dark:focus:border-white focus-visible:shadow-none"
                                />
                                <ErrorMessage
                                  name={`questions.${index}.title`}
                                  component="div"
                                  className="text-red-500"
                                />
                              </div>

                              <div className="absolute top-2">
                                <label className="block">
                                  <Field
                                    type="checkbox"
                                    name={`questions.${index}.required`}
                                    className="mr-2 leading-tight"
                                  />
                                  Required
                                </label>
                              </div>
                              <div className="w-full">
                                <Field
                                  as="select"
                                  name={`questions.${index}.type`}
                                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 dark:bg-black  outline-none  focus-visible:shadow-none dark:text-white"
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
                                >
                                  <option value="">Select type</option>
                                  <option value="input">input</option>
                                  <option value="checkbox">Checkbox</option>
                                  <option value="radio">Radio</option>
                                  <option value="select">Select</option>
                                  <option value="file">File</option>
                                  <option value="date">Date</option>
                                  <option value="textarea">Textarea</option>
                                </Field>
                                <ErrorMessage
                                  name={`questions.${index}.type`}
                                  component="div"
                                  className="text-red-500"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-red-500 absolute -top-[7px] -right-[7px]"
                              >
                                <IoCloseCircle />
                              </button>
                            </div>
                            {question.type === 'checkbox' ||
                            question.type === 'radio' ||
                            question.type === 'select' ? (
                              <FieldArray name={`questions.${index}.options`}>
                                {({ push, remove }) => (
                                  <div>
                                    {values.questions[index].options &&
                                      values.questions[index].options.length >
                                        0 &&
                                      values.questions[index].options.map(
                                        (option, optIndex) => (
                                          <div
                                            key={optIndex}
                                            className="flex space-x-4 my-3 relative"
                                          >
                                            <Field
                                              name={`questions.${index}.options.${optIndex}`}
                                              placeholder="Enter option"
                                              className="w-full rounded-lg border border-stroke dark:border-strokedark bg-transparent py-4 pl-6 pr-10 text-black outline-none dark:text-stroke focus:border-primary dark:focus:border-white focus-visible:shadow-none"
                                            />
                                            <button
                                              type="button"
                                              onClick={() => remove(optIndex)}
                                              className="text-red-500 absolute -top-[8px] -right-[8px]"
                                            >
                                              <IoCloseCircle />
                                            </button>
                                          </div>
                                        ),
                                      )}
                                    <button
                                      type="button"
                                      onClick={() => push('')}
                                      className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg mt-4"
                                    >
                                      Add Option
                                    </button>
                                  </div>
                                )}
                              </FieldArray>
                            ) : null}
                          </div>
                        ),
                      )}
                    <button
                      type="button"
                      onClick={() => push({ title: '', type: '', options: [] })}
                      className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                      Add Question
                    </button>
                  </div>
                )}
              </FieldArray>
              <SubmitBtn isSubmitting={isSubmitting} id={id} title="Form" />
            </Form>
          )}
        </formik>
      </div>
    </DefaultLayout>
  );
};

export default index;

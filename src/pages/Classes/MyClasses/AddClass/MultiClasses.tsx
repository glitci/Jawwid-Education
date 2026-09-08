import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { createClass } from '../../../../types/classes';
import { Axios } from '../../../../Api/axios';
import { CLASSES, MULTI, TRAIL, USERS } from '../../../../Api/Api';
import { formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import DefaultLayout from '../../../../layout/DefaultLayout';
import { useQuery } from 'react-query';
import {
  TransformDateDD,
  TransformTime,
} from '../../../../helpers/TransformDate';
import Select from 'react-select';
import { format } from 'date-fns';
import { SubmitBtn } from '../../../../components/Buttons/SubmitBtn';
import { showError, showSuccess } from '../../../../libs/ReactToastify';
import { useState } from 'react';

const AddMultiClasses = () => {
  const nav = useNavigate();
  const currentTime = new Date();
  const formattedTime = format(currentTime, 'hh:mm a');
  const [studentErr, setStudentErr] = useState(false);
  const [invalidStudents, setInvalidStudents] = useState([]);

  const { data: users } = useQuery({
    queryFn: () => Axios.get(`${USERS}`),
    queryKey: ['users'],
  });

  // teacher
  const option = users?.data.data
    .filter((user: any) => user.role === 'teacher')
    .map((user: any) => ({ id: user._id, name: user.name }));

  // student
  const options = users?.data.data
    .filter((user: any) => user.role === 'student' || user.role === 'guest')
    .map((user: any) => ({ value: user._id, label: user.name }));

  // Validation
  const validationSchema = Yup.object().shape({
    classes: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required('Class name is Required'),
        start_date: Yup.string().required('Start date is Required'),
        start_time: Yup.string().required('Start time is Required'),
        duration: Yup.number()
          .required('Duration is Required')
          .positive('Duration must be a positive number')
          .integer('Duration must be a whole number'),
      }),
    ),
    teacher: Yup.string().notOneOf(['Select Teacher'], 'Teacher is Required'),
    students: Yup.array().min(1, 'Select at least one student'),
  });

  const handleSubmit = async (
    values: createClass,
    { setSubmitting }: { setSubmitting: Function },
  ) => {
    try {
      const transformedClasses = values?.classes?.map((classItem: any) => ({
        ...classItem,
        start_date: TransformDateDD(classItem.start_date),
        start_time: TransformTime(classItem.start_time),
      }));

      const requestData = {
        teacher: values.teacher,
        students: values.students.map((student: any) => student?.value),
        classes: transformedClasses,
      };

      await Axios.post(`${CLASSES}/${MULTI}`, requestData);
      showSuccess('Class has added successfully');
      nav('/classes/my-classes');
    } catch (err: any) {
      if (err.response.data.invalidStudents) {
        setStudentErr(true);
        setInvalidStudents(err.response.data.invalidStudents);
      } else if (err.response.data.message) {
        showError('No Zoom Account Id provided for this teacher');
      } else {
        showError('An Error Happend, Pls Try Again Later');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const customStyles = {
    control: (base, state) => ({
      ...base,
      background: '#023950',
      // match with the menu
      borderRadius: state.isFocused ? '3px 3px 0 0' : 3,
      // Overwrittes the different states of border
      borderColor: state.isFocused ? 'yellow' : 'green',
      // Removes weird border around container
      boxShadow: state.isFocused ? null : null,
      '&:hover': {
        // Overwrittes the different states of border
        borderColor: state.isFocused ? 'red' : 'blue',
      },
    }),
    menu: (base) => ({
      ...base,
      // override border radius to match the box
      borderRadius: 0,
      // kill the gap
      marginTop: 0,
    }),
    menuList: (base) => ({
      ...base,
      // kill the white space on first and last option
      padding: 0,
    }),
  };

  return (
    <DefaultLayout>
      <div className="w-full p-4 ">
        <h2 className="mb-9 text-2xl font-bold text-black  dark:text-white sm:text-title-xl2">
          Add Class
        </h2>
        <formik
          enableReinitialize
          initialValues={{
            classes: [
              {
                name: '',
                start_date: '',
                start_time: '',
                duration: '',
              },
            ],
            teacher: 'Select Teacher',
            students: [],
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black  dark:text-white ">
                  Teacher
                </label>
                <Field
                  id="teacher"
                  name="teacher"
                  as="select"
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
                  <option value="Select Teacher" disabled>
                    Select Teacher
                  </option>
                  {option?.map((item: any) => (
                    <option value={item.id} id={item.id}>
                      {item.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="teacher"
                  component="div"
                  className="text-red-500"
                />
              </div>{' '}
              <div className="mb-4 ">
                <label className="mb-2.5 block font-medium text-black dark:text-white ">
                  Select Students For This Class
                </label>
                <Select
                  name="students"
                  options={options}
                  isMulti
                  classNamePrefix="select"
                  placeholder="Select students for this course"
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black  outline-none  focus-visible:shadow-none"
                  onChange={(selectedOptions) => {
                    const selectedValues = selectedOptions.map((option) => {
                      return { value: option.value, label: option.label };
                    });
                    setFieldValue('students', selectedValues);
                  }}
                  value={options?.filter(
                    (option: { value: string; label: string }) =>
                      values.students
                        ?.map((student: any) => student.value)
                        ?.includes(option.value),
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
                  name="students"
                  component="div"
                  className="text-red-500"
                />
              </div>
              {studentErr && (
                <div className="mb-5">
                  <h2 className="text-danger">
                    Some students do not exist or do not have remaining classes
                  </h2>
                  <p>Invalid Students:</p>
                  <ul className="list-disc	">
                    {invalidStudents?.map((student, key) => (
                      <li key={key}>
                        {values.students.map(
                          (item: any) => item.value === student && item.label,
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <FieldArray name="classes">
                {({ remove, push }) => (
                  <div>
                    {values?.classes?.map((classItem, index) => (
                      <div key={index} className="mb-4 border-b pb-4">
                        <h3 className="text-lg font-bold mb-3">
                          Class {index + 1}
                        </h3>

                        {/* Name */}
                        <div className="mb-4">
                          <label className="mb-2.5 block font-medium text-black dark:text-white">
                            Name
                          </label>
                          <Field
                            name={`classes.${index}.name`}
                            type="text"
                            placeholder="Enter Class Name"
                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black dark:text-white outline-none focus:border-primary focus-visible:shadow-none"
                          />
                          <ErrorMessage
                            name={`classes.${index}.name`}
                            component="div"
                            className="text-red-500"
                          />
                        </div>

                        {/* Start Date */}
                        <div className="mb-4">
                          <label className="mb-2.5 block font-medium text-black dark:text-white">
                            Start Date
                          </label>
                          <Field
                            name={`classes.${index}.start_date`}
                            type="date"
                            placeholder="Enter Start Date"
                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black dark:text-white outline-none focus:border-primary focus-visible:shadow-none"
                          />
                          <ErrorMessage
                            name={`classes.${index}.start_date`}
                            component="div"
                            className="text-red-500"
                          />
                        </div>

                        {/* Start Time */}
                        <div className="mb-4">
                          <label className="mb-2.5 block font-medium text-black dark:text-white">
                            Start Time
                          </label>
                          <Field
                            name={`classes.${index}.start_time`}
                            type="time"
                            defaultValue={formattedTime}
                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black dark:text-white outline-none focus:border-primary focus-visible:shadow-none"
                          />
                          <ErrorMessage
                            name={`classes.${index}.start_time`}
                            component="div"
                            className="text-red-500"
                          />
                        </div>

                        {/* Duration */}
                        <div className="mb-4">
                          <label className="mb-2.5 block font-medium text-black dark:text-white">
                            Duration
                          </label>
                          <Field
                            name={`classes.${index}.duration`}
                            type="number"
                            placeholder="Enter Duration (in minutes)"
                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black dark:text-white outline-none focus:border-primary focus-visible:shadow-none"
                          />
                          <ErrorMessage
                            name={`classes.${index}.duration`}
                            component="div"
                            className="text-red-500"
                          />
                        </div>

                        {/* Remove Class Button */}
                        {values.classes.length > 1 && (
                          <button
                            type="button"
                            className="mb-4 text-white btn bg-danger rounded-md px-2 py-1"
                            onClick={() => remove(index)}
                          >
                            Remove Class
                          </button>
                        )}
                      </div>
                    ))}

                    {/* Add Class Button */}
                    <button
                      type="button"
                      className="text-white rounded-md px-2 py-1 mb-4 bg-primary"
                      onClick={() =>
                        push({
                          name: '',
                          start_date: '',
                          start_time: '',
                          duration: '',
                        })
                      }
                    >
                      Add Another Class
                    </button>
                  </div>
                )}
              </FieldArray>
              <div className="mb-5">
                <SubmitBtn isSubmitting={isSubmitting} title="Class" />
              </div>
            </Form>
          )}
        </formik>
      </div>
    </DefaultLayout>
  );
};

export default AddMultiClasses;

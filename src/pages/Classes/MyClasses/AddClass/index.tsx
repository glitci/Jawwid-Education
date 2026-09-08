import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { createClass } from '../../../../types/classes';
import { Axios } from '../../../../Api/axios';
import { CLASSES, TRAIL, USERS } from '../../../../Api/Api';
import { Formik, Form, Field, ErrorMessage } from 'formik';
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

const AddClass = () => {
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
    name: Yup.string().required('Name is Required'),
    start_date: Yup.string().required('start Date is Required'),
    start_time: Yup.string().required('start Time is Required'),
    duration: Yup.string().required('Duration is Required'),
    teacher: Yup.string().notOneOf(['Select Teacher'], 'Teacher is Required'),
    students: Yup.array().min(1, 'Select at least one student'),
  });

  const handleSubmit = async (
    values: createClass,
    { setSubmitting }: { setSubmitting: Function },
  ) => {
    try {
      await Axios.post(`${CLASSES}/${TRAIL}`, {
        ...values,
        start_date: TransformDateDD(values.start_date),
        start_time: TransformTime(values.start_time),
        students: values.students.map((student: any) => student?.value),
      });
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
        <Formik
          enableReinitialize
          initialValues={{
            name: '',
            start_date: '',
            start_time: '',
            duration: '',
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
                  Name
                </label>
                <Field
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter Class Name"
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outli dark:text-white ne-none focus:border-primary focus-visible:shadow-none"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black  dark:text-white ">
                  Start Date
                </label>
                <Field
                  id="start_date"
                  name="start_date"
                  type="date"
                  placeholder="Enter start_date"
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outli dark:text-white ne-none focus:border-primary focus-visible:shadow-none"
                />
                <ErrorMessage
                  name="start_date"
                  component="div"
                  className="text-red-500"
                />
              </div>{' '}
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black  dark:text-white ">
                  Start Time
                </label>
                <Field
                  id="start_time"
                  name="start_time"
                  type="time"
                  placeholder="Enter start_time"
                  defaultValue={formattedTime}
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outli dark:text-white ne-none focus:border-primary focus-visible:shadow-none"
                />
                <ErrorMessage
                  name="start_time"
                  component="div"
                  className="text-red-500"
                />
              </div>{' '}
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black  dark:text-white ">
                  Duration
                </label>
                <Field
                  id="duration"
                  name="duration"
                  type="number"
                  placeholder="Enter Duration"
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outli dark:text-white ne-none focus:border-primary focus-visible:shadow-none"
                />
                <ErrorMessage
                  name="duration"
                  component="div"
                  className="text-red-500"
                />
              </div>
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
                  <option
                    value="Select Teacher"
                    className="text-black"
                    disabled
                  >
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
              <div className="mb-4">
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
              <div className="mb-5">
                <SubmitBtn isSubmitting={isSubmitting} title="Class" />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </DefaultLayout>
  );
};

export default AddClass;

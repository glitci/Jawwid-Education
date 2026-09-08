import DefaultLayout from '../../../../layout/DefaultLayout';
import { Form, Formik } from 'formik';
import Select from 'react-select';
import { useNavigate, useParams } from 'react-router-dom';
import { CLASSES, USERS } from '../../../../Api/Api';
import { Axios } from '../../../../Api/axios';
import { useQuery } from 'react-query';
import { users } from '../../../../types/users';
import { useState } from 'react';
import { AddRemoveBtn } from '../../../../components/Buttons/AddRemoveBtn';
import { showError, showSuccess } from '../../../../libs/ReactToastify';

const AddStudents = () => {
  const { id } = useParams();
  const [students, setStudents] = useState<string[]>([]);
  const [studentErr, setStudentErr] = useState(false);
  const [invalidStudents, setInvalidStudents] = useState([]);
  const nav = useNavigate();

  const handleSubmit = async (
    values: { studentIds: string[] },
    { setSubmitting }: { setSubmitting: Function },
  ) => {
    const getIds = values.studentIds.map((user: any) => user.value);
    try {
      await Axios.put(`${CLASSES}/${id}/addStudents`, { studentIds: getIds });
      showSuccess('Students has added successfully');
      nav('/classes/my-classes');
    } catch (err: any) {
      if (
        err.response.data.message ===
        'Some students do not have enough remaining classes to be added to the class.'
      ) {
        setStudentErr(true);
        setInvalidStudents(err.response.data.ineligibleStudents);
      } else {
        showError('Internal Server Error, Please Try Again Later');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const { data: users } = useQuery({
    queryFn: () => Axios.get(`${USERS}?role=student`),
    queryKey: ['classUsers'],
  });

  const {} = useQuery({
    queryFn: async () => await Axios.get(`${CLASSES}/${id}`),
    queryKey: ['singleCourseAndStudentsClass'],
    onSuccess: (data) => {
      setStudents(
        data?.data.data.studentsEnrolled?.map(
          (user: { _id: string; email: string }) => {
            return { value: user._id, label: user.email };
          },
        ),
      );
    },
  });

  const options = users?.data.data.map((user: users) => ({
    value: user._id,
    label: user.email,
  }));

  return (
    <DefaultLayout>
      <div className="w-full p-4">
        <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
          Add Student
        </h2>
        <Formik
          enableReinitialize
          initialValues={{
            studentIds: students,
          }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Select Students For This Class
                </label>
                <Select
                  name="studentIds"
                  options={options}
                  isMulti
                  classNamePrefix="select"
                  placeholder="Select Students"
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black dark:text-white outline-none  focus-visible:shadow-none"
                  onChange={(selectedOptions) => {
                    const selectedValues = selectedOptions.map((option) => {
                      return { value: option.value, label: option.label };
                    });

                    setFieldValue('studentIds', selectedValues);
                  }}
                  value={options?.filter(
                    (option: { value: string; label: string }) =>
                      values.studentIds
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
              </div>

              {studentErr && (
                <div className="mb-5">
                  <h2 className="text-danger">
                    Some students do not exist or do not have remaining classes
                  </h2>
                  <p>Invalid Students:</p>
                  <ul className="list-disc	">
                    {invalidStudents?.map((student, key) => (
                      <li key={key}>{student.email}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mb-5">
                <AddRemoveBtn isSubmitting={isSubmitting} title="Add Student" />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </DefaultLayout>
  );
};

export default AddStudents;

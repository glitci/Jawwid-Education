import DefaultLayout from '../../../../layout/DefaultLayout';
import { Form, formik, Field, ErrorMessage } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import { CLASSES } from '../../../../Api/Api';
import { Axios } from '../../../../Api/axios';
import { useQuery } from 'react-query';
import { AddRemoveBtn } from '../../../../components/Buttons/AddRemoveBtn';
import * as Yup from 'yup';
import { useContext, useState } from 'react';
import { REALUSER } from '../../../../Context/realUser';
import { showError, showSuccess } from '../../../../libs/ReactToastify';

const ManageClass = () => {
  const validationSchema = Yup.object().shape({
    comment: Yup.string().required('Comment is Required'),
  });
  const { id } = useParams();
  const nav = useNavigate();
  const [studentComments, setStudentComments] = useState<any>({});
  const [attendanceN, setAttendanceN] = useState<any>({});
  const { realUser } = useContext(REALUSER);

  const { data: classData } = useQuery({
    queryFn: async () => await Axios.get(`${CLASSES}/${id}`),
    queryKey: ['singleCourseAndStudentsClassInside' + id],
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const updatedData = {
        classComment: values.comment,
        attendance: classData?.data.data.attendance?.map((student, key) => ({
          studentId: student.student._id,
          attended: attendanceN[key] ?? student.attended,
          comment: values.attendance[key].comment,
        })),
      };

      await Axios.put(`${CLASSES}/${id}/classReport`, updatedData);
      showSuccess('Report Added Successfully');
      nav('/classes/my-classes');
    } catch (err) {
      showError('An Error Occurred, Try Again Later');
    } finally {
      setSubmitting(false);
    }
  };

  const studentsClass = classData?.data.data.attendance?.map(
    (student: any, key: number) => (
      <div className="mb-8 border border-stroke dark:border-strokedark p-3 rounded">
        <h1 className="mb-2">Name: {student.student.name}</h1>
        <h1 className="mb-2">Email: {student.student.email}</h1>
        <label htmlFor={`attendance[${key}].comment`}>Comment</label>
        <Field
          as="textarea"
          id={`attendance[${key}].comment`}
          name={`attendance[${key}].comment`}
          disabled={realUser !== 'teacher'}
          type="text"
          placeholder="we explained suret el fatha"
          className="w-full zrounded-lg border border-stroke dark:border-strokedark bg-transparent py-4 pl-6 pr-10 text-black dark:text-white outline-none focus:border-primary dark:focus:border-white d-visible:shadow-none"
          onChange={(e: any) => {
            const updatedComments = { ...studentComments };
            updatedComments[key] = e.target.value;
            setStudentComments(updatedComments);
          }}
        />
        <ErrorMessage
          name={`attendance[${key}].comment`}
          component="div"
          className="text-red-500"
        />

        <label
          className="inline-flex items-center cursor-pointer"
          htmlFor={`attendance[${key}].attended`}
        >
          Attended:
          <Field
            type="checkbox"
            id={`attendance[${key}].attended`}
            name={`attendance[${key}].attended`}
            disabled={realUser !== 'teacher'}
            class="sr-only peer "
            onChange={(e: any) => {
              const attendance = { ...attendanceN };
              attendance[key] = e.target.checked;
              setAttendanceN(attendance);
            }}
            checked={attendanceN[key]}
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300  ms-5 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray peer-checked:bg-blue-600 bg-slate-400  "></div>
        </label>
      </div>
    ),
  );

  console.log(classData?.data.data.attendance);

  return (
    <DefaultLayout>
      <div className="w-full p-4">
        <div className="flex items-center justify-between flex-wrap">
          <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
            Class Report
          </h2>

          <h2 className="mb-9 text-md font-bold text-primary sm:text-title-sm">
            Teacher : {classData?.data.data.teacher.name}
          </h2>
        </div>
        <formik
          enableReinitialize
          validationSchema={validationSchema}
          initialValues={{
            comment: classData?.data.data.comment,
            attendance: classData?.data.data.attendance?.map(
              (student: any, key: number) => ({
                comment: student?.comment || '',
                attended: student?.attended,
              }),
            ),
          }}
          onSubmit={handleSubmit}
        >
          {({ handleChange, isSubmitting, setFieldValue }) => (
            <Form>
              <div className="mb-4">
                <label htmlFor="comment">Comment</label>
                <Field
                  as="textarea"
                  id="comment"
                  name="comment"
                  type="text"
                  disabled={realUser !== 'teacher'}
                  placeholder="we explained suret el fatha"
                  className="w-full rounded-lg border border-stroke dark:border-strokedark bg-transparent py-4 pl-6 pr-10 text-black dark:text-white outline-none focus:border-primary dark:focus:border-white d-visible:shadow-none"
                />
                <ErrorMessage
                  name="comment"
                  component="div"
                  className="text-red-500"
                />
              </div>

              <hr className="border border-stroke dark:border-form-strokedark" />

              <div className="mt-5">
                <h1 className="mb-9  font-bold text-primary ">
                  Class's Students:
                </h1>
                {classData?.data.data.attendance?.map((student, key) => (
                  <div
                    key={key}
                    className="mb-8 border border-stroke dark:border-strokedark p-3 rounded"
                  >
                    <h1 className="mb-2">Name: {student.student.name}</h1>
                    <h1 className="mb-2">Email: {student.student.email}</h1>
                    <label htmlFor={`attendance[${key}].comment`}>
                      Comment
                    </label>
                    <Field
                      as="textarea"
                      id={`attendance[${key}].comment`}
                      name={`attendance[${key}].comment`}
                      disabled={realUser !== 'teacher'}
                      placeholder="we explained suret el fatha"
                      className="w-full zrounded-lg border border-stroke dark:border-strokedark bg-transparent py-4 pl-6 pr-10 text-black dark:text-white outline-none focus:border-primary dark:focus:border-white d-visible:shadow-none"
                      onChange={(e) => {
                        handleChange(e);
                        setFieldValue(
                          `attendance[${key}].comment`,
                          e.target.value,
                        );
                      }}
                    />
                    <ErrorMessage
                      name={`attendance[${key}].comment`}
                      component="div"
                      className="text-red-500"
                    />

                    <label
                      className="inline-flex items-center cursor-pointer"
                      htmlFor={`attendance[${key}].attended`}
                    >
                      Attended:
                      <Field
                        type="checkbox"
                        id={`attendance[${key}].attended`}
                        name={`attendance[${key}].attended`}
                        disabled={realUser !== 'teacher'}
                        className="sr-only peer"
                        onChange={(e) => {
                          handleChange(e);
                          const attendance = { ...attendanceN };
                          attendance[key] = e.target.checked;
                          setAttendanceN(attendance);
                          setFieldValue(
                            `attendance[${key}].attended`,
                            e.target.checked,
                          );
                        }}
                        checked={attendanceN[key] ?? student.attended}
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 ms-5 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray peer-checked:bg-blue-600 bg-slate-400"></div>
                    </label>
                  </div>
                ))}
              </div>
              {realUser === 'teacher' && (
                <div className="my-5">
                  <AddRemoveBtn
                    isSubmitting={isSubmitting}
                    title="Submit Report"
                  />
                </div>
              )}
            </Form>
          )}
        </formik>
      </div>
    </DefaultLayout>
  );
};

export default ManageClass;

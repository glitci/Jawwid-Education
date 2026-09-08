import DefaultLayout from '../../../../../layout/DefaultLayout';
import { Form, formik, Field } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import { ASSIGNMENTS, CLASSES } from '../../../../../Api/Api';
import { Axios } from '../../../../../Api/axios';
import { useQuery } from 'react-query';
import { useState } from 'react';
import { AddRemoveBtn } from '../../../../../components/Buttons/AddRemoveBtn';
import { showSuccess } from '../../../../../libs/ReactToastify';

const AddAsignments = () => {
  const { id } = useParams();
  const [students, setStudents] = useState<string[]>([]);
  const [image, setImage] = useState('');
  const nav = useNavigate();

  const handleSubmit = async (
    values: { studentId: string },
    { setSubmitting }: { setSubmitting: Function },
  ) => {
    try {
      const form = new FormData();
      form.append('classId', id);
      form.append('studentId', values.studentId);
      form.append('assignmentFile', image);

      await Axios.post(`${ASSIGNMENTS}`, form);
      showSuccess('Assignment has added successfully');
      nav('/classes');
    } catch (err: any) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  const {} = useQuery({
    queryFn: async () => await Axios.get(`${CLASSES}/${id}`),
    queryKey: ['singleCourseAndStudentsClass'],
    onSuccess: (data) => {
      setStudents(
        data?.data.data.studentsEnrolled?.map(
          (user: { _id: string; name: string }) => {
            return { value: user._id, label: user.name };
          },
        ),
      );
    },
  });

  return (
    <DefaultLayout>
      <div className="w-full p-4">
        <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
          Add Assignment
        </h2>
        <formik
          enableReinitialize
          initialValues={{
            studentId: 'Select Student',
          }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Select the student to whom you want to give the assignment
                </label>
                <Field
                  id="studentId"
                  name="studentId"
                  as="select"
                  className="w-full rounded-lg border border-stroke bg-transparent dark:bg-boxdark-2 py-4 pl-6 pr-10 text-black dark:text-white outline-none focus:border-primary focus-visible:shadow-none"
                  defaultValue="Select Student"
                >
                  <option value="Select Student" disabled>
                    Select Student
                  </option>
                  {students?.map((item: any) => (
                    <option value={item.value}>{item.label}</option>
                  ))}
                </Field>
              </div>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Assignment File
                </label>
                <Field
                  id="assignmentFile"
                  name="assignmentFile"
                  type="file"
                  onChange={(e: any) => setImage(e.target.files[0])}
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black dark:text-white outline-none focus:border-primary focus-visible:shadow-none"
                />
              </div>
              <div className="mb-5">
                <AddRemoveBtn
                  isSubmitting={isSubmitting}
                  title="Send Assignment"
                />
              </div>
            </Form>
          )}
        </formik>
      </div>
    </DefaultLayout>
  );
};

export default AddAsignments;

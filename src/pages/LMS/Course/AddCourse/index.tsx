import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../../../layout/DefaultLayout';
import { ErrorMessage, Field, Form, formik } from 'formik';
import { createCourse } from '../../../../types/Lms';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { COURSES } from '../../../../Api/Api';
import { Axios } from '../../../../Api/axios';
import { SubmitBtn } from '../../../../components/Buttons/SubmitBtn';
import { showSuccess } from '../../../../libs/ReactToastify';

const AddCourse = () => {
  const nav = useNavigate();
  const [courseData, setCourseData] = useState<createCourse | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | string>('');

  // Validation
  const validationSchema = Yup.object().shape({
    summary: Yup.string().required('summary Is Required'),
    course_link: Yup.string().required('course_link Is Required'),
    title: Yup.string().required('title Is Required'),
  });

  const { id } = useParams();
  useEffect(() => {
    if (id) {
      Axios.get(`${COURSES}/${id}`)
        .then((response) => {
          const courseData = response.data.data;
          setCourseData(courseData);
          console.log(response);
        })
        .catch((error) => {
          console.error('Error fetching course data:', error);
        });
    }
  }, [id]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (
    values: createCourse,
    { setSubmitting }: { setSubmitting: Function },
  ) => {
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('course_link', values.course_link);
      formData.append('summary', values.summary);
      if (selectedFile) {
        formData.append('image', selectedFile);
      }
      if (id) {
        await Axios.put(`${COURSES}/${id}`, formData);
        showSuccess('Course has edited successfully');
      } else {
        await Axios.post(`${COURSES}`, formData);
        showSuccess('Course has added successfully');
      }
      nav('/lms/courses');
    } catch (err: any) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="w-full p-4 ">
        <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
          {id ? 'Edit Course' : 'Add Course'}
        </h2>
        <formik
          enableReinitialize
          initialValues={{
            title: courseData ? courseData.title : '',
            summary: courseData ? courseData.summary : '',
            course_link: courseData ? courseData.course_link : '',
            image: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white ">
                  Title
                </label>
                <Field
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Enter Course Name"
                  className="w-full rounded-lg border border-stroke  dark:border-strokedark bg-transparent py-4 pl-6 pr-10 text-black dark:text-white outline-none focus:border-primary dark:focus:border-white focus-visible:shadow-none"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white ">
                  Summary
                </label>
                <Field
                  id="summary"
                  name="summary"
                  type="text"
                  placeholder="Enter Course Summary"
                  className="w-full rounded-lg border border-stroke  dark:border-strokedark bg-transparent py-4 pl-6 pr-10 text-black dark:text-white outline-none focus:border-primary dark:focus:border-white focus-visible:shadow-none"
                />
                <ErrorMessage
                  name="summary"
                  component="div"
                  className="text-red-500"
                />
              </div>{' '}
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white ">
                  Course Link
                </label>
                <Field
                  id="course_link"
                  name="course_link"
                  type="text"
                  placeholder="Enter Course Link"
                  className="w-full rounded-lg border border-stroke  dark:border-strokedark bg-transparent py-4 pl-6 pr-10 text-black dark:text-white outline-none focus:border-primary dark:focus:border-white focus-visible:shadow-none"
                />
                <ErrorMessage
                  name="course_link"
                  component="div"
                  className="text-red-500"
                />
              </div>{' '}
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white ">
                  Image
                </label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  placeholder="Enter Course Image"
                  onChange={handleFileChange}
                  className="w-full rounded-lg border border-stroke  dark:border-strokedark bg-transparent py-4 pl-6 pr-10 text-black dark:text-white outline-none focus:border-primary dark:focus:border-white focus-visible:shadow-none"
                />
                {/* {selectedFile && <p>Selected file: {selectedFile.name}</p>} */}
              </div>
              <div className="mb-5">
                <SubmitBtn isSubmitting={isSubmitting} id={id} title="Course" />
              </div>
            </Form>
          )}
        </formik>
      </div>
    </DefaultLayout>
  );
};

export default AddCourse;

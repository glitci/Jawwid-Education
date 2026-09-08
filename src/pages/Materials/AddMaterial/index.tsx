import React, { useEffect, useState } from 'react';
import UsersLayout from '../../../layout/UsersLayout';
import * as Yup from 'yup';

import { Axios } from '../../../Api/axios';
import { MATERIALS } from '../../../Api/Api';
import { useNavigate, useParams } from 'react-router-dom';
import { showError, showSuccess } from '../../../libs/ReactToastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { SubmitBtn } from '../../../components/Buttons/SubmitBtn';
import { createMaterial } from '../../../types/materials';

const AddMaterial: React.FC = () => {
  const nav = useNavigate();

  const [materialData, setMaterialData] = useState<createMaterial | null>(null);
  const [imageFile, setImageFile] = useState('');
  const [PDFFile, setPDFFile] = useState('');
  const { id } = useParams();

  // Validation
  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is Required'),
    summary: Yup.string().required('Summary is Required'),
  });

  useEffect(() => {
    if (id) {
      Axios.get(`${MATERIALS}/${id}`)
        .then((response) => {
          const materIalData = response.data.data;
          setMaterialData(materIalData);
        })
        .catch((error) => {
          console.error('Error fetching Material data:', error);
        });
    }
  }, [id]);
  const handleSubmit = async (
    values: createMaterial,
    { setSubmitting }: { setSubmitting: Function },
  ) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('summary', values.summary);
    formData.append('image', imageFile);
    formData.append('materialFile', PDFFile);
    try {
      if (id) {
        await Axios.put(`${MATERIALS}/${id}`, formData);
        showSuccess('Material has Edited successfully');
      } else {
        await Axios.post(`${MATERIALS}`, formData);
        showSuccess('Material has added successfully');
      }
      nav('/materials');
    } catch (err: any) {
      showError('Internal Server Error!');
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <UsersLayout>
      <div className="w-full p-4 ">
        <h2 className="mb-9 text-2xl font-bold text-black dark:text-stroke sm:text-title-xl2">
          {id ? 'Edit Material' : 'Add Material'}
        </h2>
        <Formik
          enableReinitialize
          initialValues={{
            title: materialData ? materialData.title : '',
            summary: materialData ? materialData.summary : '',
            image: '',
            PDFFile: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-stroke focus:border-primary dark:focus:border-white   ">
                  Title
                </label>
                <Field
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Enter title"
                  className="w-full rounded-lg border border-stroke dark:border-strokedark bg-transparent py-4 pl-6 pr-10 text-black outline-none dark:text-stroke  focus:border-primary dark:focus:border-white focus-visible:shadow-none"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-stroke  focus:border-primary dark:focus:border-white   ">
                  Summery
                </label>
                <div className="relative">
                  <Field
                    id="summary"
                    name="summary"
                    type="text"
                    placeholder="Enter summary"
                    className="w-full rounded-lg border border-stroke dark:border-strokedark bg-transparent py-4 pl-6 pr-10 text-black dark:text-stroke  focus:border-primary dark:focus:border-white   outline-none focus-visible:shadow-none"
                  />
                  <ErrorMessage
                    name="summary"
                    component="div"
                    className="text-red-500"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-stroke  focus:border-primary dark:focus:border-white">
                  Image File
                </label>
                <Field
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={(e: any) => setImageFile(e.target.files?.[0] || '')}
                  className="w-full rounded-lg border border-stroke dark:border-strokedark bg-transparent py-4 pl-6 pr-10 text-black dark:text-stroke   dark:focus:border-white   outline-none focus:border-primary focus-visible:shadow-none"
                />
                <ErrorMessage
                  name="image"
                  component="div"
                  className="text-red-500"
                />
              </div>{' '}
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-stroke  focus:border-primary dark:focus:border-white   ">
                  PDF File
                </label>
                <Field
                  id="PDFFile"
                  name="PDFFile"
                  type="file"
                  accept="pdf/*"
                  onChange={(e: any) => setPDFFile(e.target.files[0])}
                  className="w-full rounded-lg border border-stroke dark:border-strokedark bg-transparent py-4 pl-6 pr-10 text-black dark:text-stroke   dark:focus:border-white   outline-none focus:border-primary focus-visible:shadow-none"
                />
                <ErrorMessage
                  name="PDFFile"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <SubmitBtn isSubmitting={isSubmitting} id={id} title="Material" />
            </Form>
          )}
        </Formik>
      </div>
    </UsersLayout>
  );
};

export default AddMaterial;

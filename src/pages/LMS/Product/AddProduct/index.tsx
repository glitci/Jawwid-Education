import { useEffect, useState } from 'react';
import DefaultLayout from '../../../../layout/DefaultLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct } from '../../../../types/Lms';
import { PRODUCTS } from '../../../../Api/Api';
import { Axios } from '../../../../Api/axios';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SubmitBtn } from '../../../../components/Buttons/SubmitBtn';
import { showSuccess } from '../../../../libs/ReactToastify';

const AddProduct = () => {
  const nav = useNavigate();
  const [productData, setproductData] = useState<createProduct | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | string>('');
  const [selectedImage, setSelectedImage] = useState<File | string>('');

  // Validation
  const validationSchema = Yup.object().shape({
    // image: Yup.string().required('Image is Required'),
    summary: Yup.string().required('Summary Is Required'),
    // productFile: Yup.string().required('ProductFile Is Required'),
    title: Yup.string().required('Title Is Required'),
  });

  const { id } = useParams();
  useEffect(() => {
    if (id) {
      Axios.get(`${PRODUCTS}/${id}`)
        .then((response) => {
          const productData = response.data.data;
          setproductData(productData);
          console.log(response);
        })
        .catch((error) => {
          console.error('Error fetching product data:   ', error);
        });
    }
  }, [id]);

  const handleSubmit = async (
    values: createProduct,
    { setSubmitting }: { setSubmitting: Function },
  ) => {
    console.log(values);
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('productFile', selectedFile);
      formData.append('summary', values.summary);
      formData.append('image', selectedImage);

      console.log(selectedFile);
      if (id) {
        await Axios.put(`${PRODUCTS}/${id}`, formData);
        showSuccess('Product has edited successfully');
      } else {
        await Axios.post(`${PRODUCTS}`, formData);
        showSuccess('Product has added successfully');
      }
      nav('/lms/products');
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
          {id ? 'Edit Product' : 'Add Product'}
        </h2>
        <Formik
          enableReinitialize
          initialValues={{
            image: '',
            title: productData ? productData.title : '',
            summary: productData ? productData.summary : '',
            productFile: '',
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
                  placeholder="Enter Product Name"
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
                  placeholder="Enter Product Summary"
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
                  Product File
                </label>
                <input
                  id="productFile"
                  name="productFile"
                  type="file"
                  accept=".pptx"
                  className="w-full rounded-lg border border-stroke  dark:border-strokedark bg-transparent py-4 pl-6 pr-10 text-black dark:text-white outline-none focus:border-primary dark:focus:border-white focus-visible:shadow-none"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || '')}
                />
                <ErrorMessage
                  name="productFile"
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
                  accept="image/*"
                  onChange={(e) => setSelectedImage(e.target.files?.[0] || '')}
                  className="w-full rounded-lg border border-stroke  dark:border-strokedark bg-transparent py-4 pl-6 pr-10 text-black dark:text-white outline-none focus:border-primary dark:focus:border-white focus-visible:shadow-none"
                />
              </div>
              <div className="mb-5">
                <SubmitBtn
                  isSubmitting={isSubmitting}
                  title="Product"
                  id={id}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </DefaultLayout>
  );
};

export default AddProduct;

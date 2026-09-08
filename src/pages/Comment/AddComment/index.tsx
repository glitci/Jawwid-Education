import React, { useState, useEffect, useContext } from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { createComment } from '../../../types/comments';
import { Axios } from '../../../Api/axios';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, formik } from 'formik';
import { COMMENTS } from '../../../Api/Api';
import { SubmitBtn } from '../../../components/Buttons/SubmitBtn';
import { UserContext } from '../../../Context/loggedInUser';
import _403 from '../../../components/Errors/403';
import Loader from '../../../common/Loader';
import { showSuccess } from '../../../libs/ReactToastify';
import Quill from '../../../components/TextEditor';

const AddComment = () => {
  const { loggedInUser } = useContext(UserContext);
  const nav = useNavigate();
  const { id, commentId } = useParams();
  const [postsData, setPostsData] = useState<createComment | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[] | string[]>(['']);

  const [loading, setLoading] = useState<boolean>(commentId ? true : false);
  const location = useLocation();
  const pathname = location.pathname;
  // Validation
  const validationSchema = Yup.object().shape({
    content: Yup.string().required('Content is required'),
  });

  useEffect(() => {
    if (commentId) {
      setLoading(true);
      Axios.get(`${COMMENTS}/${commentId}`)
        .then((response) => {
          const postsData = response.data.data;
          setPostsData(postsData);
          console.log(response.data.data);
        })
        .catch((error) => {
          console.error('Error fetching Post data:', error);
        })
        .finally(() => setLoading(false));
    }
  }, [commentId]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles(files);
    }
  };

  const handleSubmit = async (
    values: createComment,
    { setSubmitting }: { setSubmitting: Function },
  ) => {
    try {
      const formData = new FormData();
      formData.append('content', values.content);
      if (selectedFiles) {
        for (let i = 0; i < selectedFiles.length; i++) {
          formData.append('media', selectedFiles[i]);
        }
      }
      if (commentId) {
        await Axios.put(`${COMMENTS}/${commentId}`, formData);
        showSuccess('Comment has edited successfully');
      } else {
        await Axios.post(`${COMMENTS}/post/${id}`, formData);
        showSuccess('Comment has added successfully');
      }
      nav(`/comments/post/${id}`);
    } catch (err: any) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DefaultLayout>
      {loading ? (
        <Loader />
      ) : loggedInUser?._id === postsData?.author._id ||
        pathname.includes('add') ? (
        <div className="w-full p-4 bg-white dark:bg-boxdark">
          <h2 className="mb-9 text-2xl font-bold text-black  dark:text-white sm:text-content-xl2">
            {commentId ? 'Edit Comment' : 'Add Comment'}
          </h2>
          <formik
            enableReinitialize
            initialValues={{
              content: postsData ? postsData.content : '',
              media: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values, setFieldValue }) => (
              <Form>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black  dark:text-white">
                    Content
                  </label>

                  <Quill
                    value={values.content}
                    onChange={(value: string) =>
                      setFieldValue('content', value)
                    }
                  />

                  <ErrorMessage
                    name="content"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black  dark:text-white">
                    Image
                  </label>
                  <input
                    id="image"
                    name="image"
                    type="file"
                    onChange={handleFileChange}
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black  dark:text-whiteoutline-none focus:border-primary focus-visible:shadow-none"
                  />
                </div>
                <SubmitBtn
                  isSubmitting={isSubmitting}
                  id={commentId}
                  title="Comment"
                />
              </Form>
            )}
          </formik>
        </div>
      ) : (
        <_403 />
      )}
    </DefaultLayout>
  );
};

export default AddComment;

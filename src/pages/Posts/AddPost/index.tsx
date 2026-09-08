import React, { useState, useEffect, useContext } from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { createPost } from '../../../types/posts';
import * as Yup from 'yup';
import { Axios } from '../../../Api/axios';
import { POSTS } from '../../../Api/Api';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { SubmitBtn } from '../../../components/Buttons/SubmitBtn';
import { UserContext } from '../../../Context/loggedInUser';
import _403 from '../../../components/Errors/403';
import Loader from '../../../common/Loader';
import { REALUSER } from '../../../Context/realUser';
import { showError, showInfo, showSuccess } from '../../../libs/ReactToastify';
import { IoIosCloseCircle } from 'react-icons/io';
import Quill from '../../../components/TextEditor';

const AddPost = () => {
  const nav = useNavigate();
  const { id } = useParams();
  const [postsData, setPostsData] = useState<createPost | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[] | string[]>([]);
  const [oldMedia, setOldMedia] = useState<[]>([]);
  const [loading, setLoading] = useState<boolean>(id ? true : false);
  let SendingMessage = false;
  const { loggedInUser } = useContext(UserContext);
  const { realUser } = useContext(REALUSER);

  useEffect(() => {
    function handleCloseWindow(e: any) {
      console.log('text');
      if (SendingMessage) {
        e.preventDefault();
        e.returnValue =
          'Media is still uploading. Are you sure you want to leave this page?';
      }
    }
    window.addEventListener('beforeunload', handleCloseWindow);

    return () => window.removeEventListener('beforeunload', handleCloseWindow);
  }, []);
  // Validation
  const validationSchema = Yup.object().shape({
    content: Yup.string().required('Content is required'),
  });

  useEffect(() => {
    if (id) {
      setLoading(true);
      Axios.get(`${POSTS}/${id}`)
        .then((response) => {
          const postsData = response.data.data;
          setPostsData(postsData);
          setOldMedia(postsData.media);
          console.log(response);
        })
        .catch((error) => {
          console.error('Error fetching Post data:', error);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles([...files]);
    }
  };

  const handleSubmit = async (
    values: createPost,
    { setSubmitting }: { setSubmitting: Function },
  ) => {
    let imgVedSize = false;
    for (let i = 0; i < selectedFiles.length; i++) {
      if (
        (selectedFiles[i].size / (1024 * 1024)).toFixed(2) > 10 &&
        selectedFiles[i].type.includes('image')
      ) {
        imgVedSize = true;
      } else if (
        (selectedFiles[i].size / (1024 * 1024)).toFixed(2) > 50 &&
        selectedFiles[i].type.includes('video')
      ) {
        imgVedSize = true;
      }
    }
    if (
      (selectedFiles.length < 10 || selectedFiles.length === 0) &&
      !imgVedSize
    ) {
      try {
        SendingMessage = true;
        const formData: any = new FormData();
        formData.append('author', loggedInUser?._id!);
        formData.append('content', values.content);
        formData.append('url', values.url);
        for (let i = 0; i < values?.visibleTo?.length; i++) {
          formData.append('visibleTo[]', values.visibleTo[i]);
        }

        if (selectedFiles) {
          for (let i = 0; i < selectedFiles.length; i++) {
            formData.append('media', selectedFiles[i]);
          }
        }
        if (id) {
          let oldMediaArray = [];

          for (let i = 0; i < oldMedia.length; i++) {
            oldMediaArray.push({
              type: oldMedia[i].type,
              url: oldMedia[i].url.split('/')[4],
            });
          }
          let formDataJSON = JSON.stringify(oldMediaArray);
          formData.append('oldMedia', formDataJSON);
          await Axios.put(`${POSTS}/${id}`, formData);
          showSuccess('Post has Edited successfully');
        } else {
          await Axios.post(`${POSTS}`, formData);

          if (realUser === 'admin' || realUser === 'superAdmin') {
            showSuccess('Post Added Successfully');
          } else {
            showInfo('Post has been sent to moderators for review');
          }
        }
        nav('/');
      } catch (err: any) {
        console.log(err);
        const errorMessage = err.response.data.message;
        if (errorMessage.includes('image')) {
          showError('Max Image Size Is 5MB');
        } else if (errorMessage.includes('Too many files')) {
          showError("You Can't Upload More Than 11 Images Or Videos");
        } else {
          showError('an Exepected Error, Try Again Later');
        }
      } finally {
        setSubmitting(false);
        SendingMessage = false;
      }
    } else if (imgVedSize) {
      showError('Image And Video Must not Be more than 10MB/50MB');
    } else {
      showError("You Can't Upload More than 10 Images And Videos");
    }
  };

  function handleDeleteImages(file: any) {
    const filterdData: any = oldMedia.filter((old) => old !== file);
    setOldMedia(filterdData);
  }

  return (
    <DefaultLayout>
      {loading ? (
        <Loader />
      ) : loggedInUser?._id === postsData?.author._id ||
        realUser === 'superAdmin' ||
        realUser === 'admin' ||
        !id ? (
        <div className="w-full p-4 bg-white dark:bg-boxdark">
          <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-content-xl2">
            {id ? 'Edit Post' : 'Add Post'}
          </h2>
          <Formik
            enableReinitialize
            initialValues={{
              author: postsData ? postsData.author : '',
              content: postsData ? postsData.content : '',
              media: '',
              url: postsData ? postsData.url : '',
              visibleTo: postsData ? postsData.visibleTo : [],
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values, setFieldValue }) => (
              <Form>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white ">
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

                {(realUser === 'admin' ||
                  realUser === 'superAdmin' ||
                  realUser === 'teacher') && (
                  <>
                    <div className="mb-4">
                      <label className="mb-2.5 block font-medium text-black dark:text-white ">
                        Embedded Link
                      </label>
                      <Field
                        id="url"
                        name="url"
                        type="text"
                        placeholder="Paste Embded Link Here"
                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black dark:text-white outline-none focus:border-primary focus-visible:shadow-none"
                      />
                      <ErrorMessage
                        name="url"
                        component="div"
                        className="text-red-500"
                      />
                    </div>

                    {!id && (
                      <div className="mb-4">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                          Visibilty For This Post
                        </label>
                        {(realUser !== 'teacher'
                          ? ['student', 'teacher', 'admin']
                          : ['student', 'teacher']
                        ).map((userType) => (
                          <div key={userType}>
                            <label>
                              <Field
                                type="checkbox"
                                name={userType}
                                checked={values?.visibleTo?.includes(userType)}
                                onChange={(e: any) => {
                                  const isChecked = e.target.checked;
                                  if (isChecked) {
                                    setFieldValue('visibleTo', [
                                      ...values?.visibleTo,
                                      userType,
                                    ]);
                                  } else {
                                    setFieldValue(
                                      'visibleTo',
                                      values?.visibleTo?.filter(
                                        (item) => item !== userType,
                                      ),
                                    );
                                  }
                                }}
                              />
                              {userType.charAt(0).toUpperCase() +
                                userType.slice(1)}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white ">
                    Image
                  </label>
                  <input
                    id="image"
                    name="image"
                    type="file"
                    multiple
                    accept="image/*, video/*"
                    onChange={handleFileChange}
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black dark:text-white outline-none focus:border-primary focus-visible:shadow-none"
                  />
                </div>
                {selectedFiles.length > 0 && (
                  <>
                    <h2>New Images And Videos</h2>

                    <div className="flex items-center flex-wrap my-5 gap-3">
                      {selectedFiles?.map((file: any, key) =>
                        file.type.startsWith('video/') ? (
                          <video key={key} className="w-34" controls>
                            <source
                              src={URL.createObjectURL(file)}
                              type={file.type}
                            />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <img
                            key={key}
                            className="w-34"
                            src={URL.createObjectURL(file)}
                          />
                        ),
                      )}
                    </div>
                  </>
                )}
                {oldMedia && oldMedia?.length > 0 && (
                  <>
                    <h2>Images And Videos Uploaded Before</h2>
                    <div className="flex items-center flex-wrap my-5 gap-3">
                      {oldMedia.map((file: any, key: number) =>
                        file.type === 'image' ? (
                          <div className="relative">
                            <IoIosCloseCircle
                              onClick={() => handleDeleteImages(file)}
                              className="absolute top-[-8px] right-[-8px] text-red-500 cursor-pointer"
                            />

                            <img key={key} className="w-34" src={file.url} />
                          </div>
                        ) : (
                          <video className="w-34" controls>
                            <source src={file.url} type={file.type} />
                          </video>
                        ),
                      )}
                    </div>
                  </>
                )}
                <SubmitBtn isSubmitting={isSubmitting} id={id} title="Post" />
              </Form>
            )}
          </Formik>
        </div>
      ) : (
        <_403 />
      )}
    </DefaultLayout>
  );
};
export default AddPost;

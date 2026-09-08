import { Form, Formik, Field } from 'Formik';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useContext, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { Axios } from '../../Api/axios';
import { POSTS } from '../../Api/Api';
import { showSuccess } from '../../libs/ReactToastify';
import { AddRemoveBtn } from '../../components/Buttons/AddRemoveBtn';
import { REALUSER } from '../../Context/realUser';

const PostVisibilty = () => {
  const { id } = useParams();
  const [visibilty, setVisibilty] = useState<string>('');
  const { realUser } = useContext(REALUSER);
  const nav = useNavigate();

  const handleSubmit = async (
    values: { visibleTo: string[] },
    { setSubmitting }: { setSubmitting: Function },
  ) => {
    try {
      await Axios.put(`${POSTS}/${id}/visibleTo`, values);
      showSuccess('Visibilty has changed successfully');
      nav('/');
    } catch (err: any) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  const { data: post } = useQuery({
    queryFn: () => Axios.get(`${POSTS}/${id}`),
    queryKey: ['post-visibilty'],
    onSuccess: (data) => {
      setVisibilty(data.data.data.visibleTo);
    },
  });

  console.log(post);

  return (
    <DefaultLayout>
      <div className="w-full p-4">
        <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
          Visibilty
        </h2>
        <Formik
          enableReinitialize
          initialValues={{
            visibleTo: visibilty.length > 0 ? visibilty : [],
          }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Visibilty For This Post
                </label>
                {(realUser === 'teacher'
                  ? ['student', 'teacher']
                  : ['student', 'teacher', 'admin']
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
                      {userType.charAt(0).toUpperCase() + userType.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
              <div className="mb-5">
                <AddRemoveBtn
                  isSubmitting={isSubmitting}
                  title="Change Visibilty"
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </DefaultLayout>
  );
};

export default PostVisibilty;

import React, { useEffect, useState } from 'react';

import * as Yup from 'yup';

import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';

import { Axios } from '../../../../Api/axios';
import { PACKAGES, USERS } from '../../../../Api/Api';
import { showError, showSuccess } from '../../../../libs/ReactToastify';
import DefaultLayout from '../../../../layout/DefaultLayout';
import { SubmitBtn } from '../../../../components/Buttons/SubmitBtn';
import { createPackage } from '../../../../types/subscriptions';
import { useQuery } from 'react-query';
import { users } from '../../../../types/users';
import { Currency } from './currency';
import { IoCloseCircle } from 'react-icons/io5';

const AddPackage: React.FC = () => {
  const nav = useNavigate();

  const [packageData, setPackageData] = useState<createPackage | null>(null);
  const { id } = useParams();

  // Validation
  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is Required'),
    prices: Yup.array().of(
      Yup.object().shape({
        currency: Yup.string().required('Currency is required'),
        amount: Yup.number().required('Amount is required'),
      }),
    ),
    classesNum: Yup.number().required('Classes Count is Required'),
  });

  const { data: users } = useQuery({
    queryFn: () => Axios.get(`${USERS}?role=student`),
    queryKey: ['users'],
  });

  useEffect(() => {
    if (id) {
      Axios.get(`${PACKAGES}/${id}`)
        .then((response) => {
          console.log(response);
          const packageData = response.data.package;
          setPackageData(packageData);
        })
        .catch((error) => {
          console.error('Error fetching package data:', error);
        });
    }
  }, [id]);
  const handleSubmit = async (
    values: createPackage,
    { setSubmitting }: { setSubmitting: Function },
  ) => {
    try {
      if (id) {
        await Axios.put(`${PACKAGES}/${id}`, {
          ...values,
          visibleTo: values.visibleTo.map((visi) => visi.value),
        });
        showSuccess('Package Edited successfully');
      } else {
        await Axios.post(`${PACKAGES}`, {
          ...values,
          visibleTo: values.visibleTo.map((visi) => visi.value),
        });
        showSuccess('Package added successfully');
      }
      nav('/subscriptions/packages');
    } catch (err: any) {
      console.log(err);
      showError('Internal Server Error!');
    } finally {
      setSubmitting(false);
    }
  };

  const options = [
    ...(users?.data.data || []).map((user: users) => ({
      value: user._id,
      label: user.name + ' (Student)',
    })),
    ...(users?.data.guests || []).map((guest: users) => ({
      value: guest._id,
      label: guest.name + ' (Guest)',
    })),
  ];
  return (
    <DefaultLayout>
      <div className="w-full p-4 ">
        <h2 className="mb-9 text-2xl font-bold text-black dark:text-stroke sm:text-title-xl2">
          {id ? 'Edit Package' : 'Add Package'}
        </h2>
        <Formik
          enableReinitialize
          initialValues={{
            title: packageData ? packageData.title : '',
            prices: packageData ? packageData.prices : [],
            classesNum: packageData ? packageData.classesNum : 0,
            visibleTo: packageData ? packageData.visibleTo : [],
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-stroke focus:border-primary dark:focus:border-white   ">
                  Package Title
                </label>
                <Field
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Enter Title"
                  className="w-full rounded-lg border border-stroke dark:border-strokedark bg-transparent py-4 pl-6 pr-10 text-black outline-none dark:text-stroke  focus:border-primary dark:focus:border-white focus-visible:shadow-none"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500"
                />
              </div>

              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-stroke focus:border-primary dark:focus:border-white   ">
                  Classes Count
                </label>
                <Field
                  id="classesNum"
                  name="classesNum"
                  type="number"
                  placeholder="Enter Classes Count"
                  className="w-full rounded-lg border border-stroke dark:border-strokedark bg-transparent py-4 pl-6 pr-10 text-black outline-none dark:text-stroke  focus:border-primary dark:focus:border-white focus-visible:shadow-none"
                />
                <ErrorMessage
                  name="classesNum"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Select Students To Show Them This Package (Leave It Empty To
                  Make This Package Visible For All)
                </label>

                <Select
                  name="visibleTo"
                  options={options}
                  isMulti
                  classNamePrefix="select"
                  placeholder="Select Students"
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black  outline-none  focus-visible:shadow-none "
                  onChange={(selectedOptions) => {
                    const selectedValues = selectedOptions.map((option) => {
                      return { value: option.value, label: option.label };
                    });
                    setFieldValue('visibleTo', selectedValues);
                  }}
                  value={options?.filter(
                    (option: { value: string; label: string }) =>
                      values.visibleTo
                        ?.map((student: any) => student?._id || student?.value)
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

              <FieldArray name="prices">
                {({ insert, remove, push }) => (
                  <div>
                    <label className="mb-2.5 block font-medium text-black dark:text-stroke focus:border-primary dark:focus:border-white">
                      Package Prices
                    </label>
                    {values.prices.length > 0 &&
                      values.prices.map((price, index) => (
                        <div className="mb-4" key={index}>
                          <div className="flex flex-wrap gap-y-3 border border-stroke py-4 px-5 relative">
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-red-500 absolute -top-[7px] -right-[7px]"
                            >
                              <IoCloseCircle />
                            </button>
                            <div className="lg:w-1/2 w-full ">
                              <Select
                                options={Currency}
                                getOptionLabel={(option) =>
                                  `${option.label} - ${option.name}`
                                }
                                value={Currency.find(
                                  (option) =>
                                    option.value ===
                                    values.prices[index]?.currency,
                                )}
                                getOptionValue={(option) => option.value}
                                onChange={(option: any) => {
                                  setFieldValue(
                                    `prices.${index}.currency`,
                                    option.value,
                                  );
                                }}
                                placeholder="Select Currency"
                                className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 text-black  outline-none  focus-visible:shadow-none "
                              />
                              <ErrorMessage
                                name={`prices.${index}.currency`}
                                component="div"
                                className="text-red-500"
                              />
                            </div>
                            <div className="lg:w-1/2 w-full">
                              <div className="lg:ms-3">
                                <Field
                                  name={`prices.${index}.amount`}
                                  placeholder="Amount"
                                  type="number"
                                  className="w-full rounded-lg border border-stroke dark:border-strokedark bg-transparent py-4 pl-6 text-black outline-none dark:text-stroke focus:border-primary dark:focus:border-white focus-visible:shadow-none "
                                />
                                <ErrorMessage
                                  name={`prices.${index}.amount`}
                                  component="div"
                                  className="text-red-500"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    <button
                      type="button"
                      onClick={() => push({ currency: '', amount: '' })}
                      className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                      Add Price
                    </button>
                  </div>
                )}
              </FieldArray>

              <SubmitBtn isSubmitting={isSubmitting} id={id} title="Package" />
            </Form>
          )}
        </Formik>
      </div>
    </DefaultLayout>
  );
};

export default AddPackage;

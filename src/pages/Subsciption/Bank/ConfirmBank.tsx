import React from 'react';

import * as Yup from 'yup';

import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'Formik';

import DefaultLayout from '../../../layout/DefaultLayout';
import { useQuery } from 'react-query';
import { BANK, PACKAGES, USERS } from '../../../Api/Api';
import { Axios } from '../../../Api/axios';
import { confirmBank, createPackage } from '../../../types/subscriptions';
import Select from 'react-select';
import { showError, showSuccess } from '../../../libs/ReactToastify';
import { users } from '../../../types/users';
import { SubmitBtn } from '../../../components/Buttons/SubmitBtn';
import { Currency } from '../Packages/AddPackage/currency';

const ConfirmBank: React.FC = () => {
  const nav = useNavigate();

  // Validation
  const validationSchema = Yup.object().shape({
    referenceNum: Yup.string().notRequired(),
    student: Yup.string()
      .required('Student is required')
      .notOneOf(['', 'Select Student'], 'Please select a valid option'),
    amountReceived: Yup.string().required('Amount is required'),
    currency: Yup.string().required('Currency is required'),
    packageId: Yup.string()
      .required('Package is required')
      .notOneOf(['', 'Select Package'], 'Please select a valid option'),
    subscription_start: Yup.string().required('Start Date is required'),
    subscription_end: Yup.string().required('End Date is required'),
  });

  const { data: users } = useQuery({
    queryFn: () => Axios.get(`${USERS}?role=student`),
    queryKey: ['users'],
  });

  const { data: packages } = useQuery({
    queryFn: () => Axios.get(`${PACKAGES}`),
    queryKey: ['packges'],
  });

  const handleSubmit = async (
    values: confirmBank,
    { setSubmitting }: { setSubmitting: Function },
  ) => {
    try {
      await Axios.post(`${PACKAGES}/${BANK}`, values);
      showSuccess('Bank Transfer Confirmed Successfully');

      nav('/subscriptions/bank-transfers');
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

  console.log(packages?.data.data);
  const packagesShow = packages?.data.data.map((pa: any) => (
    <option value={pa._id}>{pa.title}</option>
  ));
  return (
    <DefaultLayout>
      <div className="w-full p-4 ">
        <h2 className="mb-9 text-2xl font-bold text-black dark:text-stroke sm:text-title-xl2">
          Confirm Bank Transfer
        </h2>
        <Formik
          enableReinitialize
          initialValues={{
            referenceNum: '',
            student: 'Select Student',
            amountReceived: '',
            currency: '',
            packageId: 'Select Package',
            subscription_start: '',
            subscription_end: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-stroke focus:border-primary dark:focus:border-white   ">
                  Reference Number
                </label>
                <Field
                  id="referenceNum"
                  name="referenceNum"
                  type="text"
                  placeholder="Enter  Reference Number"
                  className="w-full rounded-lg border border-stroke dark:border-strokedark bg-transparent py-4 pl-6 pr-10 text-black outline-none dark:text-stroke  focus:border-primary dark:focus:border-white focus-visible:shadow-none"
                />
                <ErrorMessage
                  name="referenceNum"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-stroke focus:border-primary dark:focus:border-white   ">
                  Student
                </label>
                <Field
                  as="select"
                  id="student"
                  name="student"
                  placeholder="Enter Classes Count"
                  className="w-full rounded-lg border border-stroke dark:border-strokedark bg-transparent py-4 pl-6 pr-10 text-black outline-none dark:text-stroke  focus:border-primary dark:focus:border-white focus-visible:shadow-none dark:bg-black "
                >
                  <option disabled>Select Student</option>
                  {options?.map((option: any) => (
                    <option value={option.value}>{option.label}</option>
                  ))}
                </Field>
                <ErrorMessage
                  name="student"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-stroke focus:border-primary dark:focus:border-white   ">
                  Amount Recived
                </label>
                <Field
                  id="amountReceived"
                  name="amountReceived"
                  type="number"
                  placeholder="Enter Amount Recived"
                  className="w-full rounded-lg border border-stroke dark:border-strokedark bg-transparent py-4 pl-6 pr-10 text-black outline-none dark:text-stroke  focus:border-primary dark:focus:border-white focus-visible:shadow-none"
                />
                <ErrorMessage
                  name="amountReceived"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-stroke focus:border-primary dark:focus:border-white   ">
                  Currency
                </label>
                <Select
                  options={Currency}
                  getOptionLabel={(option) =>
                    `${option.label} - ${option.name}`
                  }
                  getOptionValue={(option) => option.value}
                  name="currency"
                  onChange={(selectedOption) =>
                    setFieldValue('currency', selectedOption?.value)
                  }
                  placeholder="Select Currency"
                  className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 text-black  outline-none  focus-visible:shadow-none "
                />
                <ErrorMessage
                  name="currency"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-stroke focus:border-primary dark:focus:border-white   ">
                  Package
                </label>
                <Field
                  as="select"
                  name="packageId"
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 dark:bg-black  outline-none  focus-visible:shadow-none text-black dark:text-white"
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
                  defaultValue={'Select Package'}
                >
                  <option disabled>Select Package</option>
                  {packagesShow}
                </Field>
                <ErrorMessage
                  name="packageId"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Start Date
                </label>
                <Field
                  name={`subscription_start`}
                  type="date"
                  placeholder="Enter Start Date"
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black dark:text-white outline-none focus:border-primary focus-visible:shadow-none"
                />
                <ErrorMessage
                  name={`subscription_start`}
                  component="div"
                  className="text-red-500"
                />
              </div>{' '}
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  End Date
                </label>
                <Field
                  name={`subscription_end`}
                  type="date"
                  placeholder="Enter Start Date"
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black dark:text-white outline-none focus:border-primary focus-visible:shadow-none"
                />
                <ErrorMessage
                  name={`subscription_end`}
                  component="div"
                  className="text-red-500"
                />
              </div>
              <SubmitBtn isSubmitting={isSubmitting} title="Bank Transfer" />
            </Form>
          )}
        </Formik>
      </div>
    </DefaultLayout>
  );
};

export default ConfirmBank;

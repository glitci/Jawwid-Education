import { MONTHLY_REPORT, STUDENTS_OF_TEACHER, USERS } from '../../../Api/Api';
import { Axios } from '../../../Api/axios';
import DefaultLayout from '../../../layout/DefaultLayout';
import * as Yup from 'yup';
import { formik, Form, Field, ErrorMessage } from 'formik';
import { SubmitBtn } from '../../../components/Buttons/SubmitBtn';
import { useNavigate, useParams } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../../Context/loggedInUser';
import { showError, showSuccess } from '../../../libs/ReactToastify';
import { useQuery } from 'react-query';
import { Month, student } from '../../../types/classes';
const AddReport = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { loggedInUser } = useContext(UserContext);
  const { data: studentsOfTeacher } = useQuery({
    queryFn: () => Axios.get(`${USERS}/${STUDENTS_OF_TEACHER}`),
    queryKey: ['studentsOfTeacher'],
  });
  console.log(studentsOfTeacher?.data?.studentsOfTeacher);

  const questionsAndAnswersData = [
    {
      question: 'What topics did the student cover?',
      answerName: 'answer1',
    },
    {
      question: "Write the student's progress",
      answerName: 'answer2',
    },
    {
      question: "What are the student's points of strength?",
      answerName: 'answer3',
    },
    {
      question:
        'What areas of improvement does the student need to focus more on?',
      answerName: 'answer4',
    },
    {
      question: 'Does the student attend the class on time?',
      answerName: 'answer5',
    },
    {
      question: 'How many times was the student absent?',
      answerName: 'answer6',
    },
    {
      question: "What is the student's grade?",
      answerName: 'answer7',
    },
  ];

  // Validation
  const validationSchema = Yup.object().shape({
    student: Yup.string().required('Student is Required'),
    month: Yup.string().required('Month is Required'),
    ...questionsAndAnswersData.reduce((acc, { answerName }) => {
      acc[answerName] = Yup.string().required('This Answer is Required');
      return acc;
    }, {}),
  });
  const handleSubmit = async (
    values: any,
    { setSubmitting }: { setSubmitting: Function },
  ) => {
    try {
      const questionsAndAnswers = questionsAndAnswersData.map(
        ({ question, answerName }) => ({
          question,
          answer: values[answerName],
        }),
      );
      const month = values.month;
      const teacher = loggedInUser?._id;
      const student = values.student;
      const requestData = { questionsAndAnswers, teacher, month, student };
      await Axios.post(`${MONTHLY_REPORT}`, requestData);
      showSuccess('Monthly Report has added successfully');
      nav('/classes/monthly-report');
    } catch (err: any) {
      if (err.response.status === 400) {
        showError(err?.response?.data.message);
        console.log(err);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="w-full p-4">
        <h2 className="mb-9 text-2xl font-extrabold text-black dark:text-white sm:text-content-xl2">
          Add Monthly Report :
        </h2>
        <formik
          initialValues={{
            student: '',
            month: '',
            ...questionsAndAnswersData.reduce((acc, { answerName }) => {
              acc[answerName] = '';
              return acc;
            }, {}),
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Student
                </label>
                <Field
                  id="student"
                  name="student"
                  as="select"
                  className="w-full rounded-lg border border-stroke bg-transparent dark:bg-boxdark-2 py-4 pl-6 pr-10 text-black dark:text-white outline-none focus:border-primary focus-visible:shadow-none"
                >
                  <option value="" disabled>
                    Select Student
                  </option>
                  {studentsOfTeacher?.data?.studentsOfTeacher.map(
                    (student: student) => (
                      <option key={student._id} value={student._id}>
                        {student.name}
                      </option>
                    ),
                  )}
                </Field>
                <ErrorMessage
                  name="student"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white ">
                  Month
                </label>
                <Field
                  id="month"
                  name="month"
                  as="select"
                  className="w-full rounded-lg border border-stroke bg-transparent dark:bg-boxdark-2 py-4 pl-6 pr-10 text-black dark:text-white outline-none focus:border-primary focus-visible:shadow-none"
                >
                  <option value="" disabled>
                    Select Month
                  </option>
                  {Month.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="month"
                  component="div"
                  className="text-red-500"
                />
              </div>
              {questionsAndAnswersData.map(
                ({ question, answerName }, index) => (
                  <div key={index} className="mb-4">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      {question}
                    </label>
                    <Field
                      id={answerName}
                      name={answerName}
                      as="textarea"
                      type="text"
                      placeholder="Type here"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black dark:text-white outline-none focus:border-primary focus-visible:shadow-none"
                    />
                    <ErrorMessage
                      name={answerName}
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                ),
              )}
              <SubmitBtn
                isSubmitting={isSubmitting}
                id={id}
                title="Send Report to Email"
              />
            </Form>
          )}
        </formik>
      </div>
    </DefaultLayout>
  );
};

export default AddReport;

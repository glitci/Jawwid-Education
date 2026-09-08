import { useQuery } from 'react-query';
import DefaultLayout from '../../../layout/DefaultLayout';
import { BiSolidReport } from 'react-icons/bi';
import { Axios } from '../../../Api/axios';
import { FORMS } from '../../../Api/Api';
import Loader from '../../../common/Loader';
import { useParams } from 'react-router-dom';
import { SubmissionData } from '../../../types/forms';
const index = () => {
  const { id } = useParams();

  const { data, isLoading } = useQuery<SubmissionData>({
    queryFn: () => Axios.get(`${FORMS}/submissions/${id}`),
    queryKey: ['spcific-submission' + id],
  });

  console.log(data);

  return (
    <DefaultLayout>
      {isLoading ? (
        <Loader />
      ) : (
        <div className=" m-2 mb-5 h-full rounded-lg bg-white p-5 shadow-lg dark:bg-strokedark text-xs md:text-sm lg:text-sm xl:text-base">
          <div className="w-full text-form-strokedark dark:text-stroke p-4">
            <h3 className="text-xl font-extrabold text-primary dark:text-stroke">
              <BiSolidReport className="inline-block me-5 text-2xl" />
              From Submission For {data?.data?.date?.userName} :
            </h3>
            <div className="border-b-2 mt-2 border-primary dark:border-stroke"></div>
            <div className="m-5  w-full">
              <div className="gap-2 my-5 text-[1rem]  flex flex-row">
                <div className=" font-bold">User Name:</div>
                <div className="">{data?.data?.date?.userName}</div>
              </div>
              <div className="gap-2 my-5 text-[1rem]  flex flex-row">
                <div className=" font-bold">User Email:</div>
                <div className="">{data?.data?.date?.userEmail}</div>
              </div>
              <div className="font-extrabold text-lg border-b py-2 border-stroke mt-7">
                Questions And Answers
              </div>
              {data?.data?.date?.answers?.map((QA, index) => (
                <div
                  key={index}
                  className="gap-2 my-5 text-[1rem] flex flex-col"
                >
                  <div className=" font-bold">{QA.question}</div>
                  {Array.isArray(QA.answer) ? (
                    QA.answer?.map((answer: string, key: number) => (
                      <div key={key}>{answer}</div>
                    ))
                  ) : (
                    <div>{QA.answer}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
};

export default index;

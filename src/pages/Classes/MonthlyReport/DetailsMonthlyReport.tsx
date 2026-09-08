import { useQuery } from 'react-query';
import DefaultLayout from '../../../layout/DefaultLayout';
import { BiSolidReport } from 'react-icons/bi';
import { Axios } from '../../../Api/axios';
import { MONTHLY_REPORT } from '../../../Api/Api';
import Loader from '../../../common/Loader';
import { useParams } from 'react-router-dom';
import { reports } from '../../../types/classes';
const DetailsMonthlyReport = () => {
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryFn: () => Axios.get(`${MONTHLY_REPORT}?_id=${id}`),
    queryKey: ['reports'],
  });

  return (
    <DefaultLayout>
      {isLoading ? (
        <Loader />
      ) : (
        data?.data.reports.map((item: reports, index: number) => (
          <div
            key={index}
            className=" m-2 mb-5 h-full rounded-lg bg-white p-5 shadow-lg dark:bg-strokedark text-xs md:text-sm lg:text-sm xl:text-base"
          >
            <div className="w-full text-form-strokedark dark:text-stroke p-4">
              <h3 className="text-xl font-extrabold text-primary dark:text-stroke">
                <BiSolidReport className="inline-block me-5 text-2xl" />
                Mothly Report For {item?.student?.name} :
              </h3>
              <div className="border-b-2 mt-2 border-primary dark:border-stroke"></div>
              <div className="m-5  w-full">
                <div className="gap-2 my-5 text-[1rem]  flex flex-row">
                  <div className=" font-bold">Teaher Name:</div>
                  <div className="">{item?.teacher?.name}</div>
                </div>
                <div className="gap-2 my-5 text-[1rem] flex flex-row">
                  <div className=" font-bold">Student Name:</div>
                  <div className="">{item.student?.name}</div>
                </div>
                <div className="gap-2 my-5 text-[1rem] flex flex-row">
                  <div className=" font-bold">Month:</div>
                  <div className="">{item.month}</div>
                </div>
                <div className="font-extrabold text-lg border-b py-2 border-stroke mt-7">
                  Questions And Answers
                </div>
                {item.questionsAndAnswers.map((QA, index) => (
                  <div
                    key={index}
                    className="gap-2 my-5 text-[1rem] flex flex-col"
                  >
                    <div className=" font-bold">{QA.question}</div>
                    <div>{QA.answer}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
      )}
    </DefaultLayout>
  );
};

export default DetailsMonthlyReport;

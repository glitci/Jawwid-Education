import React, { useContext, useState } from 'react';
import { LMSHeaderProps } from '../../types/table';

import Loader from '../../common/Loader';
import { Axios } from '../../Api/axios';
import { CHECKOUT, MANAGE, ONETIME, PACKAGES } from '../../Api/Api';
import DeleteLoader from '../../common/DeleteLoader';
import { UserContext } from '../../Context/loggedInUser';
import {
  showError,
  showPromis,
  showPromisPackage,
} from '../../libs/ReactToastify';

const Package: React.FC<LMSHeaderProps> = ({ data, isLoading }) => {
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState('');
  const { loggedInUser } = useContext(UserContext);

  const checkout = async (id: string, currency: string) => {
    try {
      setLoading(true);
      const res = await Axios.post(
        `${PACKAGES}/${CHECKOUT}/${id}?currency=${currency}`,
      );
      window.location.replace(res?.data?.url);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const oneTimeCheckOut = async (id: string, currency: string) => {
    try {
      setLoading(true);
      const res = await Axios.post(
        `${PACKAGES}/${ONETIME}/${id}?currency=${currency}`,
      );
      window.location.replace(res?.data?.url);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const manageSubscription = async () => {
    try {
      const res = Axios.get(`${PACKAGES}/${MANAGE}`);
      showPromisPackage(res);
      await res;
      console.log((await res).data);
      window.location.replace((await res)?.data?.url);
    } catch (err) {
      showError('There is no subscription');
    }
  };

  return (
    <>
      <div className="rounded border border-stroke dark:text-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 text-xs md:text-sm lg:text-sm xl:text-base ">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <h1
              className="bg-primary rounded-md  w-fit p-2 text-white cursor-pointer"
              onClick={manageSubscription}
            >
              Manage Subscription
            </h1>
            <div className="py-8 sm:mt-10 space-y-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 lg:max-w-4xl lg:mx-auto">
              {data?.map((item, key) => (
                <div
                  key={key}
                  className="border border-neutral-200 rounded-lg shadow-sm divide-y divide-neutral-200"
                >
                  <div className="p-6">
                    <h2 className="text-lg leading-6 font-medium text-neutral-900">
                      {item?.title}
                    </h2>

                    <p className="mt-4 flex flex-col space-y-2">
                      <span className="flex flex-row space-x-2 items-center">
                        <span className="text-5xl font-extrabold text-neutral-900">
                          {item?.prices[0]?.amount}
                        </span>
                        <div>
                          <span className="text-xs font-medium text-neutral-500">
                            per month
                          </span>
                          <span className="text-xs font-medium text-neutral-500 block">
                            {item?.prices[0]?.currency}
                          </span>{' '}
                        </div>
                      </span>
                    </p>
                    <button
                      onClick={() => {
                        setId(item?._id);
                        checkout(item?._id, item?.prices[0]?.currency);
                      }}
                      disabled={loading || loggedInUser?.subscription?.package}
                      className={`mt-8  w-full ${
                        loggedInUser?.subscription?.package &&
                        loggedInUser?.subscription?.package !== item?._id
                          ? 'bg-primary bg-opacity-40'
                          : 'bg-primary'
                      }  border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500  flex items-center justify-center`}
                    >
                      {loggedInUser?.subscription?.package === item?._id ? (
                        'Subscribed'
                      ) : loading && id === item?._id ? (
                        <DeleteLoader />
                      ) : (
                        'Get Started'
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setId(item?._id);
                        oneTimeCheckOut(item?._id, item?.prices[0]?.currency);
                      }}
                      disabled={loading || loggedInUser?.subscription?.package}
                      className={`mt-2  w-full ${
                        loggedInUser?.subscription?.package &&
                        loggedInUser?.subscription?.package !== item?._id
                          ? 'bg-primary bg-opacity-40'
                          : 'bg-primary'
                      }  border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500  flex items-center justify-center`}
                    >
                      {loggedInUser?.subscription?.package === item?._id ? (
                        'Subscribed'
                      ) : loading && id === item?._id ? (
                        <DeleteLoader />
                      ) : (
                        'One Time'
                      )}
                    </button>
                  </div>
                  <div className="pt-6 pb-8 px-6">
                    <h3 className="text-xs font-medium text-neutral-900 tracking-wide uppercase">
                      What's included
                    </h3>
                    <ul role="list" className="mt-6 space-y-4">
                      <li className="flex space-x-3">
                        <svg
                          stroke="currentColor"
                          fill="none"
                          strokeWidth={0}
                          viewBox="0 0 24 24"
                          className="flex-shrink-0 h-5 w-5 text-green-500"
                          aria-hidden="true"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-sm text-neutral-500">
                          Classes Count: {item?.classesNum}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Package;

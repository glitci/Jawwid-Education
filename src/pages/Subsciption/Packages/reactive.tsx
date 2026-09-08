import React, { useState } from 'react';

import { Link, useNavigate, useParams } from 'react-router-dom';
import DefaultLayout from '../../../layout/DefaultLayout';
import { Axios } from '../../../Api/axios';
import { showError, showSuccess } from '../../../libs/ReactToastify';
import { PACKAGES } from '../../../Api/Api';
import DeleteLoader from '../../../common/DeleteLoader';
import { FaCheck } from 'react-icons/fa6';

const ReactivatePackage: React.FC = () => {
  const nav = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await Axios.put(`${PACKAGES}/${id}/reactivate`);
      showSuccess('Package Reactivated successfully');
      nav('/subscriptions/packages');
    } catch (err: any) {
      console.log(err);
      showError('Internal Server Error!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="w-full p-4 ">
        <h2 className="mb-9 text-2xl font-bold text-black dark:text-stroke sm:text-title-xl2">
          Reactivate Package
        </h2>

        <div className="relative  rounded-lg bg-white text-left shadow-xl sm:my-8 w-full">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-500 sm:mx-0 sm:h-10 sm:w-10 text-white">
                <FaCheck />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3
                  className="text-base font-semibold leading-6 text-gray-900"
                  id="modal-title"
                >
                  Reactivate Package
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to reactivate this package?
                    <br />
                    Reactivating the package will result in it being enabled for
                    subscribers
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              onClick={handleSubmit}
              type="button"
              className="inline-flex w-full justify-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 sm:ml-3 sm:w-auto"
            >
              {loading ? <DeleteLoader /> : 'Reactivate'}
            </button>
            <Link
              to="/subscriptions/packages/"
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ReactivatePackage;

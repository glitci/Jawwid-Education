import { useEffect, useState } from 'react';
import DefaultLayout from '../../../../layout/DefaultLayout';
import { useParams } from 'react-router-dom';
import { createProduct } from '../../../../types/Lms';
import { PRODUCTS } from '../../../../Api/Api';
import { Axios } from '../../../../Api/axios';
import { DocumentViewer } from 'react-documents';

const ShowProduct = () => {
  const [productData, setproductData] = useState<createProduct | null>(null);
  const [loading, setLoading] = useState(true);

  console.log(productData);
  const { id } = useParams();
  useEffect(() => {
    if (id) {
      Axios.get(`${PRODUCTS}/${id}`)
        .then((response) => {
          const productData = response.data.data;
          setproductData(productData);
        })
        .catch((error) => {
          console.error('Error fetching product data:   ', error);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  return (
    <DefaultLayout>
      <div className="w-full p-4 ">
        <h2 className="mb-9 text-2xl font-bold text-black sm:text-title-xl2">
          Product Content
        </h2>
        <div className="bg-white rounded p-2 text-xl sm:text-title-xl3">
          {loading ? (
            <>
              <div role="status" className="animate-pulse">
                <div className="h-9 bg-stroke rounded-full dark:bg-gray-700 w-100 mb-4"></div>
              </div>

              <div
                role="status"
                className="flex items-center justify-center h-100 w-full bg-stroke rounded-lg animate-pulse dark:bg-form-strokedark"
              >
                <svg
                  className="w-full h-10 text-gray-200 dark:text-gray-600"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 16 20"
                >
                  <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                  <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM9 13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm4 .382a1 1 0 0 1-1.447.894L10 13v-2l1.553-1.276a1 1 0 0 1 1.447.894v2.764Z" />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </>
          ) : (
            <>
              <h1 className="mb-9 font-bold text-black p-2">
                {productData?.title}
              </h1>
              {productData !== null && (
                <DocumentViewer
                  queryParams="hl=Nl"
                  url={productData?.productFile}
                  overrideLocalhost="https://react-doc-viewer.firebaseapp.com/"
                  style={{ height: '800px', width: '100%' }}
                ></DocumentViewer>
              )}
            </>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ShowProduct;

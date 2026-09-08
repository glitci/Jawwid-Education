import React from 'react';
import Logo from '../../images/logo/logo.png';
import SigninVector from '../../images/vectors/signinVector.svg';
import { Link, useNavigate } from 'react-router-dom';

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="rounded-sm">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="py-17.5 px-26 text-center">
              <Link className="mb-5.5 inline-block" to="/">
                <img className="block" src={Logo} alt="Logo" />
              </Link>
              <img src={SigninVector} alt="sign in " />
              <span className="mt-15 inline-block"></span>
            </div>
          </div>
          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <span className="mb-1.5 block font-medium">
                Email Verfication
              </span>
              <h2 className="mb-5 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                An Email Sent To Your Email
              </h2>{' '}
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Please Check The Email And Verify It
              </h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default VerifyEmail;

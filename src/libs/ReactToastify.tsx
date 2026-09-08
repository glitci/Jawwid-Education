import { toast, ToastOptions } from 'react-toastify';

const customToastOption = {
  style: { width: '400px', right: '80px', zIndex: '100' },
};
export const showSuccess = (
  message: string,
  ToastOptions: ToastOptions = customToastOption,
) =>
  toast.success(
    <div data-cy="success-toast">
      <p>{message}</p>
    </div>,
    ToastOptions,
  );
export const showError = (
  message: string,
  ToastOptions: ToastOptions = customToastOption,
) => {
  toast.error(
    <div>
      <p>{message}</p>
    </div>,
    ToastOptions,
  );
};

export const showInfo = (
  message: string,
  ToastOptions: ToastOptions = customToastOption,
) => {
  toast.info(
    <div>
      <p>{message}</p>
    </div>,
    ToastOptions,
  );
};

export const showPromis = (
  functionPromise: any,
  ToastOptions: ToastOptions = customToastOption,
) => {
  toast.promise(
    functionPromise,
    {
      pending: 'Opening Chat, Please Wait',
      success: 'Chat Opened Successfully 👌',
    },
    ToastOptions,
  );
};

export const showPromisPackage = (
  functionPromise: any,
  ToastOptions: ToastOptions = customToastOption,
) => {
  toast.promise(
    functionPromise,
    {
      pending: 'Opening Subscription, Please Wait',
      success: 'Subscription Opened Successfully 👌',
    },
    ToastOptions,
  );
};

export const showPromisZoom = (
  functionPromise: any,
  ToastOptions: ToastOptions = customToastOption,
) => {
  toast.promise(
    functionPromise,
    {
      pending: 'Opening Link, Please Wait',
      success: 'Link Opened Successfully 👌',
    },
    ToastOptions,
  );
};

export const showPromisZoomOut = (
  functionPromise: any,
  ToastOptions: ToastOptions = customToastOption,
) => {
  toast.promise(
    functionPromise,
    {
      pending: 'Checking Out, Please Wait',
      success: 'Checked Out Successfully 👌',
    },
    ToastOptions,
  );
};

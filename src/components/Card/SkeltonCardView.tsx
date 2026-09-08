const SkeltonCardView = () => {
  return (
    <div className="m-2 mb-5 rounded bg-white p-6 shadow-lg dark:bg-strokedark text-xs md:text-sm lg:text-sm xl:text-base animate-pulse">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-5 mb-2 leading-6 text-black dark:text-white">
          {/* Skeleton CheckNamePage */}
          <div className="w-10 h-10 bg-stroke rounded-full animate-pulse"></div>

          <div className="flex flex-col">
            {/* Skeleton headers */}
            <div className="h-9 w-44 bg-stroke rounded mb-1 animate-pulse"></div>
          </div>
        </div>

        {/* Skeleton Options Menu */}
        <div className="w-10 h-10 bg-stroke rounded-full animate-pulse"></div>
      </div>

      <div className="border border-stroke dark:border-form-strokedark my-2"></div>

      <div className="flex justify-between text-black dark:text-white">
        <div className="flex flex-col leading-7 pb-2 pt-2.5 border-l-4 pl-4">
          {/* Skeleton content */}
          <div className="h-14 w-59 bg-stroke rounded mb-1 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeltonCardView;

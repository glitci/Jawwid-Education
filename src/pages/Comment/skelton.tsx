
const Skelton = () => {
  return (
    <div className="flex my-1">
      <div className="flex-shrink-0 mr-3">
        <div className="bg-stroke rounded-full w-8 h-8 sm:w-10 sm:h-10 animate-pulse"></div>
      </div>
      <div className="flex-1 border border-stroke shadow rounded-lg px-4 py-2 sm:px-6 sm:py-4 leading-relaxed">
        <div className="flex justify-between items-center">
          <div>
            <div className="bg-stroke rounded h-6 w-30 mb-2 animate-pulse"></div>
          </div>
          <div className="relative flex items-center space-x-3.5">
            <button>
              <div className="bg-stroke  w-10 h-10 animate-pulse rounded-full flex justify-center items-center">
              
              </div>
            </button>
          </div>
        </div>
        <div className="flex justify-between gap-5 items-center mt-2">
          <div className="bg-stroke rounded h-20 w-full animate-pulse"></div>
          <div className="flex-shrink-0">
            <div className="bg-stroke rounded border border-white w-18 h-18 animate-pulse"></div>
          </div>
        </div>
        <div className="flex justify-start items-center gap-4 mt-4">
          <div className="bg-stroke rounded h-6 w-16 animate-pulse"></div>
          <div className="bg-stroke rounded h-6 w-16 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Skelton;

const Skelton = () => {
  return (
    <div className="bg-gray-3 dark:bg-boxdark mx-2 my-2 p-8 rounded-lg shadow-lg">
      {/* User Info with Three-Dot Menu */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-11 h-11 rounded-full bg-stroke  animate-pulse"></div>
          <div>
            <div className="w-36 h-6 bg-stroke  rounded animate-pulse"></div>
            <div className="w-30 h-4 mt-2 bg-stroke  rounded animate-pulse"></div>
          </div>
        </div>
        <div className="text-gray-500 cursor-pointer">
          {/* Three-dot menu icon */}
          <div className="w-8 h-8 bg-stroke  rounded animate-pulse"></div>
        </div>
      </div>
      {/* Message */}
      <div className="mb-4">
        <div className="w-full h-8 bg-stroke  rounded animate-pulse"></div>
      </div>
      {/* Image */}
      <div className="mb-4">
        <div className="w-full h-59 object-contain bg-stroke  rounded animate-pulse"></div>
      </div>
      {/* Like and Comment Section */}
      <div className="flex items-center gap-4 justify-end text-gray-500">
        <div className="flex items-center space-x-2">
          <div className="w-20 h-8 bg-stroke  rounded animate-pulse"></div>
        </div>
        <div className="w-20 h-8 bg-stroke  rounded animate-pulse"></div>
      </div>
    </div>
  );
};

export default Skelton;

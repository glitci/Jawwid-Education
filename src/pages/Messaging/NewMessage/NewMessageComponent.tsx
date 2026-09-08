import MyEditor from '../../../components/TextEditor';

const NewMessageComponent = () => {
  return (
    <div className="rounded border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:bg-boxdark dark:border-strokedark  sm:px-7.5 xl:pb-1 text-xs md:text-sm lg:text-sm xl:text-base ">
      <form className="w-full ">
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3 mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-state"
            >
              TO:
            </label>
            <div className="relative">
              <select
                className="block appearance-none w-full  border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-state"
              >
                <option>New Mexico</option>
                <option>Missouri</option>
                <option>Texas</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="w-full px-3 mb-6 ">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-state"
            >
              CC:
            </label>
            <div className="relative">
              <select
                className="block appearance-none w-full border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-state"
              >
                <option>New Mexico</option>
                <option>Missouri</option>
                <option>Texas</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="w-full  px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-last-name"
            >
              SUBJECT
            </label>
            <input
              className="appearance-none mb-6 block w-full  text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-last-name"
              type="text"
              placeholder="Doe"
            />
          </div>
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-last-name"
            >
              MESSAGE
            </label>
            <MyEditor />
          </div>
          <div className="w-full  px-3">
            <label
              className="block uppercase tracking-wide  text-xs font-bold mb-2"
              htmlFor="grid-last-name"
            >
              attach files
            </label>
            <input
              className="appearance-none mb-6 block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-last-name"
              type="file"
              placeholder="drog you files"
            />
          </div>
          <div className=" m-4 gap-2 flex items-center">
            <button
              type="submit"
              className=" p-2 border border-stroke rounded  w-auto "
            >
              Send
            </button>
            <button
              type="submit"
              className=" p-2 border border-stroke rounded  w-auto  "
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewMessageComponent;

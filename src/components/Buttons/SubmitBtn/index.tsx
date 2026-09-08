import DeleteLoader from '../../../common/DeleteLoader';
import { Btn } from '../../../types/btns';

export const SubmitBtn: React.FC<Btn> = ({ isSubmitting, id, title }) => {
  return (
    <div className="mb-5">
      <button
        disabled={isSubmitting ? true : false}
        type="submit"
        className="w-full flex justify-center cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
      >
        {isSubmitting ? (
          <DeleteLoader />
        ) : id ? (
          `Update ${title}`
        ) : (
          `Create ${title}`
        )}
      </button>
    </div>
  );
};

import { RiDeleteBinLine } from 'react-icons/ri';
import { DeleteProps } from '../../types/table';
import { useEffect, useState } from 'react';
import DeleteDialog from '../DialogDelete/DialogDelete';

const Delete: React.FC<DeleteProps> = ({
  deleteItem,
  deleteLoading,
  id,
  isSuccess,
}) => {
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const handleDeleteConfirmation = () => {
    deleteItem(id);
  };

  useEffect(() => {
    isSuccess === true && setShowDialog(false);
  }, [isSuccess]);

  return (
    <div className="flex justify-center items-center">
      <RiDeleteBinLine
        className="cursor-pointer text-xl text-danger"
        onClick={() => setShowDialog(true)}
      />
      <DeleteDialog
        onClose={() => setShowDialog(false)}
        onConfirm={handleDeleteConfirmation}
        deleteLoading={deleteLoading}
        showDialog={showDialog}
      />
    </div>
  );
};

export default Delete;

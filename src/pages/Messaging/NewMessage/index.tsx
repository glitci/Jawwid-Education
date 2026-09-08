import DefaultLayout from '../../../layout/DefaultLayout';
import MessagingSidebar from '../../../layout/MessagingSidebar';
import NewMessageComponent from './NewMessageComponent';

const NewMessage = () => {
  return (
    <DefaultLayout>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 gap-2">
        <div className="sm:col-span-1 md:col-span-1">
          <MessagingSidebar />
        </div>
        <div className="sm:col-span-1 md:col-span-3">
          <NewMessageComponent />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default NewMessage;

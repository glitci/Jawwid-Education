import { useContext, useEffect, useState } from 'react';
import { FilterInput, Options, TableColumn } from '../../../types/table';
import Table from '../../../components/Tables/Table';
import ClassesLayout from '../../../layout/ClassesLayout';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Axios } from '../../../Api/axios';
import { CHAT, CLASSES, STARTTEACHERCHAT } from '../../../Api/Api';
import {
  showError,
  showInfo,
  showPromis,
  showPromisZoom,
  showPromisZoomOut,
  showSuccess,
} from '../../../libs/ReactToastify';
import { useNavigate } from 'react-router-dom';
import { REALUSER } from '../../../Context/realUser';

const MyClasses = () => {
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const { realUser } = useContext(REALUSER);
  const [changeClass, setChangeClass] = useState<string>(
    realUser === 'guest' ? 'trial' : 'scheduled',
  );

  const comingOptions: Options[] = [];
  const nav = useNavigate();

  const queryClient = useQueryClient();

  const filterInputs: FilterInput[] = [
    {
      header: { key: 'name', name: 'Name' },
      type: 'input',
      placeHolder: 'Name',
    },
    {
      header: { key: 'start_date', name: 'Start Date' },
      type: 'date',
      placeHolder: 'Start Date',
    },
    {
      header: { key: 'duration', name: 'Duration' },
      type: 'input',
      placeHolder: 'Duration',
    },

    {
      header: { key: 'zoomMeetingId', name: 'zoomMeeting Id' },
      type: 'input',
      placeHolder: 'zoom Meeting Id',
    },
    {
      header: { key: 'filter', name: 'Filter' },
      type: 'select',
      placeHolder: 'Select',
      data: ['upcoming', 'all', 'past'],
    },
  ];

  console.log(changeClass);

  const {
    data: classes,
    isLoading,
    refetch,
  } = useQuery({
    queryFn: () =>
      Axios.get(
        `${CLASSES}?page=${page}&limit=${limit}&status=${changeClass}&${query}${
          query === '' && changeClass !== 'ended' ? '&filter=upcoming' : ''
        }`,
      ),
    queryKey: ['classes', page, limit, query, changeClass],
  });

  const handleClose = () => {
    setQuery('');
    refetch();
  };

  const handleSend = () => {
    const query = Object?.entries(search)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    setQuery(query);
  };

  const {
    mutateAsync,
    isLoading: deleteLoading,
    isSuccess,
  } = useMutation({
    mutationFn: async ({
      id,
      cancel = false,
    }: {
      id: string;
      cancel?: boolean;
    }) => {
      const url = cancel ? `${CLASSES}/${id}/cancelClass` : `${CLASSES}/${id}`;
      return cancel ? Axios.put(url) : Axios.delete(url);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['classes']);
    },
  });
  const {
    mutateAsync: changeStatus,
    isLoading: changeLoading,
    isSuccess: changeSuccess,
  } = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) =>
      Axios.put(`${CLASSES}/${id}`, { status: status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['classes']);
    },
  });

  const handleRefetch = (title: string) => {
    setChangeClass(title);
  };

  useEffect(() => {
    refetch();
  }, [changeClass]);

  const cancelItem = (id: string) => {
    mutateAsync({ id: id, cancel: true });
  };

  const openChat = async (id: string) => {
    try {
      const chatPromise = Axios.post(`${CHAT}/${STARTTEACHERCHAT}/${id}`);
      showPromis(chatPromise);
      const res = await chatPromise;
      nav('/messaging/chats/');
    } catch (err: any) {
      if (
        err.response.data.message ===
        'There is already a chat with this teacher'
      ) {
        showInfo('There is already a chat with this teacher');

        nav('/messaging/chats/' + err.response.data.chatId);
      } else {
        showError('Error , Try Again Later');
      }
    }
  };

  const checkIn = async (id: string, link: string) => {
    if (realUser === 'teacher') {
      try {
        const chatPromise = Axios.post(`${CLASSES}/${id}/checkIn`);
        showPromisZoom(chatPromise);
        await chatPromise;
      } catch (err: any) {
        if (
          err.response.data.message ===
          'there is already a check in record for this class'
        ) {
          showSuccess('Redirecting');
        } else {
          showError('Try Again Later');
        }
      } finally {
        window.open(link, '_blank');
      }
    } else {
      window.open(link, '_blank');
    }
  };

  const checkOut = async (id: string, link: string) => {
    try {
      const chatPromise = Axios.put(`${CLASSES}/${id}/checkOut`);
      showPromisZoomOut(chatPromise);
      await chatPromise;
    } catch (err: any) {
      if (
        err.response.data.message ===
        'there is a check out record for this class'
      ) {
        showError('there is already a check out record for this class');
      } else {
        showError('Try Again Later');
      }
    }
  };

  const header: TableColumn[] = [
    { key: 'name', name: 'Name' },
    { key: 'start_date', name: 'Start Date' },
    { key: 'duration', name: 'Duration' },
    { key: 'start_time', name: 'Start Time' },
    { key: 'classZoomLink', name: 'Zoom Link' },
    { key: 'zoomMeetingId', name: 'Zoom Id' },
    { key: 'meetingPassword', name: 'Meeting Password' },
    { key: 'status', name: 'Class Status' },
  ];

  return (
    <ClassesLayout>
      <Table
        // Data
        header={header}
        data={classes?.data.data}
        ItemAdd="Trail Class"
        multiClass
        // Pagination
        limit={limit}
        setLimit={setLimit}
        page={page}
        setPage={setPage}
        // Options
        comingOptions={comingOptions}
        filterInputs={filterInputs}
        // Delete
        deleteItem={mutateAsync}
        isLoading={isLoading}
        deleteLoading={deleteLoading}
        isSuccess={isSuccess}
        // Cancel
        cancelItem={cancelItem}
        // Change Status
        changeStatus={changeStatus}
        changeLoading={changeLoading}
        changeSuccess={changeSuccess}
        totalPages={classes?.data?.totalPages!}
        setSearch={setSearch}
        handleSend={handleSend}
        openChat={openChat}
        handleRefetch={handleRefetch}
        handleClose={handleClose}
        checkIn={checkIn}
        checkOut={checkOut}
        changeClass={changeClass}
      />
    </ClassesLayout>
  );
};

export default MyClasses;

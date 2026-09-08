import DefaultLayout from '../../../layout/DefaultLayout';
import { FlatChat } from '../../../components/Socket/FlatChat';
import { useContext, useEffect, useRef, useState } from 'react';
import { currentChat } from '../../../types/chat';
import { UserContext } from '../../../Context/loggedInUser';
import { socket } from '../../../Socket';
import { Axios } from '../../../Api/axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { message } from '../../../types/messaging';
import InnerPageHeader from '../../../components/InnerPageHeader';
import { links } from './links';
import { toast } from 'react-toastify';
import { useLocation, useParams } from 'react-router-dom';
import { CHAT } from '../../../Api/Api';
import { showError } from '../../../libs/ReactToastify';

export const AllChats = () => {
  const [currentChat, setCurrentChat] = useState<currentChat | any>('');
  const [stopPagination, setStopPagination] = useState<boolean>(false);
  const [loadingPrevMessages, setLoadingPrevMessages] =
    useState<boolean>(false);
  const chatboxRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const { loggedInUser } = useContext(UserContext);
  const queryClient = useQueryClient();
  const currentChatRef = useRef(currentChat);
  const [SendingMessage, setSendingMessage] = useState<boolean>(false);
  const progress = useRef<HTMLElement>(null);
  const { id } = useParams();
  const [chats, setChats] = useState([]);

  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    id &&
      Axios.get(`${CHAT}/${id}`)
        .then((data) => setCurrentChat(data.data.chat))
        .catch(() => showError('Error, Please Try Again Later'));
  }, []);

  useEffect(() => {
    function beforeUnload(e: BeforeUnloadEvent) {
      if (!SendingMessage) return;
      e.preventDefault();
    }

    window.addEventListener('beforeunload', beforeUnload);

    return () => {
      window.removeEventListener('beforeunload', beforeUnload);
    };
  }, [SendingMessage]);

  useEffect(() => {
    refetch();
  }, [pathname]);

  useEffect(() => {
    currentChatRef.current = currentChat;
  }, [currentChat]);

  useEffect(() => {
    function putMessage(data: message) {
      if (data._id) {
        const messageToShow: message = {
          _id: data?._id,
          text: data?.text,
          chatId: data?.chatId,
          media: data.media && data.media,
          senderId: {
            _id: data?.senderId?._id,
            name: data?.senderId?.name,
          },
          createdAt: data?.createdAt,
        };
        addNewMessage(messageToShow);
      }
    }
    socket.on('getMessage', putMessage);

    return () => {
      socket.off('getMessage', putMessage);
    };
  }, []);

  //   Get Chats
  const {
    data,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryFn: () =>
      Axios.get(
        `chat${
          pathname.includes('support') ? '?chatWith=support&' : '?'
        }page=1&limit=100`,
      ),
    queryKey: ['chat', pathname],

    onSuccess: (data) => {
      setChats(data?.data?.chats);
    },
  });

  const addChats = (data) => {
    console.log(data);
  };

  // Get Messages Of Single Chat

  const { data: messages, isLoading: messageLoader } = useQuery({
    queryFn: () =>
      Axios.get('messages/' + currentChat?._id + '?page=1&limit=20'),
    queryKey: ['messages' + currentChat?._id],
    enabled: currentChat?._id ? true : false,
    staleTime: Infinity,
  });

  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  //   Scroll To Down When Load the messages

  useEffect(() => {
    !messageLoader &&
      chatboxRef.current?.scrollTo(0, chatboxRef?.current.scrollHeight);
  }, [messageLoader, currentChat]);

  //   Add New Message

  const addNewMessage = (newMessage: message, isPaginate = false) => {
    const updatedMessages = isPaginate
      ? [...messagesRef.current?.data?.messages, ...newMessage]
      : [newMessage, ...messagesRef.current?.data?.messages];
    queryClient.setQueryData(['messages' + currentChatRef.current?._id], {
      ...messages,
      data: { ...messages?.data, messages: updatedMessages },
    });

    requestAnimationFrame(() => {
      isPaginate
        ? chatboxRef.current?.scrollTo(
            0,
            chatboxRef.current?.querySelectorAll('.message')[20]?.offsetTop -
              50,
          )
        : chatboxRef.current?.scrollTo(0, chatboxRef.current.scrollHeight);
    });
  };

  //   Getting More Messages When Moving Up

  useEffect(() => {
    const chatboxElement = chatboxRef.current as HTMLElement;
    let isFetching = false;
    const handleScroll = async () => {
      if (chatboxElement?.scrollTop <= 5 && !stopPagination && !isFetching) {
        isFetching = true;
        try {
          setLoadingPrevMessages(true);
          const res = await Axios.get(
            `messages/${currentChat?._id}?page=${page + 1}&limit=20`,
          );
          const newMessages = res.data.messages;
          if (newMessages.length === 0) {
            setStopPagination(true);
          } else {
            addNewMessage(newMessages, true);
            setPage((prevPage) => prevPage + 1);
          }
        } catch (err) {
          console.log(err);
        } finally {
          setTimeout(() => {
            isFetching = false;
          }, 1000);

          setLoadingPrevMessages(false);
        }
      }
    };

    chatboxElement?.addEventListener('scroll', handleScroll);

    return () => {
      chatboxElement?.removeEventListener('scroll', handleScroll);
    };
  }, [currentChat, messages, page]);

  // Send Message In Chat

  const handleSubmit = async (message: string, media: File[]) => {
    let imgVedSize = false;
    for (let i = 0; i < media.length; i++) {
      if (
        (media[i].size / (1024 * 1024)).toFixed(2) > 5 &&
        media[i].type.includes('image')
      ) {
        imgVedSize = true;
      } else if (
        (media[i].size / (1024 * 1024)).toFixed(2) > 10 &&
        media[i].type.includes('video')
      ) {
        imgVedSize = true;
      }
    }
    if ((media.length < 10 || media.length === 0) && !imgVedSize) {
      const formData = new FormData();
      formData.append('text', message);
      if (media) {
        for (let i = 0; i < media.length; i++) {
          formData.append('media', media[i]);
        }
      }
      const messageToShow: message = {
        _id: '',
        text: message,
        chatId: currentChat?._id,
        senderId: {
          _id: loggedInUser?._id || '',
          name: loggedInUser?.name || '',
        },
        media: media && [...media],
        createdAt: '',
      };
      addNewMessage(messageToShow);

      const receiverId = currentChat?.members[0]._id;

      if (!media) {
        socket.emit('sendMessage', {
          senderId: loggedInUser?._id,
          receiverId: receiverId,
          text: message,
          sentAt: '13/5/2022',
        });
      }

      try {
        setSendingMessage(true);

        await Axios.post(`messages/${currentChat?._id}`, formData, {
          onUploadProgress: (ProgressEvent) => {
            const { loaded, total } = ProgressEvent;
            const percent = Math.floor((loaded * 100) / total);
            if (percent % 10 === 0) {
              progress.current.style.width = `${percent}%`;
            }
          },
        });
        if (media) {
          socket.emit('sendMessage', {
            senderId: loggedInUser?._id,
            receiverId: receiverId,
            text: message,
            sentAt: '13/5/2022',
          });
        }
      } catch (err) {
        console.log(err);
      } finally {
        setSendingMessage(false);
      }
    } else if (imgVedSize) {
      toast.error('Image And Must not Be more than 5MB/10MB');
    } else {
      toast.error("You Can't Upload More than 10 Images And Videos");
    }
  };

  //   Handle Close Chat

  const {
    mutateAsync: handleCloseChat,
    isLoading: closeLoading,
    isSuccess,
  } = useMutation({
    mutationFn: (id) => Axios.put(`chat/${id}`),
    onSuccess: () => {
      toast.success('Chat Has Been Closed Successfully');
      queryClient.invalidateQueries(['chat']);
    },
  });

  return (
    <DefaultLayout>
      <InnerPageHeader pageLink="messaging" links={links} />
      <div
        className="w-0 h-[3px] bg-primary transition-all rounded-sm"
        ref={progress}
      ></div>
      <FlatChat
        loading={loading}
        ref={chatboxRef}
        messageLoading={messageLoader}
        chats={chats}
        setCurrentChat={setCurrentChat}
        messages={messages?.data?.messages}
        currentChat={currentChat}
        sendMessage={handleSubmit}
        handleCloseChat={handleCloseChat}
        closeLoading={closeLoading}
        isSuccess={isSuccess}
        loadingPrevMessages={loadingPrevMessages}
        addChats={addChats}
      />
    </DefaultLayout>
  );
};

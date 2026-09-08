import { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../../../Context/loggedInUser';
import { Axios } from '../../../Api/axios';
import ChatBox from '../../../components/Socket/ChatBox';
import { socket } from '../../../Socket';
import { CHAT, STARTSUPPORTCHAT } from '../../../Api/Api';
import { toast } from 'react-toastify';
import { currentChat } from '../../../types/chat';
import { useQuery, useQueryClient } from 'react-query';
import { message } from '../../../types/messaging';

export default function Messenger() {
  const [currentChat, setCurrentChat] = useState<currentChat>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [stopPagination, setStopPagination] = useState<boolean>(false);
  const [loadingPrevMessages, setLoadingPrevMessages] =
    useState<boolean>(false);

  const chatboxRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const { loggedInUser } = useContext(UserContext);

  const queryClient = useQueryClient();

  const currentChatRef = useRef(currentChat);

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
  const {} = useQuery({
    queryFn: () => Axios.get('chat?chatWith=support&status=open'),
    queryKey: ['chat'],
    onSuccess: (data) => {
      setCurrentChat(data?.data?.chats[0]);
    },
  });

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
            chatboxRef.current?.querySelectorAll('.message-in-box')[20]
              .offsetTop - 50,
          )
        : chatboxRef.current?.scrollTo(0, chatboxRef.current.scrollHeight);
    });
  };

  // Open New Chat

  const handleOpenNewChat = async () => {
    setLoading(true);

    try {
      await Axios.post(`${CHAT}/${STARTSUPPORTCHAT}`);
      setConfirmOpen(true);
    } catch (err: any) {
      setConfirmOpen(false);
      console.log(err);
      if (err?.response.status === 400) {
        toast.error('You Already Have A Support Chat Opened');
      } else {
        toast.error('Something Went Wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  // Send Message In Chat

  const handleSubmit = async (message: string) => {
    const messageSend = {
      text: message,
    };

    const messageToShow: message = {
      _id: '',
      text: message,
      chatId: currentChat?._id,
      senderId: {
        _id: loggedInUser?._id || '',
        name: loggedInUser?.name || '',
      },
      createdAt: '',
    };
    addNewMessage(messageToShow);

    const receiverId = currentChat?.members[1]._id;

    socket.emit('sendMessage', {
      senderId: loggedInUser?._id,
      receiverId: receiverId,
      text: message,
      sentAt: '13/5/2022',
    });

    try {
      await Axios.post(`messages/${currentChat?._id}`, messageSend);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="messenger absolute z-99">
      <div className="chatMenu"></div>
      <ChatBox
        ref={chatboxRef}
        handleOpenNewChat={handleOpenNewChat}
        loading={loading}
        confirmOpen={confirmOpen}
        messages={messages?.data?.messages}
        currentChat={currentChat?.status}
        sendMessage={handleSubmit}
        messageLoading={messageLoader}
        loadingPrevMessages={loadingPrevMessages}
      />
    </div>
  );
}

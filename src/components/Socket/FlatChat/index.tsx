import { forwardRef, useContext, useEffect, useRef, useState } from 'react';
import { ChatSupportBox, currentChat } from '../../../types/chat';
import { UserContext } from '../../../Context/loggedInUser';
import { message } from '../../../types/messaging';
import { ChatLoader } from '../../ChatLoader';
import { MessageLoader } from '../../MessageLoader';
import { MdOutlineMarkChatRead } from 'react-icons/md';
import DeleteDialog from '../../DialogDelete/DialogDelete';
import { REALUSER } from '../../../Context/realUser';
import { Axios } from '../../../Api/axios';
import { useLocation } from 'react-router-dom';
import { RiAttachment2 } from 'react-icons/ri';
import { FaFileVideo } from 'react-icons/fa6';
import Image from 'react-graceful-image';

export const FlatChat = forwardRef<HTMLDivElement, ChatSupportBox>(
  (
    {
      loading,
      sendMessage,
      messages,
      currentChat,
      chats,
      addChats,
      setCurrentChat,
      messageLoading,
      handleCloseChat,
      closeLoading,
      isSuccess,
      loadingPrevMessages,
    },
    ref,
  ) => {
    const { loggedInUser } = useContext(UserContext);
    const { realUser } = useContext(REALUSER);
    const [newMessage, setNewMessage] = useState('');
    const [media, setMedia] = useState<File[]>([]);
    const mediaRef = useRef<HTMLInputElement>(null);
    const [showDialog, setShowDialog] = useState(false);
    const chatboxRef = useRef<HTMLDivElement>(null);

    const location = useLocation();
    const pathname = location.pathname;

    //   Getting More Chats When Moving Down

    useEffect(() => {
      const chats = chatboxRef.current as HTMLElement;
      let isFetching = false;
      let page = 1;
      let stopPagination = false;
      const handleScroll = async () => {
        if (
          chats?.scrollTop > chats?.scrollHeight - 10 &&
          !stopPagination &&
          !isFetching
        ) {
          isFetching = true;
          try {
            const res = Axios.get(
              `chat${
                pathname.includes('support') ? '?chatWith=support' : ''
              }?page=1&limit=2`,
            );
            const newChats = res.data.chats;
            if (newChats.length === 0) {
              stopPagination = true;
            } else {
              addChats(newChats);
              page += 1;
            }
          } catch (err) {
            console.log(err);
          } finally {
            setTimeout(() => {
              isFetching = false;
            }, 1000);
          }
        }
      };

      chats?.addEventListener('scroll', handleScroll);

      return () => {
        chats?.removeEventListener('scroll', handleScroll);
      };
    }, [chats]);

    useEffect(() => {
      isSuccess && setShowDialog(false);
    }, [isSuccess]);

    // Render Chats
    const showChats = chats?.map((chat: currentChat, key: number) => (
      <div
        key={key}
        className={`flex justify-start gap-3 hover:bg-gray w-full dark:bg-boxdark dark:border-strokedark ${
          chat?.status === 'closed' && 'opacity-50'
        } ${
          currentChat?._id === chat._id ? 'bg-gray' : ''
        } border-b border-[#eee] py-3 px-2 transition cursor-pointer relative`}
        onClick={() => setCurrentChat?.(chat)}
      >
        <div className="absolute right-0 me-5">
          {chat?.status === 'open' ? (
            (realUser === 'admin' || realUser === 'superAdmin') && (
              <MdOutlineMarkChatRead
                className="hover:text-black"
                onClick={() => setShowDialog(true)}
              />
            )
          ) : (
            <p className="text-danger">Closed</p>
          )}
        </div>

        <div className="">
          <svg
            className="w-10 h-10 me-3 text-gray-200 dark:text-gray-700"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
          </svg>
        </div>
        <div className="">
          <div className="text-lg font-semibold">
            {
              chat?.members.filter((user) => user._id !== loggedInUser?._id)[0]
                .name
            }
          </div>
          <span className="text-gray-500">
            {chat?.chatWith === 'teacher' ? 'Class Chat' : 'Help Chat'}
          </span>
        </div>
      </div>
    ));

    //   Render Messages

    const showMessages = messages
      ?.slice()
      ?.reverse()
      ?.map((message: message, key: number) => (
        <div key={key} className="flex flex-col mt-5 message">
          {message?.senderId?._id === loggedInUser?._id ? (
            <div className="flex flex-col gap-3 ms-auto w-36 mb-4 relative">
              <div className="bg-primary text-white rounded-lg py-2 px-4 inline-block">
                {message.text}
              </div>
              {message.media && message?.media.length > 0 && (
                <div className="flex items-center flex-wrap gap-2 w-36">
                  {message?.media?.map((med: any, key) =>
                    med.type === 'image' ? (
                      <Image src={med.url} width="300" height="300" />
                    ) : med.type === 'video' ? (
                      <a
                        href={med.url}
                        target="_blank"
                        className="bg-primary text-gray flex items-center w-100 ps-2 py-2 rounded-md"
                      >
                        <FaFileVideo />
                        <p className="text-sm">
                          Video
                          <span className="text-xs"> (click to open)</span>
                        </p>
                      </a>
                    ) : med.type.includes('image') ? (
                      <img src={URL.createObjectURL(med)} />
                    ) : med.type.includes('video') ? (
                      <video controls src={URL.createObjectURL(med)}>
                        <source
                          src={URL.createObjectURL(med)}
                          type={med.type}
                        />
                      </video>
                    ) : (
                      ''
                    ),
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3 me-auto w-36 mb-4">
              <div className="bg-gray text-gray-700 rounded-lg py-2 px-4 inline-block">
                {message.text}
              </div>
              {message.media && message?.media?.length > 0 && (
                <div className="flex items-center flex-wrap gap-2 w-36">
                  {message?.media?.map((med: any, key) =>
                    med.type === 'image' ? (
                      <Image src={med.url} width="300" height="300" />
                    ) : med.type === 'video' ? (
                      <a
                        href={med.url}
                        target="_blank"
                        className="bg-primary text-gray flex items-center w-100 ps-2 py-2 rounded-md"
                      >
                        <FaFileVideo />
                        <p className="text-sm">
                          Video
                          <span className="text-xs"> (click to open)</span>
                        </p>
                      </a>
                    ) : med.type.includes('image') ? (
                      <img src={URL.createObjectURL(med)} />
                    ) : med.type.includes('video') ? (
                      <video controls src={URL.createObjectURL(med)}>
                        <source
                          src={URL.createObjectURL(med)}
                          type={med.type}
                        />
                      </video>
                    ) : (
                      ''
                    ),
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ));

    return (
      <div className="mx-auto shadow-lg rounded-lg">
        <DeleteDialog
          onClose={() => setShowDialog(false)}
          onConfirm={() => handleCloseChat?.(currentChat?._id)}
          deleteLoading={closeLoading}
          showDialog={showDialog}
          title={'Close This Chat'}
          action={'Yes'}
        />
        <div className="flex flex-row justify-between bg-white dark:bg-boxdark dark:border-strokedark">
          <div
            className="flex flex-col overflow-auto h-[75vh] wrap w-2/5 border-r border-r-[#eee] dark:border-r-strokedark chat-side"
            ref={chatboxRef}
          >
            <div className="py-4 px-2">
              <input
                type="text"
                placeholder="search chatting"
                className="py-2 px-2 border border-[#eee] rounded-2xl w-full dark:bg-boxdark dark:border-strokedark"
              />
            </div>

            <div className="flex flex-col  justify-start">
              {loading ? (
                <>
                  <ChatLoader />
                  <ChatLoader />
                  <ChatLoader />
                  <ChatLoader />
                  <ChatLoader />
                  <ChatLoader />
                  <ChatLoader />
                  <ChatLoader />
                  <ChatLoader />
                </>
              ) : (
                showChats
              )}
            </div>
          </div>
          <div className="w-full">
            <div
              className="w-full justify-between overflow-y-auto relative  h-[75vh] px-5"
              ref={ref}
            >
              {loadingPrevMessages && (
                <p className="text-center text-black ">Loading...</p>
              )}
              {currentChat !== '' ? (
                messageLoading ? (
                  <MessageLoader />
                ) : (
                  showMessages
                )
              ) : (
                <p className="text-center mt-5">Click On Any Chat To Open</p>
              )}
            </div>

            <div className="w-full">
              {currentChat?.status !== 'closed' &&
              currentChat?.members?.some(
                (user) => user._id === loggedInUser?._id,
              ) ? (
                <div className="flex items-center">
                  <input
                    className="w-full px-3 py-2 border border-primary rounded-md focus:outline-none focus:primary"
                    type="text"
                    placeholder="type your message here..."
                    value={newMessage}
                    onChange={(e: any) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newMessage.length > 0) {
                        sendMessage(newMessage, media);
                        setMedia([]);
                        setNewMessage('');
                      }
                    }}
                  />
                  <div className="relative">
                    <input
                      type="file"
                      hidden
                      multiple
                      accept="image/*, video/*"
                      onChange={(e: any) => setMedia(e.target.files)}
                      ref={mediaRef}
                    />
                    {media.length > 0 && (
                      <p className="absolute -top-[10px] start-1/2 transform text-xs -translate-x-1/2 bg-primary w-[16px] text-center rounded-full text-white">
                        {media.length}
                      </p>
                    )}
                    <RiAttachment2
                      className="w-16"
                      fontSize={'1.8rem'}
                      onClick={() => mediaRef.current?.click()}
                    />
                  </div>
                </div>
              ) : !currentChat?.members?.some(
                  (user) => user._id === loggedInUser?._id,
                ) ? (
                <p className="text-danger text-center bg-white py-2">
                  You Can't Reply To This Chat
                </p>
              ) : (
                <p className="text-danger text-center bg-white py-2">
                  Chat Closed
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

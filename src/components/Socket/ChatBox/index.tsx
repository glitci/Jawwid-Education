import { useContext, useState, forwardRef, useEffect } from 'react';
import { FaFileVideo, FaRegMessage } from 'react-icons/fa6';
import { ChatSupportBox } from '../../../types/chat';

import DeleteLoader from '../../../common/DeleteLoader';
import { UserContext } from '../../../Context/loggedInUser';
import { message } from '../../../types/messaging';
import { MessageLoader } from '../../MessageLoader';
import Image from 'react-graceful-image';

const ChatBox = forwardRef<HTMLDivElement, ChatSupportBox>(
  (
    {
      handleOpenNewChat,
      loading,
      confirmOpen,
      sendMessage,
      messages,
      currentChat,
      messageLoading,
    },
    ref,
  ) => {
    const [openChat, setOpenChat] = useState<boolean>(false);
    const [openNewChat, setOpenNewChat] = useState<boolean>(false);
    const [newMessage, setNewMessage] = useState('');
    const { loggedInUser } = useContext(UserContext);

    useEffect(() => {
      ref.current?.scrollTo(0, ref?.current.scrollHeight);
    }, [openChat]);

    const showMessages = messages
      ?.slice()
      .reverse()
      .map((message: message, key) => (
        <div key={key} className="message-in-box">
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
        </div>
      ));

    return (
      <div>
        <div className="fixed bottom-0 right-0 mb-4 mr-6">
          <button
            id="open-chat"
            onClick={() => setOpenChat((prev) => !prev)}
            className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary transition duration-300 flex items-center"
          >
            <FaRegMessage fontSize={'25px'} />
          </button>
        </div>
        <div
          id="chat-container"
          className={`${!openChat && 'hidden'} fixed bottom-16 right-4 w-96`}
        >
          <div className="bg-white shadow-md rounded-lg max-w-lg w-full">
            <div className="p-4 border-b bg-primary text-white rounded-t-lg flex justify-between items-center">
              <p className="text-lg font-semibold">Admin Bot</p>
              <button
                id="close-chat"
                className="text-gray-300 hover:text-gray-400 focus:outline-none focus:text-gray-400"
                onClick={() => setOpenChat(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div id="chatbox" className="p-4 h-80 overflow-y-auto" ref={ref}>
              {messageLoading ? <MessageLoader /> : showMessages}
            </div>
            <div className="p-4 border-t flex">
              {(openNewChat && confirmOpen) || currentChat ? (
                <>
                  <input
                    id="user-input"
                    type="text"
                    placeholder="Type a message"
                    className="w-full px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newMessage}
                    onChange={(e: any) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newMessage.length > 0) {
                        sendMessage(newMessage);
                        setNewMessage('');
                      }
                    }}
                  />
                  <button
                    id="send-button"
                    className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-primary transition duration-300"
                    onClick={() => {
                      if (newMessage.length > 0) {
                        sendMessage(newMessage);
                        setNewMessage('');
                      }
                    }}
                  >
                    Send
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setOpenNewChat(true);
                    handleOpenNewChat?.();
                  }}
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-primary transition duration-300 w-100 flex items-center justify-center"
                >
                  {loading ? <DeleteLoader /> : 'New Chat'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export default ChatBox;

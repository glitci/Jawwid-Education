import { Dispatch, SetStateAction } from 'react';

export type ChatSupportBox = {
  confirmOpen?: boolean;
  loading: boolean;
  messageLoading?: boolean;
  handleOpenNewChat?: () => {};
  sendMessage: (e: any) => Promise<void>;
  messages: [];
  currentChat: boolean | currentChat | '';
  ref?: any;
  chats?: currentChat[];
  addChats?: (Chat: currentChat) => {};
  setCurrentChat?: Dispatch<SetStateAction<currentChat>>;
  handleCloseChat?: () => void;
  closeLoading?: boolean;
  isSuccess?: boolean;
  loadingPrevMessages: boolean;
};

export type chatMember = {
  _id: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
};

export type currentChat = {
  _id: string;
  members: chatMember[];
  status: 'open' | 'closed';
  createdAt: string;
  chatWith: 'admin' | 'teacher';
};

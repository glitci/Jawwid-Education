export type sender = {
  _id: string;
  name: string;
};

export type message = {
  _id: string;
  chatId: string;
  senderId: sender;
  text: string;
  media?: string[];
  createdAt: string;
};

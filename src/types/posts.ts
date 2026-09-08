export type post = {
  item: any;
  data?: [];
  deleteItem: (id: string) => {} | undefined;
  deleteLoading: boolean | undefined;
  comingOptions: any;
  handleAddLike: (id: string) => {} | undefined;
  isSuccess: boolean | undefined;
  index: number;
  isLoadingPost?: boolean;
  publishPost?: (id: string) => {} | undefined;
  publishLoading?: boolean;
};
export type createPost = {
  author: string;
  content: string;
  media: string | File;
  url?: string;
  visibleTo?: string;
};

export type notification = {
  message: string;
  postId: string;
  postOwner: string;
  scope?: string;
  userCommented: string;
  createdAt: string;
  relatedId?: string;
};

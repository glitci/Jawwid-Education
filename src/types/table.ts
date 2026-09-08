import React, { ReactElement } from 'react';
import { UseMutateAsyncFunction } from 'react-query';

export type TableColumn = {
  name: string;
  key: string;
};
export type TableRow = Record<string, any>;

export type FilterInput = {
  header: TableColumn;
  type: 'input' | 'select' | 'date';
  placeHolder: string;
  data?: string[];
  onChange?: (value: string) => void;
};

export type Options = {
  title: string;
  icon: ReactElement;
  fn?: () => void;
  show?: string;
  role?: 'student' | 'admin' | 'teacher';
};

export type OptionsMenuProps = {
  deleteItem?: (id: string) => void;
  cancelItem?: (id: string) => void;
  comingOptions?: Options[];
  deleteLoading?: boolean;
  id: any;
  role?: 'student' | 'admin' | 'teacher';
  isSuccess: boolean | undefined;
  path?: string;
  isActive?: boolean;
  classStatus?: 'trial' | 'scheduled' | 'ended' | 'cancled';
};

export type TableProps = {
  header: TableColumn[];
  data: TableRow[];
  ItemAdd?: string;
  multiClass?: boolean;
  limit: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  comingOptions?: Options[];
  filterInputs?: FilterInput[];
  isLoading?: boolean;
  isSuccess?: boolean | undefined;
  deleteItem?: (id: string) => void;
  cancelItem?: (id: string) => void;
  deleteLoading?: boolean;
  optionsExists?: boolean;
  changeStatus?: UseMutateAsyncFunction<string, unknown, void, unknown>;
  changeLoading?: boolean;
  changeSuccess?: boolean;
  totalPages?: number;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  handleSend: () => void;
  openChat?: (id: string) => void;
  handleRefetch?: (title: string) => void;
  handleClose: () => void;
  hideFilter?: boolean;
  hideOptions?: boolean;
  checkIn?: (id: string, link: string) => void;
  checkOut?: (id: string, link: string) => void;
  changeClass?: 'trial' | 'scheduled' | 'ended' | 'cancled';
};

export type CardViewProps = {
  header: TableColumn[];
  data: TableRow[];
  ItemAdd: string;
  limit: number;
  page: number;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
};

export type LMSHeaderProps = {
  ItemAdd: string;
  pageName: string;
  data: TableRow[];
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  limit: number;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  isLoading: boolean;
  deleteItem: () => {};
  comingOptions?: Options[];
  deleteLoading?: boolean;
  path: string;
  handleAddLike?: (id: string) => {};
  totalPages: number;
  isSuccess?: boolean;
  ref?: string;
  publishPost?: () => {};
  publishLoading?: boolean;
};

export type postsCard = {
  comingOptions?: Options[];
  deleteItem: () => {};
  deleteLoading?: boolean;
};

export type DeleteProps = {
  deleteLoading: boolean | undefined;
  isSuccess: boolean | undefined;
  deleteItem?: (id: string) => void;
  id: string;
};

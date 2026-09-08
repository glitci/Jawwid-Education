import { Options, TableColumn, TableRow } from './table';

export type cardLms = {
  data: TableRow[];
  header: TableColumn[];
  optionsMenu?: Options[];
  pageName: string;
};

export type course = {
  image: string;
  published: boolean;
  title: string;
  body: string;
  module: number;
  lesson: number;
  para: string;
};

export type createCourse = {
  image: string | File;
  title: string;
  summary: string;
  course_link: string;
};

export type product = {
  image: string;
  activated: boolean;
  title: string;
  body: string;
  course: number;
  free: boolean;
};

export type createProduct = {
  image: string | File;
  title: string;
  summary: string;
  productFile: string | File;
};

export type session = {
  number: number;
  period: number;
  startDate: string;
  studentNumber: number;
};
export type student = {
  name: string;
  email: string;
  enterTime: string;
};

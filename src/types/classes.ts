export type classes = {
  name: string;
  start_date: string;
  duration: string;
  start_time: string;
  classZoomLink: string;
};

export type createClass = {
  name: string;
  start_date: string;
  duration: string;
  start_time: string;
  teacher: string;
  students: string[];
};

export type myTasks = {
  id: number;
  priority: string;
  title: string;
  class: string;
  student: string;
  dueDate: string;
};

export type allTasks = {
  id: number;
  priority: string;
  title: string;
  class: string;
  student: string;
  dueDate: string;
};

export type questionsAndAnswers = {
  answer: string;
  question: string;
};

export type reports = {
  _id?: string;
  teacher?: { name: string };
  student: { name: string };
  month: string;
  questionsAndAnswers: questionsAndAnswers[];
};

export const Month = [
  { id: 'jan', name: 'January' },
  { id: 'feb', name: 'February' },
  { id: 'mar', name: 'March' },
  { id: 'apr', name: 'April' },
  { id: 'may', name: 'May' },
  { id: 'jun', name: 'June' },
  { id: 'jul', name: 'July' },
  { id: 'aug', name: 'August' },
  { id: 'sep', name: 'September' },
  { id: 'oct', name: 'October' },
  { id: 'nov', name: 'November' },
  { id: 'dec', name: 'December' },
];

export type student = {
  _id: string;
  name: string;
  email: string;
};

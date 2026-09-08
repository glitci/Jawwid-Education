export type createForm = {
  name: string;
  questions: string[];
};

export type QuestionForm = {
  title: string;
  type: 'checkbox' | 'radio' | 'select' | 'date' | 'textarea';
  options: [];
};

type Answer = {
  question: string;
  answer: string | number;
};

export type SubmissionData = {
  _id: string;
  formId: string;
  userName: string;
  userEmail: string;
  answers: Answer[];
  __v: number;
};

export type FormSubmission = {
  userName: string;
  userEmail: string;
  answers: Answer[];
};

export type users = {
  courses: [];
  products: [];
  remainingClasses: number;
  name: string;
  email: string;
  phone: string | number;
  role: string;
  account_status: 'pending' | 'confirmed';
  active: boolean;
  createdAt: string;
  passwordChangedAT: string;
  enabledControls?: [];
  _id?: string;
  zoom_account_id: string;
  zoom_client_Secret: string;
  zoom_client_id: string;
};

export type createUserType = {
  name: string;
  email: string;
  password?: any;
  phone: string | number;
  role?: 'admin' | 'teacher' | 'student';
  zoom_account_id: string;
  zoom_client_Secret: string;
  zoom_client_id: string;
  zoom_credentials?: boolean;
};

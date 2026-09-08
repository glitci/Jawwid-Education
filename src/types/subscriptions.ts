export type Price = {
  currency: string;
  amount: number;
};

export type createPackage = {
  title: string;
  prices: Price[];
  classesNum: number;
  visibleTo: [];
};

export type confirmBank = {
  referenceNum?: string;
  student: string;
  amountReceived: number | string;
  currency: string;
  packageId: string;
  subscription_start: string;
  subscription_end: string;
};

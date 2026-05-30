export type Crop = {
  id: string;
  name: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'closed';
};

export type Expense = {
  id: string;
  cropId: string;
  category: string;
  amount: number;
  date: string;
  note?: string;
};

export type Income = {
  id: string;
  cropId: string;
  amount: number;
  date: string;
  category: string;
  note?: string;
};

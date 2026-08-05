export interface Income {
  id?: string;
  date: string;
  title: string;
  amount: number;
  createdAt: number;
}

export interface Savings {
  id?: string;
  userId: string;
  title: string;
  amount: number;
  date: string;
  createdAt: number;
}

export interface Investment {
  id?: string;
  date: string;
  title: string;
  investmentAmount: number;
  returnAmount: number;
  createdAt: number;
}

export interface YearlySaving {
  id?: string;
  date: string;
  title: string;
  amount: number;
  returnRate: number;
  totalAmount: number;
  createdAt: number;
}

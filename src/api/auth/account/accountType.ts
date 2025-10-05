export type FindPasswordRequest = {
  email: string;
};

export type FindPasswordResponse = void;

export type FindAccountRequest = {
  phone_number: string;
};

export type AccountInfo = {
  id: number;
  email: string;
  login_type: 'email' | 'google';
};

export type FindAccountResponse = {
  accounts: AccountInfo[];
};

export type SnsLoginRequest = {
  code: string;
  phone_number: string;

  provider: string;
};

export type SnsLoginSuccessResponse = {
  first_login: boolean;
  access_token: string;
  refresh_token: string;
};

export type SnsLoginErrorResponse = {
  error_code: string;
  message: string;
  detail?: {
    description: string;
  };
};

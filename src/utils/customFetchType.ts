export type ResponseType<T> = {
  contents: T;
};

export type ErrorType = {
  code: number;
  message: string;
};

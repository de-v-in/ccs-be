interface IResponse<T = {}> {
  status?: "success" | "warning" | "error";
  errorCode?: 0 | 1 | -1;
  errorMessage?: string;
  data?: T;
}

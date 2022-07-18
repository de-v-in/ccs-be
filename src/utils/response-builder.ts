class ResponseBuilder<T = {}> {
  data: T;
  output: IResponse;

  constructor(data: T) {
    this.data = data;
    this.output = { data };
  }

  success(msg = "API run successfully") {
    this.output.status = "success";
    this.output.errorCode = 0;
    this.output.errorMessage = msg;
    return this;
  }
  warning(msg = "Smothing wrong") {
    this.output.status = "warning";
    this.output.errorCode = 1;
    this.output.errorMessage = msg;
    return this;
  }
  error(msg = "API is crashed") {
    this.output.status = "error";
    this.output.errorCode = -1;
    this.output.errorMessage = msg;
    return this;
  }
  build() {
    return this.output;
  }
}

export { ResponseBuilder };

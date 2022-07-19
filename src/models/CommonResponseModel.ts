import { Property } from "@tsed/schema";

export class CommonResponseModel<T> {
  @Property()
  result: T;
}

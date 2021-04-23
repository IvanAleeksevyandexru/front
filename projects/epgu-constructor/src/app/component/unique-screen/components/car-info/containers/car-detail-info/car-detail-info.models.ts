import { ServiceResult } from '../../models/car-info.interface';

export interface CarDetailInfo<T> {
  data: T;
  externalServiceCallResult: ServiceResult;
}

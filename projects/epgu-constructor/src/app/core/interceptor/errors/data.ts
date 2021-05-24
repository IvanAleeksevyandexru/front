import { FormPlayerApiSuccessResponse } from 'epgu-constructor-types';

export function instanceOfFormPlayerApiSuccessResponse(
  obj: object,
): obj is FormPlayerApiSuccessResponse {
  return 'scenarioDto' in obj;
}

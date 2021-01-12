import { PassportFormFields } from '../../../../shared/components/add-passport/passport.interface';

export interface Passport {
  isValid: boolean;
  value: PassportFormFields;
}

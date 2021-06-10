import { Clarifications } from '@epgu/epgu-constructor-types';

export interface Project {
  projectId: number;
  name: string;
  description: string;
  organization: string;
  image: string;
  address: string;
  ageLimit: string;
  freeTrainingPossible?: string;
  paidTrainingPossible?: string;
  PaymentByCertificatePossible?: string;
  groupSize?: string;
  teacher?: string;
  schedule?: string;
  period?: string;
  budgetProgramOther?: string;
  budgetProgramPreProf?: string;
  budgetProgramSignificant?: string;
  distanceLearning: string;
  additional?: string;
  clarifications?: Clarifications;
}

export interface Group {
  groupId: number;
  projectId: number;
  name: string;
  address: string;
  schedule: string;
  period: string;
  ageLimit: string;
  maxSize: string;
  price: string;
  payTypes: string[];
}

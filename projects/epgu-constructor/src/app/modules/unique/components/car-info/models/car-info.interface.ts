export type LegalInfo = 'PLEDGED' | 'WANTED' | 'RESTRICTIONS';
export type OwnerType = 'INDIVIDUAL' | 'LEGAL_ENTITY';
export type StatusType = 'REGISTERED' | 'NOT_REGISTERED' | 'REMOVED' | 'SUSPENDED';

interface Legal {
  name: LegalInfo;
  value: boolean;
}

export interface TenureDates {
  from: number;
  to: number;
}

interface Owner {
  ownerType: OwnerType;
  tenure: TenureDates;
}

export interface CarInfoValues {
  legals: Legal[];
  brandModel: string;
  owners: Owner[];
  accidenceCount: number;
  status: StatusType;
}

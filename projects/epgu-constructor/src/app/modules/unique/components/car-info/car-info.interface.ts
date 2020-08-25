type LegalInfo = 'pledged' | 'wanted' | 'restrictions';

interface Legal {
  name: LegalInfo;
  value: boolean;
}

export interface CarInfoValues {
  legal: Legal[] | null;
  brandModel: string | null;
  owners: string[] | null;
  accidents: string | null;
}

export interface IFilters {
  filters: { items: string[]; type: string };
}

export interface IResponse {
  services: IServiceItem[];
  totalServices: number;
  totalComponents: number;
}

export interface IServiceItem {
  serviceId: string;
  components: IComponentItem[];
}

export interface IComponentItem {
  componentType: string;
  amount: number;
}

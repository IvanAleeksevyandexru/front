import { Injectable } from '@angular/core';
import { LocalStorageService, LocationService } from '@epgu/epgu-constructor-ui-kit';

export interface FilterParams{}

@Injectable({
  providedIn: 'root',
})
export class FilterPanelStorageService {
  constructor(private localStorage: LocalStorageService, private location: LocationService) {}

  save(filterParams: Partial<FilterParams>): void {
    const storageName = this.location.path();
    const storage = JSON.parse(this.localStorage.getRaw(storageName) || '{}');
    const params = { ...storage, ...filterParams };
    this.localStorage.setRaw(storageName, JSON.stringify(params));
  }

  get(): FilterParams {
    const storageName = this.location.path();
    const storage = this.localStorage.getRaw(storageName);
    return JSON.parse(storage);
  }

  reset(): void {
    const storageName = this.location.path();
    this.localStorage.delete(storageName);
  }
}

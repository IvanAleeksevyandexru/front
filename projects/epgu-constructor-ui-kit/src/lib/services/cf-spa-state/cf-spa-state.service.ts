import { Injectable } from '@angular/core';
import {
  InputAppDto,
  OutputAppDto,
  SPA_INPUT_KEY,
  SPA_OUTPUT_KEY,
  DataDirectionType
} from '@epgu/epgu-constructor-types';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable()
export class CfSpaStateService {
  constructor (private localStorageService: LocalStorageService) {}

  public setState<T extends InputAppDto | OutputAppDto>(state: T, spaDataDirectionType: DataDirectionType): void {
    const key = this.getKey(spaDataDirectionType);
    this.localStorageService.set(key, state);
  }

  public  getState<T extends InputAppDto | OutputAppDto>(spaDataDirectionType: DataDirectionType): T {
    const key = this.getKey(spaDataDirectionType);
    const state = this.localStorageService.get<T>(key);
    this.localStorageService.delete(key);
    return state;
  }

  private getKey(spaDataDirectionType: DataDirectionType): string {
    return spaDataDirectionType === DataDirectionType.INPUT ? SPA_INPUT_KEY : SPA_OUTPUT_KEY;
  }
}

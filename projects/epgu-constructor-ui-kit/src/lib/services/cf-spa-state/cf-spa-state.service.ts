import { Injectable } from '@angular/core';
import {
  InputSpaDto,
  OutputSpaDto,
  SPA_INPUT_KEY,
  SPA_OUTPUT_KEY,
  SpaDataDirectionType
} from '@epgu/epgu-constructor-types';
import { LocalStorageService } from '../local-storage';

@Injectable()
export class CfSpaStateService {
  constructor (private localStorageService: LocalStorageService) {}

  public setState<T extends InputSpaDto | OutputSpaDto>(state: T, spaDataDirectionType: SpaDataDirectionType): void {
    const key = this.getKey(spaDataDirectionType);
    this.localStorageService.set(key, state);
  }

  public  getState<T extends InputSpaDto | OutputSpaDto>(spaDataDirectionType: SpaDataDirectionType): T {
    const key = this.getKey(spaDataDirectionType);
    const state = this.localStorageService.get<T>(key);
    this.localStorageService.delete(key);
    return state;
  }

  private getKey(spaDataDirectionType: SpaDataDirectionType): string {
    return spaDataDirectionType === SpaDataDirectionType.INPUT ? SPA_INPUT_KEY : SPA_OUTPUT_KEY;
  }
}

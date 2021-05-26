import { Injectable } from '@angular/core';
import { InputSpaDto, OutputSpaDto, SpaDataDirectionType, SpaType } from '@epgu/epgu-constructor-types';
import { LocalStorageService } from '../local-storage';

@Injectable()
export class CfSpaStateService {
  constructor (private localStorageService: LocalStorageService) {}

  public setState(state: InputSpaDto | OutputSpaDto, spaType: SpaType, spaDataDirectionType: SpaDataDirectionType): void {
    const key = this.getKey(spaType, spaDataDirectionType);
    this.localStorageService.set(key, state);
  }

  public  getState<T>(spaType: SpaType, spaDataDirectionType: SpaDataDirectionType): T {
    const key = this.getKey(spaType, spaDataDirectionType);
    const state = this.localStorageService.get<T>(key);
    this.localStorageService.delete(key);
    return state;
  }

  private getKey(spaType: SpaType, spaDataDirectionType: SpaDataDirectionType): string {
    return `${spaType}_${spaDataDirectionType}`;
  }
}

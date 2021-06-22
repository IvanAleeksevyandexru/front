import { Injectable, isDevMode } from '@angular/core';
import {
  InputAppDto,
  OutputAppDto,
  DataDirectionType,
  APP_INPUT_KEY,
  APP_OUTPUT_KEY,
} from '@epgu/epgu-constructor-types';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable()
export class CfAppStateService {
  constructor (private localStorageService: LocalStorageService) {}

  public setState<T extends InputAppDto | OutputAppDto>(state: T, spaDataDirectionType: DataDirectionType): void {
    const key = this.getKey(spaDataDirectionType);
    this.localStorageService.set(key, state);
  }

  public  getState<T extends InputAppDto | OutputAppDto>(spaDataDirectionType: DataDirectionType): T {
    const key = this.getKey(spaDataDirectionType);
    const state = this.localStorageService.get<T>(key);

    if (!isDevMode() || key === APP_OUTPUT_KEY ) {
      this.localStorageService.delete(key);
    }
    return state;
  }

  private getKey(spaDataDirectionType: DataDirectionType): string {
    return spaDataDirectionType === DataDirectionType.INPUT ? APP_INPUT_KEY : APP_OUTPUT_KEY;
  }
}

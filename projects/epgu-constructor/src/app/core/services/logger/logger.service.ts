import { Injectable, isDevMode } from '@angular/core';
import {
  FormPlayerApiResponse,
  ScenarioErrorsDto
} from '../../../form-player/services/form-player-api/form-player-api.types';
import { NavigationPayload } from '../../../form-player/form-player.types';

export const KEY_SHOW_LOG = 'SHOW_LOG';
export type LoggerMessageTypes = string | FormPlayerApiResponse | ScenarioErrorsDto | NavigationPayload;

@Injectable()
export class LoggerService {
  log(messages: Array<LoggerMessageTypes>, groupName: string = null): void {
    if(this.isShowLog()) {
      if (groupName) {
        this.openGroup(groupName);
      }

      messages.forEach(this.showMessage);

      if (groupName) {
        this.closeGroup();
      }
    }
  }

  error(messages: Array<LoggerMessageTypes>, groupName: string = null): void {
    if(this.isShowLog()) {
      if (groupName) {
        this.openGroup(groupName);
      }

      messages.forEach(this.showError);

      if (groupName) {
        this.closeGroup();
      }
    }
  }

  private isShowLog(): boolean {
    return isDevMode() || !!localStorage.getItem(KEY_SHOW_LOG);
  }

  private showMessage(message: string): void {
    console.log(message);
  }

  private showError(message: string): void {
    console.error(message);
  }

  private openGroup(groupName: string): void {
    console.group(groupName);
  }

  private closeGroup(): void {
    console.groupEnd();
  }
}

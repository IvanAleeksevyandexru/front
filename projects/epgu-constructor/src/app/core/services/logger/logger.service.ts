import { Injectable, isDevMode } from '@angular/core';

export const KEY_SHOW_LOG = 'SHOW_LOG';

@Injectable()
export class LoggerService {
  log(messages: Array<any>, groupName: string = null): void {
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

  error(messages: Array<any>, groupName: string = null): void {
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

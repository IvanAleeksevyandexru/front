import { Injectable, isDevMode } from '@angular/core';

export const KEY_SHOW_LOG = 'SHOW_LOG';

@Injectable()
export class LoggerService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log(messages: any[], groupName: string = null): void {
    if (this.isShowLog()) {
      if (groupName) {
        this.openGroup(groupName);
      }

      messages.forEach(this.showMessage);

      if (groupName) {
        this.closeGroup();
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(messages: any[], groupName: string = null): void {
    if (groupName) {
      this.openGroup(groupName);
    }

    messages.forEach(this.showError);

    if (groupName) {
      this.closeGroup();
    }
  }

  private isShowLog(): boolean {
    return isDevMode() || !!localStorage.getItem(KEY_SHOW_LOG);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private showMessage(message: any): void {
    console.log(message);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private showError(message: any): void {
    console.error(message);
  }

  private openGroup(groupName: string): void {
    console.group(groupName);
  }

  private closeGroup(): void {
    console.groupEnd();
  }
}

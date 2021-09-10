import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Navigation } from '../../../form-player/form-player.types';

@Injectable()
export class NavigationServiceStub {
  private nextStep = new Subject<Navigation>();
  nextStep$ = this.nextStep.asObservable();
  private prevStep = new Subject<Navigation>();
  prevStep$ = this.prevStep.asObservable();
  private skipStep = new Subject<Navigation>();
  skipStep$ = this.skipStep.asObservable();
  private saveCacheToDraft = new Subject<Navigation>();
  saveCacheToDraft$ = this.saveCacheToDraft.asObservable();
  private restart = new Subject<Navigation>();
  restartOrder$ = this.restart.asObservable();
  private patchStepOnCli = new Subject<Navigation>();
  patchStepOnCli$ = this.patchStepOnCli.asObservable();

  next(navigation?: Navigation): void {
    this.nextStep.next(navigation);
  }

  prev(navigation?: Navigation): void {
    this.prevStep.next(navigation);
  }

  saveCache(navigation?: Navigation): void {
    this.saveCacheToDraft.next(navigation);
  }

  skip(navigation?: Navigation): void {
    this.skipStep.next(navigation);
  }

  restartOrder(navigation?: Navigation): void {
    this.restart.next(navigation);
  }

  patchOnCli(navigation?: Navigation): void {
    this.patchStepOnCli.next(navigation);
  }

  redirectToLK(): void {}

  redirectToLKByOrgType(): void {}

  redirectToProfileEdit(): void {}

  redirectToHome(): void {}

  redirectTo(): void { }

  redirectExternal(): void { }
}

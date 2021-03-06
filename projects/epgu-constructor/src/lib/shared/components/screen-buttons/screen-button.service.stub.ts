import { Injectable } from '@angular/core';
import { CustomListStatusElements } from '../../../component/custom-screen/components-list.types';
import { FormArray, FormControl } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { ScreenButton, System } from '@epgu/epgu-constructor-types';
import { DeviceDetectorService } from '@epgu/epgu-constructor-ui-kit';
import { tap } from 'rxjs/operators';

@Injectable()
export class ScreenButtonServiceStub {
  private _outputButtons = new BehaviorSubject<ScreenButton[]>([]);

  private _subscriptionOnInnerFormForDisabling: FormArray = new FormArray([new FormControl({})]);

  private readonly clientSystem: System = this.deviceDetectorService.system;

  constructor(private deviceDetectorService: DeviceDetectorService) {}

  private set outputButtons(buttons: ScreenButton[]) {
    const filteredButtons = buttons.filter((screenButton) => {
      const showOnOS = screenButton.attrs?.showOnOS;
      return !showOnOS || showOnOS.includes(this.clientSystem);
    });
    this._outputButtons.next(filteredButtons);
  }

  get subscriptionOnInnerFormForDisablingChanges(): Observable<ScreenButton[]> {
    return this._subscriptionOnInnerFormForDisabling.valueChanges;
  }

  get outputButtons$(): Observable<ScreenButton[]> {
    return this._outputButtons.asObservable();
  }

  get outputButtons(): ScreenButton[] {
    return this._outputButtons.getValue();
  }

  public initSubscribeOnComponentsForm(
    form: FormArray,
    shownElements: CustomListStatusElements,
  ): void {}

  public clear(): void {}

  public initButtonsDisablingHandling(buttons: ScreenButton[]): void {
    this.outputButtons = buttons;
  }
}

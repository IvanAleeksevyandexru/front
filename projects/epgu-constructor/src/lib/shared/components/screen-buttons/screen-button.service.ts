import { Injectable } from '@angular/core';
import { ComponentsListRelationsService } from '../../../component/custom-screen/services/components-list-relations/components-list-relations.service';
import { ScreenService } from '../../../screen/screen.service';
import { CustomListStatusElements } from '../../../component/custom-screen/components-list.types';
import { FormArray, FormControl } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { ScreenButton, System } from '@epgu/epgu-constructor-types';
import { DeviceDetectorService } from '@epgu/epgu-constructor-ui-kit';

import { isEqual } from 'lodash';
import { tap } from 'rxjs/operators';

@Injectable()
export class ScreenButtonService {
  private _shownElements: CustomListStatusElements = {};

  private _outputButtons = new BehaviorSubject<ScreenButton[]>([]);

  private _subscriptionOnInnerFormForDisabling: FormArray = new FormArray([new FormControl({})]);

  private readonly clientSystem: System = this.deviceDetectorService.system;

  constructor(
    private rel: ComponentsListRelationsService,
    private screenService: ScreenService,
    private deviceDetectorService: DeviceDetectorService,
  ) {}

  get outputButtons$(): Observable<ScreenButton[]> {
    return this._outputButtons.asObservable();
  }

  get outputButtons(): ScreenButton[] {
    return this._outputButtons.getValue();
  }

  get subscriptionOnInnerFormForDisablingChanges(): Observable<ScreenButton[]> {
    return this._subscriptionOnInnerFormForDisabling.valueChanges.pipe(
      tap(() => this.processButtonsDisabling()),
    );
  }

  private set outputButtons(buttons: ScreenButton[]) {
    const filteredButtons = buttons.filter((screenButton) => {
      const showOnOS = screenButton.attrs?.showOnOS;
      return !showOnOS || showOnOS.includes(this.clientSystem);
    });
    this._outputButtons.next(filteredButtons);
  }

  public initSubscribeOnComponentsForm(
    form: FormArray,
    shownElements: CustomListStatusElements,
  ): void {
    this._shownElements = shownElements;
    this.processButtonsVisibility(form);
    form.valueChanges.subscribe(() => {
      this.processButtonsVisibility(form);
    });
  }

  public clear(): void {
    this.outputButtons = [];
  }

  public initButtonsDisablingHandling(buttons: ScreenButton[]): void {
    if (!isEqual(buttons, this.outputButtons)) {
      this.outputButtons = buttons;
    }
    this.processButtonsDisabling();
  }

  private processButtonsDisabling(): void {
    let shouldUpdate = false;
    this.outputButtons.forEach((button) => {
      const disabledByRel = this.rel.calculateDisabling(
        button,
        this.screenService.cachedAnswers,
        this._subscriptionOnInnerFormForDisabling,
      );
      if (button.disabledByRel !== disabledByRel || button.disabledByRel === undefined) {
        shouldUpdate = true;
      }

      if (disabledByRel !== undefined) {
        button.disabledByRel = disabledByRel;
      }
      if (shouldUpdate) {
        this.updateButtons(this.outputButtons);
      }
    });
  }

  private updateButtons(buttons: ScreenButton[]): void {
    this.outputButtons = buttons.map((button) => {
      return { ...button };
    });
  }

  private processButtonsVisibility(form: FormArray): void {
    const initialButtons = this.outputButtons.length
      ? this.outputButtons
      : this.screenService.buttons;

    const buttonsForProcessing = initialButtons.filter((button) => button.id);
    const shownButtons = this.rel.calculateVisibility(
      buttonsForProcessing,
      this.screenService.cachedAnswers,
      form,
      this._shownElements,
    );
    let shouldUpdate = false;
    initialButtons.forEach((button) => {
      const hidden = shownButtons && shownButtons[button.id] && !shownButtons[button.id].isShown;
      if (button.hidden !== hidden || button.hidden === undefined) {
        shouldUpdate = true;
      }
      if (hidden !== undefined) {
        button.hidden = hidden;
      }
    });
    if (shouldUpdate) {
      this.updateButtons(initialButtons);
    }
  }
}

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { takeUntil, tap } from 'rxjs/operators';
import {
  FocusManagerService,
  OPTIONAL_FIELD,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';
import { FocusState } from '@epgu/ui/services/focus';
import {
  CustomComponent,
  CustomComponentAttrValidation,
  CustomScreenComponentTypes,
  UpdateOn,
} from '../../components-list.types';
import { Clarifications } from '@epgu/epgu-constructor-types';

@Component({
  selector: 'epgu-constructor-component-item',
  templateUrl: './component-item.component.html',
  styleUrls: ['./component-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class ComponentItemComponent implements OnInit, OnChanges {
  @Input() control: AbstractControl;
  @Input() component: CustomComponent;
  @Input() invalid: boolean;
  @Input() disableLabel = false;
  @Input() disableError = false;
  @Input() disableHint = false;
  @Input() largeFontSize = false;
  @Input() clarifications?: Clarifications;

  readonly componentType = CustomScreenComponentTypes;
  public isHelperTextVisible = false;
  public hint: string;
  public customUnRecLabel: string;
  public hasInfo = false;
  public hasErrors = false;
  public hasUiError = false;
  public hasServerError = false;
  public isShowErrors = true;
  public lastError = {
    msg: '',
    desc: '',
  };

  public constructor(
    private focusManager: FocusManagerService,
    private unsubscribe$: UnsubscribeService,
    private cdr: ChangeDetectorRef,
  ) {}

  public checkShowErrors(state: FocusState): void {
    const isAnotherControlFocused = state?.current?.name !== this.component.id;
    if (isAnotherControlFocused) {
      this.isShowErrors = this.hasUiError;
      this.updateError();
    }
    this.cdr.markForCheck();
  }

  public ngOnInit(): void {
    /**
     * По умолчанию ошибки должны отображаться также как при change(Сделано для того - если у компонента нет поддержки фокуса)
     * Если в момент фокуса нет ошибок то скрываем ошибки
     * Если blur - показываем ошибки
     *
     * */
    this.focusManager
      .stateComponent$(this.component.id)
      .pipe(
        tap(() => this.setState()),
        tap((state) => this.checkShowErrors(state)),
        takeUntil(this.unsubscribe$),
      )
      .subscribe();
    this.setState();
  }

  public ngOnChanges(): void {
    this.setState();
  }

  private updateError(): void {
    this.lastError = {
      msg: this.control.getError('msg'),
      desc: this.control.getError('desc'),
    };
  }

  private setState(): void {
    this.checkItemHasErrors();
    this.setHints();
    this.setHelperTextVisibility();
    this.checkItemHasInfo();
  }

  private checkItemHasErrors(): void {
    this.hasUiError =
      this.control.invalid && (this.control.touched || this.control.value)
        ? this.control.hasError('msg')
        : false;
    this.hasServerError = this.control.hasError('serverError');
    this.hasErrors = !this.disableError && (this.hasUiError || this.hasServerError);
    if (this.getFirstUpdateOn() === UpdateOn.ON_CHANGE) {
      this.isShowErrors = this.hasUiError;
      this.updateError();
    }
  }

  private getFirstUpdateOn(): UpdateOn {
    const validations = this.component.attrs?.validation || [];

    const ruleWithUpdateOn = validations.find(
      (validation: CustomComponentAttrValidation) => !!validation.updateOn,
    );

    return ruleWithUpdateOn ? ruleWithUpdateOn.updateOn : UpdateOn.ON_CHANGE;
  }

  private checkItemHasInfo(): void {
    this.hasInfo = !this.disableHint && (this.isHelperTextVisible || !!this.hint);
  }

  private setHints(): void {
    this.hint = this.component?.attrs?.hint;
    this.customUnRecLabel =
      this.component?.attrs?.customUnrecLabel || this.component?.attrs?.labelHint || OPTIONAL_FIELD;
  }

  private setHelperTextVisibility(): void {
    const isNotCheckBox = this.component?.type !== this.componentType.CheckBox;
    const isNotRequired = !this.component?.required;
    this.isHelperTextVisible =
      ((isNotRequired && isNotCheckBox) || !!this.component?.attrs?.labelHint) &&
      !!this.customUnRecLabel;
  }
}

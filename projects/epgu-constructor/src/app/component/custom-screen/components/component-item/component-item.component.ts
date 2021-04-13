import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { takeUntil, tap } from 'rxjs/operators';
import { FocusState } from 'epgu-lib';
import { OPTIONAL_FIELD } from '../../../../shared/constants/helper-texts';
import { CustomComponent, CustomScreenComponentTypes } from '../../components-list.types';
import { FocusManagerService } from '../../../../core/focus-manager/focus-manager.service';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';

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

  readonly componentType = CustomScreenComponentTypes;
  public isHelperTextVisible = false;
  public hint: string;
  public customUnRecLabel: string;
  public hasInfo = false;
  public hasErrors = false;
  public hasUiError = false;
  public hasServerError = false;
  public isShowErrors = true;
  constructor(
    private focusManager: FocusManagerService,
    private unsubscribe$: UnsubscribeService,
  ) {}

  checkShowErrors(state: FocusState): void {
    this.isShowErrors = !(state?.current?.name === this.component.id && !this.hasUiError);
  }

  ngOnInit(): void {
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

  ngOnChanges(): void {
    this.setState();
  }

  private setState(): void {
    this.checkItemHasErrors();
    this.setHints();
    this.setHelperTextVisibility();
    this.checkItemHasInfo();
  }

  private checkItemHasErrors(): void {
    this.hasUiError =
      this.control.invalid && this.control.touched ? this.control.hasError('msg') : false;
    this.hasServerError = this.control.hasError('serverError');
    this.hasErrors = !this.disableError && (this.hasUiError || this.hasServerError);
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

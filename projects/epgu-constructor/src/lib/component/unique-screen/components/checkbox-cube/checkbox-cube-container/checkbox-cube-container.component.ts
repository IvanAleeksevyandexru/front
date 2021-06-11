import {
  Component,
  ChangeDetectionStrategy,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { takeUntil, tap } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { ComponentDto } from '@epgu/epgu-constructor-types';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../../../screen/screen.service';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import { NEXT_STEP_ACTION } from '../../../../../shared/constants/actions';
import {
  Checkbox,
  CheckboxCubeComponentAttrsDto,
  CubeElement,
} from '../models/checkbox-cube.interface';

@Component({
  selector: 'epgu-constructor-checkbox-cube-container',
  templateUrl: './checkbox-cube-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxCubeContainerComponent implements AfterViewInit {
  nextStepAction = NEXT_STEP_ACTION;
  checkboxCubeForm: FormGroup;
  checkboxes: Checkbox[];
  required: boolean;
  component$: Observable<ComponentDto> = this.screenService.component$.pipe(
    tap((component: ComponentDto) => {
      this.init(component);
    }),
  );

  constructor(
    public screenService: ScreenService,
    public currentAnswersService: CurrentAnswersService,
    private fb: FormBuilder,
    private ngUnsubscribe$: UnsubscribeService,
    private changeDetection: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    this.subscribeFormChanges();
    this.changeDetection.detectChanges();
  }

  private subscribeFormChanges(): void {
    this.checkboxCubeForm.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((change) => this.setState(change));
  }

  private init(component: ComponentDto): void {
    const { cubeElements } = <CheckboxCubeComponentAttrsDto>component.attrs;
    this.required = component.required;

    this.checkboxes = this.getCheckboxes(cubeElements);

    this.initForm(
      component.valueFromCache ? this.getPresetCubeElements(component, cubeElements) : cubeElements,
    );

    this.setState(this.checkboxCubeForm.value);
  }

  private getPresetCubeElements(
    component: ComponentDto,
    cubeElements: { [p: string]: CubeElement },
  ): { [id: string]: CubeElement } {
    const value = JSON.parse(component.value);

    return Object.entries(cubeElements).reduce(
      (presetCubeElements, [id, cubeElement]) => ({
        ...presetCubeElements,
        [id]: { ...cubeElement, value: value[id].value },
      }),
      {},
    );
  }

  private isValid(): boolean {
    return !this.required || Object.values(this.checkboxCubeForm.value).some((value) => !!value);
  }

  private getCheckboxes(cubeElements: { [p: string]: CubeElement }): Checkbox[] {
    return Object.entries(cubeElements).map<Checkbox>(([id, cubeElement]) => ({
      id,
      label: cubeElement.label,
    }));
  }

  private initForm(cubeElements: { [id: string]: CubeElement }): void {
    const formGroup = Object.entries(cubeElements).reduce((form, [id, cubeElement]) => {
      const control = new FormControl({ value: cubeElement.value, disabled: false });
      return { ...form, [id]: control };
    }, {});

    this.checkboxCubeForm = this.fb.group(formGroup);
  }

  private setState(change: { [id: string]: boolean }): void {
    this.currentAnswersService.state = Object.entries(change).reduce((state, [id, value]) => {
      return { ...state, [id]: { value } };
    }, {});
    this.currentAnswersService.isValid = this.isValid();
  }
}
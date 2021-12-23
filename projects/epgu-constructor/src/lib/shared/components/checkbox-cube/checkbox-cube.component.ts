import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';

import {
  Clarifications,
  ComponentAttrsDto,
  ComponentDto,
  CubeElements,
} from '@epgu/epgu-constructor-types';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';

import BaseModel from '../../../component/custom-screen/component-list-resolver/BaseModel';

@Component({
  selector: 'epgu-constructor-checkbox-cube',
  templateUrl: './checkbox-cube.component.html',
  styleUrls: ['./checkbox-cube.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxCubeComponent implements OnInit {
  @Input() clarifications: Clarifications;
  @Input() component: ComponentDto | BaseModel<ComponentAttrsDto>;
  @Input() label: string;
  @Input() required: boolean;
  @Output() changed = new EventEmitter();

  public checkboxCubeForm: FormGroup;
  public cubeElements: CubeElements;
  public checkboxIds: string[];

  constructor(private fb: FormBuilder, private ngUnsubscribe$: UnsubscribeService) {}

  public ngOnInit(): void {
    this.init();
    this.subscribeFormChanges();
  }

  private init(): void {
    const { cubeElements } = this.component.attrs;

    this.checkboxIds = Object.keys(cubeElements);
    this.cubeElements = this.component.valueFromCache
      ? this.getPresetCubeElements(cubeElements)
      : cubeElements;

    this.initForm();
  }

  private subscribeFormChanges(): void {
    this.checkboxCubeForm.valueChanges.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((changes) => {
      const processedChanges = {};
      this.checkboxIds.forEach((checkboxId) => {
        processedChanges[checkboxId] = {
          value: changes[checkboxId],
        };
      });

      this.changed.emit({
        changes: processedChanges,
        isValid: this.isValid,
      });
    });
  }

  private getPresetCubeElements(cubeElements: CubeElements): CubeElements {
    const value = JSON.parse(this.component.value);
    const presetCubeElements = {};
    this.checkboxIds.forEach((checkboxId) => {
      presetCubeElements[checkboxId] = {
        label: cubeElements[checkboxId].label,
        value: value[checkboxId].value,
      };
    });

    return presetCubeElements;
  }

  private initForm(): void {
    const formGroup = {};
    const initialValues = {};
    this.checkboxIds.forEach((checkboxId) => {
      const value = this.cubeElements[checkboxId].value;

      formGroup[checkboxId] = new FormControl({
        value,
        disabled: false,
      });

      initialValues[checkboxId] = {
        value,
      };
    });
    this.checkboxCubeForm = this.fb.group(formGroup);

    this.changed.emit({
      changes: initialValues,
      isValid: this.isValid,
    });
  }

  private get isValid(): boolean {
    return (
      !this.required || Object.values(this.checkboxCubeForm.value).some((value) => value === true)
    );
  }
}

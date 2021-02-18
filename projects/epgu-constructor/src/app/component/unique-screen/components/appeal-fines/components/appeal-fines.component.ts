import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationShowOn } from 'epgu-lib';
import { combineLatest } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { ScreenService } from '../../../../../screen/screen.service';
import { FileUploadComponent } from '../../file-upload-screen/sub-components/file-upload/file-upload.component';
import { EventBusService } from '../../../../../core/services/event-bus/event-bus.service';
import { CustomScreenComponentTypes } from '../../../../shared/components/components-list/components-list.types';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import { ValidationService } from '../../../../../shared/services/validation/validation.service';
import { AppealFines } from '../appeal-fines.types';

@Component({
  selector: 'epgu-constructor-appeal-fines',
  templateUrl: 'appeal-fines.component.html',
  styleUrls: ['./appeal-fines.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppealFinesComponent implements OnInit {
  @Input() components: AppealFines[];
  @Output() updateCurrentAnswerServiceEvent = new EventEmitter<{
    isValid: boolean;
    state: string;
  }>();
  @ViewChildren(FileUploadComponent) fileUploadComponents: QueryList<FileUploadComponent>;

  hasUploadFiles$ = this.eventBusService.on('fileUploadValueChangedEvent').pipe(
    startWith(null as unknown),
    map(() => this.fileUploadHasFiles()),
  );

  readonly customComponentTypes = CustomScreenComponentTypes;
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  formControl: FormControl;

  constructor(
    public screenService: ScreenService,
    private eventBusService: EventBusService,
    private unsubscribeService: UnsubscribeService,
    private validationService: ValidationService,
  ) {}

  ngOnInit(): void {
    this.initFormControl();

    combineLatest([
      this.formControl.valueChanges.pipe(startWith(this.formControl.value as string)),
      this.hasUploadFiles$,
    ])
      .pipe(takeUntil(this.unsubscribeService))
      .subscribe(([state, hasFiles]) => {
        const isValid = this.formControl.valid && hasFiles;
        this.updateCurrentAnswerServiceEvent.next({ state, isValid });
      });
  }

  private initFormControl(): void {
    const textAreaCmp = this.components.find(
      ({ type }) => type === CustomScreenComponentTypes.TextArea,
    );
    if (textAreaCmp) {
      const validators = [this.validationService.customValidator(textAreaCmp)];
      this.formControl = new FormControl(textAreaCmp.value, validators);
    }
  }

  private fileUploadHasFiles(): boolean {
    return (this.fileUploadComponents || []).some((cmp) =>
      cmp.getFiles().some((item) => item?.value.length),
    );
  }
}

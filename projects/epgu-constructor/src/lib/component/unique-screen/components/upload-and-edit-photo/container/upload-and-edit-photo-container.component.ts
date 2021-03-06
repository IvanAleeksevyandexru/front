import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { ComponentDto } from '@epgu/epgu-constructor-types';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../../../screen/screen.service';
import { NEXT_STEP_ACTION } from '../../../../../shared/constants/actions';
import { ActionService } from '../../../../../shared/directives/action/action.service';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';

@Component({
  selector: 'epgu-constructor-upload-and-edit-photo-container',
  templateUrl: './upload-and-edit-photo-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadAndEditPhotoContainerComponent {
  croppedImageUrl: string;
  startToUploadPhoto$ = new BehaviorSubject<{ isStart: boolean }>({ isStart: false });
  startToChangeCroppedImageUrl$ = new BehaviorSubject<{ isStart: boolean }>({ isStart: false });
  data$: Observable<ComponentDto> = this.screenService.component$;

  private nextStepAction = NEXT_STEP_ACTION;

  constructor(
    public screenService: ScreenService,
    public config: ConfigService,
    private actionService: ActionService,
    private currentAnswersService: CurrentAnswersService,
  ) {}

  changeCroppedImageUrl(imageUrl: string): void {
    this.croppedImageUrl = imageUrl;
  }

  changeCroppedPhoto(): void {
    this.startToChangeCroppedImageUrl$.next({ isStart: true });
  }

  uploadPhotoToServer(): void {
    this.startToUploadPhoto$.next({ isStart: true });
  }

  nextStep(mergedData): void {
    this.currentAnswersService.state = mergedData;
    this.actionService.switchAction(this.nextStepAction, this.screenService.component.id);
  }
}

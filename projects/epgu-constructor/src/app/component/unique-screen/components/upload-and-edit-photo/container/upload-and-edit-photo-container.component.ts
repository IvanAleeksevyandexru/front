import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { ConfigService } from '../../../../../core/services/config/config.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { ComponentDto } from '../../../../../form-player/services/form-player-api/form-player-api.types';
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

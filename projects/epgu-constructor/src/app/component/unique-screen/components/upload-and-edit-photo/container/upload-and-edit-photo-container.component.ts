import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { share } from 'rxjs/operators';

import { ConfigService } from '../../../../../core/services/config/config.service';
import { EventBusService } from '../../../../../core/services/event-bus/event-bus.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { ComponentDto } from '../../../../../form-player/services/form-player-api/form-player-api.types';

@Component({
  selector: 'epgu-constructor-upload-and-edit-photo-container',
  templateUrl: './upload-and-edit-photo-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadAndEditPhotoContainerComponent {
  croppedImageUrl: string;
  startToUploadPhoto$ = new BehaviorSubject<{ isStart: boolean }>({ isStart: false });
  startToChangeCroppedImageUrl$ = new BehaviorSubject<{ isStart: boolean }>({ isStart: false });
  data$: Observable<ComponentDto> = this.screenService.component$.pipe(share());

  constructor(
    public screenService: ScreenService,
    public config: ConfigService,
    private eventBusService: EventBusService,
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
    this.eventBusService.emit('nextStepEvent', JSON.stringify(mergedData));
  }
}

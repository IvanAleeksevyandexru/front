import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { WebcamEvents } from './webcamevents';
import { IMAGE_CAMERA_QUALITY } from './webcam-shoot.const';

@Component({
  selector: 'epgu-constructor-webcam-shoot',
  templateUrl: './webcam-shoot.component.html',
  styleUrls: ['./webcam-shoot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebcamShootComponent {
  imageCameraQuality = IMAGE_CAMERA_QUALITY;
  imageType = 'image/jpeg';
  width = 0;
  height = 0;
  private trigger: Subject<void> = new Subject<void>();

  constructor(private webcamEvents: WebcamEvents) {
    this.width = window.screen.width;
    this.height = window.screen.height;
  }

  /**
   * Закрытие окна
   */
  close(): void {
    this.webcamEvents.close();
  }

  /**
   * Закрытие окна и сохранение снимка
   */
  makeShot(): void {
    this.trigger.next();
  }

  /**
   * Получение изображения с веб-камеры
   * @param webcamImage - объект изображения полученного с камеры
   */
  handleImage(webcamImage: WebcamImage): void {
    this.webcamEvents.closeAndSave(webcamImage.imageAsDataUrl);
  }

  /**
   * Возвращает ссылку на триггер
   */
  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }
}

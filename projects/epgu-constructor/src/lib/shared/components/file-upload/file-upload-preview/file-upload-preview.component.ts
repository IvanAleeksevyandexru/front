import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  ViewChild,
} from '@angular/core';
import { ImgCropperConfig, ImgCropperEvent, LyImageCropper } from '@alyle/ui/image-cropper';
import { ConfigService, ModalBaseComponent } from '@epgu/epgu-constructor-ui-kit';
import { Subject } from 'rxjs';

import {
  imageErrorText,
  minCropSize,
  hintSetting,
  showErrorTime,
  ImageErrorText,
  NewSizeEvent,
} from './file-upload-preview.const';

@Component({
  selector: 'epgu-constructor-file-upload-preview',
  templateUrl: './file-upload-preview.component.html',
  styleUrls: ['./file-upload-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadPreviewComponent extends ModalBaseComponent implements AfterViewInit {
  @ViewChild('cropper') cropper: LyImageCropper;

  cropConfig: ImgCropperConfig = minCropSize;
  cropping = new Subject<ImgCropperEvent>();
  hintSetting = hintSetting;

  imageObjectUrl: string;

  imageErrors: string[][];
  imageErrorText: ImageErrorText = imageErrorText;
  errorTextIsShown = false;

  scale: number;
  isScalingAvailable = false;

  isPhoneSize: boolean;

  constructor(
    public injector: Injector,
    public config: ConfigService,
    private changeDetectionRef: ChangeDetectorRef,
  ) {
    super(injector);
  }

  ngAfterViewInit(): void {
    if (this.imageObjectUrl) {
      this.cropper.setImageUrl(this.imageObjectUrl);
    }

    if (this.imageErrors) {
      this.showErrorText();
    }
  }

  public showErrorText(): void {
    this.errorTextIsShown = true;
    setTimeout(() => {
      this.errorTextIsShown = false;
      this.changeDetectionRef.markForCheck();
    }, showErrorTime);
  }

  /**
   * Image loaded hook
   */
  public imageLoaded(): void {
    this.setScaling();
  }

  public onResized(newSize: NewSizeEvent): void {
    if (newSize.newWidth !== newSize.oldWidth) {
      this.setCropperSize();
    }
    if (this.cropper.isLoaded) {
      this.fitImageToCropArea();
    }
  }

  public takeAnotherPhoto(): void {
    this.modalResult.next(false);
    this.closeModal();
  }

  public saveAndExit(): void {
    this.modalResult.next(true);
    this.closeModal();
  }

  /**
   * Check if scaling is available and set it.
   */
  private setScaling(): void {
    const initScale = this.scale;
    this.cropper.zoomIn();
    this.isScalingAvailable = this.scale > initScale;
    this.cropper.zoomOut();
  }

  private setCropperSize(): void {
    this.isPhoneSize = matchMedia('(max-width: 576px)').matches;
  }

  private fitImageToCropArea(): void {
    this.cropper.rotate(0);
    this.cropper.center();
    this.cropper.fit();
  }
}

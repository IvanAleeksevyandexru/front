import {
  Component,
  ViewChild,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Injector,
} from '@angular/core';
import { ImgCropperConfig, ImgCropperEvent, LyImageCropper } from '@alyle/ui/image-cropper';
import { Subject } from 'rxjs';

import { ModalBaseComponent } from '../../../../../modal/shared/modal-base/modal-base.component';
import { hintSetting, photoMaskSrc, showErrorTime } from './photo-editor-modal.constant';
import { ConfigService } from '../../../../../core/services/config/config.service';
import { ImageErrorText, NewSizeEvent } from '../../upload-and-edit-photo-form.model';
import { minCropSize, imageErrorText } from '../../upload-and-edit-photo-form.constant';

@Component({
  selector: 'epgu-constructor-photo-editor-modal',
  templateUrl: './photo-editor-modal.component.html',
  styleUrls: ['./photo-editor-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoEditorModalComponent extends ModalBaseComponent implements AfterViewInit {
  @ViewChild('cropper') cropper: LyImageCropper;

  cropConfig: ImgCropperConfig = minCropSize;
  cropping = new Subject<ImgCropperEvent>();
  hintSetting = hintSetting;

  imageObjectUrl: string;
  maskSrc: string;

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
    this.modalResult.next({ changeImage: true });
    this.closeModal();
  }

  public saveAndExit(): void {
    const croppedImageUrl = this.getCroppedImageUrl();
    this.modalResult.next({ imageObjectUrl: croppedImageUrl });
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
    this.maskSrc = `${this.config.staticDomainAssetsPath}/${photoMaskSrc.desktop}`;
  }

  private fitImageToCropArea(): void {
    this.cropper.rotate(0);
    this.cropper.center();
    this.cropper.fit();
  }

  private getCroppedImageUrl(): string {
    return this.cropper.crop().dataURL;
  }
}

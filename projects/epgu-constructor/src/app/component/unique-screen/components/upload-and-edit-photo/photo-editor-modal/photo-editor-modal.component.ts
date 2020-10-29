import { Component, ViewChild, AfterViewInit } from '@angular/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ImgCropperConfig, ImgCropperEvent, LyImageCropper } from '@alyle/ui/image-cropper';
import { Subject } from 'rxjs';
import { ModalBaseComponent } from '../../../../../modal/components/modal-base/modal-base.component';
import { ImageErrorText, NewSizeEvent } from '../upload-and-edit-photo.model';
import { imageErrorText, minCropSize } from '../upload-and-edit-photo.constant';
import {
  aspectRatio,
  hintSetting,
  photoMaskSrc,
  showErrorTime,
} from './photo-editor-modal.constant';
import { ConfigService } from '../../../../../shared/config/config.service';

@Component({
  selector: 'epgu-constructor-photo-editor-modal',
  templateUrl: './photo-editor-modal.component.html',
  styleUrls: ['./photo-editor-modal.component.scss'],
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

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(public config: ConfigService) {
    super();
  }

  ngAfterViewInit(): void {
    if (this.imageObjectUrl) {
      this.cropper.setImageUrl(this.imageObjectUrl);
    }

    if (this.imageErrors) {
      this.showErrorText();
    }
  }

  showErrorText(): void {
    this.errorTextIsShown = true;
    setTimeout(() => {
      this.errorTextIsShown = false;
    }, showErrorTime);
  }

  getCroppedImageUrl(): string {
    return this.cropper.crop().dataURL;
  }

  /**
   * Image loaded hook
   */
  imageLoaded(): void {
    this.setScaling();
  }

  /**
   * Check if scaling is available and set it.
   */
  setScaling(): void {
    const initScale = this.scale;
    this.cropper.zoomIn();
    this.isScalingAvailable = this.scale > initScale;
    this.cropper.zoomOut();
  }

  setCropperSize(newSize: NewSizeEvent): void {
    this.isPhoneSize = matchMedia('(max-width: 576px)').matches;
    this.cropConfig = this.isPhoneSize
      ? { width: newSize.newWidth, height: newSize.newWidth * aspectRatio }
      : minCropSize;

    this.maskSrc = `${this.config.staticDomainAssetsPath}/${
      this.isPhoneSize ? photoMaskSrc.phone : photoMaskSrc.desktop
    }`;
  }

  fitImageToCropArea(): void {
    this.cropper.rotate(0);
    this.cropper.center();
    this.cropper.fit();
  }

  onResized(newSize: NewSizeEvent): void {
    if (newSize.newWidth !== newSize.oldWidth) {
      this.setCropperSize(newSize);
    }
    if (this.cropper.isLoaded) {
      this.fitImageToCropArea();
    }
  }

  takeAnotherPhoto(): void {
    this.modalResult.next({ changeImage: true });
    this.closeModal();
  }

  saveAndExit(): void {
    const croppedImageUrl = this.getCroppedImageUrl();
    this.modalResult.next({ imageObjectUrl: croppedImageUrl });
    this.closeModal();
  }
}

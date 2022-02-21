import {
  OnInit,
  Component,
  ViewChild,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Injector,
} from '@angular/core';
import { ImgCropperEvent, LyImageCropper } from '@alyle/ui/image-cropper';
import { Subject } from 'rxjs';
import { ConfigService, ModalBaseComponent } from '@epgu/epgu-constructor-ui-kit';
import { hintSetting, photoMaskSrc, showErrorTime } from './photo-editor-modal.constant';
import {
  ImageErrorText,
  NewSizeEvent,
  ExtendedImgCropperConfig,
} from '../../upload-and-edit-photo-form.model';
import { cropperConfig, imageErrorText } from '../../upload-and-edit-photo-form.constant';
import { CropTypes, ImageCropOptions } from '@epgu/epgu-constructor-types';

@Component({
  selector: 'epgu-constructor-photo-editor-modal',
  templateUrl: './photo-editor-modal.component.html',
  styleUrls: ['./photo-editor-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoEditorModalComponent extends ModalBaseComponent implements OnInit, AfterViewInit {
  @ViewChild('cropper') cropper: LyImageCropper;

  cropConfig: ExtendedImgCropperConfig = cropperConfig.face;
  cropping = new Subject<ImgCropperEvent>();
  hintSetting = hintSetting;

  imageObjectUrl: string;
  maskSrc: string;

  cropOptions: ImageCropOptions = {
    cropType: CropTypes.FACE,
  };
  imageErrors: string[][];
  customImageErrorText: ImageErrorText;
  imageErrorText: ImageErrorText;
  errorTextIsShown = false;

  scale: number;
  isScalingAvailable = false;
  isFacePhotoMode = true;
  isPhoneSize: boolean;

  constructor(
    public injector: Injector,
    public configService: ConfigService,
    private changeDetectionRef: ChangeDetectorRef,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.setCustomErrorText();
    this.setCropperConfig();
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
    // скрываем ошибку по заданному таймауту
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
    this.maskSrc = `${this.configService.staticDomainAssetsPath}/${photoMaskSrc.desktop}`;
  }

  private fitImageToCropArea(): void {
    this.cropper.rotate(0);
    this.cropper.center();
    this.cropper.fit();
  }

  private getCroppedImageUrl(): string {
    return this.cropper.crop().dataURL;
  }

  private setCustomErrorText(): void {
    this.imageErrorText = {
      ...imageErrorText,
      ...this.customImageErrorText,
    };
  }

  private setCropperConfig(): void {
    this.isFacePhotoMode = !this.cropOptions || this.cropOptions.cropType === CropTypes.FACE;

    if (this.cropOptions && this.cropOptions.cropType) {
      this.cropConfig = cropperConfig[this.cropOptions.cropType];
    }
  }
}

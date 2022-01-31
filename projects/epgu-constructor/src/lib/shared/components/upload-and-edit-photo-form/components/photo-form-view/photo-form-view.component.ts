import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  Input,
  OnInit,
} from '@angular/core';
import { BaseComponent } from '@epgu/epgu-constructor-ui-kit';
import { CropTypes, ImageCropOptions } from '@epgu/epgu-constructor-types';

@Component({
  selector: 'epgu-constructor-photo-form-view',
  templateUrl: './photo-form-view.component.html',
  styleUrls: ['./photo-form-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoFormViewComponent extends BaseComponent implements OnInit {
  @Input() isDesktop: boolean;
  @Input() staticDomainAssetsPath: string;
  @Input() croppedImageUrl: string;
  @Input() cropOptions?: ImageCropOptions;
  @Output() hiddenFileInputEvent = new EventEmitter<void>();
  @Output() openCameraEvent = new EventEmitter<void>();

  isFacePhotoMode = true;
  uploaderAreaIcon: string;

  ngOnInit(): void {
    const desktopIcon = `${this.staticDomainAssetsPath}/assets/icons/svg/photo-upload-area-desktop.svg`;
    const mobileIcon = `${this.staticDomainAssetsPath}/assets/icons/svg/photo-upload-area-mobile.svg`;
    const fileIcon = `${this.staticDomainAssetsPath}/assets/icons/svg/file-upload-area.svg`;

    this.isFacePhotoMode = !this.cropOptions || this.cropOptions.cropType === CropTypes.FACE;

    this.uploaderAreaIcon = this.isFacePhotoMode
      ? this.isDesktop
        ? desktopIcon
        : mobileIcon
      : fileIcon;
  }
}

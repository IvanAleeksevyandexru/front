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

const desktopIcon = require('!raw-loader!projects/epgu-constructor-ui-kit/src/assets/icons/svg/photo-upload-area-desktop.svg')
  .default as string;
const mobileIcon = require('!raw-loader!projects/epgu-constructor-ui-kit/src/assets/icons/svg/photo-upload-area-mobile.svg')
  .default as string;
@Component({
  selector: 'epgu-constructor-photo-form-view',
  templateUrl: './photo-form-view.component.html',
  styleUrls: ['./photo-form-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoFormViewComponent extends BaseComponent implements OnInit {
  @Input() isDesktop: boolean;
  @Input() croppedImageUrl: string;
  @Input() cropOptions?: ImageCropOptions;
  @Output() hiddenFileInputEvent = new EventEmitter<void>();
  @Output() openCameraEvent = new EventEmitter<void>();

  isFacePhotoMode = true;

  public icons = {
    desktopIcon: desktopIcon,
    mobileIcon: mobileIcon,
  };

  ngOnInit(): void {
    this.isFacePhotoMode = !this.cropOptions || this.cropOptions.cropType === CropTypes.FACE;
  }
}

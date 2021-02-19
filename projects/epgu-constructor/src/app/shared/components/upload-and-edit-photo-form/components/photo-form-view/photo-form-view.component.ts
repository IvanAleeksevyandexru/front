import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  Input,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'epgu-constructor-photo-form-view',
  templateUrl: './photo-form-view.component.html',
  styleUrls: ['./photo-form-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoFormViewComponent implements OnInit {
  @Input() isDesktop: boolean;
  @Input() staticDomainAssetsPath: string;
  @Input() croppedImageUrl: string;
  @Output() hiddenFileInputEvent = new EventEmitter<void>();
  @Output() openCameraEvent = new EventEmitter<void>();

  desktopIcon: string;
  mobileIcon: string;

  ngOnInit(): void {
    this.desktopIcon = `${this.staticDomainAssetsPath}/assets/icons/svg/photo-upload-area-desktop.svg`;
    this.mobileIcon = `${this.staticDomainAssetsPath}/assets/icons/svg/photo-upload-area-mobile.svg`;
  }
}

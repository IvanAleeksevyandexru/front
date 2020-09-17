import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { DeviceDetectorService } from 'ngx-device-detector';
import { ComponentBase } from '../../../screen.types';

@Component({
  selector: 'epgu-constructor-upload-and-edit-photo',
  templateUrl: './upload-and-edit-photo.component.html',
  styleUrls: ['./upload-and-edit-photo.component.scss'],
})
export class UploadAndEditPhotoComponent implements OnInit {
  @Input() data: ComponentBase;
  @Input() isLoading: boolean;
  @Input() header: string;

  @Output() nextStepEvent = new EventEmitter();

  isDesktop: boolean;

  constructor(private deviceService: DeviceDetectorService) { }

  ngOnInit(): void {
    this.isDesktop = this.deviceService.isDesktop();
  }

  onFileSelected(fileList: FileList): void {
    console.log('brooo', fileList)
    if (fileList?.length) {
      this.setFile(fileList[0]);
    }
  }

  setFile(file: File): void {

  }

  takePhoto(): void {
    console.log('brooo')
  }

}

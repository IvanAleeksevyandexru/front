import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'epgu-constructor-photo-editor-modal',
  templateUrl: './photo-editor-modal.component.html',
  styleUrls: ['./photo-editor-modal.component.scss'],
})
export class PhotoEditorModalComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

  /*
  @ViewChild('cropper') set setCropper(cropper: LyImageCropper) {
    this.cropper = cropper;
  }

  image: string;

  cropper: LyImageCropper;
  cropping = new Subject<ImgCropperEvent>();

  scale: number;
  isScalingAvailable = false;

  hintSetting = {
    title: 'Подсказка',
    text: 'Перетащите фото, чтобы изменить положение',
    color: '#FFD54C',
  };


  /!**
   * Method for calling in parent component
   *!/
  crop(): ImgCropperEvent {
    return this.cropper.crop();
  }

  /!**
   * Image loaded hook
   *!/
  imageLoaded(): void {
    this.setScaling();
  }

  /!**
   * Check if scaling is available and set it.
   *!/
  setScaling(): void {
    const initScale = this.scale;
    this.cropper.zoomIn();
    this.isScalingAvailable = this.scale > initScale;
    this.cropper.zoomOut();
  }

  deleteImage(): void {
    this.deleteImageEvent.emit(this.image);
    this.cropper.clean();
  }

  onResized(event: ResizedEvent): void {
    this.cropper.setImageUrl(URL.createObjectURL(this.image));
    this.myConfig = {width: event.newWidth, height: event.newHeight};
    if (this.cropper.isLoaded) {
      // This block fixes image displaying on resize.
      this.cropper.rotate(0);
      this.cropper.center();
      this.cropper.fit();
    }
  }

  */
  closeModal() {

  }
}


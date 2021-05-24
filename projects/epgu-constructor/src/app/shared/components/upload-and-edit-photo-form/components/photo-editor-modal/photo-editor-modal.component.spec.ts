import { LyTheme2, LY_THEME, LY_THEME_NAME, StyleRenderer } from '@alyle/ui';
import { LyImageCropperModule } from '@alyle/ui/image-cropper';
import { MinimaDark, MinimaLight } from '@alyle/ui/themes/minima';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockModule } from 'ng-mocks';
import { ButtonComponent } from 'epgu-lib';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';

import { ConfigService } from '../../../../../core/services/config/config.service';
import { SliderComponent } from '../slider/slider.component';
import { PhotoEditorModalComponent } from './photo-editor-modal.component';
import { ConfigServiceStub } from '../../../../../core/services/config/config.service.stub';
import { isBoolean } from '../../../../constants/utils';
import { configureTestSuite } from 'ng-bullet';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('PhotoEditorModalComponent', () => {
  let component: PhotoEditorModalComponent;
  let fixture: ComponentFixture<PhotoEditorModalComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        PhotoEditorModalComponent,
        MockComponent(SliderComponent),
        MockComponent(ButtonComponent),
      ],
      imports: [MockModule(LyImageCropperModule)],
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        [LyTheme2],
        [StyleRenderer],
        // Theme that will be applied to this module
        { provide: LY_THEME_NAME, useValue: 'minima-light' },
        { provide: LY_THEME, useClass: MinimaLight, multi: true }, // name: `minima-light`
        { provide: LY_THEME, useClass: MinimaDark, multi: true },
      ],
    })
      .overrideComponent(PhotoEditorModalComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoEditorModalComponent);
    component = fixture.componentInstance;
    component.detachView = () => null;
    fixture.detectChanges();
  });

  describe('ngAfterViewInit', () => {
    it('should be call cropper setImageUrl', () => {
      jest.spyOn(component.cropper, 'setImageUrl');
      component.imageObjectUrl = 'image';
      fixture.detectChanges();
      component.ngAfterViewInit();
      expect(component.cropper.setImageUrl).toHaveBeenCalledWith('image');
    });

    it('should be call showErrorText', () => {
      jest.spyOn(component, 'showErrorText');
      component.imageErrors = [['asd']];
      component.ngAfterViewInit();
      expect(component.showErrorText).toHaveBeenCalled();
    });
  });

  describe('showErrorText', () => {
    const selector = '.photo-editor-modal__error-text';

    it('should be call showErrorText after ngAfterViewInit if has error', () => {
      jest.spyOn(component, 'showErrorText');
      component.imageErrors = [['error']];
      component.ngAfterViewInit();
      fixture.detectChanges();
      expect(component.showErrorText).toHaveBeenCalled();
    });

    it('should be show template error', () => {
      component.showErrorText();
      fixture.detectChanges();
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeTruthy();
    });

    it('should be close template error after showErrorTime', () => {
      jest.useFakeTimers();
      component.showErrorText();
      fixture.detectChanges();

      jest.runAllTimers();
      fixture.detectChanges();
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeNull();
    });
  });

  describe('imageLoaded', () => {
    it('should be call zoomIn, zoomOut', () => {
      jest.spyOn(component.cropper, 'zoomIn');
      jest.spyOn(component.cropper, 'zoomOut');
      component.imageLoaded();
      expect(component.cropper.zoomIn).toHaveBeenCalled();
      expect(component.cropper.zoomOut).toHaveBeenCalled();
    });

    it('should be set isScalingAvailable', () => {
      component.scale = 0;
      fixture.detectChanges();
      component.imageLoaded();
      expect(isBoolean(component.isScalingAvailable)).toBeTruthy();
    });
  });

  describe('onResized', () => {
    it('should be set cropped size', () => {
      component.onResized({ newWidth: 100, oldWidth: 50, newHeight: 100, oldHeight: 50 });
      expect(component.isPhoneSize).toBeFalsy();
      expect(component.maskSrc).toBe('/assets/icons/svg/photo-mask-desktop.svg');
    });

    it('should be fit image to crop area', () => {
      jest.spyOn(component.cropper, 'rotate');
      jest.spyOn(component.cropper, 'center');
      jest.spyOn(component.cropper, 'fit');
      component.cropper.isLoaded = true;
      fixture.detectChanges();
      component.onResized({ newWidth: 100, oldWidth: 50, newHeight: 100, oldHeight: 50 });
      expect(component.cropper.rotate).toHaveBeenCalledWith(0);
      expect(component.cropper.center).toHaveBeenCalled();
      expect(component.cropper.fit).toHaveBeenCalled();
    });
  });

  describe('saveAndExit', () => {
    it('should be save image and close modal', () => {
      jest.spyOn(component.modalResult, 'next');
      jest.spyOn(component, 'closeModal');
      jest.spyOn(component.cropper, 'crop').mockReturnValue({ dataURL: 'image' } as any);
      component.saveAndExit();

      expect(component.modalResult.next).toHaveBeenCalledWith({ imageObjectUrl: 'image' });
      expect(component.closeModal).toHaveBeenCalled();
    });
  });

  describe('takeAnotherPhoto', () => {
    it('should be take another image and close modal', () => {
      jest.spyOn(component.modalResult, 'next');
      jest.spyOn(component, 'closeModal');
      component.takeAnotherPhoto();

      expect(component.modalResult.next).toHaveBeenCalledWith({ changeImage: true });
      expect(component.closeModal).toHaveBeenCalled();
    });
  });
});

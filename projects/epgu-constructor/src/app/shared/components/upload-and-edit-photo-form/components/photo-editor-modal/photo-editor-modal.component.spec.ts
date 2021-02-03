import { LyTheme2, LY_THEME, LY_THEME_NAME, StyleRenderer } from '@alyle/ui';
import { LyImageCropperModule } from '@alyle/ui/image-cropper';
import { MinimaDark, MinimaLight } from '@alyle/ui/themes/minima';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { ButtonComponent } from 'epgu-lib';

import { ConfigService } from '../../../../../core/services/config/config.service';
import { SliderComponent } from '../slider/slider.component';
import { PhotoEditorModalComponent } from './photo-editor-modal.component';
import { ConfigServiceStub } from '../../../../../core/services/config/config.service.stub';
import { ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('PhotoEditorModalComponent', () => {
  let component: PhotoEditorModalComponent;
  let fixture: ComponentFixture<PhotoEditorModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PhotoEditorModalComponent,
        MockComponent(SliderComponent),
        MockComponent(ButtonComponent),
      ],
      imports: [LyImageCropperModule],
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

    fixture = TestBed.createComponent(PhotoEditorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
});

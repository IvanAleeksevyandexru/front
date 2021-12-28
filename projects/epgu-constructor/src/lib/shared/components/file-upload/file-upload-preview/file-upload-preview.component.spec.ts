import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule } from '@angular/forms';
import { FileUploadPreviewComponent } from './file-upload-preview.component';
import { ConfigService, ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { LyImageCropper } from '@alyle/ui/image-cropper';
import { NewSizeEvent } from './file-upload-preview.const';

export class LyImageCropperStub {
  setImageUrl() {
    return;
  }
}

describe('FileUploadPreviewComponent', () => {
  let component: FileUploadPreviewComponent;
  let fixture: ComponentFixture<FileUploadPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [FileUploadPreviewComponent],
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        {
          provide: LyImageCropper,
          useClass: LyImageCropperStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadPreviewComponent);
    component = fixture.componentInstance;
    component.imageObjectUrl = 'test url';
    component.imageErrors = [['common']];
    component.cropper = ({
      setImageUrl: () => {
        return;
      },
    } as unknown) as LyImageCropper;
  });

  it('ngAfterViewInit()', () => {
    jest.spyOn(component.cropper, 'setImageUrl');
    jest.spyOn(component, 'showErrorText');

    component.ngAfterViewInit();

    expect(component.cropper.setImageUrl).toHaveBeenCalled();
    expect(component.showErrorText).toHaveBeenCalled();
  });

  it('showErrorText()', () => {
    component.showErrorText();

    expect(component.errorTextIsShown).toBe(true);
  });

  it('showErrorText() - error shown temporary', () => {
    jest.useFakeTimers();
    component.showErrorText();
    jest.runAllTimers();
    expect(component.errorTextIsShown).toBe(false);
  });

  describe('onResized()', () => {
    it("onResized() - width wasn't changed", () => {
      const spy = jest.spyOn(component as any, 'setCropperSize').mockReturnValue(() => {
        return;
      });

      component.onResized({ newWidth: 100, oldWidth: 100 } as NewSizeEvent);

      expect(spy).not.toHaveBeenCalled();
    });

    it('onResized() - width was changed', () => {
      const spy = jest.spyOn(component as any, 'setCropperSize').mockReturnValue(() => {
        return;
      });

      component.onResized({ newWidth: 20, oldWidth: 100 } as NewSizeEvent);

      expect(spy).toHaveBeenCalled();
    });
  });
});

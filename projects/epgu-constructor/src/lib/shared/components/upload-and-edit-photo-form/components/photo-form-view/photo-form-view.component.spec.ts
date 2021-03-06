import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeModule, IconsModule } from '@epgu/epgu-constructor-ui-kit';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';
import { PhotoFormViewComponent } from './photo-form-view.component';

describe('PhotoFormViewComponent', () => {
  let component: PhotoFormViewComponent;
  let fixture: ComponentFixture<PhotoFormViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhotoFormViewComponent],
      imports: [SafeModule, IconsModule],
      providers: [],
    })
      .overrideComponent(PhotoFormViewComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoFormViewComponent);
    component = fixture.componentInstance;
    component.croppedImageUrl = '';
    fixture.detectChanges();
  });

  describe('hiddenFileInputEvent', () => {
    it('should be call hiddenFileInputEvent', () => {
      jest.spyOn(component.hiddenFileInputEvent, 'emit');
      component.isDesktop = true;
      fixture.detectChanges();
      const debugEl = fixture.debugElement.query(By.css('button'));
      debugEl.triggerEventHandler('click', {});

      expect(component.hiddenFileInputEvent.emit).toHaveBeenCalled();
    });
  });

  describe('openCameraEvent', () => {
    it('should be call openCameraEvent', () => {
      jest.spyOn(component.openCameraEvent, 'emit');
      component.isDesktop = false;
      fixture.detectChanges();
      const debugEl = fixture.debugElement.queryAll(By.css('button'))[1];
      debugEl.triggerEventHandler('click', {});

      expect(component.openCameraEvent.emit).toHaveBeenCalled();
    });
  });
});

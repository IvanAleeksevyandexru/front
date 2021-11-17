import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadSliderComponent } from './file-upload-slider.component';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('SliderComponent', () => {
  let component: FileUploadSliderComponent;
  let fixture: ComponentFixture<FileUploadSliderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [FileUploadSliderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadSliderComponent);
    component = fixture.componentInstance;
    component.max = 10;
    component.min = 5;
    component.value = 6;
    fixture.detectChanges();
  });

  it('should be call valueChange', () => {
    jest.spyOn(component.valueChange, 'emit');
    jest.spyOn(component, 'onSlide');
    const debugElement = fixture.debugElement.query(By.css('input'));
    debugElement.triggerEventHandler('ngModelChange', 6);
    expect(component.valueChange.emit).toHaveBeenCalled();
    expect(component.onSlide).toHaveBeenCalled();
  });
});

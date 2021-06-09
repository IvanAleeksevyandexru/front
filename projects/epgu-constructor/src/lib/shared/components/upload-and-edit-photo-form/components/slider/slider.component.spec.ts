import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderComponent } from './slider.component';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';

describe('SliderComponent', () => {
  let component: SliderComponent;
  let fixture: ComponentFixture<SliderComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [SliderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderComponent);
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

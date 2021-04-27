import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploaderButtonComponent } from './uploader-button.component';
import { configureTestSuite } from 'ng-bullet';

const mockCapture = 'user';
const mockMultiple = false;
const mockType = 'png';

describe('UploaderButtonComponent', () => {
  let component: UploaderButtonComponent;
  let fixture: ComponentFixture<UploaderButtonComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [UploaderButtonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploaderButtonComponent);
    component = fixture.componentInstance;
    component.capture = mockCapture;
    component.multiple = mockMultiple;
    component.accept = mockType;
    fixture.detectChanges();
  });

  it('should be attrs', () => {
    const input: HTMLInputElement = component.input.nativeElement;
    expect(input.getAttribute('capture')).toBe(mockCapture);
    expect(input.getAttribute('multiple')).toBe(String(mockMultiple));
    expect(input.getAttribute('accept')).toBe(mockType);
  });

  it('should select', () => {
    const input: HTMLInputElement = component.input.nativeElement;
    jest.spyOn(component, 'select');
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.select).toHaveBeenCalled();
  });
  it('should reset', () => {
    spyOn(component, 'reset');
    fixture.debugElement.nativeElement.click();
    fixture.detectChanges();
    expect(component.reset).toHaveBeenCalled();
  });

  it('should click', () => {
    spyOn(component.input.nativeElement, 'click');
    fixture.debugElement.nativeElement.click();

    fixture.detectChanges();
    expect(component.input.nativeElement.click).toHaveBeenCalled();
  });
});

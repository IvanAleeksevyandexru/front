import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploaderButtonComponent } from './uploader-button.component';

const mockCapture = 'user';
const mockMultiple = false;
const mockType = 'png';

describe('UploaderButtonComponent', () => {
  let component: UploaderButtonComponent;
  let fixture: ComponentFixture<UploaderButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UploaderButtonComponent],
    }).compileComponents();
  }));

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
    spyOn(component, 'select').and.callThrough();
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.select).toBeCalled();
  });

  it('should click', () => {
    spyOn(component, 'reset').and.callThrough();
    spyOn(component.input.nativeElement, 'click').and.callThrough();
    fixture.debugElement.nativeElement.click();

    fixture.detectChanges();
    expect(component.reset).toBeCalled();
    expect(component.input.nativeElement.click).toBeCalled();
  });
});

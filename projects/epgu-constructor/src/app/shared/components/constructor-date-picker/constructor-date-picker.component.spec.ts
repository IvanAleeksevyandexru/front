import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormControl } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ConstructorDatePickerComponent } from './constructor-date-picker.component';
import { CoreModule } from '../../../core/core.module';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';

xdescribe('ConstructorDatePickerComponent', () => {
  let component: ConstructorDatePickerComponent;
  let fixture: ComponentFixture<ConstructorDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConstructorDatePickerComponent],
      imports: [CoreModule, RouterTestingModule, NoopAnimationsModule],
      providers: [{ provide: ScreenService, useClass: ScreenServiceStub }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructorDatePickerComponent);
    component = fixture.componentInstance;
    component.invalid = false;
    component.control = new FormControl();
    component.readOnly = true;
    component.minDate = '01.01.2012';
    component.maxDate = '02.04.2016';
    component.align = 'left';
    component.clearable = false;
    component.disabled = false;
    component.name = 'name';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

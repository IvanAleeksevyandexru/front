import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { ValidationShowOn } from '@epgu/epgu-lib';
import { ConstructorDropdownComponent } from './constructor-dropdown.component';
import { BaseModule } from '../../base.module';
import { configureTestSuite } from 'ng-bullet';

describe('ConstructorDropdownComponent', () => {
  let component: ConstructorDropdownComponent;
  let fixture: ComponentFixture<ConstructorDropdownComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ConstructorDropdownComponent],
      imports: [BaseModule],
      providers: [
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructorDropdownComponent);
    component = fixture.componentInstance;
    component.id = '123';
    component.control = new FormControl();
    component.invalid = false;
    component.validationShowOn = ValidationShowOn.IMMEDIATE;
    component.clearable = false;
    component.disabled = false;
    component.localSearch = false;
    component.placeholder = '&mdash;';
    component.items = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

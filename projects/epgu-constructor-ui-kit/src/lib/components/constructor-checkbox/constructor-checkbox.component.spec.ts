import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { ConstructorCheckboxComponent } from './constructor-checkbox.component';
import { BaseModule } from '../../base.module';

describe('ConstructorCheckboxComponent', () => {
  let component: ConstructorCheckboxComponent;
  let fixture: ComponentFixture<ConstructorCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConstructorCheckboxComponent],
      imports: [BaseModule],
      providers: [
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructorCheckboxComponent);
    component = fixture.componentInstance;
    component.checkboxId = '123';
    component.control = new FormControl();
    component.labelText = '';
    component.required = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

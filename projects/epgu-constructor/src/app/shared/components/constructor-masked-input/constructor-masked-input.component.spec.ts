import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConstructorMaskedInputComponent } from './constructor-masked-input.component';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { EventBusService } from '../../../core/services/event-bus/event-bus.service';
import { MaskModule } from '../../directives/mask/mask.module';
import { MaskHandleModule } from '../../pipes/mask-handle/mask-handle.module';
import { NgControl } from '@angular/forms';

describe('ConstructorMaskedInputComponent', () => {
  let component: ConstructorMaskedInputComponent;
  let fixture: ComponentFixture<ConstructorMaskedInputComponent>;
  let debugEl: DebugElement;
  const selector = 'lib-standard-masked-input';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaskModule, MaskHandleModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ConstructorMaskedInputComponent],
      providers: [EventBusService, NgControl]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructorMaskedInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    debugEl = fixture.debugElement.query(By.css(selector));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be trigger blur', () => {
    jest.spyOn(component.blurEvent, 'emit');
    debugEl.triggerEventHandler('blur', {});
    expect(component.blurEvent.emit).toHaveBeenCalled();
  });
});

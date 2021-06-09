import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConstructorMaskedInputComponent } from './constructor-masked-input.component';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { MaskHandleModule } from '@epgu/epgu-constructor-ui-kit';
import { By } from '@angular/platform-browser';
import { EventBusService } from '../../../core/services/event-bus/event-bus.service';
import { MaskModule } from '../../directives/mask/mask.module';
import { NgControl } from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';

describe('ConstructorMaskedInputComponent', () => {
  let component: ConstructorMaskedInputComponent;
  let fixture: ComponentFixture<ConstructorMaskedInputComponent>;
  let debugEl: DebugElement;
  const selector = 'lib-standard-masked-input';

  configureTestSuite(() => {
    TestBed.configureTestingModule({
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

  it('should be trigger blur', () => {
    jest.spyOn(component.blurEvent, 'emit');
    debugEl.triggerEventHandler('blur', {});
    expect(component.blurEvent.emit).toHaveBeenCalled();
  });
});

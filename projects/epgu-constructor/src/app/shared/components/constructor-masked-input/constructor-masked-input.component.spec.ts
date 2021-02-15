import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructorMaskedInputComponent } from './constructor-masked-input.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EventBusService } from '../../../core/services/event-bus/event-bus.service';
import { MaskModule } from '../../directives/mask/mask.module';
import { MaskHandleModule } from '../../pipes/mask-handle/mask-handle.module';

describe('ConstructorMaskedInputComponent', () => {
  let component: ConstructorMaskedInputComponent;
  let fixture: ComponentFixture<ConstructorMaskedInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaskModule, MaskHandleModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ConstructorMaskedInputComponent],
      providers: [EventBusService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructorMaskedInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

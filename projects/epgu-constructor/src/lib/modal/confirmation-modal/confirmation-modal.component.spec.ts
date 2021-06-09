import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationModalComponent } from './confirmation-modal.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UnsubscribeService, EventBusService, ModalService } from '@epgu/epgu-constructor-ui-kit';

describe('ConfirmationModalComponent', () => {
  let component: ConfirmationModalComponent;
  let fixture: ComponentFixture<ConfirmationModalComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ConfirmationModalComponent],
      providers: [UnsubscribeService, EventBusService, ModalService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

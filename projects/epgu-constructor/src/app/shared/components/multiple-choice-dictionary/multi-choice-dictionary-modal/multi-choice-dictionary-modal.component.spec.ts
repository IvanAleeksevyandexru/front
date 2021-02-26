import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy } from '@angular/core';
import { MockModule } from 'ng-mocks';

import { MultiChoiceDictionaryModalComponent } from './multi-choice-dictionary-modal.component';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { EventBusService } from '../../../../core/services/event-bus/event-bus.service';
import { DictionaryApiService } from '../../../../component/shared/services/dictionary-api/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../../component/shared/services/dictionary-api/dictionary-api.service.stub';
import { ConfirmationModalModule } from '../../../../modal/confirmation-modal/confirmation-modal.module';
import { BaseModule } from '../../../base.module';
import { ConstructorPlainInputModule } from '../../constructor-plain-input/constructor-plain-input.module';

describe('MultiChoiceDictionaryModalComponent', () => {
  let component: MultiChoiceDictionaryModalComponent;
  let fixture: ComponentFixture<MultiChoiceDictionaryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultiChoiceDictionaryModalComponent],
      imports: [
        MockModule(ConfirmationModalModule),
        MockModule(BaseModule),
        MockModule(ConstructorPlainInputModule),
      ],
      providers: [
        UnsubscribeService,
        EventBusService,
        {
          provide: DictionaryApiService,
          useClass: DictionaryApiServiceStub,
        },
      ],
    })
      .overrideComponent(MultiChoiceDictionaryModalComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiChoiceDictionaryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

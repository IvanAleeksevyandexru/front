import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy } from '@angular/core';
import { MockComponent, MockModule } from 'ng-mocks';

import { MultipleChoiceDictionaryComponent } from './multiple-choice-dictionary.component';
import { ModalService } from '../../../../modal/modal.service';
import { ModalServiceStub } from '../../../../modal/modal.service.stub';
import { BaseModule } from '../../../base.module';
import { ChipModule } from '../../chip/chip.module';

describe('MultipleChoiceDictionaryComponent', () => {
  let component: MultipleChoiceDictionaryComponent;
  let fixture: ComponentFixture<MultipleChoiceDictionaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultipleChoiceDictionaryComponent],
      imports: [MockModule(BaseModule), MockModule(ChipModule)],
      providers: [{ provide: ModalService, useClass: ModalServiceStub }],
    })
      .overrideComponent(MultipleChoiceDictionaryComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleChoiceDictionaryComponent);
    component = fixture.componentInstance;
    component.label = 'Label';
    component.subLabel = 'SubLabel';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

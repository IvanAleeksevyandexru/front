import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockModule, MockProvider } from 'ng-mocks';
import {
  ConfigService,
  ConfigServiceStub,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { SuggestHandlerService } from '../../../../shared/services/suggest-handler/suggest-handler.service';
import { SuggestMonitorService } from '../../../../shared/services/suggest-monitor/suggest-monitor.service';

import { AddressInputComponent } from './address-input.component';
import { ComponentItemModule } from '../component-item/component-item.module';
import { ConstructorDadataWidgetModule } from '../../../../shared/components/constructor-dadata-widget/constructor-dadata-widget.module';
import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import { ComponentsListFormServiceStub } from '../../services/components-list-form/components-list-form.service.stub';
import { AbstractControl } from '@angular/forms';
import { ISuggestionItem } from '../../../../core/services/autocomplete/autocomplete.inteface';

describe('AddressInputComponent', () => {
  let component: AddressInputComponent;
  let fixture: ComponentFixture<AddressInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddressInputComponent],
      imports: [MockModule(ComponentItemModule), MockModule(ConstructorDadataWidgetModule)],
      providers: [
        MockProvider(UnsubscribeService),
        MockProvider(SuggestHandlerService),
        MockProvider(SuggestMonitorService),
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub },
      ],
    })
      .overrideComponent(AddressInputComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressInputComponent);
    component = fixture.componentInstance;
  });

  it('should be instantiated', function () {
    expect(component).toBeTruthy();
  });

  describe('processSuggestions()', () => {
    it('should parse jsonlike structures', () => {
      component.control = ({ value: { id: 'test' }} as unknown) as AbstractControl;
      const testValue = {
        test: { list: [{ originalItem: '{ "regAddr": {"fullAddress": "test"} }', value: '' }] },
      };
      component['processSuggestions']((testValue as unknown) as { [key: string]: ISuggestionItem });
      expect(testValue.test.list[0].value).toBe('test');
    });
  });
});

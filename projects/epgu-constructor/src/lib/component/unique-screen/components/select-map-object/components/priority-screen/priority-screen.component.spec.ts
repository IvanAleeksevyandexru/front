import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ConstructorLookupModule,
  IconsModule,
  ObjectHelperService,
  PrevButtonModule,
} from '@epgu/epgu-constructor-ui-kit';
import { FormsModule } from '@angular/forms';
import { MockComponent, MockModule } from 'ng-mocks';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DisclaimerModule } from '../../../../../../shared/components/disclaimer/disclaimer.module';
import { BaseModule } from '../../../../../../shared/base.module';
import { ForTestsOnlyModule } from '../../../../../../core/for-tests-only.module';
import { PriorityScreenComponent } from './priority-screen.component';
import { DictionaryItem } from '../../../../../../shared/services/dictionary/dictionary-api.types';
import { NotifierComponent } from '@epgu/ui/components/notifier';

describe('PriorityScreenComponent', () => {
  let component: PriorityScreenComponent;
  let fixture: ComponentFixture<PriorityScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PriorityScreenComponent, MockComponent(NotifierComponent)],
      imports: [
        BaseModule,
        ConstructorLookupModule,
        MockModule(PrevButtonModule),
        HttpClientTestingModule,
        DisclaimerModule,
        FormsModule,
        IconsModule,
        ForTestsOnlyModule,
      ],
      providers: [ObjectHelperService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PriorityScreenComponent);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleKeyEvent', () => {
    it('should call back action on space and enter', () => {
      const spy = jest.spyOn(component, 'backAction');
      const event = {
        preventDefault: () => null,
      } as KeyboardEvent;

      component.handleKeyEvent(event);

      event.code = 'Space';
      component.handleKeyEvent(event);

      event.code = 'Enter';
      component.handleKeyEvent(event);

      expect(spy).toHaveBeenCalledTimes(2);
    });
  });

  describe('deleteAction', () => {
    it('should not notify', () => {
      const spy = jest.spyOn(component.notify, 'success');
      const item = {};

      component.deleteAction(item as DictionaryItem);

      expect(spy).toHaveBeenCalledTimes(0);
    });

    it('should call success on removing', () => {
      const spy = jest.spyOn(component.notify, 'success');
      jest.spyOn(component.itemsService, 'remove').mockReturnValue(1);
      const item = {};

      component.deleteAction(item as DictionaryItem);

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('changes$', () => {
    it('should show unavailable warning', () => {
      component.itemsService.items.next([{ attributeValues: {} } as any]);

      expect(component.hasUnavailable).toBeTruthy();
    });

    it('should not show unavailable warning', () => {
      component.hasUnavailable = true;

      component.itemsService.items.next([{ attributeValues: { OKTMO: '2' } } as any]);

      expect(component.hasUnavailable).toBeFalsy();
    });
  });
});

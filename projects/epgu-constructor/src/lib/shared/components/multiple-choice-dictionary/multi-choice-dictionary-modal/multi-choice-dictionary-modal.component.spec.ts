import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy } from '@angular/core';
import { MockModule, MockProvider } from 'ng-mocks';
import { ListElement } from '@epgu/ui/models/dropdown';
import { FormBuilder } from '@angular/forms';
import {
  ConfigService,
  LoggerService,
  UnsubscribeService,
  DatesToolsService,
  JsonHelperService,
  EventBusService,
} from '@epgu/epgu-constructor-ui-kit';
import { HttpClientModule } from '@angular/common/http';
import { MultiChoiceDictionaryModalComponent } from './multi-choice-dictionary-modal.component';
import { DictionaryApiService } from '../../../services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../services/dictionary/dictionary-api.service.stub';
import { BaseModule } from '../../../base.module';
import { DictionaryToolsService } from '../../../services/dictionary/dictionary-tools.service';
import { ComponentsListRelationsService } from '../../../../component/custom-screen/services/components-list-relations/components-list-relations.service';
import { DateRangeService } from '../../../services/date-range/date-range.service';
import { RefRelationService } from '../../../services/ref-relation/ref-relation.service';
import { DateRestrictionsService } from '../../../services/date-restrictions/date-restrictions.service';
import { ConfirmationModalModule } from '../../../../modal/confirmation-modal/confirmation-modal.module';
import { DateRefService } from '../../../../core/services/date-ref/date-ref.service';

describe('MultiChoiceDictionaryModalComponent', () => {
  let component: MultiChoiceDictionaryModalComponent;
  let fixture: ComponentFixture<MultiChoiceDictionaryModalComponent>;
  const mockDictionaryValue: ListElement[] = [
    {
      id: 'AUT',
      text: 'АВСТРИЯ',
      formatted: '',
      originalItem: {
        value: 'AUT',
        parentValue: null,
        title: 'АВСТРИЯ',
        isLeaf: true,
        children: [],
        attributes: [],
        source: null,
        attributeValues: {},
      },
    },
    {
      id: 'AUT2',
      text: 'АВСТРИЯ2',
      formatted: '',
      originalItem: {
        value: 'AUT',
        parentValue: null,
        title: 'АВСТРИЯ',
        isLeaf: true,
        children: [],
        attributes: [],
        source: null,
        attributeValues: {},
      },
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MultiChoiceDictionaryModalComponent],
      imports: [MockModule(ConfirmationModalModule), MockModule(BaseModule), HttpClientModule],
      providers: [
        MockProvider(DateRestrictionsService),
        FormBuilder,
        UnsubscribeService,
        EventBusService,
        DateRefService,
        {
          provide: DictionaryApiService,
          useClass: DictionaryApiServiceStub,
        },
        DictionaryToolsService,
        ComponentsListRelationsService,
        DateRangeService,
        DatesToolsService,
        RefRelationService,
        ConfigService,
        LoggerService,
        JsonHelperService,
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
    component.title = 'title';
    component.dictionaryList = mockDictionaryValue;
    component.selectedItems = [];
    component.items = [];
    fixture.detectChanges();
  });

  describe('select', () => {
    it('should be select all', () => {
      jest.spyOn(component.isSelectAll$, 'next');
      fixture.detectChanges();
      component.select(true);
      const formValue = Object.values(component.form.get('checkbox').value).every(
        (isSelect) => isSelect,
      );
      expect(formValue).toBeTruthy();
      expect(component.isSelectAll$.next).toHaveBeenCalledWith(true);
    });

    it('should be unselect all', () => {
      jest.spyOn(component.isSelectAll$, 'next');
      fixture.detectChanges();
      component.select(false);
      const formValue = Object.values(component.form.get('checkbox').value).every(
        (isSelect) => isSelect,
      );
      expect(formValue).toBeFalsy();
      expect(component.isSelectAll$.next).toHaveBeenCalledWith(false);
    });
  });

  describe('getFilteredItems$', () => {
    it('should return all items', () => {
      component.form.get('input').setValue('');
      component.filteredItems$.subscribe((items) => {
        expect(items).toEqual(mockDictionaryValue);
      });

      component.isSelectAll$.next(true);
      component.filteredItems$.subscribe((items) => {
        expect(items).toEqual(mockDictionaryValue);
      });
    });

    it('should return filtered items', () => {
      component.form.get('input').setValue('АВСТРИЯ');
      component.filteredItems$.subscribe((items) => {
        expect(items).toEqual(mockDictionaryValue[0]);
      });
    });
  });

  describe('onClose', () => {
    it('should close modal', () => {
      jest.spyOn(component, 'closeModal');
      // eslint-disable-next-line no-empty-function
      component.detachView = (): void => {};
      component.select(true);
      component.onClose();
      expect(component.closeModal).toHaveBeenCalledWith({ list: mockDictionaryValue, amount: 2 });
    });
  });
});

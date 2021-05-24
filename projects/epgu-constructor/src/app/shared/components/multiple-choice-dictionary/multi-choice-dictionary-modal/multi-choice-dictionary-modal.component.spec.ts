import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy } from '@angular/core';
import { MockModule } from 'ng-mocks';
import { ListElement } from '@epgu/epgu-lib';
import { FormBuilder } from '@angular/forms';

import { MultiChoiceDictionaryModalComponent } from './multi-choice-dictionary-modal.component';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { EventBusService } from '../../../../core/services/event-bus/event-bus.service';
import { DictionaryApiService } from '../../../services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../services/dictionary/dictionary-api.service.stub';
import { ConfirmationModalModule } from '../../../../modal/confirmation-modal/confirmation-modal.module';
import { BaseModule } from '../../../base.module';
import { DictionaryToolsService } from '../../../services/dictionary/dictionary-tools.service';
import { ComponentsListRelationsService } from '../../../../component/custom-screen/services/components-list-relations/components-list-relations.service';
import { DateRangeService } from '../../../services/date-range/date-range.service';
import { DatesToolsService } from '../../../../core/services/dates-tools/dates-tools.service';
import { RefRelationService } from '../../../services/ref-relation/ref-relation.service';
import { configureTestSuite } from 'ng-bullet';
import { DateRestrictionsService } from '../../../services/date-restrictions/date-restrictions.service';

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

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [MultiChoiceDictionaryModalComponent],
      imports: [MockModule(ConfirmationModalModule), MockModule(BaseModule)],
      providers: [
        FormBuilder,
        UnsubscribeService,
        EventBusService,
        {
          provide: DictionaryApiService,
          useClass: DictionaryApiServiceStub,
        },

        DictionaryToolsService,
        ComponentsListRelationsService,
        DateRangeService,
        DatesToolsService,
        RefRelationService,
        DateRestrictionsService,
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
      expect(component.closeModal).toHaveBeenCalledWith(mockDictionaryValue);
    });
  });
});

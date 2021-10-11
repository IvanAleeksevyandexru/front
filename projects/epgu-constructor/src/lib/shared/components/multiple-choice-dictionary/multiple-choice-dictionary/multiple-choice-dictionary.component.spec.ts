import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy } from '@angular/core';
import { MockModule } from 'ng-mocks';
import { of } from 'rxjs';
import { configureTestSuite } from 'ng-bullet';
import { ChipModule, ModalService, ModalServiceStub } from '@epgu/epgu-constructor-ui-kit';

import { MultipleChoiceDictionaryComponent } from './multiple-choice-dictionary.component';
import { BaseModule } from '../../../base.module';
import { MultiChoiceDictionaryModalComponent } from '../multi-choice-dictionary-modal/multi-choice-dictionary-modal.component';
import { COMMON_ERROR_MODAL_PARAMS } from '../../../../core/services/error-handler/error-handler';
import { ConfirmationModalComponent } from '../../../../modal/confirmation-modal/confirmation-modal.component';
import { DictionaryConditions } from '@epgu/epgu-constructor-types';
import { By } from '@angular/platform-browser';

describe('MultipleChoiceDictionaryComponent', () => {
  let component: MultipleChoiceDictionaryComponent;
  let fixture: ComponentFixture<MultipleChoiceDictionaryComponent>;
  let modalService: ModalService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
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
    modalService = TestBed.inject(ModalService);
    component = fixture.componentInstance;
    component.label = 'Label';
    component.subLabel = 'SubLabel';
    component.dictionaryType = 'STRANI_IST';
    fixture.detectChanges();
  });

  it('should be convert dictionaryList from CustomComponentDropDownItem[] to ListElement[]', () => {
    const expectedValue = [
      {
        id: '34',
        text: 'Блокированные жилые дома',
        unselectable: false,
        originalItem: {
          label: 'Блокированные жилые дома',
          disable: false,
          code: '34',
        },
        compare: (): boolean => false,
      },
    ];
    component.dictionaryList = [
      {
        label: 'Блокированные жилые дома',
        disable: false,
        code: '34',
      },
    ];
    component.dictionaryFilter = {
      filter: {
        simple: {
          attributeName: 'ID',
          condition: DictionaryConditions.EQUALS,
          value: {
            asString: '03',
          },
        },
      },
    };
    fixture.detectChanges();
    component.ngOnInit();
    expect(JSON.stringify(component.dictionaryList)).toBe(JSON.stringify(expectedValue));
  });

  describe('onClick', () => {
    it('should be open modal with modalHeader', () => {
      jest.spyOn(modalService, 'openModal');
      component.modalHeader = 'modalHeader';
      component.onClick();
      expect(modalService.openModal).toHaveBeenCalledWith(MultiChoiceDictionaryModalComponent, {
        title: component.modalHeader,
        dictionaryList: undefined,
        dictionaryType: component.dictionaryType,
        selectedItems: [],
        dictionaryFilter: component.dictionaryFilter,
      });
    });
    it('should be open modal without modalHeader', () => {
      jest.spyOn(modalService, 'openModal');
      component.onClick();
      expect(modalService.openModal).toHaveBeenCalledWith(MultiChoiceDictionaryModalComponent, {
        title: component.subLabel,
        dictionaryList: undefined,
        dictionaryType: component.dictionaryType,
        selectedItems: [],
        dictionaryFilter: component.dictionaryFilter,
      });
    });

    it('should be update value after success close modal', () => {
      jest.spyOn(modalService, 'openModal').mockReturnValue(of([]));
      component.onClick();
      expect(component.selectedItems.list).toEqual([]);
    });

    it('should be  open error modal after error MultiChoiceDictionaryModalComponent', () => {
      jest.spyOn(modalService, 'openModal').mockReturnValue(of(new Error('Dictionary error')));
      component.onClick();
      jest.spyOn(modalService, 'openModal');
      expect(modalService.openModal).toHaveBeenCalledWith(
        ConfirmationModalComponent,
        COMMON_ERROR_MODAL_PARAMS,
      );
    });
  });

  describe('remove', () => {
    it('should be update selectedItems after remove', () => {
      component.selectedItems.list = [
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
      ];
      fixture.detectChanges();
      component.remove('AUT');
      expect(component.selectedItems.list).toEqual([]);
    });
  });

  describe('Readonly', () => {
    it('should not render remove button if isReadonly is TRUE', () => {
      component.isReadonly = true;
      fixture.detectChanges();
      const debugEl = fixture.debugElement.query(By.css('.link-btn'));
      expect(debugEl).toBeFalsy();
    });
  });
});

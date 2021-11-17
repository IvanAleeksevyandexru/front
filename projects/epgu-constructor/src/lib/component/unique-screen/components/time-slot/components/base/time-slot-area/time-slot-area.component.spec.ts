import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimeSlotAreaComponent } from './time-slot-area.component';
import { BaseModule } from '../../../../../../../shared/base.module';
import { FormsModule } from '@angular/forms';
import { TimeSlotSmev3ServiceStub } from '../../../services/smev3/time-slot-smev3.service.stub';
import { TimeSlotSmev3Service } from '../../../services/smev3/time-slot-smev3.service';
import { DictionaryApiService } from '../../../../../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../../../../../shared/services/dictionary/dictionary-api.service.stub';
import { ListItem } from '@epgu/ui/models/dropdown';
import { DepartmentInterface } from '../../../typings';
import {
  DictionaryConditions,
  DictionarySubFilter,
  DictionaryUnionKind,
} from '@epgu/epgu-constructor-types';
import { of } from 'rxjs';
import {
  DictionaryItem,
  DictionaryResponse,
} from '../../../../../../../shared/services/dictionary/dictionary-api.types';

const mockCreateItem = (text: string) =>
  new ListItem({
    id: text,
    text: text,
  });

describe('TimeSlotAreaComponent', () => {
  let component: TimeSlotAreaComponent;
  let fixture: ComponentFixture<TimeSlotAreaComponent>;
  let smev3Service: TimeSlotSmev3Service;
  let dictionaryApiService: DictionaryApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimeSlotAreaComponent],
      imports: [BaseModule, FormsModule],
      providers: [
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide: TimeSlotSmev3Service, useClass: TimeSlotSmev3ServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    dictionaryApiService = TestBed.inject(DictionaryApiService);
    smev3Service = TestBed.inject(TimeSlotSmev3Service);
    fixture = TestBed.createComponent(TimeSlotAreaComponent);
    component = fixture.componentInstance;
  });

  describe('base', () => {
    it('should be presetValue', () => {
      component.presetValue([]);
      expect(component.current).toBe(null);
      const testCase = [mockCreateItem('test')];
      component.presetValue(testCase);
      expect(component.current).toBe(testCase[0]);
    });

    it('should be changedAction', () => {
      const fn = jest.fn();
      const testCase = mockCreateItem('test');
      jest.spyOn(smev3Service, 'area', 'set').mockImplementation(fn);
      component.changedAction(testCase);
      expect(fn).toHaveBeenCalledWith(testCase.id);
    });

    it('should be getList with AreaType', (done) => {
      component
        .getList(
          ({
            value: 'test',
            attributeValues: { AREA_NAME: 'areaName' },
          } as unknown) as DepartmentInterface,
          [],
        )
        .subscribe((v) => {
          expect(v).toEqual([new ListItem({ id: 'areaName', text: 'areaName' })]);
          done();
        });
    });

    it('should be getList not with AreaType', (done) => {
      const attributeValues = { AREA_NAME: 'test' };
      const testCase = [
        new ListItem({ id: attributeValues.AREA_NAME, text: attributeValues.AREA_NAME }),
      ];

      jest
        .spyOn(dictionaryApiService, 'getSelectMapDictionary')
        .mockReturnValue(
          of(({
            items: [({ attributeValues } as unknown) as DictionaryItem],
          } as unknown) as DictionaryResponse),
        );
      component.getList(({} as unknown) as DepartmentInterface, []).subscribe((v) => {
        expect(v).toEqual(testCase);
        done();
      });
    });

    it('should be getOptionsMapDictionary', () => {
      const testCase = {
        filter: {
          union: {
            unionKind: DictionaryUnionKind.AND,
            subs: [
              {
                simple: {
                  attributeName: 'SHOW_ON_MAP',
                  condition: DictionaryConditions.EQUALS,
                  value: { asString: 'false' },
                },
              },
              {
                simple: {
                  attributeName: 'CODE',
                  condition: DictionaryConditions.CONTAINS,
                  value: { asString: '123' },
                },
              },
              {
                simple: {
                  attributeName: 'TEST',
                  condition: DictionaryConditions.CONTAINS,
                  value: { asString: 'test' },
                },
              },
            ],
          },
        },
        selectAttributes: ['*'],
        pageSize: '10000',
      };
      expect(
        component.getOptionsMapDictionary(({ value: '123' } as unknown) as DepartmentInterface, [
          {
            simple: {
              attributeName: 'TEST',
              condition: DictionaryConditions.CONTAINS,
              value: { asString: 'test' },
            },
          },
        ]),
      ).toEqual(testCase);
    });
  });
});

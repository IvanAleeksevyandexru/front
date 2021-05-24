import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormControl } from '@angular/forms';
import { DropDownDeptsComponent } from './drop-down-depts.component';
import { CoreModule } from '../../../core/core.module';
import { BaseModule } from '../../base.module';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { UtilsService } from '../../../core/services/utils/utils.service';
import { UtilsServiceStub } from '../../../core/services/utils/utils.service.stub';
import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';
import { ValidationShowOn } from '@epgu/epgu-lib';
import { CustomListDictionary } from '../../../component/custom-screen/components-list.types';
import { ISuggestionItem } from '../../../core/services/autocomplete/autocomplete.inteface';
import IDropDownDeptsAttrs from './IDropDownDeptsAttrs';
import { configureTestSuite } from 'ng-bullet';
import { ValidationTypeModule } from '../../directives/validation-type/validation-type.module';
import { MockModule } from 'ng-mocks';

const getDictionary = (count = 0, repeatedWithNoFilters = false): CustomListDictionary => {
  const list = [];

  for (let i = 0; i < count; i += 1) {
    list.push({
      value: `R780000${i}`,
    });
  }

  return {
    loading: false,
    loadError: false,
    loadEnd: true,
    paginationLoading: false,
    list,
    page: 0,
    repeatedWithNoFilters,
  } as CustomListDictionary;
};

describe('DropDownDeptsComponent', () => {
  let component: DropDownDeptsComponent;
  let fixture: ComponentFixture<DropDownDeptsComponent>;
  let lockedValue = true;
  let itemsCount = 0;
  let repeatedWithNoFilters = true;

  configureTestSuite(async () => {
    await TestBed.configureTestingModule({
      imports: [CoreModule, BaseModule, RouterTestingModule, MockModule(ValidationTypeModule)],
      declarations: [DropDownDeptsComponent],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: UtilsService, useClass: UtilsServiceStub },
        UnsubscribeService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropDownDeptsComponent);
    component = fixture.componentInstance;
    component.invalid = false;
    component.dictionary = getDictionary(itemsCount, repeatedWithNoFilters);
    component.required = true;
    component.validationShowOn = ValidationShowOn.IMMEDIATE;
    component.control = new FormControl();
    component.clearable = false;
    component.queryMinSymbolsCount = 0;
    component.searchCaseSensitive = false;
    component.virtualScroll = false;
    component.suggest = {} as ISuggestionItem;
    component.attrs = {
      lockedValue,
    } as IDropDownDeptsAttrs;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when lockedValue is false', () => {
    beforeAll(() => {
      lockedValue = false;
    });

    describe('when repeatedWithNoFilters is false', () => {
      beforeAll(() => {
        repeatedWithNoFilters = false;
      });

      describe('when there is 0 items for first fetch', () => {
        beforeAll(() => {
          itemsCount = 0;
        });

        it('should NOT be disabled ', () => {
          expect(component.disabled).toBeFalsy();
        });
      });

      describe('when there is 1 items for first fetch', () => {
        beforeAll(() => {
          itemsCount = 1;
        });

        it('should be disabled ', () => {
          expect(component.disabled).toBeTruthy();
        });
      });

      describe('when there is more than 1 items for first fetch', () => {
        beforeAll(() => {
          itemsCount = 2;
        });

        it('should NOT be disabled ', () => {
          expect(component.disabled).toBeFalsy();
        });
      });
    });

    describe('when repeatedWithNoFilters is true', () => {
      beforeAll(() => {
        repeatedWithNoFilters = true;
      });

      describe('when there is 0 items for first fetch', () => {
        beforeAll(() => {
          itemsCount = 0;
        });

        it('should NOT be disabled ', () => {
          expect(component.disabled).toBeFalsy();
        });
      });

      describe('when there is 1 items for first fetch', () => {
        beforeAll(() => {
          itemsCount = 1;
        });

        it('should be disabled ', () => {
          expect(component.disabled).toBeTruthy();
        });
      });

      describe('when there is more than 1 items for first fetch', () => {
        beforeAll(() => {
          itemsCount = 2;
        });

        it('should NOT be disabled ', () => {
          expect(component.disabled).toBeFalsy();
        });
      });
    });
  });

  describe('when lockedValue is true', () => {
    beforeAll(() => {
      lockedValue = true;
    });

    describe('when repeatedWithNoFilters is false', () => {
      beforeAll(() => {
        repeatedWithNoFilters = false;
      });

      describe('when there is 0 items for first fetch', () => {
        beforeAll(() => {
          itemsCount = 0;
        });

        it('should be disabled ', () => {
          expect(component.disabled).toBeTruthy();
        });
      });

      describe('when there is 1 items for first fetch', () => {
        beforeAll(() => {
          itemsCount = 1;
        });

        it('should be disabled ', () => {
          expect(component.disabled).toBeTruthy();
        });
      });

      describe('when there is more than 1 items for first fetch', () => {
        beforeAll(() => {
          itemsCount = 2;
        });

        it('should be disabled ', () => {
          expect(component.disabled).toBeTruthy();
        });
      });
    });

    describe('when repeatedWithNoFilters is true', () => {
      beforeAll(() => {
        repeatedWithNoFilters = true;
      });

      describe('when there is 0 items for first fetch', () => {
        beforeAll(() => {
          itemsCount = 0;
        });

        it('should NOT be disabled ', () => {
          expect(component.disabled).toBeFalsy();
        });
      });

      describe('when there is 1 items for first fetch', () => {
        beforeAll(() => {
          itemsCount = 1;
        });

        it('should be disabled ', () => {
          expect(component.disabled).toBeTruthy();
        });
      });

      describe('when there is more than 1 items for first fetch', () => {
        beforeAll(() => {
          itemsCount = 2;
        });

        it('should NOT be disabled ', () => {
          expect(component.disabled).toBeFalsy();
        });
      });
    });
  });
});

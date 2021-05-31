import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { ValidationShowOn } from '@epgu/epgu-lib';
import { of } from 'rxjs';
import { ConstructorLookupComponent } from './constructor-lookup.component';
import { BaseModule } from '../../base.module';
import { configureTestSuite } from 'ng-bullet';

describe('ConstructorLookupComponent', () => {
  let component: ConstructorLookupComponent;
  let fixture: ComponentFixture<ConstructorLookupComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ConstructorLookupComponent],
      imports: [BaseModule],
      providers: [
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructorLookupComponent);
    component = fixture.componentInstance;
    component.clearable = true;
    component.control = new FormControl();
    component.invalid = true;
    component.fixedItems = [];
    component.itemsProvider = {
      search: (query, context) => {
        return of([]);
      },
    };
    component.queryMinSymbolsCount = 1;
    component.showExpandCollapse = true;
    component.showSuggestion = true;
    component.virtualScroll = true;
    component.validationShowOn = ValidationShowOn.IMMEDIATE;
    component.searchCaseSensitive = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

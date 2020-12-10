import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ValidationShowOn } from 'epgu-lib';

import { ConstructorLookupComponent } from './constructor-lookup.component';
import { CoreModule } from '../../../core/core.module';
import { FormControl } from '@angular/forms';

describe('ConstructorLookupComponent', () => {
  let component: ConstructorLookupComponent;
  let fixture: ComponentFixture<ConstructorLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConstructorLookupComponent],
      imports: [CoreModule, RouterTestingModule],
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

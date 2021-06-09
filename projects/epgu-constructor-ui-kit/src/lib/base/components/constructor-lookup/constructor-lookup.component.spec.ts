import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormControlDirective } from '@angular/forms';
import { LookupProvider, ValidationShowOn } from '@epgu/epgu-lib';
import { of } from 'rxjs';
import { ConstructorLookupComponent } from './constructor-lookup.component';
import { BaseUiModule } from '../../base-ui.module';
import { configureTestSuite } from 'ng-bullet';
import { By } from '@angular/platform-browser';

describe('ConstructorLookupComponent', () => {
  let component: ConstructorLookupComponent;
  let fixture: ComponentFixture<ConstructorLookupComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ConstructorLookupComponent],
      imports: [BaseUiModule],
      providers: [],
    }).compileComponents();
  });

  let control: FormControl;
  let itemsProvider: LookupProvider;
  const formatter = () => '';

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructorLookupComponent);
    component = fixture.componentInstance;
    component.showNotFound = true;
    component.clearable = true;
    component.control = control = new FormControl();
    component.invalid = true;
    component.fixedItems = [];
    component.itemsProvider = itemsProvider = {
      search: (query, context) => {
        return of([]);
      },
    };
    component.disabled = true;
    component.formatter = formatter;
    component.showMagnifyingGlass = true;
    component.queryMinSymbolsCount = 1;
    component.showExpandCollapse = true;
    component.showSuggestion = true;
    component.virtualScroll = true;
    component.validationShowOn = ValidationShowOn.IMMEDIATE;
    component.searchCaseSensitive = true;
    fixture.detectChanges();
  });

  it('should render lib-lookup', () => {
    const selector = 'lib-lookup';

    const debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();

    expect(debugEl.componentInstance.showNotFound).toBeTruthy();
    expect(debugEl.componentInstance.invalid).toBeTruthy();
    expect(debugEl.componentInstance.validationShowOn).toBe(ValidationShowOn.IMMEDIATE);
    expect(debugEl.injector.get(FormControlDirective).form).toBe(control);
    expect(debugEl.componentInstance.queryMinSymbolsCount).toBe(1);
    expect(debugEl.componentInstance.searchCaseSensitive).toBeFalsy();
    expect(debugEl.componentInstance.fixedItems).toEqual([]);
    expect(debugEl.componentInstance.virtualScroll).toBeTruthy();
    expect(debugEl.componentInstance.itemsProvider).toBe(itemsProvider);
    expect(debugEl.componentInstance.disabled).toBeTruthy();
    expect(debugEl.componentInstance.formatter).toBe(formatter);
    expect(debugEl.componentInstance.showMagnifyingGlass).toBeTruthy();
    expect(debugEl.componentInstance.showExpandCollapse).toBeTruthy();

    component.showNotFound = false;
    component.invalid = false;
    component.validationShowOn = ValidationShowOn.TOUCHED;
    component.queryMinSymbolsCount = 2;
    component.virtualScroll = false;
    component.disabled = false;
    component.showMagnifyingGlass = false;
    component.showExpandCollapse = false;
    fixture.detectChanges();

    expect(debugEl.componentInstance.showNotFound).toBeFalsy();
    expect(debugEl.componentInstance.invalid).toBeFalsy();
    expect(debugEl.componentInstance.validationShowOn).toBe(ValidationShowOn.TOUCHED);
    expect(debugEl.componentInstance.queryMinSymbolsCount).toBe(2);
    expect(debugEl.componentInstance.virtualScroll).toBeTruthy(); // почему-то независимо от @Input() virtualScroll, всегда передается true
    expect(debugEl.componentInstance.disabled).toBeFalsy();
    expect(debugEl.componentInstance.showMagnifyingGlass).toBeFalsy();
    expect(debugEl.componentInstance.showExpandCollapse).toBeFalsy();
  });

  it('should emit changed event', () => {
    jest.spyOn(component.changed, 'emit');

    const selector = 'lib-lookup';
    const debugEl = fixture.debugElement.query(By.css(selector));
    debugEl.triggerEventHandler('changed', {
      id: 1,
      text: 'some text',
    });

    expect(component.changed.emit).toBeCalledTimes(1);
    expect(component.changed.emit).toBeCalledWith({
      id: 1,
      text: 'some text',
    });
  });
});

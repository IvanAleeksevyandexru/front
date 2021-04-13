import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ValidationShowOn } from 'epgu-lib';
import { of } from 'rxjs';
import { CoreModule } from '../../../core/core.module';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { CachedAnswersService } from '../../services/cached-answers/cached-answers.service';
import { UtilsService } from '../../../core/services/utils/utils.service';
import { UtilsServiceStub } from '../../../core/services/utils/utils.service.stub';
import { ConstructorLookupComponent } from './constructor-lookup.component';
import { ValidationTypeModule } from '../../directives/validation-type/validation-type.module';
import { BaseModule } from '../../base.module';
import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';
import { configureTestSuite } from 'ng-bullet';

describe('ConstructorLookupComponent', () => {
  let component: ConstructorLookupComponent;
  let fixture: ComponentFixture<ConstructorLookupComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ConstructorLookupComponent],
      imports: [CoreModule, BaseModule, RouterTestingModule, ValidationTypeModule],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: UtilsService, useClass: UtilsServiceStub },
        CurrentAnswersService,
        CachedAnswersService,
        UnsubscribeService,
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

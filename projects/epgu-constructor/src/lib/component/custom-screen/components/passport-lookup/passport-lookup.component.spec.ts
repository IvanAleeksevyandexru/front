import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MockComponents, MockProviders } from 'ng-mocks';
import { By } from '@angular/platform-browser';
import { PassportLookupComponent } from './passport-lookup.component';
import { ComponentsListRelationsService } from '../../services/components-list-relations/components-list-relations.service';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import { ComponentsListFormServiceStub } from '../../services/components-list-form/components-list-form.service.stub';
import { PassportComponent } from '../../../../shared/components/add-passport/passport.component';
import { ComponentItemComponent } from '../component-item/component-item.component';
import { SuggestHandlerService } from '../../../../shared/services/suggest-handler/suggest-handler.service';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';

describe('PassportLookupComponent', () => {
  let component: PassportLookupComponent;
  let fixture: ComponentFixture<PassportLookupComponent>;
  let formService: ComponentsListFormService;
  let screenService: ScreenService;
  let control: FormGroup;
  let valueControl: FormControl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PassportLookupComponent,
        MockComponents(ComponentItemComponent, PassportComponent),
      ],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [
        MockProviders(ComponentsListRelationsService, SuggestHandlerService),
        { provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
      ],
    })
      .overrideComponent(PassportLookupComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    formService = TestBed.inject(ComponentsListFormService);
    screenService = TestBed.inject(ScreenService);
    valueControl = new FormControl('foo');
    control = new FormGroup({
      id: new FormControl('someId'),
      value: valueControl,
      attrs: new FormControl('fake attrs'),
    });
    formService['_form'] = new FormArray([control]);
    fixture = TestBed.createComponent(PassportLookupComponent);
    component = fixture.componentInstance;
    component.componentIndex = 0;
    fixture.detectChanges();
  });

  it('should extend AbstractComponentListItemComponent', () => {
    expect(component).toBeInstanceOf(PassportLookupComponent);
  });

  it('should render', () => {
    const debugEl = fixture.debugElement.query(By.css('epgu-constructor-component-item'));
    expect(debugEl).toBeTruthy();
    expect(debugEl.componentInstance.control).toBe(valueControl);
    expect(debugEl.componentInstance.component).toEqual(control.value);
  });

  it('epgu-constructor-passport', () => {
    const selector = 'epgu-constructor-passport';
    const debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl.componentInstance.attrs).toBe('fake attrs');
    expect(debugEl.componentInstance.suggestions).toBeUndefined();

    screenService.suggestions = { someId: { value: 'fake suggestion' }} as any;
    fixture.detectChanges();
    expect(debugEl.componentInstance.suggestions).toEqual({ value: 'fake suggestion' });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MockComponents, MockProvider } from 'ng-mocks';
import { By } from '@angular/platform-browser';
import { MultiChoiceDictionaryComponent } from './multi-choice-dictionary.component';
import { ComponentItemComponent } from '../component-item/component-item.component';
import { ComponentsListRelationsService } from '../../services/components-list-relations/components-list-relations.service';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import { ComponentsListFormServiceStub } from '../../services/components-list-form/components-list-form.service.stub';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { MultipleChoiceDictionaryComponent } from '../../../../shared/components/multiple-choice-dictionary/multiple-choice-dictionary/multiple-choice-dictionary.component';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { ScreenService } from '../../../../screen/screen.service';
import { DictionaryService } from '../../../../shared/services/dictionary/dictionary.service';
import { DictionaryServiceStub } from '../../../../shared/services/dictionary/dictionary.service.stub';
import AbstractDictionaryLikeComponent from '../abstract-component-list-item/abstract-dictionary-like.component';
import { ComponentsListToolsService } from '../../services/components-list-tools/components-list-tools.service';
import { ComponentsListRelationsServiceStub } from '../../services/components-list-relations/components-list-relations.service.stub';
import { InviteService } from '../../../../core/services/invite/invite.service';
import { InviteServiceStub } from '../../../../core/services/invite/invite.service.stub';
import MultipleChoiceDictionaryModelAttrs from './MultipleChoiceDictionaryModelAttrs';

describe('MultiChoiceDictionaryComponent', () => {
  let component: MultiChoiceDictionaryComponent;
  let fixture: ComponentFixture<MultiChoiceDictionaryComponent>;
  let formService: ComponentsListFormServiceStub;
  let valueControl: FormControl;
  let control: FormGroup;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        MultiChoiceDictionaryComponent,
        MockComponents(ComponentItemComponent, MultipleChoiceDictionaryComponent),
      ],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [
        MockProvider(DictionaryToolsService),
        MockProvider(ComponentsListToolsService),
        { provide: DictionaryService, useClass: DictionaryServiceStub },
        { provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ComponentsListRelationsService, useClass: ComponentsListRelationsServiceStub },
        { provide: InviteService, useClass: InviteServiceStub },
      ],
    })
      .overrideComponent(MultiChoiceDictionaryComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    formService = (TestBed.inject(
      ComponentsListFormService,
    ) as unknown) as ComponentsListFormServiceStub;
    valueControl = new FormControl('foo');
    control = new FormGroup({
      value: valueControl,
      label: new FormControl('fake label'),
      attrs: new FormGroup({
        dictionaryList: new FormControl('fake dictionaryList'),
        dictionaryType: new FormControl('fake dictionaryType'),
        subLabel: new FormControl('fake subLabel'),
        isLoadingNeeded: new FormControl(jest.fn().mockReturnValue(false)),
      }),
    });
    formService._form = new FormArray([control]);
    fixture = TestBed.createComponent(MultiChoiceDictionaryComponent);
    component = fixture.componentInstance;
    component.componentIndex = 0;
    fixture.detectChanges();
  });

  it('should extend AbstractComponentListItemComponent', () => {
    expect(component).toBeInstanceOf(AbstractComponentListItemComponent);
  });

  it('should extend AbstractDictionaryLikeComponent', () => {
    expect(component).toBeInstanceOf(AbstractDictionaryLikeComponent);
  });

  describe('epgu-constructor-component-item', () => {
    const selector = 'epgu-constructor-component-item';

    it('should render', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeTruthy();
      expect(debugEl.componentInstance.control).toBe(valueControl);
      expect(debugEl.componentInstance.component).toEqual(control.value);
    });

    it('should set error', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));
      component.control.setErrors({ required: true });
      fixture.detectChanges();
      expect(debugEl.componentInstance.invalid).toBeTruthy();
    });
  });

  it('epgu-constructor-multiple-choice-dictionary', () => {
    const selector = 'epgu-constructor-multiple-choice-dictionary';
    const debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl.componentInstance.label).toBe('fake label');
    expect(debugEl.componentInstance.dictionaryList).toBe('fake dictionaryList');
    expect(debugEl.componentInstance.dictionaryType).toBe('fake dictionaryType');
    expect(debugEl.componentInstance.subLabel).toBe('fake subLabel');
  });

  describe('when there is no dictionaryType', () => {
    let savedAttrs;
    beforeEach(() => {
      savedAttrs = control.value.attrs;
      control.value.attrs = new MultipleChoiceDictionaryModelAttrs({
        ...control.value.attrs,
        dictionaryType: undefined,
        dictionaryList: [],
      });
    });

    afterEach(() => {
      control.value.attrs = savedAttrs;
    });

    it('not do getDictionary request', () => {
      const getDictSpy = jest.spyOn(component, 'getDictionary');

      component.ngOnInit();

      expect(getDictSpy).not.toHaveBeenCalled();
    });
  });

  describe('when there is dictionaryType', () => {
    let savedAttrs;
    beforeEach(() => {
      savedAttrs = control.value.attrs;
      control.value.attrs = new MultipleChoiceDictionaryModelAttrs({
        ...control.value.attrs,
        dictionaryType: 'SOME_DICTIONARY',
        dictionaryList: undefined,
      });
    });

    afterEach(() => {
      control.value.attrs = savedAttrs;
    });

    it('do getDictionary request', () => {
      const getDictSpy = jest.spyOn(component, 'getDictionary');

      component.ngOnInit();

      expect(getDictSpy).toHaveBeenCalledTimes(1);
      expect(getDictSpy).toHaveBeenCalledWith({
        additionalParams: undefined,
        excludedParams: [],
        pageNum: 0,
      });
    });
  });
});

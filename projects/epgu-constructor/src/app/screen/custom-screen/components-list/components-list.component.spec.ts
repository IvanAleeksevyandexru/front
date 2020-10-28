import { ComponentsListComponent } from './components-list.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DictionaryApiService } from '../../services/dictionary-api/dictionary-api.service';
import { ScreenService } from '../../screen.service';
import { ConfigService } from '../../../shared/config/config.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ScreenServiceStub } from '../../screen.service.stub';
import { MaskHandlePipe } from '../../../shared/pipes/mask-handle/mask-handle.pipe';
import { FormsModule, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ValidationService } from '../services/validation.service';
import { DictionaryApiServiceStub } from '../../services/dictionary-api/dictionary-api.service.stub';
import { ConfigServiceStub } from '../../../shared/config/config.service.stub';
import { AddressHelperService } from './address-helper.service';
import { ComponentListFormService } from './services/component-list-form.service';


xdescribe('ComponentsListComponent', () => {
  let component: ComponentsListComponent;
  let fixture: ComponentFixture<ComponentsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [ ComponentsListComponent, MaskHandlePipe ],
      providers: [
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide:  ConfigService, useClass: ConfigServiceStub },
        ComponentListFormService,
      ],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
      ]
    });

    TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentsListComponent);
    component = fixture.componentInstance;
    // fixture.debugElement.injector.get(DictionaryApiService);
    // fixture.debugElement.injector.get(ScreenService);
    // fixture.debugElement.injector.get(ConfigService);
    // fixture.debugElement.injector.get(UnsubscribeService);
    // fixture.debugElement.injector.get(ValidationService);
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

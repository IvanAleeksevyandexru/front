import { ComponentsListComponent } from './components-list.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DictionaryApiService } from '../shared/services/dictionary-api/dictionary-api.service';
import { ConfigService } from '../../core/config/config.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaskHandlePipe } from '../../shared/pipes/mask-handle/mask-handle.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DictionaryApiServiceStub } from '../shared/services/dictionary-api/dictionary-api.service.stub';
import { ConfigServiceStub } from '../../core/config/config.service.stub';
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
import { ComponentsListComponent } from './components-list.component';
import { ComponentFixture, TestBed, waitForAsync, tick } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DictionaryApiService } from '../../../services/api/dictionary-api/dictionary-api.service';
import { ScreenService } from '../../screen.service';
import { ConfigService } from '../../../config/config.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ScreenServiceStub } from '../../screen.service.stub';
import { MaskHandlePipe } from '../../../shared/pipes/mask-handle/mask-handle.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UnsubscribeService } from '../../../services/unsubscribe/unsubscribe.service';
import { ValidationService } from '../services/validation.service';
import { DictionaryApiServiceStub } from '../../../services/api/dictionary-api/dictionary-api.service.stub';
import { ConfigServiceStub } from '../../../config/config.service.stub';


describe('ComponentsListComponent', () => {
  let component: ComponentsListComponent;
  let fixture: ComponentFixture<ComponentsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [ ComponentsListComponent, MaskHandlePipe ],
      providers: [
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide:  ConfigService, useClass: ConfigServiceStub },
        UnsubscribeService,
        ValidationService,
        { provide: ScreenService, useClass: ScreenServiceStub },
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
    // fixture = TestBed.createComponent(ComponentsListComponent);
    // component = fixture.componentInstance;
    // component.ngOnInit();
    // fixture.debugElement.injector.get(DictionaryApiService);
    // fixture.debugElement.injector.get(ScreenService);
    // fixture.debugElement.injector.get(ConfigService);
    // fixture.debugElement.injector.get(UnsubscribeService);
    // fixture.debugElement.injector.get(ValidationService);
    // fixture.detectChanges();
  });

  it('should create', () => {
    // expect(component).toBeTruthy();
  });
});

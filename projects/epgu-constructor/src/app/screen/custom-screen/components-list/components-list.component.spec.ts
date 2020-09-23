import { ComponentsListComponent } from './components-list.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DictionaryApiService } from '../../../services/api/dictionary-api/dictionary-api.service';
import { ScreenService } from '../../screen.service';
import { ConfigService } from '../../../config/config.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ScreenServiceStub } from '../../screen.service.stub';
import { MaskHandlePipe } from '../../../shared/pipes/mask-handle/mask-handle.pipe';
import { FormsModule } from '@angular/forms';


describe('ComponentsListComponent', () => {
  let component: ComponentsListComponent;
  let fixture: ComponentFixture<ComponentsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [ ComponentsListComponent, MaskHandlePipe ],
      providers: [
        DictionaryApiService,
        ConfigService,
        { provide: ScreenService, useClass: ScreenServiceStub },
      ],
      imports: [
        HttpClientTestingModule,
        FormsModule,
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentsListComponent);
    component = fixture.componentInstance;

    fixture.debugElement.injector.get(DictionaryApiService);
    fixture.debugElement.injector.get(ScreenService);
    fixture.debugElement.injector.get(ConfigService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

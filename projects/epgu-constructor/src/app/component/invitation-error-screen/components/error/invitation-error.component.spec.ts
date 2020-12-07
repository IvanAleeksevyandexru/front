import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ValidationService } from 'epgu-lib';
import { UnsubscribeService } from 'projects/epgu-constructor/src/app/core/services/unsubscribe/unsubscribe.service';
import { ConfigService } from '../../../../core/config/config.service';
import { ConfigServiceStub } from '../../../../core/config/config.service.stub';
import { ImgPrefixerPipe } from '../../../../core/pipes/img-prefixer/img-prefixer.pipe';
import { InvitationErrorComponent } from './invitation-error.component';
import { ConstructorPlainInputModule } from '../../../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { ComponentAttrsDto } from '../../../../form-player/services/form-player-api/form-player-api.types';


xdescribe('InvitationErrorComponent', () => {
  let component: InvitationErrorComponent;
  let fixture: ComponentFixture<InvitationErrorComponent>;
  let http: HttpTestingController;
  let config: ConfigService;
  let validationService: ValidationService;
  const mockData = { label: '', attrs: { url: '' } as ComponentAttrsDto, id: '', type: '' };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [InvitationErrorComponent, ImgPrefixerPipe],
      imports: [HttpClientTestingModule, ConstructorPlainInputModule],
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        ValidationService,
        UnsubscribeService,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationErrorComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
    http = TestBed.inject(HttpTestingController);
    config = TestBed.inject(ConfigService);
    validationService = TestBed.inject(ValidationService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

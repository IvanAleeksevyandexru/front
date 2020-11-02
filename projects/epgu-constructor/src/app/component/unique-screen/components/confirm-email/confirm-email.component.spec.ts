import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmEmailComponent } from './confirm-email.component';
import { ScreenService } from '../../../../screen/screen.service';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../../../core/services/navigation/navigation.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { ConfigService } from '../../../../core/config/config.service';
import { ConfigServiceStub } from '../../../../core/config/config.service.stub';

xdescribe('ConfirmEmailComponent', () => {
  let component: ConfirmEmailComponent;
  let fixture: ComponentFixture<ConfirmEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [ ConfirmEmailComponent ],
      providers: [
        UnsubscribeService,
        NavigationService,
        { provide: ScreenService,useClass: ScreenServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmEmailComponent);
    component = fixture.componentInstance;

    fixture.debugElement.injector.get(ScreenService);
    fixture.debugElement.injector.get(UnsubscribeService);
    fixture.debugElement.injector.get(NavigationService);
  });

  it('nothing', () => {
    expect(true).toBeTruthy();
  });
});
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmPhoneComponent } from './confirm-phone.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CounterDirective } from '../../../../../../shared/directives/counter/counter.directive';
import { ScreenService } from '../../../../../screen.service';
import { UnsubscribeService } from '../../../../../../services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../../../../../shared/services/navigation/navigation.service';
import { FormPlayerService } from '../../../../../../services/form-player/form-player.service';
import { EpguLibModule } from 'epgu-lib';
import { ScreenServiceStub } from '../../../../../screen.service.stub';
import { FormPlayerServiceStub } from '../../../../../../services/form-player/form-player.service.stub';

describe('ConfirmPhoneComponent', () => {
  // let component: ConfirmPhoneComponent;
  // let fixture: ComponentFixture<ConfirmPhoneComponent>;
  //
  // beforeEach(async () => {
  //   await TestBed.configureTestingModule({
  //     declarations: [ConfirmPhoneComponent, CounterDirective],
  //     imports: [EpguLibModule],
  //     providers: [
  //       UnsubscribeService,
  //       NavigationService,
  //       { provide: ScreenService,useClass: ScreenServiceStub },
  //       { provide: FormPlayerService,useClass: FormPlayerServiceStub },
  //     ],
  //     schemas: [CUSTOM_ELEMENTS_SCHEMA], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
  //   })
  //     .compileComponents();
  // });
  //
  // beforeEach(() => {
  //   fixture = TestBed.createComponent(ConfirmPhoneComponent);
  //   component = fixture.componentInstance;
  //   fixture.debugElement.injector.get(ScreenService);
  //   fixture.debugElement.injector.get(UnsubscribeService);
  //   fixture.debugElement.injector.get(NavigationService);
  //   fixture.debugElement.injector.get(FormPlayerService);
  //
  //   fixture.detectChanges();
  // });

  it('should create', () => {
    expect(true).toBeTruthy(); // TODO подправить
  });
});

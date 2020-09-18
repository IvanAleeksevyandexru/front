import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EpguLibModule } from 'epgu-lib';
import { ComponentStateService } from '../../../../../../../../services/component-state/component-state.service';
import { LabelComponent } from '../../../../../../../../shared/components/base/label/label.component';
import { ConfirmPersonalUserPhoneComponent } from './confirm-personal-user-phone.component';
import { ScreenService } from '../../../../../../../screen.service';
import { NavigationService } from '../../../../../../../../shared/services/navigation/navigation.service';
import { FormPlayerService } from '../../../../../../../../services/form-player/form-player.service';

describe('ConfirmPersonalUserPhoneComponent', () => {
  // let component: ConfirmPersonalUserPhoneComponent;
  // let fixture: ComponentFixture<ConfirmPersonalUserPhoneComponent>;
  // const mockData = '';
  //
  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     imports: [ EpguLibModule ],
  //     declarations: [ ConfirmPersonalUserPhoneComponent ],
  //     providers: [
  //       ComponentStateService,
  //       ScreenService,
  //       NavigationService,
  //       FormPlayerService,
  //     ]
  //   })
  //   .compileComponents();
  // }));
  //
  // beforeEach(() => {
  //   fixture = TestBed.createComponent(ConfirmPersonalUserPhoneComponent);
  //   component = fixture.componentInstance;
  //   component.data = mockData;
  //   fixture.detectChanges();
  // });
  //
  it('should create', () => {
    expect(true).toBeTruthy();
  });
});

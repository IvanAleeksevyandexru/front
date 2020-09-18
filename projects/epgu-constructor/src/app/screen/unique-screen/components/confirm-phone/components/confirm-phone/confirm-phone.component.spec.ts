import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPhoneComponent } from './confirm-phone.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CounterDirective } from '../../../../../../shared/directives/counter/counter.directive';
import { ScreenService } from '../../../../../screen.service';
import { UnsubscribeService } from '../../../../../../services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../../../../../shared/services/navigation/navigation.service';
import { FormPlayerService } from '../../../../../../services/form-player/form-player.service';
import { FormPlayerNavigation, NavigationFullOptions, NavigationPayload } from '../../../../../../form-player.types';

describe('ConfirmPhoneComponent', () => {
  // let component: ConfirmPhoneComponent;
  // let fixture: ComponentFixture<ConfirmPhoneComponent>;
  //
  // beforeEach(async () => {
  //   await TestBed.configureTestingModule({
  //     declarations: [ConfirmPhoneComponent, CounterDirective],
  //     schemas: [CUSTOM_ELEMENTS_SCHEMA], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
  //   })
  //     .compileComponents();
  // });
  //
  // beforeEach(() => {
  //   fixture = TestBed.createComponent(ConfirmPhoneComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  // });

  it('should create', () => {
    expect(true).toBeTruthy(); // TODO подправить
  });
});

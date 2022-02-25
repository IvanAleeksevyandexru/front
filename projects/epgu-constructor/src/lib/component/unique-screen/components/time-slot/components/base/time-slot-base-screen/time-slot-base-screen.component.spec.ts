import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule } from '@angular/forms';
import {
  ObjectHelperService,
  PREV_BUTTON_NAVIGATION,
  ScreenContainerModule,
} from '@epgu/epgu-constructor-ui-kit';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MockModule } from 'ng-mocks';
import { TimeSlotBaseScreenComponent } from './time-slot-base-screen.component';
import { BaseModule } from '../../../../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../../../../shared/components/base-components/base-components.module';
import { CurrentAnswersService } from '../../../../../../../screen/current-answers.service';
import { CurrentAnswersServiceStub } from '../../../../../../../screen/current-answers-service.stub';
import { ScreenServiceStub } from '../../../../../../../screen/screen.service.stub';
import { ScreenService } from '../../../../../../../screen/screen.service';

import { PrevButtonNavigationServiceStub } from '../../../../../../../core/services/prev-button-navigation/prev-button-navigation.service.stub';

const testHeader = 'testHeader';
const testShowNav = true;

@Component({
  template: `<epgu-constructor-time-slot-base-screen
    header="${testHeader}"
    showNav="${testShowNav}"
  >
    <ng-container time-slot-content><div class="test-content"></div></ng-container>
    <ng-container time-slot-footer><div class="test-footer"></div></ng-container>
  </epgu-constructor-time-slot-base-screen>`,
})
class TestScreenComponent {}

describe('TimeSlotBaseScreenComponent', () => {
  let component: TestScreenComponent;
  let fixture: ComponentFixture<TestScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimeSlotBaseScreenComponent, TestScreenComponent],
      imports: [FormsModule, BaseModule, ScreenContainerModule, BaseComponentsModule],
      providers: [
        { provide: CurrentAnswersService, useClass: CurrentAnswersServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: PREV_BUTTON_NAVIGATION, useClass: PrevButtonNavigationServiceStub },
        ObjectHelperService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('base', () => {
    it('should be header', () => {
      expect(
        fixture.debugElement
          .query(By.css('epgu-constructor-page-name h1'))
          ?.nativeElement?.innerHTML?.trim(),
      ).toBe(testHeader);
    });
    it('should be showNav', () => {
      expect(
        fixture.debugElement.query(By.css('epgu-constructor-time-slot-base-screen'))
          .componentInstance?.showNav,
      ).toBe('true');
    });
    it('should be content', () => {
      expect(fixture.debugElement.query(By.css('.test-content'))).not.toBeNull();
    });
    it('should be footer', () => {
      expect(fixture.debugElement.query(By.css('.test-footer'))).not.toBeNull();
    });
  });
});

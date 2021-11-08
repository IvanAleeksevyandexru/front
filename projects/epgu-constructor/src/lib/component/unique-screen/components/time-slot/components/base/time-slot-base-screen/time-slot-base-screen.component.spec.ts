import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';

import { TimeSlotBaseScreenComponent } from './time-slot-base-screen.component';
import { FormsModule } from '@angular/forms';
import { BaseModule } from '../../../../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../../../../shared/components/base-components/base-components.module';
import { PREV_BUTTON_NAVIGATION, ScreenContainerModule } from '@epgu/epgu-constructor-ui-kit';
import { Component } from '@angular/core';
import { CurrentAnswersService } from '../../../../../../../screen/current-answers.service';
import { CurrentAnswersServiceStub } from '../../../../../../../screen/current-answers-service.stub';
import { ScreenServiceStub } from '../../../../../../../screen/screen.service.stub';
import { ScreenService } from '../../../../../../../screen/screen.service';
import { By } from '@angular/platform-browser';

import { PrevButtonNavigationServiceStub } from '../../../../../../../core/services/prev-button-navigation/prev-button-navigation.service.stub';
import { MockModule } from 'ng-mocks';

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

  configureTestSuite(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimeSlotBaseScreenComponent, TestScreenComponent],
      imports: [FormsModule, BaseModule, ScreenContainerModule, BaseComponentsModule],
      providers: [
        { provide: CurrentAnswersService, useClass: CurrentAnswersServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: PREV_BUTTON_NAVIGATION, useClass: PrevButtonNavigationServiceStub },
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

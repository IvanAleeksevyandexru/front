import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlainInputComponent } from '@epgu/ui/controls';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { FocusManagerService } from './focus-manager.service';
import { DatesToolsService } from '../dates-tools/dates-tools.service';
import { EventBusService } from '../event-bus/event-bus.service';
import { TrimModule } from '../../../base/directives/trim/trim.module';
import { TextTransformModule } from '../../../base/directives/text-transform/text-transform.module';
import { CurrencyModule } from '../../../base/directives/currency/currency.module';
import { RankPipeModule } from '../../../base/pipes/rank/rank-pipe.module';
import { BaseUiModule } from '../../../base/base-ui.module';

@Component({
  template: '<lib-plain-input [id]="id" [name]="name"></lib-plain-input>',
})
class TestPlainInputComponent {
  id = 'testId';

  name = 'test';
}

describe('FocusManagerService', () => {
  let service: FocusManagerService;
  let fixture: ComponentFixture<TestPlainInputComponent>;
  let component: TestPlainInputComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FocusManagerService, DatesToolsService, EventBusService],
      imports: [BaseUiModule, CurrencyModule, TrimModule, TextTransformModule, RankPipeModule],
      declarations: [TestPlainInputComponent],
    });
    fixture = TestBed.createComponent(TestPlainInputComponent);
    service = TestBed.inject(FocusManagerService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be focus event in state', (done) => {
    service.stateComponent$('test').subscribe((v) => {
      expect(v?.current?.name).toBe('test');
      done();
    });
    const element: PlainInputComponent = fixture.debugElement.query(By.css('lib-plain-input'))
      ?.componentInstance;

    element.notifyFocusEvent(new FocusEvent('focus'));
    fixture.detectChanges();
  });
});

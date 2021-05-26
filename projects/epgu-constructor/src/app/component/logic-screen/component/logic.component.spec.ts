import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { LogicComponent } from './logic.component';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { LogicService } from '../service/logic.service';
import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';
import { BaseModule } from '../../../shared/base.module';
import { LocalStorageService, LocalStorageServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { ChangeDetectionStrategy } from '@angular/core';
import { configureTestSuite } from 'ng-bullet';
import { ApplicantAnswersDto } from '@epgu/epgu-constructor-types';

describe('LogicComponent', () => {
  let component: LogicComponent;
  let fixture: ComponentFixture<LogicComponent>;
  let screenService: ScreenService;
  let logicService: LogicService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [LogicComponent],
      imports: [BaseModule],
      providers: [
        LogicService,
        UnsubscribeService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
      ],
    })
      .overrideComponent(LogicComponent, {
        set: {
          changeDetection: ChangeDetectionStrategy.Default,
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogicComponent);
    component = fixture.componentInstance;
    logicService = TestBed.inject(LogicService);
    screenService = TestBed.inject(ScreenService);
    screenService.logicComponents = [
      {
        id: 'rest1',
        type: 'RestCall',
        attrs: {},
        value: JSON.stringify({
          url: 'url',
          headers: { headers: 'headers' },
          method: 'POST',
          body: 'body',
          path: 'path',
        }),
      },
    ];
    fixture.detectChanges();
  });

  it('should be set logicAnswers', () => {
    const applicantAnswersDto: ApplicantAnswersDto = {
      rest: {
        visited: true,
        value: 'value',
      },
    };
    jest.spyOn(logicService, 'fetch').mockReturnValue([of(applicantAnswersDto)]);
    component.components$.subscribe();
    expect(screenService.logicAnswers).toEqual(applicantAnswersDto);
  });
});

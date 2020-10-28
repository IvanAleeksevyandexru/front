import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnsubscribeService } from '../../shared/services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../shared/services/navigation/navigation.service';
import { ScreenService } from '../screen.service';
import { ScreenStore, ScreenTypes } from '../screen.types';
import { SharedModule } from '../../shared/shared.module';
import { QuestionsScreenComponent } from './questions-screen.component';
import { EpguLibModule } from 'epgu-lib';
import { ElementRef, Renderer2 } from '@angular/core';

xdescribe('QuestionsScreenComponent', () => {
  let component: QuestionsScreenComponent;
  let fixture: ComponentFixture<QuestionsScreenComponent>;
  let navService: NavigationService;
  let screenService: ScreenService;
  const screenDataMock: ScreenStore = {
    display: {
      components: [
        {
          attrs: {},
          id: 'sd',
          label: '',
          type: '',
          visited: true,
          value: ''
        }
      ],
      header: '',
      id: '',
      name: '',
      submitLabel: '',
      type: ScreenTypes.QUESTION
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        EpguLibModule
      ],
      declarations: [QuestionsScreenComponent],
      providers: [
        NavigationService,
        Renderer2,
        ElementRef,
        UnsubscribeService,
        ScreenService,
      ]
    })
    .compileComponents();
  });

  it('nothing', () => {
    expect(true).toBeTruthy();
  });
});

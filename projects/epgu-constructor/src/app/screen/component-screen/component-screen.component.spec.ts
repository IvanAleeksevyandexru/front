import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MockComponents } from 'ng-mocks';
import { NavigationService } from '../../core/services/navigation/navigation.service';
import { NavigationServiceStub } from '../../core/services/navigation/navigation.service.stub';
import { ScreenService } from '../screen.service';
import { ScreenServiceStub } from '../screen.service.stub';
import { ComponentScreenComponent } from './component-screen.component';
import { ComponentResolverComponent } from '../../component/component-resolver/component-resolver.component';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { CurrentAnswersService } from '../current-answers.service';
import { EventBusService } from '../../core/services/event-bus/event-bus.service';

describe('ComponentScreenComponent', () => {
  let component: ComponentScreenComponent;
  let fixture: ComponentFixture<ComponentScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [
        ComponentScreenComponent,
        MockComponents(ComponentResolverComponent),
      ],
      providers: [
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        UnsubscribeService,
        CurrentAnswersService,
        EventBusService,
      ],
    })
      .overrideComponent(ComponentScreenComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

});
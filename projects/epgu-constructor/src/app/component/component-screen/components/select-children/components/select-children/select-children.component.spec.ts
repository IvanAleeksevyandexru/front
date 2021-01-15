import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HealthService } from 'epgu-lib';

import { SelectChildrenComponent } from './select-children.component';
import { CoreModule } from '../../../../../../core/core.module';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import { EventBusService } from '../../../../../../core/services/event-bus/event-bus.service';

describe('SelectChildrenComponent', () => {
  let component: SelectChildrenComponent;
  let fixture: ComponentFixture<SelectChildrenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectChildrenComponent],
      imports: [CoreModule, RouterTestingModule, ReactiveFormsModule],
      providers: [UnsubscribeService, HealthService, EventBusService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectChildrenComponent);
    fixture.debugElement.injector.get(UnsubscribeService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

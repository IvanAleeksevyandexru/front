import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { MicroAppComponentResolverComponent } from './micro-app-component-resolver.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { configureTestSuite } from 'ng-bullet';
import { MicroAppRoutingService } from '../micro-app-routing/micro-app-routing.service';
import { MicroAppRoutingServiceStub } from '../micro-app-routing/micro-app-routing.service.stub';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';

@Component({
  template: '<div>test</div>',
})
class TestComponent {}

@Component({
  template: '<div>test2</div>',
})
class Test2Component {}

describe('AppComponentResolverComponent', () => {
  let component: MicroAppComponentResolverComponent;
  let fixture: ComponentFixture<MicroAppComponentResolverComponent>;
  let appRoutingService: MicroAppRoutingService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [MicroAppComponentResolverComponent, TestComponent, Test2Component],
      providers: [
        UnsubscribeService,
        { provide: MicroAppRoutingService, useClass: MicroAppRoutingServiceStub },
      ],
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [TestComponent, Test2Component],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MicroAppComponentResolverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { AppComponentResolverComponent } from './app-component-resolver.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { configureTestSuite } from 'ng-bullet';
import { AppRoutingService } from '../app-routing/app-routing.service';
import { AppRoutingServiceStub } from '../app-routing/app-routing.service.stub';
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
  let component: AppComponentResolverComponent;
  let fixture: ComponentFixture<AppComponentResolverComponent>;
  let appRoutingService: AppRoutingService;

  configureTestSuite( () => {
    TestBed.configureTestingModule({
      declarations: [AppComponentResolverComponent, TestComponent, Test2Component],
      providers: [
        UnsubscribeService,
        { provide: AppRoutingService, useClass: AppRoutingServiceStub }
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
    fixture = TestBed.createComponent(AppComponentResolverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

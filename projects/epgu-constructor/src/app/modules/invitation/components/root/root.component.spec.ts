import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RootComponent } from './root.component';
import {ConstructorService} from '../../../../services/constructor/constructor.service';
import {ConstructorServiceStub} from '../../../../services/constructor/constructor.service.stub';
import {NavigationService} from '../../../../shared-module/service/navigation/navigation.service';
import { MockComponent } from 'ng-mocks'
import { InvitationErrorComponent } from '../error/invitation-error.component'
import { NavigationComponent } from '../../../../shared-module/components/navigation/navigation.component'

describe('RootComponent', () => {
  let component: RootComponent;
  let fixture: ComponentFixture<RootComponent>;
  let navService: NavigationService;
  let constructorService: ConstructorService;
  let NavigationComponentMock = MockComponent(NavigationComponent);
  let InvitationErrorComponentMock = MockComponent(InvitationErrorComponent);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RootComponent, NavigationComponentMock, InvitationErrorComponentMock ],
      providers: [NavigationService, { provide: ConstructorService, useClass: ConstructorServiceStub }]
    })
    .compileComponents();
    navService = TestBed.inject(NavigationService);
    constructorService = TestBed.inject(ConstructorService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

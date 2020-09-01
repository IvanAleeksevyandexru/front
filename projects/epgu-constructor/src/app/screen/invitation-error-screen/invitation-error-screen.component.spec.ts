import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationErrorScreenComponent } from './invitation-error-screen.component';
import { FormPlayerService } from '../../services/form-player/form-player.service';
import { FormPlayerServiceStub } from '../../services/form-player/form-player.service.stub';
import { NavigationService } from '../../shared/service/navigation/navigation.service';
import { MockComponent } from 'ng-mocks';
import { InvitationErrorComponent } from './components/error/invitation-error.component';
import { NavigationComponent } from '../../shared/components/navigation/navigation.component';

describe('InvitationScreenComponent', () => {
  let component: InvitationErrorScreenComponent;
  let fixture: ComponentFixture<InvitationErrorScreenComponent>;
  let navService: NavigationService;
  let constructorService: FormPlayerService;
  let NavigationComponentMock = MockComponent(NavigationComponent);
  let InvitationErrorComponentMock = MockComponent(InvitationErrorComponent);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitationErrorScreenComponent, NavigationComponentMock, InvitationErrorComponentMock ],
      providers: [NavigationService, { provide: FormPlayerService, useClass: FormPlayerServiceStub }]
    })
    .compileComponents();
    navService = TestBed.inject(NavigationService);
    constructorService = TestBed.inject(FormPlayerService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationErrorScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

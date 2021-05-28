import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildrenClubsAppComponent } from './children-clubs-app.component';
import { CfSpaStateService, CfSpaStateServiceStub, LocationServiceStub, LocationService } from '@epgu/epgu-constructor-ui-kit';

describe('ChildrenClubsComponent', () => {
  let component: ChildrenClubsAppComponent;
  let fixture: ComponentFixture<ChildrenClubsAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChildrenClubsAppComponent ],
      providers: [
        { provide: CfSpaStateService, useClass: CfSpaStateServiceStub },
        { provide: LocationService, useClass: LocationServiceStub },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildrenClubsAppComponent);
    component = fixture.componentInstance;
    component['initState'] = {
      componentId: 'spa42',
      componentType: 'ChildrenClubs',
      callbackRedirectUrl: '/some/app/url',
      value: '{}'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

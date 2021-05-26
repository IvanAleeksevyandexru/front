import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildrenClubsAppComponent } from './children-clubs-app.component';

describe('ChildrenClubsComponent', () => {
  let component: ChildrenClubsAppComponent;
  let fixture: ComponentFixture<ChildrenClubsAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChildrenClubsAppComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildrenClubsAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

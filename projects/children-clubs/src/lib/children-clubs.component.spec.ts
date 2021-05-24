import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildrenClubsComponent } from './children-clubs.component';

describe('ChildrenClubsComponent', () => {
  let component: ChildrenClubsComponent;
  let fixture: ComponentFixture<ChildrenClubsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChildrenClubsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildrenClubsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

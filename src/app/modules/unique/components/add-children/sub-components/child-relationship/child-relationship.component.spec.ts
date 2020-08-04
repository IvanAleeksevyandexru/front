import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildRelationshipComponent } from './child-relationship.component';

describe('ChildRelationshipComponent', () => {
  let component: ChildRelationshipComponent;
  let fixture: ComponentFixture<ChildRelationshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChildRelationshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildRelationshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

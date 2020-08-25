import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EpguLibModule } from 'epgu-lib'

import { ChildRelationshipComponent } from './child-relationship.component';


describe('ChildRelationshipComponent', () => {
  let component: ChildRelationshipComponent;
  let fixture: ComponentFixture<ChildRelationshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ EpguLibModule.forChild() ],
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

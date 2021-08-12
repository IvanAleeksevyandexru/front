import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonUserInnComponent } from './person-user-inn.component';

describe('PersonUserInnComponent', () => {
  let component: PersonUserInnComponent;
  let fixture: ComponentFixture<PersonUserInnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonUserInnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonUserInnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

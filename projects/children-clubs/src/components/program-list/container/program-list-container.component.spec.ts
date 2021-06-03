import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramListContainerComponent } from './program-list-container.component';

describe('ListComponent', () => {
  let component: ProgramListContainerComponent;
  let fixture: ComponentFixture<ProgramListContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramListContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

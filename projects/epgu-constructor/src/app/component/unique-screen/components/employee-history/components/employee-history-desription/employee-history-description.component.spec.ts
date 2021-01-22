import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EpguLibModule } from 'epgu-lib';

import { EmployeeHistoryDescriptionComponent } from './employee-history-description.component';

describe('EmployeeHistoryComponent', () => {
  let component: EmployeeHistoryDescriptionComponent;
  let fixture: ComponentFixture<EmployeeHistoryDescriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EpguLibModule],
      declarations: [EmployeeHistoryDescriptionComponent],
      providers: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeHistoryDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('nothing', () => {
    expect(true).toBeTruthy();
  });
});

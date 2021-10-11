import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpansionLinkComponent } from './expansion-link.component';
import { configureTestSuite } from 'ng-bullet';

describe('ExpansionLinkComponent', () => {
  let component: ExpansionLinkComponent;
  let fixture: ComponentFixture<ExpansionLinkComponent>;

  configureTestSuite(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExpansionLinkComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpansionLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionButtonComponent } from './action-button.component';
import { LongButtonComponent } from '../long-button/long-button.component';

describe('ActionButtonComponent', () => {
  let component: ActionButtonComponent;
  let fixture: ComponentFixture<ActionButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActionButtonComponent, LongButtonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

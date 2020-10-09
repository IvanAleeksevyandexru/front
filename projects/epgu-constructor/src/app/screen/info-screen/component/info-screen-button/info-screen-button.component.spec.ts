import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoScreenButtonComponent } from './info-screen-button.component';
import { LongButtonComponent } from '../../../../shared/components/long-button/long-button.component';

describe('InfoScreenButtonComponent', () => {
  let component: InfoScreenButtonComponent;
  let fixture: ComponentFixture<InfoScreenButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InfoScreenButtonComponent, LongButtonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoScreenButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

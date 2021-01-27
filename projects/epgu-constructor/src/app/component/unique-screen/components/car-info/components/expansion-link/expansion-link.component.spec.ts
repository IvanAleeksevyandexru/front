import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpansionLinkComponent } from './expansion-link.component';

describe('ExpansionLinkComponent', () => {
  let component: ExpansionLinkComponent;
  let fixture: ComponentFixture<ExpansionLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpansionLinkComponent ]
    })
    .compileComponents();
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

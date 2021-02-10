import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaryInfoComponent } from './notary-info.component';

describe('NotaryInfoComponent', () => {
  let component: NotaryInfoComponent;
  let fixture: ComponentFixture<NotaryInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotaryInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotaryInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

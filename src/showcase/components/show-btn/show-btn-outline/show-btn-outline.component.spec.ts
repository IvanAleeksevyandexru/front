import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowBtnOutlineComponent } from './show-btn-outline.component';

describe('ShowBtnOutlineComponent', () => {
  let component: ShowBtnOutlineComponent;
  let fixture: ComponentFixture<ShowBtnOutlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowBtnOutlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowBtnOutlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

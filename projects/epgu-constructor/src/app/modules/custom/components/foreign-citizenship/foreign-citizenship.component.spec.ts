import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForeignCitizenshipComponent } from './foreign-citizenship.component';

describe('ForeignCitizenshipComponent', () => {
  let component: ForeignCitizenshipComponent;
  let fixture: ComponentFixture<ForeignCitizenshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForeignCitizenshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForeignCitizenshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

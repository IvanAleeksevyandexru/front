import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpgucLabelComponent } from './epguc-label.component';

describe('LabelComponent', () => {
  let component: EpgucLabelComponent;
  let fixture: ComponentFixture<EpgucLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpgucLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpgucLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

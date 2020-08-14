import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocInputComponent } from './doc-input.component';

describe('DocInputComponent', () => {
  let component: DocInputComponent;
  let fixture: ComponentFixture<DocInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

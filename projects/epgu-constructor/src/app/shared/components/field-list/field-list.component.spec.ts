import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafePipe } from '../../../core/pipes/safe/safe.pipe';

import { FieldListComponent } from './field-list.component';

describe('FieldListComponent', () => {
  let component: FieldListComponent;
  let fixture: ComponentFixture<FieldListComponent>;
  const dataMock = {
    attrs: {
      style: {},
    },
    visited: true,
    label: '',
    type: '',
    value: '',
    id: '',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FieldListComponent, SafePipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldListComponent);
    component = fixture.componentInstance;
    component.data = dataMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

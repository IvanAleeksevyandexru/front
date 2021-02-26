import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy } from '@angular/core';

import { ChipComponent } from './chip.component';

describe('ChipComponent', () => {
  let component: ChipComponent;
  let fixture: ComponentFixture<ChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChipComponent],
    })
      .overrideComponent(ChipComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be call closeEvent with id', () => {
    const id = 'ID';
    component.id = id;
    jest.spyOn(component.closeEvent, 'emit');
    fixture.detectChanges();
    component.onClose();
    expect(component.closeEvent.emit).toHaveBeenCalledWith(id);
  });

  it('should be call closeEvent with label', () => {
    const label = 'LABEL';
    component.id = label;
    jest.spyOn(component.closeEvent, 'emit');
    fixture.detectChanges();
    component.onClose();
    expect(component.closeEvent.emit).toHaveBeenCalledWith(label);
  });
});

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleTextComponent } from './toggle-text.component';

@Component({ template: `
  <children-clubs-toggle-text
  [text]="text"
  [linesQuantity]="linesQuantity"
  ></children-clubs-toggle-text>
` })
class TestComponent {
  text = 'text text2 text3';
  linesQuantity = 2;
}

describe('ToggleTextComponent', () => {
  let component: ToggleTextComponent;
  let fixture: ComponentFixture<ToggleTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToggleTextComponent, TestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should cut text if text lenght > linesQuantity', () => {
    /*component.text = 'text text2 text3';
    component.linesQuantity = 1;
    component.ngOnChanges();
    fixture.detectChanges();
    const resultText = fixture.debugElement.query(By.css('.toggle-text')).nativeElement.textContent;
    expect(resultText).toBe('text text2 text3');*/
  });
});

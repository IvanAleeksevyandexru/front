import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelperTextComponent } from './helper-text.component';
import { By } from '@angular/platform-browser'

describe('HelperTextComponent', () => {
  let component: HelperTextComponent;
  let fixture: ComponentFixture<HelperTextComponent>;
  let helperTextMock = 'Awesome useful helper text.';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelperTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelperTextComponent);
    component = fixture.componentInstance;
    component.text = helperTextMock;
    fixture.detectChanges();
  });

  it('should match snapshot', () => {
    expect(fixture).toMatchSnapshot();
  });

  it('component should render passed text', () => {
    const helperText = fixture.debugElement
      .query(By.css('.helper-text')).nativeElement.textContent;
    expect(helperText).toEqual(helperTextMock);
  });

});

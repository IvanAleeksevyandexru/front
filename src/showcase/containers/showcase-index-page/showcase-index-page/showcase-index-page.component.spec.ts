import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowcaseIndexPageComponent } from './showcase-index-page.component';

describe('ShowcaseIndexPageComponent', () => {
  let component: ShowcaseIndexPageComponent;
  let fixture: ComponentFixture<ShowcaseIndexPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowcaseIndexPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowcaseIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpgucScreenContainerComponent } from './epguc-screen-container.component';

describe('ScreenContainerComponent', () => {
  let component: EpgucScreenContainerComponent;
  let fixture: ComponentFixture<EpgucScreenContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpgucScreenContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpgucScreenContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

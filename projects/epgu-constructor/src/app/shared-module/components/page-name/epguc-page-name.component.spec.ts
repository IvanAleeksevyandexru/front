import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpgucPageNameComponent } from './epguc-page-name.component';

describe('PageNameComponent', () => {
  let component: EpgucPageNameComponent;
  let fixture: ComponentFixture<EpgucPageNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpgucPageNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpgucPageNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

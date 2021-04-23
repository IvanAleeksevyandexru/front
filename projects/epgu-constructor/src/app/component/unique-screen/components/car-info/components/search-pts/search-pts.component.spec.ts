import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPtsComponent } from './search-pts.component';

describe('SearchPtsComponent', () => {
  let component: SearchPtsComponent;
  let fixture: ComponentFixture<SearchPtsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchPtsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

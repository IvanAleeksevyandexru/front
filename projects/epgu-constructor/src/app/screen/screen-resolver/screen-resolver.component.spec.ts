import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenResolverComponent } from './screen-resolver.component';

describe('ScreenResolverComponent', () => {
  let component: ScreenResolverComponent;
  let fixture: ComponentFixture<ScreenResolverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScreenResolverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenResolverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

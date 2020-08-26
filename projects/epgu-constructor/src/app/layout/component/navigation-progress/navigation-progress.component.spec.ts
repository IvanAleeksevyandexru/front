import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationProgressComponent } from './navigation-progress.component';


describe('NavigationProgressComponent', () => {
  let component: NavigationProgressComponent;
  let fixture: ComponentFixture<NavigationProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

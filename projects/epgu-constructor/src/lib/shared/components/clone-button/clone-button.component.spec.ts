import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventBusService } from '@epgu/epgu-constructor-ui-kit';
import { CloneButtonComponent } from './clone-button.component';


describe('CloneButtonComponent', () => {
  let component: CloneButtonComponent;
  let fixture: ComponentFixture<CloneButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CloneButtonComponent],
      providers: [EventBusService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloneButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
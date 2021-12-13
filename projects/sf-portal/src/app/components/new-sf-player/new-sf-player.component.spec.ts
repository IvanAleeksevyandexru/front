import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { NewSfPlayerComponent } from './new-sf-player.component';

xdescribe('NewSfPlayerComponent', () => {
  let component: NewSfPlayerComponent;
  let fixture: ComponentFixture<NewSfPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewSfPlayerComponent],
      providers: [ActivatedRoute],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSfPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

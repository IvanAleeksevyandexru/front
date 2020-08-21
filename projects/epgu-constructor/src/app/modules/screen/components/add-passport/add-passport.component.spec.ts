import {async, ComponentFixture, TestBed} from '@angular/core/testing';

class AddPassportComponent {
}

describe('', () => {
  let component: AddPassportComponent;
  let fixture: ComponentFixture<AddPassportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPassportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPassportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

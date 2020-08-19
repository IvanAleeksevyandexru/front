import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ConstructorComponent } from './constructor.component';

describe('ConstructorComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        ConstructorComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(ConstructorComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});

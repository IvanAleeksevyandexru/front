import { TestBed, waitForAsync } from '@angular/core/testing';
import { EpguLibModule } from 'epgu-lib';
import { FormConstructorComponent } from './form-constructor.component';

const epguLibModule = EpguLibModule.forRoot();

describe('FormConstructorComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        epguLibModule,
      ],
      declarations: [
        FormConstructorComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(FormConstructorComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});

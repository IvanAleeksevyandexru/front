import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockModule } from 'ng-mocks';

import { HintComponent } from './hint.component';
import { SafeModule } from '@epgu/epgu-constructor-ui-kit';
import { ImgPrefixerModule } from '../../../pipes/img-prefixer/img-prefixer.module';
import { ClickableLabelModule } from '../../../directives/clickable-label/clickable-label.module';

describe('HintComponent', () => {
  let component: HintComponent;
  let fixture: ComponentFixture<HintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HintComponent],
      imports: [SafeModule, MockModule(ImgPrefixerModule), MockModule(ClickableLabelModule)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

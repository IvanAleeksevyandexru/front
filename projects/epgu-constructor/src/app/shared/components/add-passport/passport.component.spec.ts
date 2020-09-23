import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassportComponent } from './passport.component';
import { EpguLibModule } from 'epgu-lib';
import { FormsModule } from '@angular/forms';
import { UnsubscribeService } from '../../../services/unsubscribe/unsubscribe.service';
import { LabelComponent } from '../base/label/label.component';
import { TextTransformDirective } from '../../directives/text-transform/text-transform.directive';
import { TrimDirective } from '../../directives/trim/trim.directive';

describe('PassportComponent', () => {
  let component: PassportComponent;
  let fixture: ComponentFixture<PassportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ EpguLibModule, FormsModule ],
      declarations: [ PassportComponent, LabelComponent, TextTransformDirective, TrimDirective ],
      providers: [ UnsubscribeService ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PassportComponent);
    component = fixture.componentInstance;
    component.attrs = {
      fields: []
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

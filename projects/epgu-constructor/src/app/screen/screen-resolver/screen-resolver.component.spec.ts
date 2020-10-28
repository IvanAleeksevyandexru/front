import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenResolverComponent } from './screen-resolver.component';
import { ScreenService } from '../screen.service';
import { ScreenServiceStub } from '../screen.service.stub';
import { UnsubscribeService } from '../../shared/services/unsubscribe/unsubscribe.service';

describe('ScreenResolverComponent', () => {
  let component: ScreenResolverComponent;
  let fixture: ComponentFixture<ScreenResolverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScreenResolverComponent ],
      providers: [
        UnsubscribeService,
        { provide: ScreenService, useClass: ScreenServiceStub }
      ]
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

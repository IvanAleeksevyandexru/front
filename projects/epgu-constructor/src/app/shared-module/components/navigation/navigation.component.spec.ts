import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationComponent } from './navigation.component';
import { NavigationService } from '../../service/navigation/navigation.service'
import { MockComponent } from 'ng-mocks'
import { ScreenContainerComponent } from '../screen-container/screen-container.component'

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;
  let ScreenContainerComponentMock = MockComponent(ScreenContainerComponent);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationComponent, ScreenContainerComponentMock ],
      providers: [ NavigationService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

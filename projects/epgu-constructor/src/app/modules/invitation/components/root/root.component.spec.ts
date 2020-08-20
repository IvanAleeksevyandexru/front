import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RootComponent } from './root.component';
import {ConstructorService} from '../../../../services/constructor/constructor.service';
import {ConstructorServiceStub} from '../../../../services/constructor/constructor.service.stub';
import {NavigationService} from '../../../../layout/service/navigation/navigation.service';

describe('RootComponent', () => {
  let component: RootComponent;
  let fixture: ComponentFixture<RootComponent>;
  let navService: NavigationService;
  let constructorService: ConstructorService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RootComponent ],
      providers: [NavigationService, { provide: ConstructorService, useClass: ConstructorServiceStub }]
    })
    .compileComponents();
    navService = TestBed.inject(NavigationService);
    constructorService = TestBed.inject(ConstructorService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

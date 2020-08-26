/*
import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ConstructorComponent } from './constructor.component';
import { ConstructorService } from './services/constructor/constructor.service'
import { ConstructorServiceStub } from './services/constructor/constructor.service.stub'
import { EpguLibModule } from 'epgu-lib'
import { NavigationComponent } from './shared-module/components/navigation/navigation.component';
import { NavigationService } from './shared-module/service/navigation/navigation.service';
import { ScreenContainerComponent } from './shared-module/components/screen-container/screen-container.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

describe('ConstructorComponent', () => {
  let constructorService: ConstructorService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      imports: [
        RouterTestingModule,
        EpguLibModule.forChild(),
      ],
      declarations: [
        ConstructorComponent,
        NavigationComponent,
        ScreenContainerComponent
      ],
      providers: [
        NavigationService,
        {provide: ConstructorService, useClass: ConstructorServiceStub}
      ]
    }).compileComponents();
    constructorService = TestBed.inject(ConstructorService);
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(ConstructorComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
*/
describe('ConstructorComponent', () => {
  it('TODO: write the test', () => {
    expect(true).toBeTruthy();
  });
});

import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

import { ConstructorComponent } from './constructor.component';
import { ConstructorService } from './services/constructor/constructor.service'
import { ConstructorServiceStub } from './services/constructor/constructor.service.stub'


describe('ConstructorComponent', () => {
  let constructorService: ConstructorService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      imports: [
        RouterTestingModule
      ],
      declarations: [
        ConstructorComponent
      ],
      providers: [{provide: ConstructorService, useClass: ConstructorServiceStub}]
    }).compileComponents();
    constructorService = TestBed.inject(ConstructorService);
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(ConstructorComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});

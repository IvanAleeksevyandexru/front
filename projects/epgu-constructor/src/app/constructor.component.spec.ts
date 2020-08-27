import { TestBed, async } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { RouterTestingModule } from '@angular/router/testing';
import { EpguLibModule } from 'epgu-lib';

import { ConstructorComponent } from './constructor.component';
import { ConstructorService } from './services/constructor/constructor.service';
import { ConstructorServiceStub } from './services/constructor/constructor.service.stub';
import { NavigationService } from './shared-module/service/navigation/navigation.service';
import { ModalContainerComponent } from './shared-module/components/modal-container/modal-container.component';

describe('ConstructorComponent', () => {
  let constructorService: ConstructorService;
  let ModalContainerComponentMock = MockComponent(ModalContainerComponent);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        EpguLibModule.forChild(),
      ],
      declarations: [
        ConstructorComponent,
        ModalContainerComponentMock
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

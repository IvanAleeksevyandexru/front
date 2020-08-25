import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ConstructorComponent } from './constructor.component';
import { ConstructorService } from './services/constructor/constructor.service'
import { ConstructorServiceStub } from './services/constructor/constructor.service.stub'
import { EpguLibModule } from 'epgu-lib'
import { NavigationComponent } from './layout/component/navigation/navigation.component'
import { NavigationService } from './layout/service/navigation/navigation.service'
import { EpgucScreenContainerComponent } from './shared-module/components/screen-container/epguc-screen-container.component'


describe('ConstructorComponent', () => {
  let constructorService: ConstructorService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        EpguLibModule.forChild()
      ],
      declarations: [
        ConstructorComponent,
        NavigationComponent,
        EpgucScreenContainerComponent
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

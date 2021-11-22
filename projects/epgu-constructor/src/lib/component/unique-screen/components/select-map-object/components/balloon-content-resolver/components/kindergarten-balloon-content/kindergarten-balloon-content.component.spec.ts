import { cloneDeep } from 'lodash';
import { ScenarioDto } from '@epgu/epgu-constructor-types';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  YandexMapModule,
} from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../../../../../../screen/screen.service';
import { BaseModule } from '../../../../../../../../shared/base.module';
import { mockKindergartenStore } from '../../../../../kindergarten/mocks/stores';
import { KindergartenSearchPanelService } from '../../../search-panel-resolver/components/kindergarten-search-panel/kindergarten-search-panel.service';
import { KindergartenContentComponent } from './kindergarten-balloon-content.component';
import { mockKindergartenMapObject } from './mocks/map-objects';
import { By } from '@angular/platform-browser';
import { ForTestsOnlyModule } from '../../../../../../../../core/for-tests-only.module';

describe('KindergartenContentComponent', () => {
  let component: KindergartenContentComponent;
  let fixture: ComponentFixture<KindergartenContentComponent>;
  let screenService: ScreenService;
  let kindergartenSearchPanelService: KindergartenSearchPanelService;
  let MapStore: ScenarioDto;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KindergartenContentComponent],
      imports: [BaseModule, YandexMapModule, ForTestsOnlyModule],
      providers: [],
    }).compileComponents();
  });

  beforeEach(() => {
    screenService = TestBed.inject(ScreenService);
    MapStore = cloneDeep(mockKindergartenStore);
    screenService.initScreenStore(MapStore);
    fixture = TestBed.createComponent(KindergartenContentComponent);
    kindergartenSearchPanelService = fixture.debugElement.injector.get(
      KindergartenSearchPanelService,
    );
    kindergartenSearchPanelService.deptsLeftToChoose$.next(10);
    component = fixture.componentInstance;
    component.selectObject = (item) => (item.isSelected = !item.isSelected);
    component.mapObject = mockKindergartenMapObject;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('calcGartens should increase and decrease deptsLeftToChoose', () => {
    const spy = jest.spyOn(component, 'calcGartens');
    const selectBtn = fixture.debugElement.query(By.css('.submit-button')).nativeElement;
    selectBtn.click();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(kindergartenSearchPanelService.deptsLeftToChoose$.getValue()).toEqual(9);
    const cancelBtn = fixture.debugElement.query(
      By.css('div.department-selected > a.information-link'),
    ).nativeElement;
    cancelBtn.click();
    expect(spy).toHaveBeenCalledTimes(2);
    expect(kindergartenSearchPanelService.deptsLeftToChoose$.getValue()).toEqual(10);
  });
});

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  Input,
  ViewChild,
  ViewContainerRef,
  Type,
  ComponentRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { DisclaimerDto } from '@epgu/epgu-constructor-types';
import { BaseComponent } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../../../../screen/screen.service';
import { MapTypes, SelectMapObjectService, SidebarViewType } from '../../select-map-object.service';
import { KindergartenSearchPanelComponent } from './components/kindergarten-search-panel/kindergarten-search-panel.component';
import { CommonSearchPanelComponent } from './components/common-search-panel/common-search-panel.component';
import { ElectionsSearchPanelComponent } from './components/elections-search-panel/elections-search-panel.component';
import { JusticeSearchPanelComponent } from './components/justice-search-panel/justice-search-panel.component';
import { DictionaryYMapItem } from '../../../../../../shared/services/dictionary/dictionary-api.types';
import { ChildrenClubsSearchPanelComponent } from './components/children-clubs-search-panel/children-clubs-search-panel.component';

type PanelTypesComponents =
  | CommonSearchPanelComponent
  | ElectionsSearchPanelComponent
  | KindergartenSearchPanelComponent
  | JusticeSearchPanelComponent;

export const PanelTypes = {
  [MapTypes.commonMap]: 'commonPanel',
  [MapTypes.electionsMap]: 'electionsPanel',
  [MapTypes.kindergartenMap]: 'kindergartenPanel',
  [MapTypes.justiceMap]: 'justicePanel',
  [MapTypes.childrenClubsMap]: 'childrenClubsPanel',
  undefined: 'commonPanel',
};

@Component({
  selector: 'epgu-constructor-search-panel-resolver',
  templateUrl: './search-panel-resolver.component.html',
  styleUrls: ['./search-panel-resolver.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPanelResolverComponent extends BaseComponent implements AfterViewInit {
  @ViewChild('panel', { read: ViewContainerRef }) panel: ViewContainerRef;

  @Output() handleFiltering = new EventEmitter<DictionaryYMapItem[]>();

  @Input() isSearchTitleVisible = true;
  @Input() isNoDepartmentErrorVisible = false;
  @Input() label: string;
  @Input() noDepartmentsErrorMsg: string;
  @Input() showNav: boolean;
  @Input() disclaimer: DisclaimerDto;
  @Input() panelType = PanelTypes[MapTypes.commonMap];
  @Input() enableFilter = false;
  @Input() customNav = false;

  public viewTypes = SidebarViewType;
  public searchPanelRef: ComponentRef<PanelTypesComponents>;

  private panelsMap = {
    [PanelTypes[MapTypes.commonMap]]: CommonSearchPanelComponent,
    [PanelTypes[MapTypes.electionsMap]]: ElectionsSearchPanelComponent,
    [PanelTypes[MapTypes.kindergartenMap]]: KindergartenSearchPanelComponent,
    [PanelTypes[MapTypes.justiceMap]]: JusticeSearchPanelComponent,
    [PanelTypes[MapTypes.childrenClubsMap]]: ChildrenClubsSearchPanelComponent,
  };

  constructor(
    public screenService: ScreenService,
    public selectMapObjectService: SelectMapObjectService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private cdr: ChangeDetectorRef,
  ) {
    super();
  }

  ngAfterViewInit(): void {
    this.addPanel();
    this.cdr.detectChanges();
  }

  public addPanel(): void {
    const panel = this.componentFactoryResolver.resolveComponentFactory(
      this.getComponent(this.panelType),
    );
    this.searchPanelRef = this.panel.createComponent(panel);
    // @ts-ignore
    this.searchPanelRef.instance.handleFiltering = (data: DictionaryYMapItem[]): void =>
      this.handleFiltering.emit(data);
  }

  private getComponent(type: string): Type<PanelTypesComponents> {
    return this.panelsMap[type];
  }
}

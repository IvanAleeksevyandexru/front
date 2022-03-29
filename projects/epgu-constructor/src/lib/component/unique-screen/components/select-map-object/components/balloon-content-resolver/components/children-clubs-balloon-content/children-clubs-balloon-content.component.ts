import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  ConfigService,
  rotateAndDiminish,
  smoothHeight,
  DeviceDetectorService,
  BaseComponent,
} from '@epgu/epgu-constructor-ui-kit';
import { Observable } from 'rxjs';
import { KeyValueMap } from '@epgu/epgu-constructor-types';
import { SelectMapObjectService } from '../../../../select-map-object.service';
import { IBalloonContent } from '../../balloon-content-resolver.interface';
import { financingTypes } from '../../../../../children-clubs/models/children-clubs.types';

@Component({
  selector: 'epgu-constructor-children-clubs-balloon-content',
  templateUrl: './children-clubs-balloon-content.component.html',
  styleUrls: ['./children-clubs-balloon-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [rotateAndDiminish, smoothHeight],
})
export class ChildrenClubsBalloonContentComponent extends BaseComponent implements IBalloonContent {
  @Input() isSelectButtonHidden = false;
  @Input() showLoader: Observable<boolean>;
  @Input() mapObjects;
  @Input() showChevron = false;
  @Input() lockAnimation = false;
  @Input() attrs: KeyValueMap = {};
  @Input() showCrossButton = true;
  @ViewChild('detailsTemplate', { static: false }) detailsTemplate;
  @ViewChild('informationTemplate', { static: false }) informationTemplate;
  @ViewChildren('balloonComponents') balloonComponents: QueryList<ElementRef>;
  public selectObject: Function;
  public objectClick: Function;
  public collapseObject: Function;
  public financingTypes = financingTypes;

  constructor(
    public selectMapObjectService: SelectMapObjectService,
    public cdr: ChangeDetectorRef,
    public config: ConfigService,
    public deviceDetector: DeviceDetectorService,
  ) {
    super();
  }
}

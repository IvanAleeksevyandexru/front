import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import {
  CommonModalComponent,
  ConfigService,
  ModalService,
  rotateAndDiminish,
  smoothHeight,
  YMapItem,
  DeviceDetectorService,
} from '@epgu/epgu-constructor-ui-kit';
import { Observable } from 'rxjs';
import { KeyValueMap } from '@epgu/epgu-constructor-types';
import { DictionaryItem } from '../../../../../../../../shared/services/dictionary/dictionary-api.types';
import { SelectMapObjectService } from '../../../../select-map-object.service';
import { IBalloonContent } from '../../balloon-content-resolver.interface';

@Component({
  selector: 'epgu-constructor-common-balloon-content',
  templateUrl: './common-balloon-content.component.html',
  styleUrls: ['./common-balloon-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [rotateAndDiminish, smoothHeight],
})
export class CommonBalloonContentComponent implements IBalloonContent {
  @Input() isSelectButtonHidden = false;
  @Input() showLoader: Observable<boolean>;
  @Input() mapObject;
  @Input() lockAnimation = false;
  @Input() attrs: KeyValueMap = {};
  @Input() showCrossButton = true;
  @ViewChild('detailsTemplate', { static: false }) detailsTemplate;
  @ViewChild('informationTemplate', { static: false }) informationTemplate;
  public selectObject: Function;
  public objectClick: Function;
  public collapseObject: Function;

  constructor(
    public selectMapObjectService: SelectMapObjectService,
    public cdr: ChangeDetectorRef,
    public config: ConfigService,
    public deviceDetector: DeviceDetectorService,
    private modalService: ModalService,
  ) {}

  /**
   * Показывает модальное окно на основе шаблона
   * @param templateName имя шаблона из this.templates
   * @param item контекст балуна
   */
  public showModalFromTemplate(templateName: string, item: YMapItem<DictionaryItem>): void {
    this.modalService.openModal(CommonModalComponent, {
      modalTemplateRef: this[templateName],
      item,
    });
  }
}

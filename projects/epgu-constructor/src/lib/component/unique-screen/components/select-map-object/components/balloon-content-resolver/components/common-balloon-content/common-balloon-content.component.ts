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
  YMapItem,
} from '@epgu/epgu-constructor-ui-kit';
import { DictionaryItem } from '../../../../../../../../shared/services/dictionary/dictionary-api.types';
import { SelectMapObjectService } from '../../../../select-map-object.service';
import { IBalloonContent } from '../../balloon-content-resolver.interface';

@Component({
  selector: 'epgu-constructor-common-balloon-content',
  templateUrl: './common-balloon-content.component.html',
  styleUrls: ['./common-balloon-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommonBalloonContentComponent implements IBalloonContent {
  @Input() isSelectButtonHidden = false;
  @Input() showLoader = false;
  @Input() mapObject;
  @ViewChild('detailsTemplate', { static: false }) detailsTemplate;
  @ViewChild('informationTemplate', { static: false }) informationTemplate;
  public selectObject: Function;

  constructor(
    public selectMapObjectService: SelectMapObjectService,
    public cdr: ChangeDetectorRef,
    public config: ConfigService,
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

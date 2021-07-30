import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SelectMapObjectService } from '../../../../select-map-object.service';
import { IBalloonContent } from '../../balloon-content-resolver.interface';
import { IuikFullDataResponse } from './elections-balloon-content.interface';

@Component({
  selector: 'epgu-constructor-elections-balloon-content',
  templateUrl: './elections-balloon-content.component.html',
  styleUrls: ['./elections-balloon-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElectionsBalloonContentComponent implements AfterViewInit, IBalloonContent {
  @Input() isSelectButtonHidden = false;
  @Input() showLoader = false;
  @Input() mapObject;
  public selectObject: Function;
  public expandObject: Function;
  public extInfo$: Observable<IuikFullDataResponse>;

  constructor(
    public selectMapObjectService: SelectMapObjectService,
    public cdr: ChangeDetectorRef,
  ) {}

  public ngAfterViewInit(): void {
    this.extInfo$ = this.selectMapObjectService
      .getElections(
        this.mapObject.pollStationNumber,
        this.mapObject.pollStationRegion,
        this.selectMapObjectService.componentAttrs.electionDate,
        this.selectMapObjectService.componentAttrs.electionLevel,
      )
      .pipe(
        tap(() => {
          setTimeout(() => this.cdr.detectChanges(), 0);
        }),
      );
    this.cdr.detectChanges();
  }
}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';

import { AppService } from '../app.service';
import { AppConfig } from '../app.type';

@Component({
  selector: 'config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigComponent implements OnInit {
  configForm: FormGroup;
  fieldsName = [];
  numberFields = ['gepsId', 'orderId'];

  constructor(
    private appService: AppService,
    private ngUnsubscribe$: UnsubscribeService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.appService.config$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((config) => {
      this.fieldsName = Object.keys(config);
      this.configForm = this.getConfigForm(config);

      this.changeDetectorRef.markForCheck();
    });
  }

  getConfigForm(config: AppConfig): FormGroup {
    const fields = {};
    this.fieldsName.forEach((fieldName) => {
      fields[fieldName] = new FormControl(config[fieldName]);
    });

    return new FormGroup(fields);
  }

  saveConfig(): void {
    const config = this.configForm.value;
    config.canStartNew = config.canStartNew ? config.canStartNew.toString() !== 'false' : '';
    config.invited = config.invited ? config.invited.toString() !== 'false' : '';
    this.appService.saveConfig(config);
  }

  resetConfig(): void {
    this.appService.resetConfig();
  }
}

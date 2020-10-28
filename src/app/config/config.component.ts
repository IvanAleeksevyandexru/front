import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { UnsubscribeService } from '../../../projects/epgu-constructor/src/app/services/unsubscribe/unsubscribe.service';
import { AppService } from '../app.service';
import { AppConfig } from '../app.type';

@Component({
  selector: 'config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
  providers: [UnsubscribeService],
})
export class ConfigComponent implements OnInit {
  configForm: FormGroup;
  fieldsName = [];

  constructor(private appService: AppService, private ngUnsubscribe$: UnsubscribeService) {}

  ngOnInit(): void {
    this.appService.config$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((config) => {
      this.fieldsName = Object.keys(config);
      this.configForm = this.getConfigForm(config);
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
    this.appService.saveConfig(this.configForm.value);
  }

  resetConfig(): void {
    this.appService.resetConfig();
  }
}

import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { UnsubscribeService } from '../../../projects/epgu-constructor/src/app/services/unsubscribe/unsubscribe.service';
import { AppService } from '../app.service';

@Component({
  selector: 'config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
})
export class ConfigComponent implements OnInit {
  configForm: FormGroup;
  private config;
  fieldsName = [];

  constructor(private appService: AppService, private ngUnsubscribe$: UnsubscribeService) {}

  ngOnInit(): void {
    this.appService.config$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((config) => {
      this.config = config;
      this.fieldsName = Object.keys(config);
      this.initForm();
    });
  }

  initForm(): void {
    const fields = {};
    this.fieldsName.forEach((fieldName) => {
      fields[fieldName] = new FormControl(this.config[fieldName]);
    });

    this.configForm = new FormGroup(fields);
  }

  saveConfig(): void {
    this.appService.saveConfig(this.configForm.value);
  }

  resetConfig(): void {
    this.appService.resetConfig();
  }
}

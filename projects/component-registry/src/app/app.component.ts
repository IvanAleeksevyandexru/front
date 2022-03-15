import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { IFilters, IResponse, IServiceItem, IComponentItem } from './app.type';
import { BehaviorSubject } from 'rxjs';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public data$ = new BehaviorSubject(null);
  public formGroup: FormGroup;
  public types = [{ value: 'serviceId' }, { value: 'componentType' }];
  public copyButtonLabel = '📋Скопировать';
  public isAccordionAllOpened = true;
  private config;

  constructor(
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private clipboard: Clipboard,
  ) {}

  public trackByServiceId(_index, service: IServiceItem): string {
    return service?.serviceId;
  }

  public trackByComponentType(_index, component: IComponentItem): string {
    return component?.componentType;
  }

  public ngOnInit(): void {
    this.initForm();
    this.fetchConfig().then((config) => {
      this.config = config;
      this.fetchData();
    });
  }

  public onTypeChange(type: string): void {
    this.formGroup.patchValue({ type });
  }

  public onSubmit(formValue?: { searchInput: string; type: string }): void {
    const { searchInput, type } = formValue;
    const items = searchInput
      .replace(' ', '')
      .trim()
      .split(',')
      .filter((value: string) => !!value);
    this.fetchData({ filters: { items, type } });
  }

  public onCopy(): void {
    const data = JSON.stringify(this.data$.getValue(), null, 2);
    this.clipboard.copy(data);
    this.copyButtonLabel = '✅Скопировать';
    setTimeout(() => {
      this.copyButtonLabel = '📋Скопировать';
    }, 1000);
  }

  public handleAccordionState(isOpened: boolean): void {
    this.isAccordionAllOpened = isOpened;
  }

  private initForm(): void {
    this.formGroup = this.formBuilder.group({
      searchInput: new FormControl(''),
      type: new FormControl('serviceId'),
    });
  }

  private fetchConfig(): Promise<any> {
    const configFilePath = 'assets/config/config.json';
    return this.httpClient.get(configFilePath).toPromise();
  }

  private fetchData(filters: IFilters = { filters: { items: [], type: 'serviceId' } }): void {
    this.data$.next(null);
    const apiUrl = `${this.config.apiUrl}/stats`;

    this.httpClient
      .post(apiUrl, filters)
      .pipe(
        tap((response: IResponse) => {
          this.data$.next(response);
        }),
      )
      .subscribe();
  }
}

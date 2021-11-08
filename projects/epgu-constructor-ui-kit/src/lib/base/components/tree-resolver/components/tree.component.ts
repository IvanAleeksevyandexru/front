import { DataSource } from '@angular/cdk/collections';
import { CdkTree, TreeControl } from '@angular/cdk/tree';
import {
  ChangeDetectorRef,
  Component,
  Input,
  IterableDiffer,
  IterableDiffers,
  OnDestroy,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Component({ template: '' })
export class TreeComponent<T> extends CdkTree<T> implements OnInit, OnDestroy {
  static ngAcceptInputType_directoryTree: boolean;
  static ngAcceptInputType_blockNode: boolean;
  @Input() directoryTree = false;
  @Input() blockNode = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() treeControl!: TreeControl<T, any>;
  @Input('dataSource')
  get dataSource(): DataSource<T> | Observable<T[]> | T[] {
    return super.dataSource;
  }
  set dataSource(dataSource: DataSource<T> | Observable<T[]> | T[]) {
    super.dataSource = dataSource;
  }

  _dataSourceChanged = new Subject<void>();

  private destroy$ = new Subject();

  constructor(protected differs: IterableDiffers, protected changeDetectorRef: ChangeDetectorRef) {
    super(differs, changeDetectorRef);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.destroy$.next();
    this.destroy$.complete();
  }

  renderNodeChanges(
    data: T[] | readonly T[],
    dataDiffer?: IterableDiffer<T>,
    viewContainer?: ViewContainerRef,
    parentData?: T,
  ): void {
    super.renderNodeChanges(data, dataDiffer, viewContainer, parentData);
    this._dataSourceChanged.next();
  }
}

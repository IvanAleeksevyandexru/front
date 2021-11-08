import { TreeNode, FilteredTreeResult, FlatNode } from './complex-choice-dictionary.models';
import { BehaviorSubject, merge, Observable, of, combineLatest, Subscription } from 'rxjs';
import { map, tap, delay, catchError } from 'rxjs/operators';
import { CollectionViewer, DataSource, SelectionChange } from '@angular/cdk/collections';
import { TreeControl } from '@angular/cdk/tree';
import { DictionaryApiService } from '../../services/dictionary/dictionary-api.service';
import { DictionaryToolsService } from '../../services/dictionary/dictionary-tools.service';

import { ListElement } from '@epgu/ui/models/dropdown';
import {
  DictionaryFilters,
  AttributeTypes,
  DictionaryUnionKind,
} from '@epgu/epgu-constructor-types';

import { DictionaryConditions, DictionarySubFilter } from '@epgu/epgu-constructor-types';
import { FormControl } from '@angular/forms';

export function filterTreeData(data: TreeNode[], value: string): FilteredTreeResult {
  const filterUniq = (arr: TreeNode[]): TreeNode[] => {
    return [...new Map(arr.map((item) => [item['id'], item])).values()];
  };
  const filter = (node: TreeNode, result: TreeNode[]): TreeNode[] => {
    if (node.text.search(value) !== -1) {
      result.push(node);
      return result;
    }
    return result;
  };
  const treeData = data.reduce((a, b) => filter(b, a), [] as TreeNode[]);
  const flattenData = filterUniq(treeData).map(el => ({ ...el, level: 0 }));
  return new FilteredTreeResult(flattenData);
}

export function dataMapping(data: ListElement[], level = null): FlatNode[] {
  return data.map((item: ListElement) => ({
    id: item.id as string,
    expandable: item.originalItem?.attributeValues?.HAS_A_CHILD === 'true',
    text: item.text,
    level: level != null ? level + 1 : 0,
    loading: false,
    originalItem: item.originalItem,
  }));
}

export class DynamicDatasource implements DataSource<FlatNode> {
  flattenedData: BehaviorSubject<FlatNode[]>;
  searchValue = '';
  private originalData: BehaviorSubject<FlatNode[]>;
  private subscription: Subscription;

  private childrenLoadedSet = new Set<FlatNode>();
  private expandedNodes: TreeNode[] = [];

  constructor(
    private treeControl: TreeControl<FlatNode>,
    public initData: FlatNode[],
    private dictionaryApiService: DictionaryApiService,
    private dictionaryToolsService: DictionaryToolsService,
    private dictionaryType: string,
    private currentFilter: DictionaryFilters,
  ) {
    this.flattenedData = new BehaviorSubject<FlatNode[]>(initData);
    this.originalData = new BehaviorSubject<FlatNode[]>(initData);
    treeControl.dataNodes = initData;
  }

  updateFilteredItems(formControl: FormControl): void {
    this.subscription = combineLatest([this.originalData, formControl.valueChanges])
      .pipe(
        map(([data, value]) => {
          this.searchValue = value;
          return value ? filterTreeData(data, value) : new FilteredTreeResult(data);
        }),
      )
      .subscribe((result) => {
        this.flattenedData.next(result.treeData);
        const hasSearchValue = !!this.searchValue;
        if (hasSearchValue) {
          if (this.expandedNodes.length === 0) {
            this.expandedNodes = this.treeControl.expansionModel.selected;
            this.treeControl.expansionModel.clear();
          }
          this.treeControl.expansionModel.select(...(result.needsToExpanded as FlatNode[]));
        } else if (this.expandedNodes.length) {
          this.treeControl.expansionModel.clear();
          this.treeControl.expansionModel.select(...(this.expandedNodes as FlatNode[]));
          this.expandedNodes = [];
        }
      });
  }

  connect(collectionViewer: CollectionViewer): Observable<FlatNode[]> {
    const changes = [
      collectionViewer.viewChange,
      this.treeControl.expansionModel.changed.pipe(
        tap((change) => this.handleExpansionChange(change)),
      ),
      this.flattenedData,
    ];
    return merge(...changes).pipe(
      map(() => this.expandFlattenedNodes(this.flattenedData.getValue())),
    );
  }

  expandFlattenedNodes(nodes: FlatNode[]): FlatNode[] {
    const treeControl = this.treeControl;
    const results: FlatNode[] = [];
    const currentExpand: boolean[] = [];
    currentExpand[0] = true;

    nodes.forEach((node) => {
      let expand = true;
      for (let i = 0; i <= treeControl.getLevel(node); i++) {
        expand = expand && currentExpand[i];
      }
      if (expand) {
        results.push(node);
      }
      if (treeControl.isExpandable(node)) {
        currentExpand[treeControl.getLevel(node) + 1] = treeControl.isExpanded(node);
      }
    });
    return results;
  }

  handleExpansionChange(change: SelectionChange<FlatNode>): void {
    if (change.added) {
      change.added.forEach((node) => this.loadChildren(node));
    }
  }

  loadChildren(node: FlatNode): void {
    if (this.childrenLoadedSet.has(node)) {
      return;
    }

    node.loading = true;
    this.getDictionaryData(node as FlatNode).subscribe((children) => {
      node.loading = false;
      let flattenedData = this.flattenedData.getValue();
      const index = flattenedData.indexOf(node);
      if (children.length > 0) {
        if (index !== -1) {
          flattenedData.splice(index + 1, 0, ...(dataMapping(children, node.level) as FlatNode[]));
          this.childrenLoadedSet.add(node);
        }
      } else {
        flattenedData = JSON.parse(JSON.stringify(flattenedData));
      }
      this.flattenedData.next(flattenedData);
    });
  }

  disconnect(): void {
    this.flattenedData.complete();
    this.subscription.unsubscribe();
  }

  private filterSubParentId(subs: DictionarySubFilter[]): DictionarySubFilter[] {
    return subs.filter(
      (sub) => sub.simple.value.asLong !== 'null' && sub.simple.value.asLong != null,
    );
  }

  private createFilterValue(node: FlatNode): DictionaryFilters['filter'] {
    let currentFilter = JSON.parse(JSON.stringify(this.currentFilter.filter));

    const parentFilter = {
      attributeName: 'PARENT_ID',
      condition: DictionaryConditions.EQUALS,
      value: {
        [AttributeTypes.asLong]: node.id,
      },
    };

    if (
      currentFilter?.union != null &&
      currentFilter?.union?.subs != null &&
      Array.isArray(currentFilter.union.subs)
    ) {
      const subs = this.filterSubParentId(currentFilter.union.subs);
      currentFilter = {
        ...currentFilter,
        ...{
          union: {
            ...currentFilter.union,
            subs: [...subs, { simple: parentFilter }],
          },
        },
      };
    } else {
      const subs = this.filterSubParentId([
        {
          simple: {
            ...this.currentFilter.filter.simple,
          },
        },
      ]);
      currentFilter = {
        union: {
          unionKind: DictionaryUnionKind.AND,
          subs: [
            ...subs,
            {
              simple: {
                ...parentFilter,
              },
            },
          ],
        },
      };
    }

    return currentFilter;
  }

  private getDictionaryData(node: FlatNode): Observable<ListElement[]> {
    const filterValue = this.createFilterValue(node);
    return this.dictionaryApiService
      .getDictionary(this.dictionaryType, {
        filter: filterValue,
      })
      .pipe(
        delay(500),
        map((response) => {
          if (response.error.code !== 0) {
            throw new Error('An unexpected error occurred');
          }
          return this.dictionaryToolsService.adaptDictionaryToListItem(response.items);
        }),
        catchError(() => of([])),
      );
  }
}

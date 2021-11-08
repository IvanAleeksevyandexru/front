import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { FlatTreeControl, TreeControl } from '@angular/cdk/tree';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

export class TreeFlattener<T, F, K = F> {
  constructor(
    public transformFunction: (node: T, level: number) => F,
    public getLevel: (node: F) => number,
    public isExpandable: (node: F) => boolean,
    public getChildren: (node: T) => Observable<T[]> | T[] | undefined | null,
  ) {}

  flattenNodes(structuredData: T[]): F[] {
    const resultNodes: F[] = [];
    structuredData.forEach((node) => this.flattenNode(node, 0, resultNodes, []));
    return resultNodes;
  }

  expandFlattenedNodes(nodes: F[], treeControl: TreeControl<F, K>): F[] {
    const results: F[] = [];
    const currentExpand: boolean[] = [];
    currentExpand[0] = true;

    nodes.forEach((node) => {
      let expand = true;
      for (let i = 0; i <= this.getLevel(node); i++) {
        expand = expand && currentExpand[i];
      }
      if (expand) {
        results.push(node);
      }
      if (this.isExpandable(node)) {
        currentExpand[this.getLevel(node) + 1] = treeControl.isExpanded(node);
      }
    });
    return results;
  }

  private flattenNode(node: T, level: number, resultNodes: F[], parentMap: boolean[]): F[] {
    const flatNode = this.transformFunction(node, level);
    resultNodes.push(flatNode);

    if (this.isExpandable(flatNode)) {
      const childrenNodes = this.getChildren(node);
      if (childrenNodes) {
        if (Array.isArray(childrenNodes)) {
          this.flattenChildren(childrenNodes, level, resultNodes, parentMap);
        } else {
          childrenNodes.pipe(take(1)).subscribe((children) => {
            this.flattenChildren(children, level, resultNodes, parentMap);
          });
        }
      }
    }
    return resultNodes;
  }

  private flattenChildren(
    children: T[],
    level: number,
    resultNodes: F[],
    parentMap: boolean[],
  ): void {
    children.forEach((child, index) => {
      const childParentMap: boolean[] = parentMap.slice();
      childParentMap.push(index !== children.length - 1);
      this.flattenNode(child, level + 1, resultNodes, childParentMap);
    });
  }
}

export class TreeFlatDataSource<T, F, K = F> extends DataSource<F> {
  _flattenedData = new BehaviorSubject<F[]>([]);
  _expandedData = new BehaviorSubject<F[]>([]);
  _data: BehaviorSubject<T[]>;

  constructor(
    private _treeControl: FlatTreeControl<F, K>,
    private _treeFlattener: TreeFlattener<T, F, K>,
    initialData: T[] = [],
  ) {
    super();
    this._data = new BehaviorSubject<T[]>(initialData);
    this.flatNodes();
  }

  setData(value: T[]): void {
    this._data.next(value);
    this.flatNodes();
  }

  getData(): T[] {
    return this._data.getValue();
  }

  connect(collectionViewer: CollectionViewer): Observable<F[]> {
    const changes = [
      collectionViewer.viewChange,
      this._treeControl.expansionModel.changed,
      this._flattenedData,
    ];
    return merge(...changes).pipe(
      map(() => {
        this._expandedData.next(
          this._treeFlattener.expandFlattenedNodes(this._flattenedData.value, this._treeControl),
        );
        return this._expandedData.value;
      }),
    );
  }

  // eslint-disable-next-line no-empty-function
  disconnect(): void {}

  private flatNodes(): void {
    this._flattenedData.next(this._treeFlattener.flattenNodes(this.getData()));
    this._treeControl.dataNodes = this._flattenedData.value;
  }
}

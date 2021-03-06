import { ListElement } from '@epgu/ui/models/dropdown';
import { DictionaryItem } from '../../services/dictionary/dictionary-api.types';

export interface TreeNode extends ListElement {
  [key: string]: unknown;
  text: string;
  disabled?: boolean;
  children?: TreeNode[];
  id: string;
  expandable: boolean;
  level: number;
}

export interface FlatNode {
  [key: string]: unknown;
  id: string;
  children?: TreeNode[];
  expandable: boolean;
  text: string;
  level: number;
  disabled?: boolean;
  originalItem?: DictionaryItem;
}

export enum FormField {
  checkboxGroup = 'checkboxGroup',
  search = 'search',
}

export class FilteredTreeResult {
  constructor(public treeData: TreeNode[], public needsToExpanded: TreeNode[] = []) {}
}

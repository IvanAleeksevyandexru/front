import { ClarificationsDto } from '../../form-player/services/form-player-api/form-player-api.types';

export interface DropdownListContent extends ClarificationsDto{
  [key: string]: {
    title: string;
    items: DropdownListItem[];
  }
}

export interface DropdownListItem{
  label: string;
  content: string;
  tags: string[];
}

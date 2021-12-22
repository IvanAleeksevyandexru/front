import { BaseDisplayRelation } from './base-display-relation';
import { CustomComponentRefRelation } from '@epgu/epgu-constructor-types';
import { Injectable } from '@angular/core';

@Injectable()
export class DisplayOnRelation extends BaseDisplayRelation {
  public isCurrentRelation(relation: CustomComponentRefRelation): boolean {
    return this.refRelationService.isDisplayOnRelation(relation);
  }
}

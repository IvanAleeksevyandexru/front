import { CustomComponentRefRelation } from '@epgu/epgu-constructor-types';
import { BaseDisplayRelation } from './base-display-relation';
import { Injectable } from '@angular/core';

@Injectable()
export class DisplayOffRelation extends BaseDisplayRelation {
  public isCurrentRelation(relation: CustomComponentRefRelation): boolean {
    return this.refRelationService.isDisplayOffRelation(relation);
  }
}

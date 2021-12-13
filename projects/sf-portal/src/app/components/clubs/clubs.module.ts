import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClubsRoutingModule } from './clubs-routing.module';
import { ClubsComponent } from './clubs.component';
import { ChildrenClubsModule } from '@epgu/children-clubs';

@NgModule({
  declarations: [ClubsComponent],
  imports: [ChildrenClubsModule, CommonModule, ClubsRoutingModule],
})
export class ClubsModule {}

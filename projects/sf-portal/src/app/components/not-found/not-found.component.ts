import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LoadService } from '@epgu/ui/services/load';

@Component({
  selector: 'not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent implements OnInit {
  deviceType: 'mob' | 'desk' | 'tablet';
  constructor(private loadService: LoadService) {}

  ngOnInit(): void {
    this.deviceType = this.loadService.attributes.deviceType;
  }
}

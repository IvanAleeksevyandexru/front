import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-notification-about-absent-account',
  templateUrl: './notification-about-absent-account-screen.component.html',
  styleUrls: ['./notification-about-absent-account-screen.component.scss'],
})
export class NotificationAboutAbsentAccountScreenComponent implements OnInit {
  @Input() data;
  @Output() nextStepEvent: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit(): void {}
}

import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'confirm-personal-user-phone',
  templateUrl: './confirm-personal-user-phone.component.html',
  styleUrls: ['./confirm-personal-user-phone.component.scss']
})
export class ConfirmPersonalUserPhoneComponent implements OnInit {

  @Input() name: string
  @Input() content: string
  constructor() { }

  ngOnInit(): void {
  }

}

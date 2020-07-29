import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-confirm-personal-user-email',
  templateUrl: './confirm-personal-user-email.component.html',
  styleUrls: ['./confirm-personal-user-email.component.scss']
})
export class ConfirmPersonalUserEmailComponent implements OnInit {

  @Input() name: string;
  @Input() content: string;
  constructor() { }

  ngOnInit(): void {
  }

}

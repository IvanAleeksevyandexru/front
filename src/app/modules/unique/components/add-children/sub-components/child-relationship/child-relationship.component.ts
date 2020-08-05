import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { EgpuResponseQuestionsDisplayComponentAttrsActionsInterface } from '../../../../../questions/components/interface/question-block.interface';

@Component({
  selector: 'app-child-relationship',
  templateUrl: './child-relationship.component.html',
  styleUrls: ['./child-relationship.component.scss'],
})
export class ChildRelationshipComponent implements OnInit {
  @Output() answerSelect = new EventEmitter<
    EgpuResponseQuestionsDisplayComponentAttrsActionsInterface
  >();

  answerChoose(answer: EgpuResponseQuestionsDisplayComponentAttrsActionsInterface): void {
    this.answerSelect.emit(answer);
  }

  ngOnInit(): void {
    // TODO
  }
}

import { Component } from '@angular/core';
import {
  ActionType,
  ComponentDtoAction,
  DTOActionAction,
} from '../../../form-player/services/form-player-api/form-player-api.types';

// @ts-ignore
@Component({
  selector: 'epgu-constructor-action-test',
  template: `
    <button class="download" epgu-constructor-action [action]="downloadAction"></button>
    <button class="prevStepModal" epgu-constructor-action [action]="prevStepModalAction"></button>
    <button class="nextStepModal" epgu-constructor-action [action]="nextStepModalAction"></button>
    <button class="skipStep" epgu-constructor-action [action]="skipStepAction"></button>
    <button class="prevStep" epgu-constructor-action [action]="prevStepAction"></button>
    <button class="nextStep" epgu-constructor-action [action]="nextStepAction"></button>
    <button class="redirectToLK" epgu-constructor-action [action]="redirectToLKAction"></button>
    <button class="profileEdit" epgu-constructor-action [action]="profileEditAction"></button>
    <button class="home" epgu-constructor-action [action]="homeAction"></button>
  `,
})
export class ActionTestComponent {
  downloadAction: ComponentDtoAction = {
    label: '',
    value: '',
    action: DTOActionAction.editPhoneNumber,
    type: ActionType.download,
  };
  prevStepModalAction: ComponentDtoAction = {
    label: '',
    value: '',
    action: DTOActionAction.editPhoneNumber,
    type: ActionType.prevStepModal,
  };
  nextStepModalAction: ComponentDtoAction = {
    label: '',
    value: '',
    action: DTOActionAction.editPhoneNumber,
    type: ActionType.nextStepModal,
  };
  skipStepAction: ComponentDtoAction = {
    label: '',
    value: '',
    action: DTOActionAction.editPhoneNumber,
    type: ActionType.skipStep,
  };
  prevStepAction: ComponentDtoAction = {
    label: '',
    value: '',
    action: DTOActionAction.editPhoneNumber,
    type: ActionType.prevStep,
  };
  nextStepAction: ComponentDtoAction = {
    label: '',
    value: '',
    action: DTOActionAction.editPhoneNumber,
    type: ActionType.nextStep,
  };
  redirectToLKAction: ComponentDtoAction = {
    label: '',
    value: '',
    action: DTOActionAction.editPhoneNumber,
    type: ActionType.redirectToLK,
  };
  profileEditAction: ComponentDtoAction = {
    label: '',
    value: '',
    action: DTOActionAction.editPhoneNumber,
    type: ActionType.profileEdit,
  };
  homeAction: ComponentDtoAction = {
    label: '',
    value: '',
    action: DTOActionAction.editPhoneNumber,
    type: ActionType.home,
  };
}

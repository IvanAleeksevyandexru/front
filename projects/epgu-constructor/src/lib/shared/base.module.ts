import { NgModule } from '@angular/core';
import { EpguLibModule } from '@epgu/epgu-lib';
import { BaseUiModule } from '@epgu/epgu-constructor-ui-kit';
import { ActionModule } from './directives/action/action.module';
import { OutputHtmlModule } from './components/output-html/output-html.module';

export const EpguLibModuleInited = EpguLibModule.forRoot({
  notifier: {
    singleNotifier: true,
  },
});

/**
 * Здесь храниться всё что необходимо во всех слоях.
 */
@NgModule({
  imports: [BaseUiModule, ActionModule, OutputHtmlModule],
  exports: [BaseUiModule, ActionModule, OutputHtmlModule],
})
export class BaseModule {}

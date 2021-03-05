import {
  ComponentAttrsDto,
} from '../../../../form-player/services/form-player-api/form-player-api.types';
import { CustomComponent, CustomComponentAttr } from '../../../shared/components/components-list/components-list.types';
import { FileUploadAttributes } from '../../../../core/services/terra-byte-api/terra-byte-api.types';

export interface AppealFinesComponentAttrs extends ComponentAttrsDto {
  components: Array<AppealFines>;
}

export type AppealFines = CustomComponent & {
  attrs?: CustomComponentAttr & FileUploadAttributes
};

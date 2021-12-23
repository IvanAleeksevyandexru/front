import { Clarifications, CubeElements } from '@epgu/epgu-constructor-types';

import { CustomComponentAttr } from '../../components-list.types';
import GenericAttrs from '../../component-list-resolver/GenericAttrs';

export default class CheckboxCubeItemModelAttrs extends GenericAttrs {
  readonly clarifications: Clarifications;

  readonly cubeElements: CubeElements;

  constructor(attrs: CustomComponentAttr) {
    super(attrs);

    this.clarifications = attrs.clarifications;
    this.cubeElements = attrs.cubeElements;
  }
}

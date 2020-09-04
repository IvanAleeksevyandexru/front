import { SmevSlotInterface } from './smev-slot.interface';

export interface SmevSlotsMapInterface {
  [key: number]: { [
    key: number]: { [key: number]: SmevSlotInterface[] }
  }
}

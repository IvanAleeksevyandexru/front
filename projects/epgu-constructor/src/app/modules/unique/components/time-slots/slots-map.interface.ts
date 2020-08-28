export interface SlotsMapInterface {
  [key: number]: { [
    key: number]: { [key: number]: { slotId, areaId, slotTime }[] }
  }
}

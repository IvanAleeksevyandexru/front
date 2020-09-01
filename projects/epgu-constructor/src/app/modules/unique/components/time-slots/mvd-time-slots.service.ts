import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstructorConfigService } from '../../../../services/config/constructor-config.service';
import { TimeSlotsService } from './time-slots.service';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { RestService } from '../../../../services/rest/rest.service';
import { formatDate } from '@angular/common';
import { SlotsMapInterface } from './slots-map.interface';

@Injectable()
export class MvdTimeSlotsService implements TimeSlotsService {

  private department;
  private orderId;
  private userId;

  public activeMonthNumber: number;
  public activeYearNumber: number;
  availableMonths: string[];

  private slotsMap: SlotsMapInterface;

  private bookedSlot: { slotId, areaId, slotTime };

  private errorMessage;

  constructor(
    private http: HttpClient,
    private constructorConfigService: ConstructorConfigService,
    private restService: RestService
  ) {

  }

  private getTimeSlots(options): Observable<any> {
    return this.restService.getDictionary('getAppointment2_mvdr01', options);
  }

  book(selectedSlot: any): Observable<any> {
    this.bookedSlot = selectedSlot;
    this.activeMonthNumber = selectedSlot.slotTime.getMonth();
    this.activeYearNumber = selectedSlot.slotTime.getFullYear();
    return of(selectedSlot);
  }

  isDateLocked(date: Date): boolean {
    return !this.slotsMap[date.getFullYear()]
      || !this.slotsMap[date.getFullYear()][date.getMonth()]
      || !this.slotsMap[date.getFullYear()][date.getMonth()][date.getDate()];
  }

  getAvailableMonths(): string[] {
    return this.availableMonths;
  }

  getAvailableSlots(selectedDay: Date): Observable<any[]> {
    return this.getTimeSlots(this.getSlotsOptions(selectedDay)).pipe(
      map(response => {
        if (response.error.code === 0) {
          return response.items.map(
            slot => { slot.value; new Date(slot.value); }
          );
        } else {
          this.errorMessage = response.error.message;
          return [];
        }
      })
    );
  }

  getBookedSlot(): any {
    return this.bookedSlot;
  }

  getCurrentMonth(): number {
    return this.activeMonthNumber;
  }

  getCurrentYear(): number {
    return this.activeYearNumber;
  }

  init(data: any): Observable<any> {

    if (this.changed(data) || this.errorMessage) {
      this.slotsMap = {};
      this.availableMonths = [];
      this.errorMessage = undefined;
      this.initSlotsMap();
    }

    return of(undefined);
  }

  hasError(): boolean {
    return !!this.getErrorMessage();
  }

  getErrorMessage(): string {
    return this.errorMessage;
  }

  changed(data: any): boolean {
    let changed = false;

    let department = JSON.parse(data.department);
    if (!this.department || this.department.value !== department.value) {
      changed = true;
      this.department = department;
    }

    let orderId = data.orderId;
    if (!this.orderId || this.orderId !== orderId) {
      changed = true;
      this.orderId = orderId;
    }

    let userId = data.userId;
    if (!this.userId || this.userId !== userId) {
      changed = true;
      this.userId = userId;
    }

    return changed;
  }

  private getSlotsOptions(selectedDay: Date) {
    var startOfDay = new Date(selectedDay);
    startOfDay.setHours(0,0,0,0);
    var endOfDay = new Date(selectedDay);
    endOfDay.setHours(23,59,59,999);

    return {
      filter: {
        union: {
          unionKind: 'AND',
          subs: [
            {
              simple: {
                attributeName: 'option_188getRegNum',
                condition: 'EQUALS',
                value: {
                  asString: '361'
                }
              }
            },
            {
              simple: {
                attributeName: 'option_187Doc4',
                condition: 'EQUALS',
                value: {
                  asString: 'false'
                }
              }
            },
            {
              simple: {
                attributeName: 'option_189passportTC',
                condition: 'EQUALS',
                value: {
                  asString: '363'
                }
              }
            },
            {
              simple: {
                attributeName: 'option_190licensePlateNumberTR',
                condition: 'EQUALS',
                value: {
                  asString: 'false'
                }
              }
            },
            {
              simple: {
                attributeName: 'option_181procedure',
                condition: 'EQUALS',
                value: {
                  asString: '341'
                }
              }
            },
            {
              simple: {
                attributeName: 'option_182personType',
                condition: 'EQUALS',
                value: {
                  asString: '346'
                }
              }
            },
            {
              simple: {
                attributeName: 'option_183registrationType',
                condition: 'EQUALS',
                value: {
                  asString: '349'
                }
              }
            },
            {
              simple: {
                attributeName: 'option_184Doc1',
                condition: 'EQUALS',
                value: {
                  asString: 'false'
                }
              }
            },
            {
              simple: {
                attributeName: 'option_185Doc2',
                condition: 'EQUALS',
                value: {
                  asString: 'false'
                }
              }
            },
            {
              simple: {
                attributeName: 'option_186Doc3',
                condition: 'EQUALS',
                value: {
                  asString: 'false'
                }
              }
            },
            {
              simple: {
                attributeName: 'departmentID',
                condition: 'EQUALS',
                value: {
                  asString: '130863'
                }
              }
            },
            {
              simple: {
                attributeName: 'AppointmentDate',
                condition: 'EQUALS',
                value: {
                  asString: formatDate(startOfDay.toISOString(), 'yyyy-MM-ddTHH:mm:ss', 'ru')
                }
              }
            },
            {
              simple: {
                attributeName: 'AppointmentDateTo',
                condition: 'EQUALS',
                value: {
                  asString: formatDate(endOfDay.toISOString(), 'yyyy-MM-ddTHH:mm:ss', 'ru')
                }
              }
            },
            {
              simple: {
                attributeName: 'personSourceSystemID',
                condition: 'EQUALS',
                value: {
                  asString: this.userId
                }
              }
            }
          ]
        }
      }
    };
  }

  private initSlotsMap(): void {
    let slotDate = new Date();
    for (let i = 0; i < 365; i++) {
      slotDate.setDate( slotDate.getDate() + 1 );

      if (!this.slotsMap[slotDate.getFullYear()]) {
        this.slotsMap[slotDate.getFullYear()] = {};
      }

      let monthSlots = this.slotsMap[slotDate.getFullYear()];
      if (!monthSlots[slotDate.getMonth()]) {
        monthSlots[slotDate.getMonth()] = {};
        this.availableMonths.push(`${slotDate.getFullYear()}-${slotDate.getMonth()+1}`);
      }

      let daySlots = monthSlots[slotDate.getMonth()];
      if (!daySlots[slotDate.getDate()]) {
        daySlots[slotDate.getDate()] = [];
      }
    }

    if (this.availableMonths.length == 0) {
      const today = new Date();
      this.activeMonthNumber = today.getMonth();
      this.activeYearNumber = today.getFullYear();
    } else {
      const [activeYearNumber, activeMonthNumber] = this.availableMonths[0].split('-');
      this.activeMonthNumber = parseInt(activeMonthNumber, 10) - 1;
      this.activeYearNumber = parseInt(activeYearNumber, 10);
    }
  }
}

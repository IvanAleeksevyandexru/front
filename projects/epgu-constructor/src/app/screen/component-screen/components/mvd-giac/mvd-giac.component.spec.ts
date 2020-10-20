import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MvdGiacComponent } from './mvd-giac.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Subject } from 'rxjs';
import { CurrentAnswersService } from '../../../current-answers.service';
import { DictionaryApiService } from '../../../../services/api/dictionary-api/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../../services/api/dictionary-api/dictionary-api.service.stub';
import { ComponentScreenComponentTypes } from '../../component-screen.types';
import { CachedAnswers, ScreenTypes } from '../../../screen.types';
import { DisplayDto } from '../../../../services/api/form-player-api/form-player-api.types';
import { ConfigService } from '../../../../config/config.service';
import { ConfigServiceStub } from '../../../../config/config.service.stub';
import { ScreenService } from '../../../screen.service';
import { ScreenServiceStub } from '../../../screen.service.stub';

xdescribe('MvdGiacComponent', () => {
  let component: MvdGiacComponent;
  let fixture: ComponentFixture<MvdGiacComponent>;

  let dictionaryApiService: DictionaryApiService;
  let currentAnswersService: CurrentAnswersService;
  let screenService: ScreenService;

  let getMvdDictionarySpy: jasmine.Spy;

  let checkRegionList;
  let testRegionList;
  const dictionarySubject = new Subject();

  function emitDictionary() {
    dictionarySubject.next({ items: testRegionList });
  }

  const mockData: DisplayDto = {
    components: [{
      attrs: {
        dictionaryType: 'MVD_TER_ORGAN_GIAC'
      },
      id: '',
      label: '',
      type: ComponentScreenComponentTypes.mvdGiac,
      value: ''
    }],
    header: '',
    id: '',
    name: '',
    submitLabel: '',
    terminal: false,
    type: ScreenTypes.COMPONENT
  };

  const applicantAnswersMock: CachedAnswers = {
    q1: {
      value: '',
      visited: true
    },
    q5: {
      value: '',
      visited: true
    },
    pd4: {
      value: JSON.stringify({ regAddr: { region: '' }}),
      visited: true
    },
    pd5: {
      value: JSON.stringify({ regAddr: { region: '' }}),
      visited: true
    }
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      imports: [ReactiveFormsModule],
      declarations: [ MvdGiacComponent ],
      providers: [
        CurrentAnswersService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub }
      ]
    })
      .overrideComponent(MvdGiacComponent, {
        set: {
          template: ''
        }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MvdGiacComponent);
    component = fixture.componentInstance;
    component.data = mockData.components[0];
    screenService = fixture.debugElement.injector.get(ScreenService);
    dictionaryApiService = fixture.debugElement.injector.get(DictionaryApiService);
    currentAnswersService = fixture.debugElement.injector.get(CurrentAnswersService);

    let regionList = [
      {
        value: 1,
        title: 'Московской'
      },
      {
        value: 2,
        title: 'Москвы'
      },
      {
        value: 3,
        title: 'Татарстан'
      },
    ];

    checkRegionList = regionList.map(item => {
      return {
        id: item.value,
        text: item.title,
      };
    });
    testRegionList = regionList.map(item => Object.assign({}, item));

    getMvdDictionarySpy = spyOn(dictionaryApiService, 'getMvdDictionary').and.returnValue(dictionarySubject);

    currentAnswersService.state = null;
  });

  describe('ngOnInit', () => {
    describe('before getting dictionary', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('should set loading flag', () => {
        expect(component.isLoading).toBeTruthy();
      });
    });

    describe('initForm', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('should save data if form is valid', () => {
        const EXPECTED_VALUE = 'region';

        component.regionControl.patchValue(EXPECTED_VALUE);

        expect(currentAnswersService.state).toBe(EXPECTED_VALUE);
      });
    });

    describe('loadDictionary', () => {
      let patchValueSpy;
      let disableSpy;

      beforeEach(() => {
        fixture.detectChanges();


        patchValueSpy = spyOn(component.regionControl, 'patchValue');
        disableSpy = spyOn(component.regionControl, 'disable');
      });

      it('should set loading flag', () => {
        emitDictionary();
        expect(component.isLoading).toBeFalsy();
      });

      describe('filterRegion', () => {
        describe('document type is not \'Эелектронная справка\'', () => {
          beforeEach(() => {
            emitDictionary();
          });

          it('shouldn\'t change dictionary list',() => {
            expect(component.dictionary).toEqual(checkRegionList);
          });

          it('shouldn\'t change region control value',() => {
            expect(patchValueSpy).not.toHaveBeenCalled();
          });

          it('shouldn\'t disable region control',() => {
            expect(disableSpy).not.toHaveBeenCalled();
          });
        });

        describe('document type is \'Эелектронная справка\'', () => {
          describe('same address', () => {
            beforeEach(() => {
              screenService.applicantAnswers['q1'].value = 'Электронная справка';
              screenService.applicantAnswers['q5'].value = 'Да';
              screenService.applicantAnswers['pd4'].value = JSON.stringify({
                regAddr: {
                  region: 'Москва'
                }
              });

              emitDictionary();
            });

            it('should set dictionary list',() => {
              expect(component.dictionary).toEqual([checkRegionList[1]]);
            });

            it('should patch value', () => {
              expect(patchValueSpy).toHaveBeenCalledWith(checkRegionList[1]);
            });

            it('should disable control', () => {
              expect(disableSpy).toHaveBeenCalled();
            });
          });

          describe('not same address', () => {
            beforeEach(() => {
              screenService.applicantAnswers['q1'].value = 'Электронная справка';
              screenService.applicantAnswers['q5'].value = 'Нет';
              screenService.applicantAnswers['pd4'].value = JSON.stringify({
                regAddr: {
                  region: 'Москва'
                }
              });
            });

            describe('same region', () => {
              beforeEach(() => {
                screenService.applicantAnswers['pd5'].value = JSON.stringify({
                  regAddr: {
                    region: 'Москва'
                  }
                });

                emitDictionary();
              });

              it('should set dictionary list',() => {
                expect(component.dictionary).toEqual([checkRegionList[1]]);
              });

              it('should patch value', () => {
                expect(patchValueSpy).toHaveBeenCalledWith(checkRegionList[1]);
              });

              it('should disable control', () => {
                expect(disableSpy).toHaveBeenCalled();
              });
            });

            describe('not same region', () => {
              beforeEach(() => {
                screenService.applicantAnswers['pd5'].value = JSON.stringify({
                  regAddr: {
                    region: 'Другой'
                  }
                });

                emitDictionary();
              });

              it('shouldn\'t change dictionary list',() => {
                expect(component.dictionary).toEqual(checkRegionList);
              });

              it('shouldn\'t change region control value',() => {
                expect(patchValueSpy).not.toHaveBeenCalled();
              });

              it('shouldn\'t disable region control',() => {
                expect(disableSpy).not.toHaveBeenCalled();
              });
            });
          });

          describe('finding region', () => {
            beforeEach(() => {
              screenService.applicantAnswers['q1'].value = 'Электронная справка';
              screenService.applicantAnswers['q5'].value = 'Да';
            });

            describe('find region without slicing', () => {
              beforeEach(() => {
                screenService.applicantAnswers['pd4'].value = JSON.stringify({
                  regAddr: {
                    region: 'Татарстан'
                  }
                });

                emitDictionary();
              });

              it('should change dictionary list',() => {
                expect(component.dictionary).toEqual([checkRegionList[2]]);
              });

              it('should change region control value',() => {
                expect(patchValueSpy).toHaveBeenCalledWith(checkRegionList[2]);
              });

              it('should disable region control',() => {
                expect(disableSpy).toHaveBeenCalled();
              });
            });

            describe('find region without slicing 1 symbol', () => {
              beforeEach(() => {
                screenService.applicantAnswers['pd4'].value = JSON.stringify({
                  regAddr: {
                    region: 'Москва'
                  }
                });

                emitDictionary();
              });

              it('should change dictionary list',() => {
                expect(component.dictionary).toEqual([checkRegionList[1]]);
              });

              it('should change region control value',() => {
                expect(patchValueSpy).toHaveBeenCalledWith(checkRegionList[1]);
              });

              it('should disable region control',() => {
                expect(disableSpy).toHaveBeenCalled();
              });
            });

            describe('find region without slicing 2 symbol', () => {
              beforeEach(() => {
                screenService.applicantAnswers['pd4'].value = JSON.stringify({
                  regAddr: {
                    region: 'Московская'
                  }
                });

                emitDictionary();
              });

              it('should change dictionary list',() => {
                expect(component.dictionary).toEqual([checkRegionList[0]]);
              });

              it('should change region control value',() => {
                expect(patchValueSpy).toHaveBeenCalledWith(checkRegionList[0]);
              });

              it('should disable region control',() => {
                expect(disableSpy).toHaveBeenCalled();
              });
            });

            describe('check region is \'Байконур\'', () => {
              beforeEach(() => {
                screenService.applicantAnswers['q1'].value = 'Электронная справка';
                screenService.applicantAnswers['q5'].value = 'Да';
                screenService.applicantAnswers['pd4'].value = JSON.stringify({
                  regAddr: {
                    region: 'Байконур'
                  }
                });

                emitDictionary();
              });

              it('shouldn\'t change dictionary list',() => {
                expect(component.dictionary).toEqual(checkRegionList);
              });

              it('shouldn\'t change region control value',() => {
                expect(patchValueSpy).not.toHaveBeenCalled();
              });

              it('shouldn\'t disable region control',() => {
                expect(disableSpy).not.toHaveBeenCalled();
              });
            });

            describe('when region wasn\'t found', () => {
              beforeEach(() => {
                screenService.applicantAnswers['q1'].value = 'Электронная справка';
                screenService.applicantAnswers['q5'].value = 'Да';
                screenService.applicantAnswers['pd4'].value = JSON.stringify({
                  regAddr: {
                    region: 'Регион'
                  }
                });

                emitDictionary();
              });

              it('shouldn\'t change dictionary list',() => {
                expect(component.dictionary).toEqual(checkRegionList);
              });

              it('shouldn\'t change region control value',() => {
                expect(patchValueSpy).not.toHaveBeenCalled();
              });

              it('shouldn\'t disable region control',() => {
                expect(disableSpy).not.toHaveBeenCalled();
              });
            });
          });
        });
      });
    });
  });
});

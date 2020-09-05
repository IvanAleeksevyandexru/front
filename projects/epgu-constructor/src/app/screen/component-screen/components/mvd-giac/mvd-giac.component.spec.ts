import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MvdGiacComponent } from './mvd-giac.component';
import { DisplayInterface } from '../../../../../interfaces/epgu.service.interface';
import { SCREEN_COMPONENT_NAME, SCREEN_TYPE } from '../../../../../constant/global';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Subject } from 'rxjs';
import { ComponentStateService } from '../../../../services/component-state/component-state.service';
import { FormPlayerService } from '../../../../services/form-player/form-player.service';
import { FormPlayerServiceStub } from '../../../../services/form-player/form-player.service.stub';
import { DictionaryApiService } from '../../../../services/api/dictionary-api/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../../services/api/dictionary-api/dictionary-api.service.stub';

describe('MvdGiacComponent', () => {
  let component: MvdGiacComponent;
  let fixture: ComponentFixture<MvdGiacComponent>;

  let dictionaryApiService: DictionaryApiService;
  let formPlayerService: FormPlayerService;
  let componentStateService: ComponentStateService;

  let getDictionarySpy: jasmine.Spy;

  let checkRegionList;
  let testRegionList;
  const dictionarySubject = new Subject();

  function emitDictionary() {
    dictionarySubject.next({
      items: testRegionList
    });
  }

  const mockData: DisplayInterface = {
    components: [{
      attrs: {
        dictionaryType: 'MVD_TER_ORGAN_GIAC'
      },
      id: '',
      label: '',
      type: SCREEN_COMPONENT_NAME.mvdGiac,
      value: ''
    }],
    header: '',
    id: '',
    name: '',
    submitLabel: '',
    type: SCREEN_TYPE.COMPONENT
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      imports: [ReactiveFormsModule],
      declarations: [ MvdGiacComponent ],
      providers: [
        ComponentStateService,
        { provide: FormPlayerService, useClass: FormPlayerServiceStub },
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

    dictionaryApiService = TestBed.inject(DictionaryApiService);
    formPlayerService = TestBed.inject(FormPlayerService);
    componentStateService = TestBed.inject(ComponentStateService);

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

    getDictionarySpy = spyOn(dictionaryApiService, 'getDictionary').and.returnValue(dictionarySubject);

    componentStateService.state = null;

    formPlayerService.responseStore = {
      scenarioDto: {
        applicantAnswers: {
          q1: {
            value: ''
          },
          q5: {
            value: ''
          },
          pd4: {
            value: JSON.stringify({ regAddr: { region: '' }})
          },
          pd5: {
            value: JSON.stringify({ regAddr: { region: '' }})
          }
        }
      }
    } as any;
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

      it('should do nothing if form is invalid', () => {
        component.regionForm.get('region').setErrors({ incorrect: true });
        component.regionForm.patchValue({});

        expect(componentStateService.state).toBe(null);
      });

      it('should save data if form is valid', () => {
        const EXPECTED_VALUE = 'region';

        component.regionForm.patchValue({
          region: EXPECTED_VALUE
        });

        expect(componentStateService.state).toBe(EXPECTED_VALUE);
      });
    });

    describe('loadDictionary', () => {
      let patchValueSpy;
      let disableSpy;

      beforeEach(() => {
        fixture.detectChanges();

        const regionControl = component.regionForm.get('region');

        patchValueSpy = spyOn(regionControl, 'patchValue');
        disableSpy = spyOn(regionControl, 'disable');
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
              formPlayerService.responseStore.scenarioDto.applicantAnswers['q1'].value = 'Электронная справка';
              formPlayerService.responseStore.scenarioDto.applicantAnswers['q5'].value = 'Да';
              formPlayerService.responseStore.scenarioDto.applicantAnswers['pd4'].value = JSON.stringify({
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
              formPlayerService.responseStore.scenarioDto.applicantAnswers['q1'].value = 'Электронная справка';
              formPlayerService.responseStore.scenarioDto.applicantAnswers['q5'].value = 'Нет';
              formPlayerService.responseStore.scenarioDto.applicantAnswers['pd4'].value = JSON.stringify({
                regAddr: {
                  region: 'Москва'
                }
              });
            });

            describe('same region', () => {
              beforeEach(() => {
                formPlayerService.responseStore.scenarioDto.applicantAnswers['pd5'].value = JSON.stringify({
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
                formPlayerService.responseStore.scenarioDto.applicantAnswers['pd5'].value = JSON.stringify({
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
              formPlayerService.responseStore.scenarioDto.applicantAnswers['q1'].value = 'Электронная справка';
              formPlayerService.responseStore.scenarioDto.applicantAnswers['q5'].value = 'Да';
            });

            describe('find region without slicing', () => {
              beforeEach(() => {
                formPlayerService.responseStore.scenarioDto.applicantAnswers['pd4'].value = JSON.stringify({
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
                formPlayerService.responseStore.scenarioDto.applicantAnswers['pd4'].value = JSON.stringify({
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
                formPlayerService.responseStore.scenarioDto.applicantAnswers['pd4'].value = JSON.stringify({
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
                formPlayerService.responseStore.scenarioDto.applicantAnswers['q1'].value = 'Электронная справка';
                formPlayerService.responseStore.scenarioDto.applicantAnswers['q5'].value = 'Да';
                formPlayerService.responseStore.scenarioDto.applicantAnswers['pd4'].value = JSON.stringify({
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
                formPlayerService.responseStore.scenarioDto.applicantAnswers['q1'].value = 'Электронная справка';
                formPlayerService.responseStore.scenarioDto.applicantAnswers['q5'].value = 'Да';
                formPlayerService.responseStore.scenarioDto.applicantAnswers['pd4'].value = JSON.stringify({
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

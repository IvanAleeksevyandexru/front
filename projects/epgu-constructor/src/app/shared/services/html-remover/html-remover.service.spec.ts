import { TestBed } from '@angular/core/testing';
import { DisplayDto } from '../../../form-player/services/form-player-api/form-player-api.types';
import { ScreenTypes } from '../../../screen/screen.types';
import { HtmlRemoverService } from './html-remover.service';
import { configureTestSuite } from 'ng-bullet';


describe('HtmlRemoverService', () => {
  let service: HtmlRemoverService;
  let mockDisplay: DisplayDto = {
    id: 's1',
    name: 'Приветствие',
    type: ScreenTypes.INFO,
    header: 'Получение заграничного паспорта',
    submitLabel: 'Начать',
    components: [
      {
        id: 'w1',
        type: 'InfoScr',
        label:
          `<p>Планируете зарубежную поездку? Закажите заграничный паспорт себе и своим детям без ожидания в очередях</p>
          <p>Чтобы сделать правильный выбор, <a id=\'findout\'>узнайте</a>,
          чем загранпаспорт нового образца отличается от старого образца</p>
          <p>Для получения услуги вам нужно ответить на несколько вопросов, чтобы мы показали необходимые действия</p>`,
        attrs: {
          clarifications: {
            findout: {
              title: 'Чем отличается паспорт нового образца от старого',
              text:
                `<p><h5>Загранпаспорт нового образца</h5>
                Загранпаспорт нового образца еще называют содержащим электронный носитель информации либо биометрическим.<br><br>
                <b>Особенности</b><ul class=\'mt-12\'>
                <li>Срок действия — 10 лет</li>
                <li>Госпошлина за оформление — 5 000 рублей (3 500 рублей при оплате на портале)
                для взрослых и 2 500 рублей (1 750 рублей при оплате на портале) для детей до 14 лет</li>
                <li>Обязательная дактилоскопическая регистрация (сканирование папиллярных узоров пальцев)</li>
                <li>Фото на документ делает сотрудник МВД</li><li>Количество страниц — 46</li>
                <li>Нельзя внести информацию о детях</li><li>Обязательно присутствие ребенка при оформлении загранпаспорта на него</li>
                </ul></p><p><h5>Загранпаспорт старого образца</h5><br><b>Особенности</b><br><ul class=\'mt-12\'>
                <li>Срок действия — 5 лет</li>
                <li>Госпошлина за оформление — 2 000 рублей (1 400 рублей при оплате на портале) для взрослых
                и 1 000 рублей (700 рублей при оплате на портале) для детей до 14 лет</li>
                <li>Дактилоскопическая регистрация не нужна</li><li>Количество страниц — 36</li>
                <li>Можно внести информацию о детях до 14 лет</li>
                <li>Присутствие ребенка до 14 лет при оформлении загранпаспорта не обязательно</li></ul></p>`,
            },
          },
        },
        value: '',
        required: true,
      },
    ],
    terminal: false,
    firstScreen: true,
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [HtmlRemoverService],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(HtmlRemoverService);
  });

  it('should return object without html tags in props', () => {
    const result = JSON.stringify(service.delete(mockDisplay));
    expect(service.hasHtmlRegExp.test(result)).toBeFalsy();
  });
});

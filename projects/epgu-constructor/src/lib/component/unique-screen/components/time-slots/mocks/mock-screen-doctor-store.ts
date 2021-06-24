/* eslint-disable max-len */
export const mockScreenDoctorStore = {
  serviceCode: '10000000204',
  targetCode: '-10000000204',
  orderId: 763931536,
  currentScenarioId: 1,
  serviceDescriptorId: '10000000204',
  currentUrl: 'http://local.test.gosuslugi.ru:4200/',
  finishedAndCurrentScreens: [
    's1',
    's2',
    's3',
    's4_temp',
    's5',
    's6',
    's8_smev2',
    's9_smev2',
    's10_smev2',
    's11_smev2',
  ],
  cachedAnswers: {},
  currentValue: {},
  errors: {},
  uniquenessErrors: [],
  applicantAnswers: {
    w1: { visited: true, value: 'Начать' },
    q1: { visited: true, value: 'Себя' },
    pd1: {
      visited: true,
      value:
        '{"states":[{"groupName":"Николаев Николай Николаевич","fields":[{"label":"Дата рождения","value":"03.05.1974"},{"label":"СНИЛС","value":"000-000-000 57"}]}],"storedValues":{"firstName":"Николай","lastName":"Николаев","middleName":"Николаевич","birthDate":"03.05.1974","gender":"M","citizenship":"РОССИЯ","citizenshipCode":"RUS","snils":"000-000-000 57"},"errors":[]}',
    },
    pd5_9_temp: { visited: true, value: '2342424324' },
    pd5_9_add_temp: { visited: true, value: '' },
    pd5_10_temp: { visited: true, value: '' },
    pd3: { visited: true, value: '+7(999)8388383' },
    reg1: {
      visited: true,
      value:
        '{"originalItem":{"value":"86","title":"г. Севастополь","isLeaf":true,"children":[],"attributes":[{"name":"Reg_Code","type":"STRING","value":{"asString":"86","typeOfValue":"STRING","value":"86"},"valueAsOfType":"86"},{"name":"Reg_Name","type":"STRING","value":{"asString":"г. Севастополь","typeOfValue":"STRING","value":"г. Севастополь"},"valueAsOfType":"г. Севастополь"},{"name":"OKATO","type":"STRING","value":{"asString":"67000000000","typeOfValue":"STRING","value":"67000000000"},"valueAsOfType":"67000000000"},{"name":"KLADR","type":"STRING","value":{"asString":"9200000000000","typeOfValue":"STRING","value":"9200000000000"},"valueAsOfType":"9200000000000"},{"name":"Type_Screenplay","type":"STRING","value":{"asString":"0","typeOfValue":"STRING","value":"0"},"valueAsOfType":"0"},{"name":"Referral","type":"STRING","value":{"asString":"3","typeOfValue":"STRING","value":"3"},"valueAsOfType":"3"}],"attributeValues":{"KLADR":"9200000000000","Reg_Code":"86","OKATO":"67000000000","Type_Screenplay":"0","Referral":"3","Reg_Name":"г. Севастополь"}},"id":"86","text":"г. Севастополь","medicalInfo":{"smevVersion":2,"sessionId":"100ab5f6-87ab-417f-bc61-fd1aec06d719","eserviceId":"33090","medicalData":{"totalItems":1,"items":[{"attributes":[{"name":"Patient_Id","value":"78541412"}],"convertedAttributes":{"Patient_Id":"78541412"}}]},"bookAttributes":[{"name":"Session_Id","value":"100ab5f6-87ab-417f-bc61-fd1aec06d719"}]}}',
    },
    ms1_smev2: {
      visited: true,
      value:
        '{"value":"27000049","parentValue":null,"title":"Амбулатория, ГБУЗ РА \\"Гиагинская ЦРБ\\"","isLeaf":true,"children":null,"attributes":[{"name":"MO_Id","type":"STRING","value":{"asString":"27000049","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"27000049"},"valueAsOfType":"27000049"},{"name":"Organization_Name","type":"STRING","value":{"asString":"Амбулатория, ГБУЗ РА \\"Гиагинская ЦРБ\\"","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"Амбулатория, ГБУЗ РА \\"Гиагинская ЦРБ\\""},"valueAsOfType":"Амбулатория, ГБУЗ РА \\"Гиагинская ЦРБ\\""},{"name":"Address_MO","type":"STRING","value":{"asString":"196607, Санкт-Петербург, Пушкин, Школьная ул., 2","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"196607, Санкт-Петербург, Пушкин, Школьная ул., 2"},"valueAsOfType":"196607, Санкт-Петербург, Пушкин, Школьная ул., 2"},{"name":"Reg_Phone","type":"STRING","value":{"asString":"(812)352-35-53","asLong":null,"asDecimal":null,"asDateTime":null,"asDate":null,"asBoolean":null,"typeOfValue":"STRING","value":"(812)352-35-53"},"valueAsOfType":"(812)352-35-53"}],"source":null,"attributeValues":{"MO_Id":"27000049","Reg_Phone":"(812)352-35-53","Organization_Name":"Амбулатория, ГБУЗ РА \\"Гиагинская ЦРБ\\"","Address_MO":"196607, Санкт-Петербург, Пушкин, Школьная ул., 2"},"objectId":3,"center":[30.401945,59.728855],"baloonContent":[{"value":"196607, Санкт-Петербург, Пушкин, Школьная ул., 2","label":"Адрес"},{"value":"(812)352-35-53","label":"Телефон"}],"agreement":true,"idForMap":3,"expanded":true,"okato":"67000000000"}',
    },
    spec_smev2: {
      visited: true,
      value:
        '{"originalItem":{"parentItem":null,"children":[],"fields":null,"attributes":[{"name":"Service_Id","value":"122"},{"name":"Service_Name","value":"врач-хирург"}]},"id":"122","text":"врач-хирург"}',
    },
    doc_smev2: {
      visited: true,
      value:
        '{"originalItem":{"parentItem":null,"children":[],"fields":null,"attributes":[{"name":"Resource_Id","value":"00000000000"},{"name":"Resource_Name","value":"Алексеев Иван Александрович"}]},"id":"00000000000","text":"Алексеев Иван Александрович"}',
    },
  },
  cycledApplicantAnswers: { answerlist: [] },
  participants: {},
  display: {
    id: 's11_smev2',
    name: 'Выбор даты и времени СМЭВ2',
    type: 'UNIQUE',
    header: 'Выберите дату и время',
    components: [
      {
        id: 'ts_smev2',
        name: '',
        type: 'TimeSlot',
        label: '',
        attrs: {
          attributeNameWithAddress: 'Address_MO',
          timePeriodInMinutes: '300',
          timeSlotType: { type: 'CONST', value: 'DOCTOR' },
          daysToShow: 15,
          startSection: 'today',
          isMonthsRangeVisible: true,
          externalIntegration: 'medicalInfo',
          department: { type: 'REF', value: 'ms1_smev2' },
          calculations: [
            {
              attributeName: 'eserviceId',
              expr: ['$reg1.value.medicalInfo.smevVersion == \'3\' ? \'10000025167\' : \'33090\''],
              valueType: 'preset',
              value: 'eserviceId',
            },
            { attributeName: 'serviceId', value: '10001000603', valueType: 'value' },
            { attributeName: 'serviceCode', value: '-10001000603', valueType: 'value' },
            {
              attributeName: 'organizationId',
              expr: [
                '$reg1.value.medicalInfo.smevVersion == \'3\' ? $ms1_smev3.value.value : $ms1_smev2.value.value',
              ],
              valueType: 'preset',
              value: 'organizationId',
            },
            {
              attributeName: 'bookAttributes',
              expr: ['$reg1.value.medicalInfo.bookAttributes'],
              valueType: 'preset',
              value: 'bookAttributes',
            },
            {
              attributeName: 'Session_Id',
              expr: ['$reg1.value.medicalInfo.sessionId'],
              valueType: 'preset',
              value: 'Session_Id',
            },
            {
              attributeName: 'Resource_Id',
              expr: [
                '$reg1.value.medicalInfo.smevVersion == \'3\' ? $doc_smev3.value.id : $doc_smev2.value.id',
              ],
              valueType: 'preset',
              value: 'Resource_Id',
            },
            {
              attributeName: 'MO_Id',
              expr: [
                '$reg1.value.medicalInfo.smevVersion == \'3\' ? $ms1_smev3.value.value : $ms1_smev2.value.value',
              ],
              valueType: 'preset',
              value: 'MO_Id',
            },
            {
              attributeName: 'Starttime',
              expr: ['\'00:00\''],
              valueType: 'preset',
              value: 'Starttime',
            },
            {
              attributeName: 'Endtime',
              expr: ['\'23:59\''],
              valueType: 'preset',
              value: 'Endtime',
            },
            {
              attributeName: 'Service_Id',
              expr: [
                '$reg1.value.medicalInfo.smevVersion == \'3\' ? $spec_smev3.value.id : $spec_smev2.value.id',
              ],
              valueType: 'preset',
              value: 'Service_Id',
            },
            {
              attributeName: 'userSelectedRegion',
              expr: ['$reg1.value.originalItem.attributeValues.OKATO'],
              valueType: 'preset',
              value: 'userSelectedRegion',
            },
            {
              attributeName: 'pacientname',
              expr: ['\'\''],
              valueType: 'preset',
              value: 'pacientname',
            },
            {
              attributeName: 'doctorname',
              expr: [
                '$reg1.value.medicalInfo.smevVersion == \'3\' ? $doc_smev3.value.text : $doc_smev2.value.text',
              ],
              valueType: 'preset',
              value: 'doctorname',
            },
            {
              attributeName: 'doctor',
              expr: [
                '$reg1.value.medicalInfo.smevVersion == \'3\' ? $spec_smev3.value.text : $spec_smev2.value.text',
              ],
              valueType: 'preset',
              value: 'doctor',
            },
            {
              attributeName: 'anotherperson',
              expr: ['$q1.value == \'Себя\' ? \'N\' : \'Y\''],
              valueType: 'preset',
              value: 'anotherperson',
            },
            {
              attributeName: 'doctorid',
              expr: [
                '$reg1.value.medicalInfo.smevVersion == \'3\' ? $doc_smev3.value.id : $doc_smev2.value.id',
              ],
              valueType: 'preset',
              value: 'doctorid',
            },
            {
              attributeName: 'genderperson',
              expr: [
                '($q1.value == \'Себя\' && $pd1.value.storedValues.gender == \'M\') ? \'Мужской\' : \'\'',
                '($q1.value == \'Себя\' && $pd1.value.storedValues.gender == \'F\') ? \'Женский\' : \'\'',
                '($q1.value == \'Ребенка\' && $cld1.value[0].cld1_5 == \'M\') ? \'Мужской\' : \'\'',
                '($q1.value == \'Ребенка\' && $cld1.value[0].cld1_5 == \'F\') ? \'Женский\' : \'\'',
                '($q1.value == \'Другого человека\' && $pd5_6.value == \'M\') ? \'Мужской\' : \'\'',
                '($q1.value == \'Другого человека\' && $pd5_6.value == \'F\') ? \'Женский\' : \'Мужской\'',
              ],
              valueType: 'preset',
              value: 'genderperson',
            },
          ],
          refs: {},
        },
        linkedValues: [
          {
            argument: 'ageperson',
            jsonLogic: {
              if: [
                { '==': ['answer.q1.value', 'Себя'] },
                'answer.pd1.value.storedValues.birthDate',
                { '==': ['answer.q1.value', 'Ребенка'] },
                'answer.cld1.value[0].pd_cld1.storedValues.birthDate',
                'answer.pd5_4.value',
              ],
            },
            converterSettings: { converter: 'DATE_TO_AGE', path: '' },
            jsonSource: false,
          },
        ],
        arguments: { ageperson: '47' },
        value:
          '{"timeSlotType":"DOCTOR","department":"{\\"value\\":\\"27000049\\",\\"parentValue\\":null,\\"title\\":\\"Амбулатория, ГБУЗ РА \\\\\\"Гиагинская ЦРБ\\\\\\"\\",\\"isLeaf\\":true,\\"children\\":null,\\"attributes\\":[{\\"name\\":\\"MO_Id\\",\\"type\\":\\"STRING\\",\\"value\\":{\\"asString\\":\\"27000049\\",\\"asLong\\":null,\\"asDecimal\\":null,\\"asDateTime\\":null,\\"asDate\\":null,\\"asBoolean\\":null,\\"typeOfValue\\":\\"STRING\\",\\"value\\":\\"27000049\\"},\\"valueAsOfType\\":\\"27000049\\"},{\\"name\\":\\"Organization_Name\\",\\"type\\":\\"STRING\\",\\"value\\":{\\"asString\\":\\"Амбулатория, ГБУЗ РА \\\\\\"Гиагинская ЦРБ\\\\\\"\\",\\"asLong\\":null,\\"asDecimal\\":null,\\"asDateTime\\":null,\\"asDate\\":null,\\"asBoolean\\":null,\\"typeOfValue\\":\\"STRING\\",\\"value\\":\\"Амбулатория, ГБУЗ РА \\\\\\"Гиагинская ЦРБ\\\\\\"\\"},\\"valueAsOfType\\":\\"Амбулатория, ГБУЗ РА \\\\\\"Гиагинская ЦРБ\\\\\\"\\"},{\\"name\\":\\"Address_MO\\",\\"type\\":\\"STRING\\",\\"value\\":{\\"asString\\":\\"196607, Санкт-Петербург, Пушкин, Школьная ул., 2\\",\\"asLong\\":null,\\"asDecimal\\":null,\\"asDateTime\\":null,\\"asDate\\":null,\\"asBoolean\\":null,\\"typeOfValue\\":\\"STRING\\",\\"value\\":\\"196607, Санкт-Петербург, Пушкин, Школьная ул., 2\\"},\\"valueAsOfType\\":\\"196607, Санкт-Петербург, Пушкин, Школьная ул., 2\\"},{\\"name\\":\\"Reg_Phone\\",\\"type\\":\\"STRING\\",\\"value\\":{\\"asString\\":\\"(812)352-35-53\\",\\"asLong\\":null,\\"asDecimal\\":null,\\"asDateTime\\":null,\\"asDate\\":null,\\"asBoolean\\":null,\\"typeOfValue\\":\\"STRING\\",\\"value\\":\\"(812)352-35-53\\"},\\"valueAsOfType\\":\\"(812)352-35-53\\"}],\\"source\\":null,\\"attributeValues\\":{\\"MO_Id\\":\\"27000049\\",\\"Reg_Phone\\":\\"(812)352-35-53\\",\\"Organization_Name\\":\\"Амбулатория, ГБУЗ РА \\\\\\"Гиагинская ЦРБ\\\\\\"\\",\\"Address_MO\\":\\"196607, Санкт-Петербург, Пушкин, Школьная ул., 2\\"},\\"objectId\\":3,\\"center\\":[30.401945,59.728855],\\"baloonContent\\":[{\\"value\\":\\"196607, Санкт-Петербург, Пушкин, Школьная ул., 2\\",\\"label\\":\\"Адрес\\"},{\\"value\\":\\"(812)352-35-53\\",\\"label\\":\\"Телефон\\"}],\\"agreement\\":true,\\"idForMap\\":3,\\"expanded\\":true,\\"okato\\":\\"67000000000\\"}","orderId":763931536,"userId":"1000466480","waitingTimeExpired":false,"eserviceId":"33090","organizationId":"27000049","bookAttributes":"[{\\"name\\":\\"Session_Id\\",\\"value\\":\\"100ab5f6-87ab-417f-bc61-fd1aec06d719\\"}]","timeSlotRequestAttrs":[{"name":"Session_Id","value":"100ab5f6-87ab-417f-bc61-fd1aec06d719"},{"name":"Resource_Id","value":"00000000000"},{"name":"MO_Id","value":"27000049"},{"name":"Startdate","value":"23.06.2021"},{"name":"Enddate","value":"07.07.2021"},{"name":"Starttime","value":"00:00"},{"name":"Endtime","value":"23:59"},{"name":"Service_Id","value":"122"},{"name":"ServiceSpec_Id","value":""}],"userSelectedRegion":"67000000000","bookingRequestParams":[{"name":"pacientname","value":""},{"name":"doctorname","value":"Алексеев Иван Александрович"},{"name":"doctor","value":"врач-хирург"},{"name":"anotherperson","value":"N"},{"name":"doctorid","value":"00000000000"},{"name":"ageperson","value":"47"},{"name":"genderperson","value":"Мужской"}]}',
        required: true,
      },
    ],
    buttons: [{ label: 'Записаться к врачу', type: 'nextStep', action: 'getNextScreen' }],
    hideBackButton: false,
    infoComponents: [],
    impasse: false,
    accepted: true,
    firstScreen: false,
    terminal: false,
  },
  logicComponents: [],
  serviceInfo: { statusId: 0 },
  signInfoMap: {},
  attachmentInfo: {},
  additionalParameters: {},
  serviceParameters: {},
  generatedFiles: [],
  cycledApplicantAnswerContext: {},
  gender: 'M',
};

/**
 * @property {string}header - question title
 * @property {Array<QuestionAnswerInterface>}supportedValues - answer data
 */
export interface QuestionISrcInterface {
  // "id": string,
  // "type": "QuestionScr",
  "header": string,
  // "label": string,
  "supportedValues": Array<QuestionAnswerInterface>,
  // "attrs": Object,
  // "visited": boolean
}


/**
 * @property {string}label - answer text
 * @property {string}value - action value
 * @property {string}action - xxxxx - // TODO что это за значение
 */
export interface QuestionAnswerInterface {
  "label": string,
  "value": string,
  "action": string
}






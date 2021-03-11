import { addMinutes, endOfDay, format, getHours, getMinutes, parse, setHours, setMinutes, startOfDay } from 'date-fns';

/**
 * Возвращает массив объектов Date с шагом в stepInMinutes минут для суток с 00:00 до 23:59
 * @param stepInMinutes - шаг в минутах
 */
export const getTimeChunksDateObjects = (stepInMinutes: number): Date[] => {
  const now = new Date();

  let start = startOfDay(now);

  const end = endOfDay(now);

  const chunks = [];

  while (start <= end) {
    chunks.push(start);
    start = addMinutes(start, stepInMinutes);
  }

  return chunks;
};

/**
 * Возвращает массив вида: ["00:00", "00:15", "00:30", ....] с начала и до конца суток
 * @param stepInMinutes - шаг в минутах
 * @param timeFormat - формат времени, например "HH:mm"
 */
export const getTimeChunks = (stepInMinutes: number, timeFormat: string): string[] => {
  const dateObjects = getTimeChunksDateObjects(stepInMinutes);

  return dateObjects.map(item => format(item, timeFormat));
};

export const getDateTimeObject = (date: Date, time: string, timeFormat: string): Date => {
  const timeObj = parse(time, timeFormat, new Date());

  let dateTimeObj = setHours(date, getHours(timeObj));
  dateTimeObj = setMinutes(dateTimeObj, getMinutes(timeObj));

  return dateTimeObj;
};


export const MASKS = {
  KadastrNumberInput: (value: string): Array<string | RegExp> => {
    const mask = [/\d/, /\d/, ':', /\d/, /\d/, ':'];
    const chunks = value.replace(/\_/g, '').split(':');
    let i;

    for (i = 0; (!chunks[2] || i < chunks[2].length) && i < 7; i++) {
        mask.push(/\d/);
    }

    if (!chunks[3] && (!chunks[2] || chunks[2].length < 7)) {
        mask.push(/\d|:/);
    } else {
        mask.push(':');
    }

    for (i = 0; (!chunks[3] || i <= chunks[3].length) && i < 9; i++) {
      mask.push(/\d/);
    }

    return mask;
  },
};
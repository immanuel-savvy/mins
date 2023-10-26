const charset =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const combinations = {
  alnum: charset,
  num: '01234556789',
  alpha: 'abcdefghijklmnopqrstuvwxyz',
};

const gen_random_int = (max_int, min_int = 0) =>
  min_int + Math.floor(Math.random() * max_int);

const generate_random_string = (len = 6, combination = 'num') => {
  let string = '';
  combination = combinations[combination];
  for (let i = 0; i < len; i++)
    string += combination[gen_random_int(combination.length)];

  return string;
};

const zero_padd_figure = figure =>
  figure < 10 && figure > -1 ? `0${figure}` : figure;

const format_date = date => {
  let _date = new Date(date);
  return `Date: ${zero_padd_figure(_date.getDate())}-${zero_padd_figure(
    _date.getMonth() + 1,
  )}-${zero_padd_figure(_date.getUTCFullYear())}`;
};

const format_time = time => {
  let _time = new Date(time);
  return `Time: ${zero_padd_figure(_time.getHours())} : ${zero_padd_figure(
    _time.getMinutes(),
  )}`;
};

const sentence = text => {
  let index;
  for (let t = 0; t < text.length; t++) {
    if (combinations.alpha.includes(text[t].toLowerCase())) {
      index = t;
      break;
    }
  }
  text = text.split('');
  if (text[index]) text[index] = text[index].toUpperCase();

  return text.join('');
};

const capitalise = text => {
  if (!text || typeof text !== 'string') return text;

  let text_split = text.split(' ');
  for (let t = 0; t < text_split.length; t++)
    text_split[t] = sentence(text_split[t]);

  return text_split.join(' ');
};

const format_quick_time = timestamp => {
  let time = new Date(timestamp);
  let this_time = new Date();

  let minute = 60 * 1000,
    hour = minute * 60,
    days = hour * 24;

  let time_diff = this_time - time;
  if (time_diff >= days) return `${Math.floor(time_diff / days)} days ago`;
  else if (time_diff >= hour)
    return `${Math.floor(time_diff / hour)} hours ago`;
  else if (time_diff >= minute)
    return `${Math.floor(time_diff / minute)} minutes ago`;
  else return 'Just now';
};

const month_index = new Object({
  0: 'jan',
  1: 'feb',
  2: 'mar',
  3: 'apr',
  4: 'may',
  5: 'jun',
  6: 'jul',
  7: 'aug',
  8: 'sep',
  9: 'oct',
  10: 'nov',
  11: 'dec',
});

const date_string = timestamp => {
  let date = new Date(timestamp);
  return `${date.getDate().toString().padStart(2, '0')} ${to_title(
    month_index[date.getMonth()],
  )} ${date.getFullYear()}`;
};

const time_string = timestamp => {
  let date = new Date(timestamp);

  return `${date.getHours().toString().padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
};

let phone_regex =
  /^(\+{0,})(\d{0,})([(]{1}\d{1,3}[)]{0,}){0,}(\s?\d+|\+\d{2,3}\s{1}\d+|\d+){1}[\s|-]?\d+([\s|-]?\d+){1,2}(\s){0,}$/gm;

let email_regex =
  /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const validate_phone = phone => phone_regex.test(phone);

const validate_email = email => email_regex.test(email);

const commalise_figures_ = figure => {
  if (typeof figure !== 'number') {
    return figure;
  }

  if (figure >= 1e21) return figure.toLocaleString('fullwide');

  figure = figure.toString();
  if (figure.length <= 3) return figure;

  let ff = '',
    i;
  for (i = 0; i < figure.length; i += 3)
    ff = `${figure.slice(figure.length - i - 3, figure.length - i)},${ff}`;

  if (i < figure.length) ff = `${figure.slice(0, i)}${ff}`;
  else if (i > figure.length) {
    ff = `${figure.slice(0, figure.length % 3)}${ff}`;
  }
  if (ff.startsWith(',')) ff = ff.slice(1);

  return ff.slice(0, -1);
};

const commalise_figures = (value, no_fixed) => {
  if (typeof value !== 'number') {
    if (typeof value === 'string') {
      if (/[A-Za-z]{1,}\-/.test(value)) return value;
      else value = Number(value);

      if (!value) return;
    } else return value;
  }

  if (!value) return '0.00';

  let sign = value > 0 ? 1 : -1;
  value = Math.abs(value);

  let integer = Math.floor(value);
  let decimal = (value - integer).toFixed(2).toString();

  let commalised = commalise_figures_(integer);

  if (sign === -1) commalised = `-${commalised}`;

  return no_fixed
    ? commalised
    : `${commalised}${decimal.slice(decimal.indexOf('.'))}`;
};

const to_title = string => {
  if (!string) return string;

  let str = '';
  string.split(' ').map(s => {
    if (s) str += ' ' + s[0].toUpperCase() + s.slice(1);
  });
  return str.trim();
};

export {
  zero_padd_figure,
  format_date,
  format_time,
  phone_regex,
  email_regex,
  sentence,
  capitalise,
  validate_email,
  validate_phone,
  format_quick_time,
  generate_random_string,
  commalise_figures,
  date_string,
  month_index,
  time_string,
  to_title,
};

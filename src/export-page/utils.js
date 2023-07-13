import Cookies from 'universal-cookie';
import moment from 'moment';
import { LAST_EXPORT_COOKIE_NAME } from './data/constants';

// eslint-disable-next-line import/prefer-default-export
export const setExportCookie = (date, completed) => {
  const cookies = new Cookies();
  cookies.set(LAST_EXPORT_COOKIE_NAME, { date, completed }, { path: window.location.pathname });
};

export const getFormattedSuccessDate = (unixDate) => {
  const formattedDate = moment(unixDate).utc().format('MM/DD/YYYY');
  const formattedTime = moment(unixDate).utc().format('HH:mm');
  return unixDate ? ` (${formattedDate} at ${formattedTime} UTC)` : null;
};

import moment from 'moment';

import { CERTIFICATE_DISPLAY_BEHAVIOR } from './schedule-section/certificate-display-row';
import messages from './messages';

const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss\\Z';

const convertToDateFromString = (dateStr) => {
  if (!dateStr) {
    return '';
  }

  return moment(dateStr).utc().toDate();
};

const isDateBefore = (dateFormer, dateLatter, checkExists = true) => {
  if (checkExists && (!dateFormer || !dateLatter)) {
    return false;
  }
  return new Date(dateFormer) <= new Date(dateLatter);
};

const convertToStringFromDate = (date) => {
  if (!date) {
    return '';
  }

  return moment(date).utc().format(DATE_TIME_FORMAT);
};

const validateScheduleAndDetails = (courseDetails, intl) => {
  const errors = {};
  const {
    endDate,
    startDate,
    enrollmentEnd,
    enrollmentStart,
    certificateAvailableDate,
    certificatesDisplayBehavior,
  } = courseDetails;

  if (!startDate) {
    errors.startDate = intl.formatMessage(messages.error7);
  }

  if (isDateBefore(certificateAvailableDate, endDate)) {
    errors.certificateAvailableDate = intl.formatMessage(messages.error6);
  }

  if (isDateBefore(endDate, startDate)) {
    errors.endDate = intl.formatMessage(messages.error5);
  }

  if (isDateBefore(startDate, enrollmentStart)) {
    errors.enrollmentStart = intl.formatMessage(messages.error4);
  }

  if (isDateBefore(enrollmentStart, enrollmentEnd)) {
    errors.enrollmentStart = intl.formatMessage(messages.error3);
  }

  if (isDateBefore(enrollmentEnd, endDate)) {
    errors.enrollmentEnd = intl.formatMessage(messages.error2);
  }

  if (
    certificatesDisplayBehavior === CERTIFICATE_DISPLAY_BEHAVIOR.endWithDate
    && !certificateAvailableDate
  ) {
    errors.certificateAvailableDate = intl.formatMessage(messages.error1);
  }

  return errors;
};

export { validateScheduleAndDetails, convertToDateFromString, convertToStringFromDate };

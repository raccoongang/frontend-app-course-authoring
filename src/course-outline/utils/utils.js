import { LAUNCH_CHECKLIST, BEST_PRACTICES_CHECKLIST } from '../constants';
import { getChecklistValues, getChecklistValidatedValue } from './getChecklistValues';

const getCourseLaunchChecklist = (data) => {
  // eslint-disable-next-line camelcase
  const { is_self_paced: isSelfPaced, certificates } = data;

  const filteredCourseLaunchChecks = getChecklistValues({
    checklist: LAUNCH_CHECKLIST.data,
    isSelfPaced,
    hasCertificatesEnabled: certificates.is_enabled,
    hasHighlightsEnabled: false,
  });

  const completedCourseLaunchChecks = filteredCourseLaunchChecks.reduce((result, currentValue) => {
    const value = getChecklistValidatedValue(data, currentValue.id);
    return value ? result + 1 : result;
  }, 0);

  return {
    totalCourseLaunchChecks: filteredCourseLaunchChecks.length,
    completedCourseLaunchChecks,
  };
};

const getCourseBestPacticesChecklist = (data) => {

};

// eslint-disable-next-line import/prefer-default-export
export { getCourseLaunchChecklist };

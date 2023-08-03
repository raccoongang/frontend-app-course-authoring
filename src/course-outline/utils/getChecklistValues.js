import * as healthValidators from './courseChecklistValidators';
import { CHECKLIST_FILTERS } from '../constants';

const getChecklistValidatedValue = (data, id) => {
  switch (id) {
  case 'welcomeMessage':
    return healthValidators.hasWelcomeMessage(data.updates);
  case 'gradingPolicy':
    return healthValidators.hasGradingPolicy(data.grades);
  case 'certificate':
    return healthValidators.hasCertificate(data.certificates);
  case 'courseDates':
    return healthValidators.hasDates(data.dates);
  case 'assignmentDeadlines':
    return healthValidators.hasAssignmentDeadlines(data.assignments, data.dates);
  case 'videoDuration':
    return healthValidators.hasShortVideoDuration(data.videos);
  case 'mobileFriendlyVideo':
    return healthValidators.hasMobileFriendlyVideos(data.videos);
  case 'diverseSequences':
    return healthValidators.hasDiverseSequences(data.subsections);
  case 'weeklyHighlights':
    return healthValidators.hasWeeklyHighlights(data.sections);
  case 'unitDepth':
    return healthValidators.hasShortUnitDepth(data.units);
  case 'proctoringEmail':
    return healthValidators.hasProctoringEscalationEmail(data.proctoring);
  default:
    throw new Error(`Unknown validator ${id}.`);
  }
};

const getChecklistValues = ({
  checklist,
  isSelfPaced,
  hasCertificatesEnabled,
  hasHighlightsEnabled,
  needsProctoringEscalationEmail,
}) => {
  let filteredCheckList;

  if (isSelfPaced) {
    filteredCheckList = checklist.filter(data => data.pacingTypeFilter === CHECKLIST_FILTERS.ALL
      || data.pacingTypeFilter === CHECKLIST_FILTERS.SELF_PACED);
  } else {
    filteredCheckList = checklist.filter(data => data.pacingTypeFilter === CHECKLIST_FILTERS.ALL
      || data.pacingTypeFilter === CHECKLIST_FILTERS.INSTRUCTOR_PACED);
  }

  filteredCheckList = filteredCheckList.filter(data => data.id !== 'certificate'
    || hasCertificatesEnabled);

  filteredCheckList = filteredCheckList.filter(data => data.id !== 'weeklyHighlights'
    || hasHighlightsEnabled);

  filteredCheckList = filteredCheckList.filter(data => data.id !== 'proctoringEmail'
    || needsProctoringEscalationEmail);

  return filteredCheckList;
};

export { getChecklistValues, getChecklistValidatedValue };

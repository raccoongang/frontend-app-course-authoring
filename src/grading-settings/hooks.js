import { useEffect, useRef, useState } from 'react';
import { getGradingValues, getSortedGrades } from './grading-scale/utils';

const useConvertGradeCutoffs = (
  gradeCutoffs,
) => {
  const gradeLetters = gradeCutoffs && Object.keys(gradeCutoffs);
  const gradeValues = gradeCutoffs && getGradingValues(gradeCutoffs);
  const sortedGrades = gradeCutoffs && getSortedGrades(gradeValues);

  return {
    gradeLetters,
    gradeValues,
    sortedGrades,
  };
};

const useUpdateGradingData = (gradingSettingsData, setOverrideInternetConnectionAlert) => {
  const [gradingData, setGradingData] = useState({});
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const resetDataRef = useRef(false);
  const {
    gradeCutoffs = {},
    gracePeriod = { hours: '', minutes: '' },
    minimumGradeCredit,
    graders,
  } = gradingData;

  useEffect(() => {
    if (gradingSettingsData) {
      setGradingData(gradingSettingsData);
    }
  }, [gradingSettingsData]);

  const handleResetPageData = () => {
    setShowSavePrompt(!showSavePrompt);
    setGradingData(gradingSettingsData);
    resetDataRef.current = true;
    setOverrideInternetConnectionAlert(false);
  };

  const handleAddAssignment = () => {
    setGradingData(prevState => ({
      ...prevState,
      graders: [...prevState.graders, {
        id: graders.length,
        dropCount: 0,
        minCount: 1,
        shortLabel: '',
        type: '',
        weight: 0,
      }],
    }));
  };

  const handleRemoveAssignment = (id) => {
    setGradingData((prevState) => ({
      ...prevState,
      graders: prevState.graders.filter((obj) => obj.id !== id),
    }));
  };

  return {
    graders,
    resetDataRef,
    setGradingData,
    gradingData,
    gradeCutoffs,
    gracePeriod,
    minimumGradeCredit,
    showSavePrompt,
    setShowSavePrompt,
    handleResetPageData,
    handleAddAssignment,
    handleRemoveAssignment,
  };
};

export { useConvertGradeCutoffs, useUpdateGradingData };

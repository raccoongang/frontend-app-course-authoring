import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

export const AdvancedSettingsContext = React.createContext({});

const AdvancedSettingsProvider = ({ courseId, children }) => {
  const contextValue = useMemo(() => ({
    courseId,
    path: `/course/${courseId}/settings/advanced`,
  }), []);
  return (
    <AdvancedSettingsContext.Provider
      value={contextValue}
    >
      {children}
    </AdvancedSettingsContext.Provider>
  );
};

AdvancedSettingsProvider.propTypes = {
  courseId: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default AdvancedSettingsProvider;

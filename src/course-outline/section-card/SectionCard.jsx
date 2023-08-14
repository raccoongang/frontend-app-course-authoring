import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { getSectionStatus } from '../utils';
import CardHeader from '../card-header/CardHeader';

const SectionCard = ({ section, children }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const {
    displayName,
    published,
    releasedToStudents,
    visibleToStaffOnly,
    visibilityState,
    staffOnlyMessage,
  } = section;

  const sectionStatus = getSectionStatus({
    published,
    releasedToStudents,
    visibleToStaffOnly,
    visibilityState,
    staffOnlyMessage,
  });

  const handleExpandContent = () => {
    setIsExpanded((prevState) => !prevState);
  };

  return (
    <div className="section-card">
      <CardHeader
        title={displayName}
        sectionStatus={sectionStatus}
        isExpanded={isExpanded}
        handleExpand={handleExpandContent}
      />
      {isExpanded && (
        <div className="section-card__content" data-testid="section-card__content">
          <div className="outline-section__status">
            {/* TODO: add section highlight widget */}
            <h4 className="h4 font-weight-normal">Section status</h4>
          </div>
          {children && (
            <div className="section-card__subsections">
              {children}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

SectionCard.defaultProps = {
  children: null,
};

// TODO: add new props
SectionCard.propTypes = {
  section: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    published: PropTypes.bool.isRequired,
    releasedToStudents: PropTypes.bool.isRequired,
    visibleToStaffOnly: PropTypes.bool.isRequired,
    visibilityState: PropTypes.string.isRequired,
    staffOnlyMessage: PropTypes.bool.isRequired,
  }).isRequired,
  children: PropTypes.node,
};

export default SectionCard;

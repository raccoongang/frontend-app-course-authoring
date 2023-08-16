import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Badge, Button } from '@edx/paragon';
import CardHeader from '../card-header/CardHeader';
import { getSectionStatus } from '../utils';

const SectionCard = ({ section, children, onOpenHighlightsModal }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const {
    id,
    displayName,
    published,
    releasedToStudents,
    visibleToStaffOnly,
    visibilityState,
    staffOnlyMessage,
    highlights,
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
            <Button
              className="section-card__highlights"
              variant="tertiary"
              onClick={() => onOpenHighlightsModal(id, highlights)}
            >
              <Badge className="highlights-badge" variant="primary">{highlights.length}</Badge>
              <p className="m-0 text-black">Section highlights</p>
            </Button>
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

SectionCard.propTypes = {
  section: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    published: PropTypes.bool.isRequired,
    releasedToStudents: PropTypes.bool.isRequired,
    visibleToStaffOnly: PropTypes.bool.isRequired,
    visibilityState: PropTypes.string.isRequired,
    staffOnlyMessage: PropTypes.bool.isRequired,
    highlights: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  children: PropTypes.node,
  onOpenHighlightsModal: PropTypes.func.isRequired,
};

export default SectionCard;

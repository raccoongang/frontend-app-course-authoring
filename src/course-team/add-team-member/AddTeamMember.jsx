import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Add } from '@edx/paragon/icons';
import { Button } from '@edx/paragon';
import messages from './messages';

const AddTeamMember = ({ onFormOpen, isButtonDisable }) => {
  const intl = useIntl();

  return (
    <div className="add-team-member bg-gray-100" data-testid="add-team-member">
      <div className="add-team-member-info">
        <h3 className="add-team-member-title">{intl.formatMessage(messages.title)}</h3>
        <span className="add-team-member-description">{intl.formatMessage(messages.description)}</span>
      </div>
      <Button
        variant="outline-success"
        iconBefore={Add}
        onClick={onFormOpen}
        disabled={isButtonDisable}
      >
        {intl.formatMessage(messages.button)}
      </Button>
    </div>
  );
};

AddTeamMember.propTypes = {
  onFormOpen: PropTypes.func.isRequired,
  isButtonDisable: PropTypes.bool,
};

AddTeamMember.defaultProps = {
  isButtonDisable: false,
};

export default AddTeamMember;
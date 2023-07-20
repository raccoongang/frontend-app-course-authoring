import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Badge, Button, MailtoLink } from '@edx/paragon';
import { DeleteOutline } from '@edx/paragon/icons';
import messages from './messages';
import { BADGE_STATES, USER_ROLES } from '../enum';

const CourseTeamMember = ({
  userName,
  role,
  email,
  onChangeRole,
  onDelete,
  currentUserEmail,
  isHideActions,
  isAllowActions,
}) => {
  const intl = useIntl();

  return (
    <div className="course-team-member" data-testid="course-team-member">
      <div className="member-info">
        <Badge variant={role === USER_ROLES.admin ? BADGE_STATES.danger : BADGE_STATES.secondary}>
          {role === USER_ROLES.admin
            ? intl.formatMessage(messages.roleAdmin)
            : intl.formatMessage(messages.roleStaff)}
          {currentUserEmail === email && (
            <span className="badge-current-user">{intl.formatMessage(messages.roleYou)}</span>
          )}
        </Badge>
        <span className="member-info-name">{userName}</span>
        <MailtoLink to={email}>{email}</MailtoLink>
      </div>
      {/* eslint-disable-next-line no-nested-ternary */}
      {isAllowActions && (
        !isHideActions ? (
          <div className="member-actions">
            <Button
              variant={role === USER_ROLES.admin ? 'tertiary' : 'primary'}
              size="sm"
              onClick={() => onChangeRole(email, role === USER_ROLES.admin ? USER_ROLES.staff : USER_ROLES.admin)}
            >
              {role === USER_ROLES.admin
                ? intl.formatMessage(messages.removeButton)
                : intl.formatMessage(messages.addButton)}
            </Button>
            <Button
              className="delete-button"
              variant="tertiary"
              size="sm"
              data-testid="delete-button"
              iconBefore={DeleteOutline}
              onClick={onDelete}
            />
          </div>
        ) : (
          <div className="member-hint">
            <span>{intl.formatMessage(messages.hint)}</span>
          </div>
        )
      )}
    </div>
  );
};

CourseTeamMember.propTypes = {
  userName: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  onChangeRole: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  currentUserEmail: PropTypes.string.isRequired,
  isHideActions: PropTypes.bool.isRequired,
  isAllowActions: PropTypes.bool.isRequired,
};

export default CourseTeamMember;

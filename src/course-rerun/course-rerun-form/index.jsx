import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';

import { CreateOrRerunCourseForm } from '../../generic/create-or-rerun-course';
import messages from './messages';

const CourseRerunForm = ({ initialFormValues, handleOnClickCancel, handleOnClickCreate }) => {
  const intl = useIntl();
  return (
    <div className="mb-4.5">
      <div className="my-2.5">{intl.formatMessage(messages.rerunCourseDescription, {
        strong: (
          <strong>{intl.formatMessage(messages.rerunCourseDescriptionStrong)}</strong>
        ),
      })}
      </div>
      <CreateOrRerunCourseForm
        initialValues={initialFormValues}
        onClickCreate={handleOnClickCreate}
        onClickCancel={handleOnClickCancel}
      />
    </div>
  );
};

CourseRerunForm.propTypes = {
  initialFormValues: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    org: PropTypes.string.isRequired,
    number: PropTypes.string.isRequired,
    run: PropTypes.string,
  }).isRequired,
  handleOnClickCancel: PropTypes.func.isRequired,
  handleOnClickCreate: PropTypes.func.isRequired,
};

export default CourseRerunForm;
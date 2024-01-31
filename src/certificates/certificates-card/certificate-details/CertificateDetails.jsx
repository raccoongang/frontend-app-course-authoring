import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Icon, Stack, IconButtonWithTooltip, Form,
} from '@edx/paragon';
import {
  EditOutline as EditOutlineIcon, DeleteOutline as DeleteOutlineIcon,
} from '@edx/paragon/icons';

import { MODE_STATES } from '../../data/constants';
import messages from '../messages';

const CertificateDetails = ({
  mode,
  handleChange,
  handleBlur,
  detailsCourseTitle,
  courseTitleOverride,
  detailsCourseNumber,
  courseNumberOverride,
}) => {
  const intl = useIntl();

  return (
    <section>
      <Stack className="justify-content-between" direction="horizontal">
        <h2 className="lead">{intl.formatMessage(messages.detailsSectionTitle)}</h2>
        <Stack direction="horizontal" gap="2">
          {mode === MODE_STATES.VIEW && (
            <>
              <IconButtonWithTooltip
                src={EditOutlineIcon}
                iconAs={Icon}
                variant="primary"
                tooltipContent={<div>{intl.formatMessage(messages.editTooltip)}</div>}
                alt={intl.formatMessage(messages.editTooltip)}
                // onClick={handleEditAll} TODO https://youtrack.raccoongang.com/issue/AXIMST-178
              />
              <IconButtonWithTooltip
                src={DeleteOutlineIcon}
                iconAs={Icon}
                variant="primary"
                tooltipContent={<div>{intl.formatMessage(messages.deleteTooltip)}</div>}
                alt={intl.formatMessage(messages.deleteTooltip)}
                // onClick={confirmOpen} TODO https://youtrack.raccoongang.com/issue/AXIMST-172
              />
            </>
          )}
        </Stack>
      </Stack>

      <hr />

      <div>
        <Stack>
          <Stack direction="horizontal" gap="1.5" className="details-info">
            <p><strong>{intl.formatMessage(messages.detailsCourseTitle)}:</strong> {detailsCourseTitle}</p>
            {mode === MODE_STATES.VIEW && (
              <p className="details-course-number"><strong>{intl.formatMessage(messages.detailsCourseNumber)}:</strong> {detailsCourseNumber}</p>
            )}
          </Stack>
          <Stack direction="horizontal" gap="1.5" className="details-info justify-content-between align-items-baseline">
            {mode === MODE_STATES.VIEW && (
              <>
                {courseTitleOverride && (
                  <p>
                    <strong>{intl.formatMessage(messages.detailsCourseTitleOverride)}:</strong> {courseTitleOverride}
                  </p>
                )}
                {courseNumberOverride && (
                  <p className="text-right">
                    <strong>{intl.formatMessage(messages.detailsCourseNumberOverride)}:</strong> {courseNumberOverride}
                  </p>
                )}
              </>
            )}
            {mode === MODE_STATES.CREATE && (
              <Form.Group className="m-0 w-100">
                <Form.Label>{intl.formatMessage(messages.detailsCourseTitleOverride)}</Form.Label>
                <Form.Control
                  name="courseTitle"
                  value={courseTitleOverride}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={intl.formatMessage(messages.detailsCourseTitleOverride)}
                />
                <Form.Control.Feedback className="x-small">
                  {intl.formatMessage(messages.detailsCourseTitleOverrideDescription)}
                </Form.Control.Feedback>
              </Form.Group>
            )}
          </Stack>
        </Stack>
      </div>
    </section>
  );
};

CertificateDetails.defaultProps = {
  courseTitleOverride: '',
  courseNumberOverride: '',
  handleChange: null,
  handleBlur: null,
};

CertificateDetails.propTypes = {
  courseTitleOverride: PropTypes.string,
  courseNumberOverride: PropTypes.string,
  detailsCourseTitle: PropTypes.string.isRequired,
  detailsCourseNumber: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
};

export default CertificateDetails;

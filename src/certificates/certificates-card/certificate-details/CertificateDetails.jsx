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
  componentMode,
  handleChange,
  handleBlur,
  detailsCourseTitle,
  courseTitleOverride,
  detailsCourseNumber,
  courseNumberOverride,
}) => {
  const intl = useIntl();

  return (
    <section className="certificate-details">
      <Stack className="justify-content-between" direction="horizontal">
        <h2 className="lead section-title">{intl.formatMessage(messages.detailsSectionTitle)}</h2>
        <Stack direction="horizontal" gap="2">
          {componentMode === MODE_STATES.view && (
            <>
              <IconButtonWithTooltip
                src={EditOutlineIcon}
                iconAs={Icon}
                tooltipContent={<div>{intl.formatMessage(messages.editTooltip)}</div>}
                alt={intl.formatMessage(messages.editTooltip)}
                // onClick={handleEditAll} TODO https://youtrack.raccoongang.com/issue/AXIMST-178
              />
              <IconButtonWithTooltip
                src={DeleteOutlineIcon}
                iconAs={Icon}
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
          <Stack direction="horizontal" gap="1.5" className="certificate-details__info">
            <p className="certificate-details__info__paragraph">
              <strong>{intl.formatMessage(messages.detailsCourseTitle)}:</strong> {detailsCourseTitle}
            </p>
            {componentMode === MODE_STATES.view && (
              <p className="certificate-details__info__paragraph--course-number">
                <strong>{intl.formatMessage(messages.detailsCourseNumber)}:</strong> {detailsCourseNumber}
              </p>
            )}
          </Stack>
          <Stack direction="horizontal" gap="1.5" className="certificate-details__info">
            {componentMode === MODE_STATES.view && (
              <>
                {courseTitleOverride && (
                  <p className="certificate-details__info__paragraph">
                    <strong>{intl.formatMessage(messages.detailsCourseTitleOverride)}:</strong> {courseTitleOverride}
                  </p>
                )}
                {courseNumberOverride && (
                  <p className="certificate-details__info__paragraph text-right">
                    <strong>{intl.formatMessage(messages.detailsCourseNumberOverride)}:</strong> {courseNumberOverride}
                  </p>
                )}
              </>
            )}
            {componentMode === MODE_STATES.create && (
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
  componentMode: PropTypes.string.isRequired,
  detailsCourseNumber: PropTypes.string.isRequired,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
};

export default CertificateDetails;

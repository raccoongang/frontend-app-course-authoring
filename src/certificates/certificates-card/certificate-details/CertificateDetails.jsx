import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Stack, Form } from '@openedx/paragon';

import { MODE_STATES } from '../../data/constants';
import messages from '../messages';

const CertificateDetails = ({
  componentMode,
  handleChange,
  handleBlur,
  detailsCourseTitle,
  courseTitleOverride,
}) => {
  const intl = useIntl();

  return (
    <section>
      <Stack className="justify-content-between certificate-details" direction="horizontal">
        <h2 className="lead section-title">{intl.formatMessage(messages.detailsSectionTitle)}</h2>
        <Stack direction="horizontal" gap="2">
          {/* {mode === MODE_STATES.VIEW && ()} TODO https://youtrack.raccoongang.com/issue/AXIMST-166 */}
        </Stack>
      </Stack>

      <hr />

      <div>
        <Stack>
          <Stack direction="horizontal" gap="1.5" className="details-info">
            <p><strong>{intl.formatMessage(messages.detailsCourseTitle)}:</strong> {detailsCourseTitle}</p>
            {/* {mode === MODE_STATES.VIEW && ()} TODO https://youtrack.raccoongang.com/issue/AXIMST-166 */}
          </Stack>
          <Stack direction="horizontal" gap="1.5" className="details-info justify-content-between align-items-baseline">
            {/* {mode === MODE_STATES.VIEW && ()} TODO https://youtrack.raccoongang.com/issue/AXIMST-166 */}
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
  handleChange: null,
  handleBlur: null,
};

CertificateDetails.propTypes = {
  courseTitleOverride: PropTypes.string,
  detailsCourseTitle: PropTypes.string.isRequired,
  componentMode: PropTypes.string.isRequired,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
};

export default CertificateDetails;

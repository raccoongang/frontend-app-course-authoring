import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Icon, Stack, IconButtonWithTooltip, Form, useToggle,
} from '@edx/paragon';
import {
  EditOutline as EditOutlineIcon, DeleteOutline as DeleteOutlineIcon,
} from '@edx/paragon/icons';

import { setMode } from '../../data/slice';
import { deleteCourseCertificate } from '../../data/thunks';
import { MODE_STATES } from '../../data/constants';
import ConfirmModal from '../../confirm-modal/ConfirmModal';
import messages from '../messages';

const CertificateDetails = ({
  mode,
  handleChange,
  handleBlur,
  certificateId,
  detailsCourseTitle,
  courseTitleOverride,
  detailsCourseNumber,
  courseNumberOverride,
}) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const [isConfirmOpen, confirmOpen, confirmClose] = useToggle(false);
  const { courseId } = useParams();

  const handleEditAll = () => {
    dispatch(setMode(MODE_STATES.EDIT_ALL));
  };

  const handleDeleteCard = () => {
    if (certificateId) {
      dispatch(deleteCourseCertificate(courseId, certificateId));
    }
  };

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
                onClick={handleEditAll}
              />
              <IconButtonWithTooltip
                src={DeleteOutlineIcon}
                iconAs={Icon}
                variant="primary"
                tooltipContent={<div>{intl.formatMessage(messages.deleteTooltip)}</div>}
                alt={intl.formatMessage(messages.deleteTooltip)}
                onClick={confirmOpen}
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
      <ConfirmModal
        isOpen={isConfirmOpen}
        title={intl.formatMessage(messages.deleteCertificateConfirmation)}
        message={intl.formatMessage(messages.deleteCertificateMessage)}
        actionButtonText={intl.formatMessage(messages.deleteTooltip)}
        cancelButtonText={intl.formatMessage(messages.cancelModal)}
        handleCancel={() => confirmClose()}
        handleAction={() => {
          confirmClose();
          handleDeleteCard();
        }}
      />
    </section>
  );
};

CertificateDetails.defaultProps = {
  courseTitleOverride: '',
  courseNumberOverride: '',
  handleChange: null,
  handleBlur: null,
  certificateId: undefined,
};

CertificateDetails.propTypes = {
  certificateId: PropTypes.number,
  courseTitleOverride: PropTypes.string,
  courseNumberOverride: PropTypes.string,
  detailsCourseTitle: PropTypes.string.isRequired,
  detailsCourseNumber: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
};

export default CertificateDetails;

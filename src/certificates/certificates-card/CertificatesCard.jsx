import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Stack, Button } from '@openedx/paragon';
import { Formik, Form, FieldArray } from 'formik';
import { useIntl } from '@edx/frontend-platform/i18n';

import { MODE_STATES } from '../data/constants';
import {
  getComponentMode, getCourseTitle, getCourseNumber, getCourseNumberOverride,
} from '../data/selectors';
import { setMode } from '../data/slice';
import { createCourseCertificate } from '../data/thunks';
import CertificateDetails from './certificate-details/CertificateDetails';
import CertificateSignatories from './certificate-signatories/CertificateSignatories';
import { defaultCertificate } from '../constants';
import messages from './messages';

const CertificatesCard = ({
  id: certificateId, courseTitle: courseTitleOverride, signatories, courseId,
}) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const componentMode = useSelector(getComponentMode);
  const courseTitle = useSelector(getCourseTitle);
  const courseNumber = useSelector(getCourseNumber);
  const courseNumberOverride = useSelector(getCourseNumberOverride);

  const handleSubmit = (values) => {
    dispatch(createCourseCertificate(courseId, values));
  };

  const cardCreateCancel = (resetForm) => {
    dispatch(setMode(MODE_STATES.noCertificates));
    resetForm();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (componentMode === MODE_STATES.create) {
    return (
      <Formik initialValues={defaultCertificate} onSubmit={handleSubmit}>
        {({
          values, handleChange, handleBlur, resetForm, setFieldValue,
        }) => (
          <Form className="certificates-card-form">
            <article>
              <Card>
                <Card.Section>
                  <Stack gap="4">
                    <CertificateDetails
                      detailsCourseTitle={courseTitle}
                      detailsCourseNumber={courseNumber}
                      courseTitleOverride={values.courseTitle}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      componentMode={componentMode}
                    />
                    <FieldArray
                      name="signatories"
                      render={arrayHelpers => (
                        <CertificateSignatories
                          signatories={values.signatories}
                          componentMode={componentMode}
                          arrayHelpers={arrayHelpers}
                          handleChange={handleChange}
                          handleBlur={handleBlur}
                          setFieldValue={setFieldValue}
                        />
                      )}
                    />
                  </Stack>
                </Card.Section>
                <Card.Footer className="justify-content-start">
                  <Button type="submit">
                    {intl.formatMessage(messages.cardCreate)}
                  </Button>
                  <Button
                    variant="tertiary"
                    onClick={() => cardCreateCancel(resetForm)}
                  >
                    {intl.formatMessage(messages.cardCancel)}
                  </Button>
                </Card.Footer>
              </Card>
            </article>
          </Form>
        )}
      </Formik>
    );
  }

  return (
    <article>
      <Card>
        <Card.Section>
          <Stack gap="2">
            <CertificateDetails
              detailsCourseTitle={courseTitle}
              detailsCourseNumber={courseNumber}
              courseNumberOverride={courseNumberOverride}
              courseTitleOverride={courseTitleOverride}
              componentMode={componentMode}
              certificateId={certificateId}
            />
            <CertificateSignatories
              signatories={signatories}
              componentMode={componentMode}
            />
          </Stack>
        </Card.Section>
      </Card>
    </article>
  );
};

CertificatesCard.defaultProps = {
  id: undefined,
  courseTitle: '',
};

const SignatoryPropType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  organization: PropTypes.string.isRequired,
  signatureImagePath: PropTypes.string.isRequired,
});

CertificatesCard.propTypes = {
  id: PropTypes.number,
  courseTitle: PropTypes.string,
  signatories: PropTypes.arrayOf(SignatoryPropType).isRequired,
  courseId: PropTypes.string.isRequired,
};

export default CertificatesCard;

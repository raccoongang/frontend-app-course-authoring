import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Stack, Button } from '@openedx/paragon';
import { Formik, Form, FieldArray } from 'formik';
import { useIntl } from '@edx/frontend-platform/i18n';

import { MODE_STATES } from '../data/constants';
import {
  getComponentMode, getCourseTitle, getCourseNumber,
} from '../data/selectors';
import { setMode } from '../data/slice';
import { createCourseCertificate } from '../data/thunks';
import CertificateDetails from './certificate-details/CertificateDetails';
import CertificateSignatories from './certificate-signatories/CertificateSignatories';
import { defaultCertificate } from '../constants';
import messages from './messages';

const CertificatesCard = ({
  courseId,
}) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const componentMode = useSelector(getComponentMode);
  const courseTitle = useSelector(getCourseTitle);
  const courseNumber = useSelector(getCourseNumber);

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
    null
    // <article></article> TODO https://youtrack.raccoongang.com/issue/AXIMST-166
  );
};

CertificatesCard.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default CertificatesCard;

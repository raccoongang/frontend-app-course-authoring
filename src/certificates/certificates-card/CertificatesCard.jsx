import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Stack, Button } from '@edx/paragon';
import { Formik, Form, FieldArray } from 'formik';
import { useIntl } from '@edx/frontend-platform/i18n';

import { MODE_STATES } from '../data/constants';
import {
  getMode, getCourseTitle, getCourseNumber,
} from '../data/selectors';
import { setMode } from '../data/slice';
import { createCourseCertificate } from '../data/thunks';
import CertificateDetails from './certificate-details/CertificateDetails';
import CertificateSignatories from './certificate-signatories/CertificateSignatories';
import messages from './messages';

const CertificatesCard = ({
  courseId,
}) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const mode = useSelector(getMode);
  const title = useSelector(getCourseTitle);
  const number = useSelector(getCourseNumber);

  const initialValues = {
    courseTitle: '',
    signatories: [{
      name: '', title: '', organization: '', signatureImagePath: '',
    }],
  };

  const handleSubmit = (values) => {
    const certificateData = {
      courseTitle: values.courseTitle,
      description: 'Description of the certificate',
      editing: true,
      isActive: false,
      name: 'Name of the certificate',
      signatories: values.signatories.map(sig => ({
        name: sig.name,
        title: sig.title,
        organization: sig.organization,
        signature_image_path: sig.signatureImagePath,
        certificate: null,
      })),
      version: 1,
    };
    dispatch(createCourseCertificate(courseId, certificateData));
  };

  const cardCreateCancel = (resetForm) => {
    dispatch(setMode(MODE_STATES.NO_CERTIFICATES));
    resetForm();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (mode === MODE_STATES.CREATE) {
    return (
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({
          values, handleChange, handleBlur, resetForm, setFieldValue,
        }) => (
          <Form className="certificates__card-form">
            <article>
              <Card>
                <Card.Section>
                  <Stack gap="4">
                    <CertificateDetails
                      detailsCourseTitle={title}
                      detailsCourseNumber={number}
                      courseTitleOverride={values.courseTitle}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      mode={mode}
                    />
                    <FieldArray
                      name="signatories"
                      render={arrayHelpers => (
                        <CertificateSignatories
                          signatories={values.signatories}
                          mode={mode}
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
                    onClick={() => {
                      cardCreateCancel(resetForm);
                    }}
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

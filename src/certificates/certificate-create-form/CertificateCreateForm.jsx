import PropTypes from 'prop-types';
import { Card, Stack, Button } from '@edx/paragon';
import { Formik, Form, FieldArray } from 'formik';

import CertificateDetailsForm from '../certificate-details/CertificateDetailsForm';
import CertificateSignatories from '../certificate-signatories/CertificateSignatories';
import { defaultCertificate } from '../constants';
import messages from '../messages';
import useCertificateCreateForm from './hooks/useCertificateCreateForm';

const CertificateCreateForm = ({ courseId }) => {
  const {
    intl, courseTitle, handleCertificateSubmit, cardCreateCancel,
  } = useCertificateCreateForm(courseId);

  return (
    <Formik initialValues={defaultCertificate} onSubmit={handleCertificateSubmit}>
      {({
        values, handleChange, handleBlur, resetForm, setFieldValue,
      }) => (
        <Form className="certificates-card-form" data-testid="certificates-create-form">
          <Card>
            <Card.Section>
              <Stack gap="4">
                <CertificateDetailsForm
                  courseTitleOverride={values.courseTitle}
                  detailsCourseTitle={courseTitle}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />
                <FieldArray
                  name="signatories"
                  render={arrayHelpers => (
                    <CertificateSignatories
                      isForm
                      signatories={values.signatories}
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
        </Form>
      )}
    </Formik>
  );
};

CertificateCreateForm.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default CertificateCreateForm;

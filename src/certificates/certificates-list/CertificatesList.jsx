import PropTypes from 'prop-types';
import { Card, Stack } from '@edx/paragon';
import { Formik, Form, FieldArray } from 'formik';

import CertificateDetails from '../certificate-details/CertificateDetails';
import CertificateSignatories from '../certificate-signatories/CertificateSignatories';
import useCertificatesList from './hooks/useCertificatesList';

const CertificatesList = ({ courseId }) => {
  const {
    editModes,
    courseTitle,
    certificates,
    courseNumber,
    initialValues,
    courseNumberOverride,
    setEditModes,
    handleSubmit,
  } = useCertificatesList(courseId);

  return (
    <>
      {certificates.map((certificate, idx) => (
        <Formik initialValues={initialValues[idx]} onSubmit={handleSubmit} key={certificate.id}>
          {({
            values, handleChange, handleBlur, resetForm, setFieldValue,
          }) => (
            <Form className="certificates-card-form" data-testid="certificates-list">
              <Card>
                <Card.Section>
                  <Stack gap="2">
                    <CertificateDetails
                      detailsCourseTitle={courseTitle}
                      detailsCourseNumber={courseNumber}
                      courseNumberOverride={courseNumberOverride}
                      courseTitleOverride={certificate.courseTitle}
                      certificateId={certificate.id}
                    />
                    <FieldArray
                      name="signatories"
                      render={arrayHelpers => (
                        <CertificateSignatories
                          signatories={values.signatories}
                          arrayHelpers={arrayHelpers}
                          editModes={editModes}
                          handleChange={handleChange}
                          handleBlur={handleBlur}
                          setFieldValue={setFieldValue}
                          resetForm={resetForm}
                          setEditModes={setEditModes}
                        />
                      )}
                    />
                  </Stack>
                </Card.Section>
              </Card>
            </Form>
          )}
        </Formik>
      ))}
    </>
  );
};

CertificatesList.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default CertificatesList;
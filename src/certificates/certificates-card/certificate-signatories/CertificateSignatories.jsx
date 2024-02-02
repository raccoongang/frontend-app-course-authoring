import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { Stack, Button, Form } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import { MODE_STATES } from '../../data/constants';
import messages from '../messages';
import Signatory from './signatory/Signatory';

const CertificateSignatories = ({
  signatories, componentMode, handleChange, handleBlur, arrayHelpers, setFieldValue,
}) => {
  const intl = useIntl();

  const handleAddSignatory = () => {
    const newSignatory = {
      id: uuid(), name: '', title: '', organization: '', signatureImagePath: '',
    };
    arrayHelpers.push(newSignatory);
  };

  const handleDeleteSignatory = (id) => {
    arrayHelpers.remove(id);
  };

  return (
    <section className="certificate-signatories">
      <h2 className="lead section-title">{intl.formatMessage(messages.signatoriesSectionTitle)}</h2>
      <hr />
      <div>
        <p className="mb-4.5">
          {intl.formatMessage(messages.signatoriesRecommendation)}
        </p>
        <Stack gap="4.5">
          {signatories.map(({
            id, name, title, organization, signatureImagePath,
          }, idx) => (
            <Signatory
              key={`signatory-${id}`}
              id={idx}
              componentMode={componentMode}
              name={name}
              title={title}
              signatureImagePath={signatureImagePath}
              organization={organization}
              handleChange={handleChange}
              handleBlur={handleBlur}
              setFieldValue={setFieldValue}
              showDeleteButton={signatories.length > 1}
              handleDeleteSignatory={() => handleDeleteSignatory(id)}
            />
          ))}
        </Stack>
        {componentMode === MODE_STATES.create && (
          <>
            <Button variant="outline-primary" onClick={handleAddSignatory} className="w-100 mt-4">
              {intl.formatMessage(messages.addSignatoryButton)}
            </Button>
            <Form.Control.Feedback className="x-small">
              {intl.formatMessage(messages.addSignatoryButtonDescription)}
            </Form.Control.Feedback>
          </>
        )}
      </div>
    </section>
  );
};

CertificateSignatories.defaultProps = {
  handleChange: null,
  handleBlur: null,
  setFieldValue: null,
  arrayHelpers: null,
};

CertificateSignatories.propTypes = {
  componentMode: PropTypes.string.isRequired,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
  setFieldValue: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  arrayHelpers: PropTypes.object,
  signatories: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    organization: PropTypes.string.isRequired,
    signatureImagePath: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  })).isRequired,
};

export default CertificateSignatories;

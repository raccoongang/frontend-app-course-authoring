import PropTypes from 'prop-types';
import {
  Stack, FormLabel, Form, Button, useToggle,
} from '@edx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';

import ModalDropzone from '../../../../generic/modal-dropzone/ModalDropzone';
import { MODE_STATES } from '../../../data/constants';
import messages from '../../messages';

const Signatory = ({
  id,
  mode,
  name,
  title,
  handleBlur,
  organization,
  handleChange,
  setFieldValue,
  signatureImagePath,
}) => {
  const intl = useIntl();
  const [isOpen, open, close] = useToggle(false);

  const handleImageUpload = (newImagePath) => {
    setFieldValue(`signatories[${id}].signatureImagePath`, newImagePath);
  };

  const formData = [
    {
      labelText: intl.formatMessage(messages.nameLabel),
      value: name,
      name: `signatories[${id}].name`,
      placeholder: intl.formatMessage(messages.namePlaceholder),
      feedback: intl.formatMessage(messages.nameDescription),
      onChange: handleChange,
      onBlur: handleBlur,
    },
    {
      as: 'textarea',
      labelText: intl.formatMessage(messages.titleLabel),
      value: title,
      name: `signatories[${id}].title`,
      placeholder: intl.formatMessage(messages.titlePlaceholder),
      feedback: intl.formatMessage(messages.titleDescription),
      onChange: handleChange,
      onBlur: handleBlur,
    },
    {
      labelText: intl.formatMessage(messages.organizationLabel),
      value: organization,
      name: `signatories[${id}].organization`,
      placeholder: intl.formatMessage(messages.organizationPlaceholder),
      feedback: intl.formatMessage(messages.organizationDescription),
      onChange: handleChange,
      onBlur: handleBlur,
    },
  ];

  return (
    <div className="bg-light-200 p-2.5">
      <Stack className="justify-content-between mb-3" direction="horizontal">
        <h3>{`${intl.formatMessage(messages.signatoryTitle)} ${id + 1}`}</h3>
        <Stack direction="horizontal" gap="2">
          {/* {mode === MODE_STATES.VIEW && ()} TODO https://youtrack.raccoongang.com/issue/AXIMST-166 */}
        </Stack>
      </Stack>
      {mode === MODE_STATES.CREATE ? (
        <Stack gap="4">
          {formData.map(({ labelText, feedback, ...rest }) => (
            <Form.Group className="m-0" key={labelText}>
              <FormLabel>{labelText}</FormLabel>
              <Form.Control {...rest} className="m-0" />
              <Form.Control.Feedback className="x-small">
                {feedback}
              </Form.Control.Feedback>
            </Form.Group>
          ))}
          <Form.Group className="m-0">
            <FormLabel> {intl.formatMessage(messages.imageLabel)}</FormLabel>
            {signatureImagePath && (
              <img
                src={`${getConfig().STUDIO_BASE_URL}${signatureImagePath}`}
                style={{
                  maxWidth: '375px', minHeight: '100%', objectFit: 'cover', objectPosition: 'center', margin: '10px auto',
                }}
                alt="signature"
                className="d-block w-100"
              />
            )}
            <Stack direction="horizontal" className="align-items-baseline">
              <Stack>
                <Form.Control
                  readOnly
                  value={signatureImagePath}
                  name={`signatories[${id}].signatureImagePath`}
                  placeholder={intl.formatMessage(messages.imagePlaceholder)}
                />
                <Form.Control.Feedback className="x-small">
                  {intl.formatMessage(messages.imageDescription)}
                </Form.Control.Feedback>
              </Stack>
              <Button onClick={open}>{intl.formatMessage(messages.uploadImageButton)}</Button>
            </Stack>
          </Form.Group>
        </Stack>
      ) : (
        null
        // <Stack direction="horizontal" gap="2" className="stack-container" data-testid="signatory-view" /> TODO https://youtrack.raccoongang.com/issue/AXIMST-166
      )}
      <ModalDropzone
        isOpen={isOpen}
        onClose={close}
        onCancel={close}
        onChange={handleImageUpload}
      />
    </div>
  );
};

Signatory.defaultProps = {
  mode: MODE_STATES.VIEW,
  handleChange: null,
  handleBlur: null,
  handleDeleteSignatory: null,
  setFieldValue: null,
};

Signatory.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  organization: PropTypes.string.isRequired,
  showDeleteButton: PropTypes.bool.isRequired,
  signatureImagePath: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  mode: PropTypes.string,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
  setFieldValue: PropTypes.func,
  handleDeleteSignatory: PropTypes.func,
};

export default Signatory;

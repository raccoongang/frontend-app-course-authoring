import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import {
  Image, Icon, Stack, IconButtonWithTooltip, FormLabel, Form, Button, useToggle,
} from '@edx/paragon';
import {
  EditOutline as EditOutlineIcon, DeleteOutline as DeleteOutlineIcon,
} from '@edx/paragon/icons';
import { useIntl } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';

import { updateSavingStatus } from '../../../data/slice';
import ModalDropzone from '../../../../generic/modal-dropzone/ModalDropzone';
import ModalNotification from '../../../../generic/modal-notification';
import { MODE_STATES } from '../../../data/constants';
import messages from '../../messages';

const Signatory = ({
  id,
  componentMode,
  name,
  title,
  handleBlur,
  organization,
  handleChange,
  setFieldValue,
  showDeleteButton,
  signatureImagePath,
  handleDeleteSignatory,
}) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const [isOpen, open, close] = useToggle(false);
  const [isConfirmOpen, confirmOpen, confirmClose] = useToggle(false);

  const handleImageUpload = (newImagePath) => {
    setFieldValue(`signatories[${id}].signatureImagePath`, newImagePath);
  };

  const handleSavingStatusDispatch = (status) => {
    dispatch(updateSavingStatus(status));
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
    <div className="bg-light-200 p-2.5 signatory">
      <Stack className="justify-content-between mb-3" direction="horizontal">
        <h3 className="section-title">{`${intl.formatMessage(messages.signatoryTitle)} ${id + 1}`}</h3>
        <Stack direction="horizontal" gap="2">
          {componentMode === MODE_STATES.view && (
            <IconButtonWithTooltip
              src={EditOutlineIcon}
              iconAs={Icon}
              alt={intl.formatMessage(messages.editTooltip)}
              tooltipContent={<div>{intl.formatMessage(messages.editTooltip)}</div>}
            />
          )}
          {componentMode === MODE_STATES.create && showDeleteButton && (
            <IconButtonWithTooltip
              src={DeleteOutlineIcon}
              iconAs={Icon}
              alt={intl.formatMessage(messages.deleteTooltip)}
              tooltipContent={<div>{intl.formatMessage(messages.deleteTooltip)}</div>}
              onClick={confirmOpen}
            />
          )}
        </Stack>
      </Stack>
      {componentMode === MODE_STATES.create ? (
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
              <Image
                src={`${getConfig().STUDIO_BASE_URL}${signatureImagePath}`}
                fluid
                alt={intl.formatMessage(messages.imageLabel)}
                className="signatory__image"
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
        <Stack direction="horizontal" gap="2" className="signatory__fields-container" data-testid="signatory-view">
          <Stack className="signatory__text-fields-stack">
            <p className="signatory__text"><b>{intl.formatMessage(messages.nameLabel)}</b> {name}</p>
            <p className="signatory__text"><b>{intl.formatMessage(messages.titleLabel)}</b> {title}</p>
            <p className="signatory__text"><b>{intl.formatMessage(messages.organizationLabel)}</b> {organization}</p>
          </Stack>
          <div className="signatory__image-container">
            {signatureImagePath && (
              <Image
                src={`${getConfig().STUDIO_BASE_URL}${signatureImagePath}`}
                fluid
                alt={intl.formatMessage(messages.imageLabel)}
                className="signatory__image"
              />
            )}
          </div>
        </Stack>
      )}
      <ModalDropzone
        isOpen={isOpen}
        onClose={close}
        onCancel={close}
        onChange={handleImageUpload}
        fileTypes={['png']}
        onSavingStatus={handleSavingStatusDispatch}
        modalTitle={intl.formatMessage(messages.uploadImageButton)}
      />
      <ModalNotification
        isOpen={isConfirmOpen}
        title={intl.formatMessage(messages.deleteSignatoryConfirmation, { name })}
        message={intl.formatMessage(messages.deleteSignatoryConfirmationMessage)}
        actionButtonText={intl.formatMessage(messages.deleteTooltip)}
        cancelButtonText={intl.formatMessage(messages.cancelModal)}
        handleCancel={confirmClose}
        handleAction={() => {
          confirmClose();
          handleDeleteSignatory();
        }}
      />
    </div>
  );
};

Signatory.defaultProps = {
  componentMode: MODE_STATES.view,
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
  componentMode: PropTypes.string,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
  setFieldValue: PropTypes.func,
  handleDeleteSignatory: PropTypes.func,
};

export default Signatory;

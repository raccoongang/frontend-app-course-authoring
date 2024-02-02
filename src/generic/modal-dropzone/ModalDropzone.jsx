import PropTypes from 'prop-types';
import {
  Form,
  ModalDialog,
  Dropzone,
  ActionRow,
  Image,
  Card,
  Icon,
  Button,
  IconButton,
  Spinner,
} from '@openedx/paragon';
import { FileUpload as FileUploadIcon } from '@openedx/paragon/icons';

import InternetConnectionAlert from '../internet-connection-alert';
import useModalDropzone from './useModalDropzone';
import messages from './messages';

const ModalDropzone = ({
  isOpen,
  onClose,
  onCancel,
  onChange,
}) => {
  const {
    intl,
    previewUrl,
    uploadProgress,
    disabledUploadBtn,
    isQueryFailed,
    isQueryPending,
    imageValidator,
    handleUpload,
    handleCancel,
    handleSelectFile,
  } = useModalDropzone({ onChange, onCancel, onClose });

  const inputComponent = previewUrl ? (
    <div>
      <Image
        src={previewUrl}
        alt={intl.formatMessage(messages.uploadImageDropzoneAlt)}
        fluid
      />
    </div>
  ) : (
    <>
      <IconButton
        isActive
        src={FileUploadIcon}
        iconAs={Icon}
        variant="secondary"
        alt={intl.formatMessage(messages.uploadImageDropzoneAlt)}
        className="mb-3"
      />
      <p>{intl.formatMessage(messages.uploadImageDropzoneText)}</p>
      <p className="x-small text-center mt-1.5">{intl.formatMessage(messages.uploadImageHelpText)}</p>
    </>
  );

  return (
    <ModalDialog
      title={intl.formatMessage(messages.uploadImageButton)}
      size="lg"
      isOpen={isOpen}
      onClose={handleCancel}
      hasCloseButton
      isFullscreenOnMobile
      className="modal-dropzone"
    >
      <ModalDialog.Header>
        <ModalDialog.Title>
          {intl.formatMessage(messages.uploadImageButton)}
        </ModalDialog.Title>
      </ModalDialog.Header>
      <ModalDialog.Body>
        <Form.Group className="form-group-custom w-100">
          <Card>
            <Card.Body className="image-body">
              {uploadProgress > 0 ? (
                <Spinner animation="border" variant="primary" className="mr-3" screenReaderText={uploadProgress} />
              ) : (
                <Dropzone
                  onProcessUpload={handleSelectFile}
                  inputComponent={inputComponent}
                  accept={{ 'image/*': ['.png'] }}
                  validator={imageValidator}
                />
              )}
            </Card.Body>
          </Card>
        </Form.Group>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <ActionRow>
          <ModalDialog.CloseButton variant="tertiary" onClick={handleCancel}>
            {intl.formatMessage(messages.cancelModal)}
          </ModalDialog.CloseButton>
          <Button onClick={handleUpload} disabled={disabledUploadBtn}>
            {intl.formatMessage(messages.uploadModal)}
          </Button>
        </ActionRow>
      </ModalDialog.Footer>
      <InternetConnectionAlert
        isFailed={isQueryFailed}
        isQueryPending={isQueryPending}
      />
    </ModalDialog>
  );
};

ModalDropzone.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ModalDropzone;

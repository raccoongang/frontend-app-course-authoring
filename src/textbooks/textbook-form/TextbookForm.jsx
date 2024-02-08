import { useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import * as Yup from 'yup';
import { FieldArray, Formik } from 'formik';
import {
  PictureAsPdf as PdfIcon,
  Add as AddIcon,
  DeleteOutline as DeleteIcon,
  Upload as UploadIcon,
} from '@edx/paragon/icons';
import {
  ActionRow,
  Button,
  Form,
  Icon,
  IconButtonWithTooltip,
  useToggle,
} from '@edx/paragon';

import FormikControl from '../../generic/FormikControl';
import PromptIfDirty from '../../generic/PromptIfDirty';
import ModalDropzone from '../../generic/modal-dropzone/ModalDropzone';
import { useModel } from '../../generic/model-store';
import messages from './messages';

const TextbookForm = ({
  closeTextbookForm,
  initialFormValues,
  onSubmit,
  onSavingStatus,
  courseId,
}) => {
  const intl = useIntl();

  const courseDetail = useModel('courseDetails', courseId);
  const courseTitle = courseDetail ? courseDetail?.name : '';

  const [currentTextbookIndex, setCurrentTextbookIndex] = useState(0);
  const [isUploadModalOpen, openUploadModal, closeUploadModal] = useToggle(false);

  const textbookFormValidationSchema = Yup.object().shape({
    tab_title: Yup.string().required(intl.formatMessage(messages.tabTitleValidationText)).max(255),
    chapters: Yup.array().of(
      Yup.object({
        title: Yup.string().required((intl.formatMessage(messages.chapterTitleValidationText))).max(255),
        url: Yup.string().required(intl.formatMessage(messages.chapterUrlValidationText)).max(255),
      }),
    ).min(1),
  });

  return (
    <div className="textbook-form">
      <Formik
        initialValues={initialFormValues}
        validationSchema={textbookFormValidationSchema}
        onSubmit={onSubmit}
        validateOnBlur
        validateOnMount
      >
        {({
          values, handleSubmit, isValid, dirty, setFieldValue,
        }) => (
          <>
            <Form.Group size="sm" className="form-field">
              <Form.Label size="sm" className="font-weight-bold form-main-label">
                {intl.formatMessage(messages.tabTitleLabel)} *
              </Form.Label>
              <FormikControl
                name="tab_title"
                value={values.tab_title}
                placeholder={intl.formatMessage(messages.tabTitlePlaceholder)}
              />
              <Form.Control.Feedback className="form-helper-text">
                {intl.formatMessage(messages.tabTitleHelperText)}
              </Form.Control.Feedback>
            </Form.Group>
            <FieldArray
              name="chapters"
              render={(arrayHelpers) => (
                <>
                  {Boolean(values?.chapters.length) && values.chapters.map(({ title, url }, index) => (
                    <div className="form-chapters-fields" data-testid="form-chapters-fields">
                      <Form.Group size="sm" className="form-field">
                        <Form.Label size="sm" className="form-label font-weight-bold required">
                          {intl.formatMessage(messages.chapterTitleLabel)} *
                        </Form.Label>
                        <FormikControl
                          name={`chapters[${index}].title`}
                          value={title}
                          placeholder={intl.formatMessage(messages.chapterTitlePlaceholder, { value: index + 1 })}
                        />
                        <Form.Control.Feedback className="form-helper-text">
                          {intl.formatMessage(messages.chapterTitleHelperText)}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group size="sm" className="form-field">
                        <div className="d-flex align-items-center mb-1">
                          <Form.Label size="sm" className="font-weight-bold mb-0">
                            {intl.formatMessage(messages.chapterUrlLabel)} *
                          </Form.Label>
                          <IconButtonWithTooltip
                            size="sm"
                            variant="primary"
                            className="ml-auto field-icon-button"
                            tooltipContent="Upload"
                            src={UploadIcon}
                            iconAs={Icon}
                            data-testid="chapter-upload-button"
                            onClick={() => {
                              setCurrentTextbookIndex(index);
                              openUploadModal();
                            }}
                          />
                          <IconButtonWithTooltip
                            size="sm"
                            variant="primary"
                            className="field-icon-button"
                            tooltipContent="Delete"
                            src={DeleteIcon}
                            iconAs={Icon}
                            data-testid="chapter-delete-button"
                            onClick={() => arrayHelpers.remove(index)}
                          />
                        </div>
                        <FormikControl
                          name={`chapters[${index}].url`}
                          value={url}
                          placeholder={intl.formatMessage(messages.chapterUrlPlaceholder)}
                        />
                        <Form.Control.Feedback className="form-helper-text">
                          {intl.formatMessage(messages.chapterUrlHelperText)}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                  ))}
                  <div>
                    {!values.chapters.length && (
                      <Form.Control.Feedback className="pgn__form-text-invalid mb-2">
                        {intl.formatMessage(messages.addChapterHelperText)}
                      </Form.Control.Feedback>
                    )}
                    <Button
                      variant="outline-primary w-100"
                      iconBefore={AddIcon}
                      onClick={() => arrayHelpers.push({ title: '', url: '' })}
                    >
                      {intl.formatMessage(messages.addChapterButton)}
                    </Button>
                  </div>
                </>
              )}
            />
            <ActionRow>
              <Button variant="tertiary" onClick={closeTextbookForm}>
                {intl.formatMessage(messages.cancelButton)}
              </Button>
              <Button onClick={handleSubmit} disabled={!isValid} type="submit">
                {intl.formatMessage(messages.saveButton)}
              </Button>
            </ActionRow>
            <ModalDropzone
              isOpen={isUploadModalOpen}
              onClose={closeUploadModal}
              onCancel={closeUploadModal}
              onChange={(value) => setFieldValue(`chapters[${currentTextbookIndex}].url`, value)}
              fileTypes={['pdf']}
              modalTitle={intl.formatMessage(messages.uploadModalTitle, { courseName: courseTitle })}
              imageDropzoneText={intl.formatMessage(messages.uploadModalDropzoneText)}
              imageHelpText={intl.formatMessage(messages.uploadModalHelperText)}
              onSavingStatus={onSavingStatus}
              previewComponent={(
                <Icon src={PdfIcon} className="modal-preview-icon" />
              )}
            />
            <PromptIfDirty dirty={dirty} formValues={values} />
          </>
        )}
      </Formik>
    </div>
  );
};

TextbookForm.propTypes = {
  closeTextbookForm: PropTypes.func.isRequired,
  initialFormValues: PropTypes.shape({}).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onSavingStatus: PropTypes.func.isRequired,
  courseId: PropTypes.string.isRequired,
};

export default TextbookForm;

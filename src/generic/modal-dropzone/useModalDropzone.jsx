import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@edx/frontend-platform/i18n';

import { uploadAssets } from './data/api';
import messages from './messages';

const useModalDropzone = ({ onChange, onCancel, onClose }) => {
  const { courseId } = useParams();
  const intl = useIntl();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [disabledUploadBtn, setDisabledUploadBtn] = useState(true);

  const handleSelectFile = ({ fileData }) => {
    const file = fileData.get('file');

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        setDisabledUploadBtn(false);
      };
      reader.readAsDataURL(file);
      setSelectedFile(fileData);
    }
  };

  const imageDimensionValidator = async (file) => {
    if (file.type !== 'image/png') {
      return intl.formatMessage(messages.uploadImageValidationText);
    }

    return null;
  };

  const handleCancel = () => {
    setPreviewUrl(null);
    setDisabledUploadBtn(true);
    onCancel();
    onClose();
  };

  const handleUpload = async () => {
    if (!selectedFile) { return; }

    const onUploadProgress = (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      setUploadProgress(percentCompleted);
    };

    try {
      const response = await uploadAssets(courseId, selectedFile, onUploadProgress);
      const url = response?.asset?.url;
      if (url) {
        onChange(url);
        setDisabledUploadBtn(true);
        setUploadProgress(0);
        setPreviewUrl(null);

        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    intl,
    uploadProgress,
    disabledUploadBtn,
    previewUrl,
    handleSelectFile,
    imageDimensionValidator,
    handleCancel,
    handleUpload,
  };
};

export default useModalDropzone;

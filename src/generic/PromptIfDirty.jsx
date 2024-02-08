import { useEffect } from 'react';
import PropTypes from 'prop-types';

const PromptIfDirty = ({ dirty, formValues }) => {
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (dirty) {
        event.preventDefault();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [dirty, formValues]);

  return null;
};

PromptIfDirty.propTypes = {
  formValues: PropTypes.shape({}).isRequired,
  dirty: PropTypes.bool.isRequired,
};

export default PromptIfDirty;

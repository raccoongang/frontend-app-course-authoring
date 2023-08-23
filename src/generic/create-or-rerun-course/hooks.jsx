import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from '@edx/frontend-platform/i18n';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { getOrganizations, getPostErrors } from '../data/selectors';
import { updatePostErrors } from '../data/slice';
import { fetchOrganizationsQuery } from '../data/thunks';
import messages from './messages';

const useCreateOrRerunCourse = (initialValues) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const [isFormFilled, setFormFilled] = useState(false);
  const [showErrorBanner, setShowErrorBanner] = useState(false);
  const organizations = useSelector(getOrganizations);
  const postErrors = useSelector(getPostErrors);

  const specialCharsRule = /^[a-zA-Z0-9_\-.'*~\s]+$/;
  const noSpaceRule = /^\S*$/;
  const validationSchema = Yup.object().shape({
    displayName: Yup.string().required(
      intl.formatMessage(messages.requiredFieldError),
    ),
    org: Yup.string()
      .required(intl.formatMessage(messages.requiredFieldError))
      .matches(
        specialCharsRule,
        intl.formatMessage(messages.disallowedCharsError),
      )
      .matches(noSpaceRule, intl.formatMessage(messages.noSpaceError)),
    number: Yup.string()
      .required(intl.formatMessage(messages.requiredFieldError))
      .matches(
        specialCharsRule,
        intl.formatMessage(messages.disallowedCharsError),
      )
      .matches(noSpaceRule, intl.formatMessage(messages.noSpaceError)),
    run: Yup.string()
      .required(intl.formatMessage(messages.requiredFieldError))
      .matches(
        specialCharsRule,
        intl.formatMessage(messages.disallowedCharsError),
      )
      .matches(noSpaceRule, intl.formatMessage(messages.noSpaceError)),
  });

  const {
    values, errors, touched, handleChange, handleBlur, setFieldValue,
  } = useFormik({
    initialValues,
    enableReinitialize: true,
    validateOnBlur: false,
    validationSchema,
  });

  useEffect(() => {
    dispatch(fetchOrganizationsQuery());
  }, []);

  useEffect(() => {
    setFormFilled(Object.values(values).every((i) => i));
    dispatch(updatePostErrors({}));
  }, [values]);

  useEffect(() => {
    setShowErrorBanner(!!postErrors.errMsg);
  }, [postErrors]);

  const hasErrorField = (fieldName) => !!errors[fieldName] && !!touched[fieldName];
  const isFormInvalid = Object.keys(errors).length;

  return {
    intl,
    errors,
    values,
    postErrors,
    isFormFilled,
    isFormInvalid,
    organizations,
    showErrorBanner,
    dispatch,
    handleBlur,
    handleChange,
    hasErrorField,
    setFieldValue,
    setShowErrorBanner,
  };
};

// eslint-disable-next-line import/prefer-default-export
export { useCreateOrRerunCourse };

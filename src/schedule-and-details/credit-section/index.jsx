import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import messages from './messages';

export const CREDIT_REQUIREMENTS_TYPE = {
  grade: 'grade',
  proctoredExam: 'proctoredExam',
  reverification: 'reverification',
};

const CreditSection = ({ intl, creditRequirements }) => {
  const requirementsInfo = [
    {
      id: CREDIT_REQUIREMENTS_TYPE.grade,
      label: `${intl.formatMessage(messages.creditMinimumGrade)}`,
      values: creditRequirements?.grade,
      prefix: 'credit-minimum-grade',
    },
    {
      id: CREDIT_REQUIREMENTS_TYPE.proctoredExam,
      label: `${intl.formatMessage(messages.creditProctoredExam)}`,
      values: creditRequirements?.proctoredExam,
      prefix: 'credit-proctored-exam',
    },
    {
      id: CREDIT_REQUIREMENTS_TYPE.reverification,
      label: `${intl.formatMessage(messages.creditVerification)}`,
      values: creditRequirements?.reverification,
      prefix: 'credit-reverification',
    },
  ];

  const renderRequirementsInfo = (requirement) => (
    <li className="d-grid" key={requirement.id}>
      <h4 htmlFor={requirement.prefix} className="text-gray-700">
        {requirement.label}
      </h4>
      {requirement.values.map((value) => {
        const displayValue = requirement.id === CREDIT_REQUIREMENTS_TYPE.grade
          ? `${(parseFloat(value.criteria.minGrade) || 0) * 100}%`
          : value.displayName;
        return (
          <span className="small" key={value.name}>
            {displayValue}
          </span>
        );
      })}
    </li>
  );

  return (
    <section className="section-container credit-section">
      <header className="section-header">
        <h2 className="section-header-title">
          {intl.formatMessage(messages.creditTitle)}
        </h2>
        <span className="section-header-description">
          {intl.formatMessage(messages.creditDescription)}
        </span>
      </header>
      <span>{intl.formatMessage(messages.creditHelp)}</span>
      {Object.keys(creditRequirements).length ? (
        <ul className="credit-info-list">
          {requirementsInfo
            .filter((item) => item.values?.length)
            .map(renderRequirementsInfo)}
        </ul>
      ) : (
        <p>{intl.formatMessage(messages.creditNotFound)}</p>
      )}
    </section>
  );
};

const creditRequirementsNamespace = PropTypes.shape({
  name: PropTypes.string,
  display_name: PropTypes.string,
  criteria: PropTypes.shape({
    min_grade: PropTypes.number,
  }),
});

const creditRequirementsPropTypes = PropTypes.shape({
  proctoredExam: PropTypes.arrayOf(creditRequirementsNamespace),
  grade: PropTypes.arrayOf(creditRequirementsNamespace),
  reverification: PropTypes.arrayOf(creditRequirementsNamespace),
});

CreditSection.defaultProps = {
  creditRequirements: undefined,
};

CreditSection.propTypes = {
  intl: intlShape.isRequired,
  creditRequirements: creditRequirementsPropTypes,
};

export default injectIntl(CreditSection);

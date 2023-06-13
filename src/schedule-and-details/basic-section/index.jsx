import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  injectIntl,
  intlShape,
  FormattedMessage,
} from '@edx/frontend-platform/i18n';
import {
  PageBanner, Button, Card, MailtoLink,
} from '@edx/paragon';
import { Email } from '@edx/paragon/icons';
import { EMAIL_TO, INVITE_STUDENTS_LINK_ID } from './constants';
import messages from './messages';

const BasicSection = ({
  intl,
  org,
  courseNumber,
  run,
  lmsLinkForAboutPage,
  marketingEnabled,
  courseDisplayName,
  platformName,
}) => {
  const [showPageBanner, setShowPageBanner] = useState(true);
  const emailSubject = intl.formatMessage(
    {
      id: 'course-authoring.schedule.basic.email.subject',
      defaultMessage: 'Enroll in {courseDisplayName}.',
    },
    { courseDisplayName },
  );

  const emailBody = intl.formatMessage(
    {
      id: 'course-authoring.schedule.basic.email.body',
      defaultMessage:
        'The course {courseDisplayName}, provided by {platformName}, is open for enrollment. Please navigate to this course at {lmsLinkForAboutPage} to enroll.',
    },
    {
      courseDisplayName,
      platformName,
      lmsLinkForAboutPage,
    },
  );

  const promotionTitle = (
    <FormattedMessage
      id="course-authoring.schedule.basic.promotion.title"
      defaultMessage="Course Summary Page {smallText}"
      values={{
        smallText: <small>(for student enrollment and access)</small>,
      }}
    />
  );

  const courseBasicInfo = [
    {
      label: `${intl.formatMessage(messages.courseOrganization)}`,
      prefix: 'basic-organization',
      value: org,
    },
    {
      label: `${intl.formatMessage(messages.courseNumber)}`,
      prefix: 'basic-course-number',
      value: courseNumber,
    },
    {
      label: `${intl.formatMessage(messages.courseRun)}`,
      prefix: 'basic-course-run',
      value: run,
    },
  ];

  const renderBasicInfo = (info) => (
    <li className="d-grid" key={info.prefix}>
      <h4 className="text-gray-700">{info.label}</h4>
      <span className="small">{info.value}</span>
    </li>
  );

  const renderPageBanner = () => (
    <PageBanner
      show={showPageBanner}
      dismissible
      onDismiss={() => setShowPageBanner(false)}
      className="align-items-start"
    >
      <h4 className="mb-2">{intl.formatMessage(messages.basicBannerTitle)}</h4>
      <span className="text text-gray-700 text-left">
        {intl.formatMessage(messages.basicBannerText)}
      </span>
    </PageBanner>
  );

  const renderCoursePromotion = () => (
    <Card>
      <Card.Header className="px-3" title={promotionTitle} size="sm" />
      <Card.Section className="px-3 py-1">
        <a
          href={lmsLinkForAboutPage}
          className="lead info-500 text-decoration-none"
          target="_blank"
          rel="noreferrer"
        >
          {lmsLinkForAboutPage}
        </a>
      </Card.Section>
      <Card.Divider />
      <Card.Footer className="p-3 justify-content-start">
        <MailtoLink
          to={EMAIL_TO}
          subject={emailSubject}
          body={emailBody}
          data-testid={INVITE_STUDENTS_LINK_ID}
        >
          <Button variant="info" iconBefore={Email}>
            {intl.formatMessage(messages.basicPromotionButton)}
          </Button>
        </MailtoLink>
      </Card.Footer>
    </Card>
  );

  return (
    <section className="section-container basic-section">
      <header className="section-header">
        <h2 className="section-header-title">
          {intl.formatMessage(messages.basicTitle)}
        </h2>
        <span className="section-header-description">
          {intl.formatMessage(messages.basicDescription)}
        </span>
      </header>
      <ul className="basic-info-list">
        {courseBasicInfo.map(renderBasicInfo)}
      </ul>
      {marketingEnabled ? renderPageBanner() : renderCoursePromotion()}
    </section>
  );
};

BasicSection.propTypes = {
  intl: intlShape.isRequired,
  org: PropTypes.string.isRequired,
  courseNumber: PropTypes.string.isRequired,
  run: PropTypes.string.isRequired,
  lmsLinkForAboutPage: PropTypes.string.isRequired,
  marketingEnabled: PropTypes.bool.isRequired,
  courseDisplayName: PropTypes.string.isRequired,
  platformName: PropTypes.string.isRequired,
};

export default injectIntl(BasicSection);

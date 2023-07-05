import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { Form, Card, Hyperlink } from '@edx/paragon';

import { getPagePath } from '../../../utils';
import GradeRequirements from '../grade-requirements';
import messages from './messages';

const EntranceExam = ({
  errorEffort,
  isCheckedString,
  entranceExamMinimumScorePct,
  onChange,
}) => {
  const { courseId } = useParams();
  const initialEntranceExam = isCheckedString === 'true';
  const [showEntranceExam, setShowEntranceExam] = useState(initialEntranceExam);

  const toggleEntranceExam = () => {
    onChange(showEntranceExam ? 'true' : 'false', 'entranceExamEnabled');
    setShowEntranceExam(!showEntranceExam);
  };
  const courseOutlineDestination = getPagePath(
    courseId,
    process.env.ENABLE_NEW_COURSE_OUTLINE_PAGE,
    'course',
  );

  return (
    <Form.Group className="form-group-custom">
      <Form.Label className="h3">
        <FormattedMessage {...messages.requirementsEntrance} />
      </Form.Label>
      <Card>
        <Card.Section className="pt-2.5 pb-1 pl-3">
          <Form.Checkbox
            checked={showEntranceExam}
            onChange={toggleEntranceExam}
          >
            <FormattedMessage {...messages.requirementsEntranceCollapseTitle} />
          </Form.Checkbox>
        </Card.Section>
        {showEntranceExam && (
          <>
            <Card.Divider />
            <Card.Body className="pl-3 pt-2">
              <p className="small mb-2">
                <FormattedMessage
                  {...messages.requirementsEntranceCollapseParagraph}
                  values={{
                    hyperlink: (
                      <Hyperlink
                        destination={courseOutlineDestination}
                        target="_blank"
                        showLaunchIcon={false}
                      >
                        <FormattedMessage
                          {...messages.requirementsEntranceCollapseHyperlink}
                        />
                      </Hyperlink>
                    ),
                  }}
                />
              </p>
              <GradeRequirements
                errorEffort={errorEffort}
                entranceExamMinimumScorePct={entranceExamMinimumScorePct}
                onChange={onChange}
              />
            </Card.Body>
          </>
        )}
      </Card>
    </Form.Group>
  );
};

EntranceExam.defaultProps = {
  errorEffort: '',
  isCheckedString: '',
  entranceExamMinimumScorePct: '',
};

EntranceExam.propTypes = {
  errorEffort: PropTypes.string,
  isCheckedString: PropTypes.string,
  entranceExamMinimumScorePct: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default EntranceExam;

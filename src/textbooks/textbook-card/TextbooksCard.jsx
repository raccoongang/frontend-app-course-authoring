import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  ActionRow,
  Card,
  Collapsible,
  Icon,
  IconButtonWithTooltip,
  useToggle,
} from '@openedx/paragon';
import {
  EditOutline as EditIcon,
  RemoveRedEye as ViewIcon,
  DeleteOutline as DeleteIcon,
} from '@openedx/paragon/icons';

import { RequestStatus } from '../../data/constants';
import { getCurrentTextbookId, getSavingStatus } from '../data/selectors';
import TextbookForm from '../textbook-form/TextbookForm';
import { getTextbookFormInitialValues } from '../utils';
import messages from './messages';

const TextbookCard = ({
  textbook,
  courseId,
  handleSavingStatusDispatch,
  onSubmit,
}) => {
  const intl = useIntl();
  const savingStatus = useSelector(getSavingStatus);
  const currentTextbookId = useSelector(getCurrentTextbookId);
  const [isTextbookFormOpen, openTextbookForm, closeTextbookForm] = useToggle(false);

  const { tabTitle, chapters, id } = textbook;

  useEffect(() => {
    if (savingStatus === RequestStatus.SUCCESSFUL && currentTextbookId === id) {
      closeTextbookForm();
    }
  }, [savingStatus, currentTextbookId]);

  return isTextbookFormOpen ? (
    <TextbookForm
      closeTextbookForm={closeTextbookForm}
      initialFormValues={getTextbookFormInitialValues(true, { tab_title: tabTitle, chapters, id })}
      onSubmit={onSubmit}
      onSavingStatus={handleSavingStatusDispatch}
      courseId={courseId}
    />
  ) : (
    (
      <Card className="textbook-card" data-testid="textbook-card">
        <Card.Header
          title={tabTitle}
          actions={(
            <ActionRow>
              <IconButtonWithTooltip
                tooltipContent={intl.formatMessage(messages.buttonView)}
                src={ViewIcon}
                iconAs={Icon}
                data-testid="textbook-view-button"
                onClick={() => null}
              />
              <IconButtonWithTooltip
                tooltipContent={intl.formatMessage(messages.buttonEdit)}
                src={EditIcon}
                iconAs={Icon}
                data-testid="textbook-edit-button"
                onClick={() => openTextbookForm()}
              />
              <IconButtonWithTooltip
                tooltipContent={intl.formatMessage(messages.buttonDelete)}
                src={DeleteIcon}
                iconAs={Icon}
                data-testid="textbook-delete-button"
                onClick={() => null}
              />
            </ActionRow>
          )}
        />
        <div className="textbook-card__chapters">
          <Collapsible
            styling="basic"
            data-testid="chapters-button"
            title={intl.formatMessage(messages.chaptersTitle, { count: chapters.length })}
          >
            {chapters.map(({ title, url }) => (
              <div className="textbook-card__chapter-item" key={title}>
                <span className="small">{title}</span>
                <span className="small text-gray-700">{url}</span>
              </div>
            ))}
          </Collapsible>
        </div>
      </Card>
    )
  );
};

TextbookCard.propTypes = {
  textbook: PropTypes.shape({
    tabTitle: PropTypes.string.isRequired,
    chapters: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })).isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
  courseId: PropTypes.string.isRequired,
  handleSavingStatusDispatch: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default TextbookCard;

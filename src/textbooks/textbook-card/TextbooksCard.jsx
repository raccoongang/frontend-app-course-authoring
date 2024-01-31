import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  ActionRow,
  Card,
  Collapsible,
  Icon,
  IconButtonWithTooltip,
} from '@openedx/paragon';
import {
  EditOutline as EditIcon,
  RemoveRedEye as ViewIcon,
  DeleteOutline as DeleteIcon,
} from '@openedx/paragon/icons';

import messages from './messages';

const TextbookCard = ({ title, chapters }) => {
  const intl = useIntl();

  return (
    <Card className="textbook-card" data-testid="textbook-card">
      <Card.Header
        title={title}
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
              onClick={() => null}
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
          {chapters.map(({ title: chapterTitle, url }) => (
            <div className="textbook-card__chapter-item" key={chapterTitle}>
              <span className="small">{chapterTitle}</span>
              <span className="small text-gray-700">{url}</span>
            </div>
          ))}
        </Collapsible>
      </div>
    </Card>
  );
};

TextbookCard.propTypes = {
  title: PropTypes.string.isRequired,
  chapters: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  })).isRequired,
};

export default TextbookCard;

import PropTypes from 'prop-types';
import {
  ActionRow, Card, Dropdown, Icon, IconButton,
} from '@openedx/paragon';
import { EditOutline as EditIcon, MoreVert as MoveVertIcon } from '@openedx/paragon/icons';
import { useIntl } from '@edx/frontend-platform/i18n';

import messages from './messages';

const CourseXBlock = ({ id, title }) => {
  const intl = useIntl();

  return (
    <Card className="mb-1">
      <Card.Header
        title={title}
        actions={(
          <ActionRow>
            <IconButton
              alt={intl.formatMessage(messages.blockAltButtonEdit)}
              iconAs={EditIcon}
              size="md"
              onClick={() => {}}
            />
            <Dropdown>
              <Dropdown.Toggle
                id={id}
                as={IconButton}
                src={MoveVertIcon}
                alt={intl.formatMessage(messages.blockActionsDropdownAlt)}
                size="sm"
                iconAs={Icon}
              />
              <Dropdown.Menu>
                <Dropdown.Item>
                  {intl.formatMessage(messages.blockLabelButtonCopy)}
                </Dropdown.Item>
                <Dropdown.Item>
                  {intl.formatMessage(messages.blockLabelButtonDuplicate)}
                </Dropdown.Item>
                <Dropdown.Item>
                  {intl.formatMessage(messages.blockLabelButtonMove)}
                </Dropdown.Item>
                <Dropdown.Item>
                  {intl.formatMessage(messages.blockLabelButtonManageAccess)}
                </Dropdown.Item>
                <Dropdown.Item>
                  {intl.formatMessage(messages.blockLabelButtonDelete)}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </ActionRow>
        )}
        size="md"
      />
      <Card.Section>
        <div className="w-100 bg-gray-100" style={{ height: 200 }} data-block-id={id} />
      </Card.Section>
    </Card>
  );
};

CourseXBlock.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default CourseXBlock;

import PropTypes from 'prop-types';
import {
  ActionRow, Card, Dropdown, Icon, IconButton,
} from '@edx/paragon';
import { EditOutline as EditIcon, MoreVert as MoveVertIcon } from '@edx/paragon/icons';
import { useIntl } from '@edx/frontend-platform/i18n';

import { useDispatch } from 'react-redux';
import messages from './messages';
import { copyCourseXBlock } from '../data/thunk';

const CourseXBlock = ({
  id, title, actions,
}) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const { canCopy } = actions;

  const handleCopyXBlockItem = (blockId) => {
    dispatch(copyCourseXBlock(blockId));
  };

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
                {canCopy && (
                  <Dropdown.Item onClick={() => handleCopyXBlockItem(id)}>
                    Copy to clipboard
                  </Dropdown.Item>
                )}
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
  actions: PropTypes.shape({
    canCopy: PropTypes.bool.isRequired,
    canDuplicate: PropTypes.bool.isRequired,
    canMove: PropTypes.bool.isRequired,
    canManageAccess: PropTypes.bool.isRequired,
    canDelete: PropTypes.bool.isRequired,
  }).isRequired,
};

export default CourseXBlock;

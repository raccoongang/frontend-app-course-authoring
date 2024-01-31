import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  ActionRow, Card, Dropdown, Icon, IconButton, useToggle,
} from '@edx/paragon';
import { EditOutline as EditIcon, MoreVert as MoveVertIcon } from '@edx/paragon/icons';
import { useIntl } from '@edx/frontend-platform/i18n';
import { useDispatch } from 'react-redux';

import DeleteModal from '../../generic/delete-modal/DeleteModal';
import { scrollToElement } from '../../course-outline/utils';
import { copyToClipboard } from '../data/thunk';
import { getCourseUnitEnableCopyPaste } from '../data/selectors';
import ContentIFrame from './ContentIFrame';
import { getIFrameUrl } from './urls';
import messages from './messages';

const CourseXBlock = ({
  id, title, unitXBlockActions, shouldScroll, ...props
}) => {
  const courseXBlockElementRef = useRef(null);
  const [isDeleteModalOpen, openDeleteModal, closeDeleteModal] = useToggle(false);
  const dispatch = useDispatch();
  const intl = useIntl();
  const iframeUrl = getIFrameUrl({ blockId: id });

  const onXBlockDelete = () => {
    unitXBlockActions.handleDelete(id);
    closeDeleteModal();
  };

  useEffect(() => {
    // if this item has been newly added, scroll to it.
    if (courseXBlockElementRef.current && shouldScroll) {
      scrollToElement(courseXBlockElementRef.current);
    }
  }, []);

  return (
    <div ref={courseXBlockElementRef} {...props}>
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
                  <Dropdown.Item onClick={() => unitXBlockActions.handleDuplicate(id)}>
                    {intl.formatMessage(messages.blockLabelButtonDuplicate)}
                  </Dropdown.Item>
                  <Dropdown.Item>
                    {intl.formatMessage(messages.blockLabelButtonMove)}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => dispatch(copyToClipboard(id))}>
                    {intl.formatMessage(messages.blockLabelButtonCopyToClipboard)}
                  </Dropdown.Item>
                  <Dropdown.Item>
                    {intl.formatMessage(messages.blockLabelButtonManageAccess)}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={openDeleteModal}>
                    {intl.formatMessage(messages.blockLabelButtonDelete)}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <DeleteModal
                category="component"
                isOpen={isDeleteModalOpen}
                close={closeDeleteModal}
                onDeleteSubmit={onXBlockDelete}
              />
            </ActionRow>
          )}
          size="md"
        />
        <Card.Section>
          <ContentIFrame id={id} title={title} elementId={id} iframeUrl={iframeUrl} />
        </Card.Section>
      </Card>
    </div>
  );
};

CourseXBlock.defaultProps = {
  shouldScroll: false,
};

CourseXBlock.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  shouldScroll: PropTypes.bool,
  unitXBlockActions: PropTypes.shape({
    handleDelete: PropTypes.func,
    handleDuplicate: PropTypes.func,
  }).isRequired,
};

export default CourseXBlock;

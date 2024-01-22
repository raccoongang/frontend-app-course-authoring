import PropTypes from 'prop-types';
import { Dropdown, Icon, IconButton } from '@edx/paragon';
import { EditOutline as EditIcon, MoreVert as MoveVertIcon } from '@edx/paragon/icons';
import { useIntl } from '@edx/frontend-platform/i18n';

import messages from './messages';

const CourseXblock = ({ id, title }) => {
  const intl = useIntl();

  return (
    <li className="studio-xblock-wrapper mb-4">
      <section className="wrapper-xblock p-4">
        <div className="xblock-header d-flex justify-content-between mb-4">
          <div className="header-details">
            <span className="h3 xblock-display-name">{title}</span>
          </div>
          <div className="header-actions flex-shrink-0">
            <ul className="actions-list list-unstyled m-0 d-flex">
              <li className="action-item action-edit">
                <IconButton
                  alt={intl.formatMessage(messages.blockAltButtonEdit)}
                  iconAs={EditIcon}
                  size="sm"
                  onClick={() => {}}
                />
              </li>
              <li className="action-item action-actions-menu">
                <Dropdown>
                  <Dropdown.Toggle
                    id={id}
                    as={IconButton}
                    src={MoveVertIcon}
                    alt="unit-xblock-card-header__menu"
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
              </li>
            </ul>
          </div>
        </div>
        <div className="unit-iframe-wrapper">
          <div className="w-100 bg-gray-100" style={{ height: 200 }} data-block-id={id} />
        </div>
      </section>
    </li>
  );
};

CourseXblock.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default CourseXblock;

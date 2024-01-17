import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useIntl } from '@edx/frontend-platform/i18n';
import { useToggle } from '@edx/paragon';

import { getCourseSectionVertical } from '../data/selectors';
import { COMPONENT_ICON_TYPES } from '../constants';
import ComponentModalView from './add-component-modals/ComponentModalView';
import AddComponentButton from './add-component-btn';
import messages from './messages';

const AddComponent = ({ blockId, handleCreateNewCourseXblock }) => {
  const navigate = useNavigate();
  const intl = useIntl();
  const [isOpenAdvanced, openAdvanced, closeAdvanced] = useToggle(false);
  const [isOpenHtml, openHtml, closeHtml] = useToggle(false);
  const [isOpenOpenassessment, openOpenassessment, closeOpenassessment] = useToggle(false);
  const { componentTemplates } = useSelector(getCourseSectionVertical);

  const handleCreateNewXblock = (type, moduleName) => {
    switch (type) {
    case COMPONENT_ICON_TYPES.discussion:
    case COMPONENT_ICON_TYPES.dragAndDrop:
      handleCreateNewCourseXblock({ type, parentLocator: blockId });
      break;
    case COMPONENT_ICON_TYPES.problem:
      handleCreateNewCourseXblock({ type, parentLocator: blockId }, ({ courseKey, locator }) => {
        navigate(`/course/${courseKey}/editor/problem/${locator}`);
      });
      break;
    case COMPONENT_ICON_TYPES.library:
      handleCreateNewCourseXblock({ type, category: 'library_content', parentLocator: blockId });
      break;
    case COMPONENT_ICON_TYPES.advanced:
      handleCreateNewCourseXblock({
        type: moduleName, category: moduleName, parentLocator: blockId,
      });
      break;
    case COMPONENT_ICON_TYPES.openassessment:
      handleCreateNewCourseXblock({
        boilerplate: moduleName, category: type, parentLocator: blockId,
      });
      break;
    case COMPONENT_ICON_TYPES.html:
      handleCreateNewCourseXblock({
        type,
        boilerplate: moduleName,
        parentLocator: blockId,
      }, ({ courseKey, locator }) => {
        navigate(`/course/${courseKey}/editor/html/${locator}`);
      });
      break;
    default:
    }
  };

  const renderComponentButton = (componentIndex, modalParams) => (
    <ComponentModalView
      key={componentIndex}
      componentTemplates={componentTemplates}
      componentIndex={componentIndex}
      handleCreateNewXblock={handleCreateNewXblock}
      modalParams={modalParams}
    />
  );

  if (!Object.keys(componentTemplates).length) {
    return null;
  }

  return (
    <div className="py-4">
      <h5 className="h3 mb-4 text-center">{intl.formatMessage(messages.title)}</h5>
      <ul className="new-component-type list-unstyled m-0 d-flex flex-wrap justify-content-center">
        {Object.keys(componentTemplates).map((componentIndex) => {
          const { type, displayName } = componentTemplates[componentIndex];

          if (type === COMPONENT_ICON_TYPES.advanced) {
            return renderComponentButton(componentIndex, {
              open: openAdvanced, close: closeAdvanced, isOpen: isOpenAdvanced,
            });
          }
          if (type === COMPONENT_ICON_TYPES.html) {
            return renderComponentButton(componentIndex, {
              open: openHtml, close: closeHtml, isOpen: isOpenHtml,
            });
          }
          if (type === COMPONENT_ICON_TYPES.openassessment) {
            return renderComponentButton(componentIndex, {
              open: openOpenassessment, close: closeOpenassessment, isOpen: isOpenOpenassessment,
            });
          }

          return (
            <li key={type}>
              <AddComponentButton
                onClick={() => handleCreateNewXblock(type)}
                displayName={displayName}
                type={type}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

AddComponent.propTypes = {
  blockId: PropTypes.string.isRequired,
  handleCreateNewCourseXblock: PropTypes.func.isRequired,
};

export default AddComponent;

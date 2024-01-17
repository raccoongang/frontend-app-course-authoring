import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, useToggle } from '@edx/paragon';

import { useState } from 'react';
import { getCourseSectionVertical } from '../data/selectors';
import { COMPONENT_ICON_TYPES } from '../constants';
import ComponentIcon from './ComponentIcon';
import messages from './messages';
import { Modal } from './modals';

const AddComponent = ({ blockId, handleCreateNewCourseXblock }) => {
  const navigate = useNavigate();
  const intl = useIntl();
  const [isOpenAdvanced, openAdvanced, closeAdvanced] = useToggle(false);
  const [isOpenHtml, openHtml, closeHtml] = useToggle(false);
  const [isOpenOpenassessment, openOpenassessment, closeOpenassessment] = useToggle(false);
  const { componentTemplates } = useSelector(getCourseSectionVertical);

  const handleCreateNewXblock = (type, moduleName) => {
    console.log('handleCreateNewXblock ===>', { type, moduleName });
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

  if (!Object.keys(componentTemplates).length) {
    return null;
  }

  return (
    <div className="py-4">
      <h5 className="h3 mb-4 text-center">{intl.formatMessage(messages.title)}</h5>
      <ul className="new-component-type list-unstyled m-0 d-flex flex-wrap justify-content-center">
        {Object.keys(componentTemplates).map((component) => {
          if (componentTemplates[component].type === COMPONENT_ICON_TYPES.advanced) {
            const componentData = componentTemplates.find(template => template.type === COMPONENT_ICON_TYPES.advanced);
            console.log('componentData', componentData);
            return (
              <>
                <li key={componentTemplates[component].type}>
                  <Button
                    variant="outline-primary"
                    className="add-component-button flex-column rounded-sm"
                    onClick={openAdvanced}
                  >
                    <ComponentIcon type={componentTemplates[component].type} />
                    <span className="sr-only">{intl.formatMessage(messages.buttonText)}</span>
                    <span className="small mt-2">{componentTemplates[component].displayName}</span>
                  </Button>
                </li>
                <Modal
                  isOpen={isOpenAdvanced}
                  close={closeAdvanced}
                  data={componentData}
                  handleCreateNewXblock={handleCreateNewXblock}
                />
              </>
            );
          }
          if (componentTemplates[component].type === COMPONENT_ICON_TYPES.html) {
            const componentData = componentTemplates.find(template => template.type === COMPONENT_ICON_TYPES.html);
            return (
              <>
                <li key={componentTemplates[component].type}>
                  <Button
                    variant="outline-primary"
                    className="add-component-button flex-column rounded-sm"
                    onClick={openHtml}
                  >
                    <ComponentIcon type={componentTemplates[component].type} />
                    <span className="sr-only">{intl.formatMessage(messages.buttonText)}</span>
                    <span className="small mt-2">{componentTemplates[component].displayName}</span>
                  </Button>
                </li>
                <Modal
                  isOpen={isOpenHtml}
                  close={closeHtml}
                  data={componentData}
                  handleCreateNewXblock={handleCreateNewXblock}
                />
              </>
            );
          }
          if (componentTemplates[component].type === COMPONENT_ICON_TYPES.openassessment) {
            const componentData = componentTemplates
              .find(template => template.type === COMPONENT_ICON_TYPES.openassessment);
            return (
              <>
                <li key={componentTemplates[component].type}>
                  <Button
                    variant="outline-primary"
                    className="add-component-button flex-column rounded-sm"
                    onClick={openOpenassessment}
                  >
                    <ComponentIcon type={componentTemplates[component].type} />
                    <span className="sr-only">{intl.formatMessage(messages.buttonText)}</span>
                    <span className="small mt-2">{componentTemplates[component].displayName}</span>
                  </Button>
                </li>
                <Modal
                  isOpen={isOpenOpenassessment}
                  close={closeOpenassessment}
                  data={componentData}
                  handleCreateNewXblock={handleCreateNewXblock}
                />
              </>
            );
          }
          return (
            <li key={componentTemplates[component].type}>
              <Button
                variant="outline-primary"
                className="add-component-button flex-column rounded-sm"
                onClick={() => handleCreateNewXblock(componentTemplates[component].type)}
              >
                <ComponentIcon type={componentTemplates[component].type} />
                <span className="sr-only">{intl.formatMessage(messages.buttonText)}</span>
                <span className="small mt-2">{componentTemplates[component].displayName}</span>
              </Button>
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

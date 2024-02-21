import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Container, Layout, Stack } from '@edx/paragon';
import { useIntl, injectIntl } from '@edx/frontend-platform/i18n';
import { DraggableList, ErrorAlert } from '@edx/frontend-lib-content-components';
import { Warning as WarningIcon } from '@edx/paragon/icons';

import { ensureConfig } from '@edx/frontend-platform';
import { getProcessingNotification } from '../generic/processing-notification/data/selectors';
import SubHeader from '../generic/sub-header/SubHeader';
import { RequestStatus } from '../data/constants';
import getPageHeadTitle from '../generic/utils';
import AlertMessage from '../generic/alert-message';
import ProcessingNotification from '../generic/processing-notification';
import InternetConnectionAlert from '../generic/internet-connection-alert';
import ConnectionErrorAlert from '../generic/ConnectionErrorAlert';
import Loading from '../generic/Loading';
import AddComponent from './add-component/AddComponent';
import CourseXBlock from './course-xblock/CourseXBlock';
import HeaderTitle from './header-title/HeaderTitle';
import Breadcrumbs from './breadcrumbs/Breadcrumbs';
import HeaderNavigations from './header-navigations/HeaderNavigations';
import Sequence from './course-sequence';
import Sidebar from './sidebar';
import { useCourseUnit } from './hooks';
import messages from './messages';
import { PasteNotificationAlert, PasteComponent } from './clipboard';
import LibraryBlock from './course-xblock/libraries/library-authoring/edit-block/LibraryBlock/LibraryBlock';
import { getXBlockHandlerUrl, XBLOCK_VIEW_SYSTEM } from './course-xblock/libraries/library-authoring';

ensureConfig(['STUDIO_BASE_URL'], 'library API service');
const getHandlerUrl = async (blockId) => getXBlockHandlerUrl(blockId, XBLOCK_VIEW_SYSTEM.Studio, 'handler_name');

const CourseUnit = ({ courseId }) => {
  const { blockId } = useParams();
  const intl = useIntl();
  const {
    isLoading,
    sequenceId,
    unitTitle,
    isQueryPending,
    sequenceStatus,
    savingStatus,
    isEditTitleFormOpen,
    isErrorAlert,
    staticFileNotices,
    currentlyVisibleToStudents,
    isInternetConnectionAlertFailed,
    unitXBlockActions,
    sharedClipboardData,
    showPasteXBlock,
    showPasteUnit,
    handleTitleEditSubmit,
    headerNavigationsActions,
    handleTitleEdit,
    handleInternetConnectionFailed,
    handleCreateNewCourseXBlock,
    handleConfigureSubmit,
    courseVerticalChildren,
    handleXBlockDragAndDrop,
    canPasteComponent,
  } = useCourseUnit({ courseId, blockId });

  const initialXBlocksData = useMemo(() => courseVerticalChildren.children ?? [], [courseVerticalChildren.children]);
  const [unitXBlocks, setUnitXBlocks] = useState(initialXBlocksData);
  const xblockModalData = useSelector(state => state.courseUnit.xblockModalData);

  useEffect(() => {
    document.title = getPageHeadTitle('', unitTitle);
  }, [unitTitle]);

  useEffect(() => {
    setUnitXBlocks(courseVerticalChildren.children);
  }, [courseVerticalChildren.children]);

  const {
    isShow: isShowProcessingNotification,
    title: processingNotificationTitle,
  } = useSelector(getProcessingNotification);

  if (isLoading) {
    return <Loading />;
  }

  if (sequenceStatus === RequestStatus.FAILED) {
    return (
      <Container size="xl" className="course-unit px-4 mt-4">
        <ConnectionErrorAlert />
      </Container>
    );
  }

  const finalizeXBlockOrder = () => (newXBlocks) => {
    handleXBlockDragAndDrop(newXBlocks.map(xBlock => xBlock.id), () => {
      setUnitXBlocks(initialXBlocksData);
    });
  };

  const view = {
    status: 'loaded',
    value: {
      content: "<div class='xblock-v1 xblock-v1-student_view xmodule_display xmodule_ProblemBlock' data-usage='lb:DeveloperInc:123:problem:088da16a-a016-468f-b590-08a8339d6f8d' data-block-type='problem' data-init='XBlockToXModuleShim' data-runtime-version='1'><div id=\"problem_lb:DeveloperInc:123:problem:088da16a-a016-468f-b590-08a8339d6f8d\" class=\"problems-wrapper\" role=\"group\"\n     aria-labelledby=\"lb:DeveloperInc:123:problem:088da16a-a016-468f-b590-08a8339d6f8d-problem-title\"\n     data-problem-id=\"lb:DeveloperInc:123:problem:088da16a-a016-468f-b590-08a8339d6f8d\" data-url=\"http://localhost:18010/api/xblock/v2/xblocks/lb:DeveloperInc:123:problem:088da16a-a016-468f-b590-08a8339d6f8d/handler/3-bc9a7b8e6bf3ae4f1f9b/xmodule_handler\"\n     data-problem-score=\"0\"\n     data-problem-total-possible=\"0\"\n     data-attempts-used=\"0\"\n     data-content=\"\n\n\n\n&lt;h3 class=&#34;hd hd-3 problem-header&#34; id=&#34;lb:DeveloperInc:123:problem:088da16a-a016-468f-b590-08a8339d6f8d-problem-title&#34; aria-describedby=&#34;lb:DeveloperInc:123:problem:088da16a-a016-468f-b590-08a8339d6f8d-problem-progress&#34; tabindex=&#34;-1&#34;&gt;\n  Blank Problem\n&lt;/h3&gt;\n\n&lt;div class=&#34;problem-progress&#34; id=&#34;lb:DeveloperInc:123:problem:088da16a-a016-468f-b590-08a8339d6f8d-problem-progress&#34;&gt;&lt;/div&gt;\n\n&lt;div class=&#34;problem&#34;&gt;\n  &lt;div/&gt;\n  &lt;div class=&#34;action&#34;&gt;\n    &lt;input type=&#34;hidden&#34; name=&#34;problem_id&#34; value=&#34;Blank Problem&#34; /&gt;\n\n    &lt;div class=&#34;problem-action-buttons-wrapper&#34;&gt;\n      &lt;span class=&#34;problem-action-button-wrapper&#34;&gt;\n          &lt;button type=&#34;button&#34; class=&#34;show problem-action-btn btn-link btn-small&#34; aria-describedby=&#34;lb:DeveloperInc:123:problem:088da16a-a016-468f-b590-08a8339d6f8d-problem-title&#34;&gt;&lt;span class=&#34;show-label&#34;&gt;Show answer&lt;/span&gt;&lt;/button&gt;\n      &lt;/span&gt;\n    &lt;/div&gt;\n    &lt;div class=&#34;submit-attempt-container&#34;&gt;\n      &lt;button type=&#34;button&#34; class=&#34;submit btn-brand&#34; data-submitting=&#34;Submitting&#34; data-value=&#34;Submit&#34; data-should-enable-submit-button=&#34;True&#34; aria-describedby=&#34;submission_feedback_lb:DeveloperInc:123:problem:088da16a-a016-468f-b590-08a8339d6f8d&#34; &gt;\n          &lt;span class=&#34;submit-label&#34;&gt;Submit&lt;/span&gt;\n      &lt;/button&gt;\n\n      &lt;div class=&#34;submission-feedback &#34; id=&#34;submission_feedback_lb:DeveloperInc:123:problem:088da16a-a016-468f-b590-08a8339d6f8d&#34;&gt;\n        &lt;span class=&#34;sr&#34;&gt;Some problems have options such as save, reset, hints, or show answer. These options follow the Submit button.&lt;/span&gt;\n      &lt;/div&gt;\n    &lt;/div&gt;\n  &lt;/div&gt;\n    \n\n\n&lt;div class=&#34;notification warning notification-gentle-alert\n      is-hidden&#34;\n     tabindex=&#34;-1&#34;&gt;\n    &lt;span class=&#34;icon fa fa-exclamation-circle&#34; aria-hidden=&#34;true&#34;&gt;&lt;/span&gt;\n    &lt;span class=&#34;notification-message&#34; aria-describedby=&#34;lb:DeveloperInc:123:problem:088da16a-a016-468f-b590-08a8339d6f8d-problem-title&#34;&gt;\n    &lt;/span&gt;\n    &lt;div class=&#34;notification-btn-wrapper&#34;&gt;\n        &lt;button type=&#34;button&#34; class=&#34;btn btn-default btn-small notification-btn review-btn sr&#34;&gt;Review&lt;/button&gt;\n    &lt;/div&gt;\n&lt;/div&gt;\n\n    \n\n\n&lt;div class=&#34;notification warning notification-save\n      is-hidden&#34;\n     tabindex=&#34;-1&#34;&gt;\n    &lt;span class=&#34;icon fa fa-save&#34; aria-hidden=&#34;true&#34;&gt;&lt;/span&gt;\n    &lt;span class=&#34;notification-message&#34; aria-describedby=&#34;lb:DeveloperInc:123:problem:088da16a-a016-468f-b590-08a8339d6f8d-problem-title&#34;&gt;None\n    &lt;/span&gt;\n    &lt;div class=&#34;notification-btn-wrapper&#34;&gt;\n        &lt;button type=&#34;button&#34; class=&#34;btn btn-default btn-small notification-btn review-btn sr&#34;&gt;Review&lt;/button&gt;\n    &lt;/div&gt;\n&lt;/div&gt;\n\n    \n    \n\n\n&lt;div class=&#34;notification general notification-show-answer\n      is-hidden&#34;\n     tabindex=&#34;-1&#34;&gt;\n    &lt;span class=&#34;icon fa fa-info-circle&#34; aria-hidden=&#34;true&#34;&gt;&lt;/span&gt;\n    &lt;span class=&#34;notification-message&#34; aria-describedby=&#34;lb:DeveloperInc:123:problem:088da16a-a016-468f-b590-08a8339d6f8d-problem-title&#34;&gt;Answers are displayed within the problem\n    &lt;/span&gt;\n    &lt;div class=&#34;notification-btn-wrapper&#34;&gt;\n        &lt;button type=&#34;button&#34; class=&#34;btn btn-default btn-small notification-btn review-btn sr&#34;&gt;Review&lt;/button&gt;\n    &lt;/div&gt;\n&lt;/div&gt;\n\n&lt;/div&gt;\n\n&lt;script&gt;\n    function emit_event(message) {\n        parent.postMessage(message, &#39;*&#39;);\n    }\n&lt;/script&gt;\n\"\n     data-graded=\"False\">\n    <p class=\"loading-spinner\">\n        <i class=\"fa fa-spinner fa-pulse fa-2x fa-fw\"></i>\n        <span class=\"sr\">Loading&hellip;</span>\n    </p>\n</div>\n<script type=\"json/xblock-args\" class=\"xblock_json_init_args\">{\"xmodule-type\": \"Problem\"}</script></div>",
      resources: [
        {
          kind: 'url',
          data: 'http://localhost:18010/static/studio/css/ProblemBlockDisplay.css',
          mimetype: 'text/css',
          placement: 'head',
        },
        {
          kind: 'url',
          data: 'http://localhost:18010/static/studio/bundles/ProblemBlockDisplay.js',
          mimetype: 'application/javascript',
          placement: 'foot',
        },
        {
          kind: 'url',
          data: 'http://localhost:18010/static/studio/bundles/XModuleShim.js',
          mimetype: 'application/javascript',
          placement: 'foot',
        },
      ],
    },
  };

  const view2 = {
    "html": "\n<div class=\"xblock-v1-student_view xblock xblock-studio_view xblock-studio_view-discussion\" data-init=\"StudioEditableXBlockMixin\" data-runtime-class=\"StudioRuntime\" data-runtime-version=\"1\" data-block-type=\"discussion\" data-usage-id=\"block-v1:love+12312312+2024+type@discussion+block@088dab62394148ae831603cef4061481\" data-request-token=\"fb93cd0ecf5c11eea39e0242ac12000c\" data-graded=\"False\" data-has-score=\"False\">\n  \n<div class=\"editor-with-buttons\">\n  <div class=\"wrapper-comp-settings is-active editor-with-buttons\" id=\"settings-tab\">\n    <ul class=\"list-input settings-list\">\n      \n        <li\n          class=\"field comp-setting-entry metadata_entry \"\n          data-field-name=\"display_name\"\n          data-default=\"Discussion\"\n          data-cast=\"string\"\n        >\n          <div class=\"wrapper-comp-setting\">\n            <label class=\"label setting-label\" for=\"xb-field-edit-display_name\">Display Name</label>\n\n            \n              <input\n                type=\"text\"\n                class=\"field-data-control\"\n                id=\"xb-field-edit-display_name\"\n                value=\"Discussion\"\n              >\n            \n\n            \n              <button class=\"action setting-clear inactive\" type=\"button\" name=\"setting-clear\" value=\"Clear\" data-tooltip=\"Clear\">\n                <i class=\"icon fa fa-undo\"></i><span class=\"sr\">Clear Value</span>\n              </button>\n            \n          </div>\n          \n            <span class=\"tip setting-help\"> The display name for this component. </span>\n          \n        </li>\n      \n        <li\n          class=\"field comp-setting-entry metadata_entry \"\n          data-field-name=\"discussion_category\"\n          data-default=\"Week 1\"\n          data-cast=\"string\"\n        >\n          <div class=\"wrapper-comp-setting\">\n            <label class=\"label setting-label\" for=\"xb-field-edit-discussion_category\">Category</label>\n\n            \n              <input\n                type=\"text\"\n                class=\"field-data-control\"\n                id=\"xb-field-edit-discussion_category\"\n                value=\"Week 1\"\n              >\n            \n\n            \n              <button class=\"action setting-clear inactive\" type=\"button\" name=\"setting-clear\" value=\"Clear\" data-tooltip=\"Clear\">\n                <i class=\"icon fa fa-undo\"></i><span class=\"sr\">Clear Value</span>\n              </button>\n            \n          </div>\n          \n            <span class=\"tip setting-help\"> A category name for the discussion. This name appears in the left pane of the discussion forum for the course. </span>\n          \n        </li>\n      \n        <li\n          class=\"field comp-setting-entry metadata_entry \"\n          data-field-name=\"discussion_target\"\n          data-default=\"Topic-Level Student-Visible Label\"\n          data-cast=\"string\"\n        >\n          <div class=\"wrapper-comp-setting\">\n            <label class=\"label setting-label\" for=\"xb-field-edit-discussion_target\">Subcategory</label>\n\n            \n              <input\n                type=\"text\"\n                class=\"field-data-control\"\n                id=\"xb-field-edit-discussion_target\"\n                value=\"Topic-Level Student-Visible Label\"\n              >\n            \n\n            \n              <button class=\"action setting-clear inactive\" type=\"button\" name=\"setting-clear\" value=\"Clear\" data-tooltip=\"Clear\">\n                <i class=\"icon fa fa-undo\"></i><span class=\"sr\">Clear Value</span>\n              </button>\n            \n          </div>\n          \n            <span class=\"tip setting-help\"> A subcategory name for the discussion. This name appears in the left pane of the discussion forum for the course. </span>\n          \n        </li>\n      \n    </ul>\n  </div>\n  <div class=\"xblock-actions\">\n    <ul>\n      <li class=\"action-item\">\n        <a href=\"#\" class=\"button action-primary save-button\">Save</a>\n      </li>\n\n      <li class=\"action-item\">\n        <a href=\"#\" class=\"button cancel-button\">Cancel</a>\n      </li>\n    </ul>\n  </div>\n</div>\n\n</div>\n",
    "resources": [
        {
          "kind": "text",
          "data": "/* Javascript for StudioEditableXBlockMixin. */\nfunction StudioEditableXBlockMixin(runtime, element) {\n    \"use strict\";\n    \n    var fields = [];\n    var tinyMceAvailable = (typeof $.fn.tinymce !== 'undefined'); // Studio includes a copy of tinyMCE and its jQuery plugin\n    var datepickerAvailable = (typeof $.fn.datepicker !== 'undefined'); // Studio includes datepicker jQuery plugin\n\n    $(element).find('.field-data-control').each(function() {\n        var $field = $(this);\n        var $wrapper = $field.closest('li');\n        var $resetButton = $wrapper.find('button.setting-clear');\n        var type = $wrapper.data('cast');\n        fields.push({\n            name: $wrapper.data('field-name'),\n            isSet: function() { return $wrapper.hasClass('is-set'); },\n            hasEditor: function() { return tinyMceAvailable && $field.tinymce(); },\n            val: function() {\n                var val = $field.val();\n                // Cast values to the appropriate type so that we send nice clean JSON over the wire:\n                if (type == 'boolean')\n                    return (val == 'true' || val == '1');\n                if (type == \"integer\")\n                    return parseInt(val, 10);\n                if (type == \"float\")\n                    return parseFloat(val);\n                if (type == \"generic\" || type == \"list\" || type == \"set\") {\n                    val = val.trim();\n                    if (val === \"\")\n                        val = null;\n                    else\n                        val = JSON.parse(val); // TODO: handle parse errors\n                }\n                return val;\n            },\n            removeEditor: function() {\n                $field.tinymce().remove();\n            }\n        });\n        var fieldChanged = function() {\n            // Field value has been modified:\n            $wrapper.addClass('is-set');\n            $resetButton.removeClass('inactive').addClass('active');\n        };\n        $field.bind(\"change input paste\", fieldChanged);\n        $resetButton.click(function() {\n            $field.val($wrapper.attr('data-default')); // Use attr instead of data to force treating the default value as a string\n            $wrapper.removeClass('is-set');\n            $resetButton.removeClass('active').addClass('inactive');\n        });\n        if (type == 'html' && tinyMceAvailable) {\n            tinyMCE.baseURL = baseUrl + \"/js/vendor/tinymce/js/tinymce\";\n            $field.tinymce({\n                theme: 'silver',\n                skin: 'studio-tmce5',\n                content_css: 'studio-tmce5',\n                height: '200px',\n                formats: { code: { inline: 'code' } },\n                codemirror: { path: \"\" + baseUrl + \"/js/vendor\" },\n                convert_urls: false,\n                plugins: \"lists, link, codemirror\",\n                menubar: false,\n                statusbar: false,\n                toolbar_items_size: 'small',\n                toolbar: \"formatselect | styleselect | bold italic underline forecolor | bullist numlist outdent indent blockquote | link unlink | code\",\n                resize: \"both\",\n                extended_valid_elements : 'i[class],span[class]',\n                setup : function(ed) {\n                    ed.on('change', fieldChanged);\n                }\n            });\n        }\n\n        if (type == 'datepicker' && datepickerAvailable) {\n            $field.datepicker('destroy');\n            $field.datepicker({dateFormat: \"m/d/yy\"});\n        }\n    });\n\n    $(element).find('.wrapper-list-settings .list-set').each(function() {\n        var $optionList = $(this);\n        var $checkboxes = $(this).find('input');\n        var $wrapper = $optionList.closest('li');\n        var $resetButton = $wrapper.find('button.setting-clear');\n\n        fields.push({\n            name: $wrapper.data('field-name'),\n            isSet: function() { return $wrapper.hasClass('is-set'); },\n            hasEditor: function() { return false; },\n            val: function() {\n                var val = [];\n                $checkboxes.each(function() {\n                    if ($(this).is(':checked')) {\n                        val.push(JSON.parse($(this).val()));\n                    }\n                });\n                return val;\n            }\n        });\n        var fieldChanged = function() {\n            // Field value has been modified:\n            $wrapper.addClass('is-set');\n            $resetButton.removeClass('inactive').addClass('active');\n        };\n        $checkboxes.bind(\"change input\", fieldChanged);\n\n        $resetButton.click(function() {\n            var defaults = JSON.parse($wrapper.attr('data-default'));\n            $checkboxes.each(function() {\n                var val = JSON.parse($(this).val());\n                $(this).prop('checked', defaults.indexOf(val) > -1);\n            });\n            $wrapper.removeClass('is-set');\n            $resetButton.removeClass('active').addClass('inactive');\n        });\n    });\n\n    var studio_submit = function(data) {\n        var handlerUrl = runtime.handlerUrl(element, 'submit_studio_edits');\n        runtime.notify('save', {state: 'start', message: gettext(\"Saving\")});\n        $.ajax({\n            type: \"POST\",\n            url: handlerUrl,\n            data: JSON.stringify(data),\n            dataType: \"json\",\n            global: false,  // Disable Studio's error handling that conflicts with studio's notify('save') and notify('cancel') :-/\n            success: function(response) { runtime.notify('save', {state: 'end'}); }\n        }).fail(function(jqXHR) {\n            var message = gettext(\"This may be happening because of an error with our server or your internet connection. Try refreshing the page or making sure you are online.\");\n            if (jqXHR.responseText) { // Is there a more specific error message we can show?\n                try {\n                    message = JSON.parse(jqXHR.responseText).error;\n                    if (typeof message === \"object\" && message.messages) {\n                        // e.g. {\"error\": {\"messages\": [{\"text\": \"Unknown user 'bob'!\", \"type\": \"error\"}, ...]}} etc.\n                        message = $.map(message.messages, function(msg) { return msg.text; }).join(\", \");\n                    }\n                } catch (error) { message = jqXHR.responseText.substr(0, 300); }\n            }\n            runtime.notify('error', {title: gettext(\"Unable to update settings\"), message: message});\n        });\n    };\n\n    $('.save-button', element).bind('click', function(e) {\n        e.preventDefault();\n        var values = {};\n        var notSet = []; // List of field names that should be set to default values\n        for (var i in fields) {\n            var field = fields[i];\n            if (field.isSet()) {\n                values[field.name] = field.val();\n            } else {\n                notSet.push(field.name);\n            }\n            // Remove TinyMCE instances to make sure jQuery does not try to access stale instances\n            // when loading editor for another block:\n            if (field.hasEditor()) {\n                field.removeEditor();\n            }\n        }\n        studio_submit({values: values, defaults: notSet});\n    });\n\n    $(element).find('.cancel-button').bind('click', function(e) {\n        // Remove TinyMCE instances to make sure jQuery does not try to access stale instances\n        // when loading editor for another block:\n        for (var i in fields) {\n            var field = fields[i];\n            if (field.hasEditor()) {\n                field.removeEditor();\n            }\n        }\n        e.preventDefault();\n        runtime.notify('cancel', {});\n    });\n}\n",
          "mimetype": "application/javascript",
          "placement": "foot"
        }
    ]
  };
  console.log('unitXBlocks', unitXBlocks);
  return (
    <>
      {Object.keys(xblockModalData).length ? (
        <LibraryBlock getHandlerUrl={getHandlerUrl} view={xblockModalData} />
      ) : null}
      <Container size="xl" className="course-unit px-4">
        <section className="course-unit-container mb-4 mt-5">
          <ErrorAlert hideHeading isError={savingStatus === RequestStatus.FAILED && isErrorAlert}>
            {intl.formatMessage(messages.alertFailedGeneric, { actionName: 'save', type: 'changes' })}
          </ErrorAlert>
          <SubHeader
            hideBorder
            title={(
              <HeaderTitle
                unitTitle={unitTitle}
                isEditTitleFormOpen={isEditTitleFormOpen}
                handleTitleEdit={handleTitleEdit}
                handleTitleEditSubmit={handleTitleEditSubmit}
                handleConfigureSubmit={handleConfigureSubmit}
              />
            )}
            breadcrumbs={(
              <Breadcrumbs />
            )}
            headerActions={(
              <HeaderNavigations
                headerNavigationsActions={headerNavigationsActions}
              />
            )}
          />
          <Sequence
            courseId={courseId}
            sequenceId={sequenceId}
            unitId={blockId}
            handleCreateNewCourseXBlock={handleCreateNewCourseXBlock}
            showPasteUnit={showPasteUnit}
          />
          <Layout
            lg={[{ span: 8 }, { span: 4 }]}
            md={[{ span: 8 }, { span: 4 }]}
            sm={[{ span: 8 }, { span: 3 }]}
            xs={[{ span: 9 }, { span: 3 }]}
            xl={[{ span: 9 }, { span: 3 }]}
          >
            <Layout.Element>
              {currentlyVisibleToStudents && (
                <AlertMessage
                  title={intl.formatMessage(messages.alertUnpublishedVersion)}
                  variant="warning"
                  icon={WarningIcon}
                />
              )}
              <PasteNotificationAlert
                staticFileNotices={staticFileNotices}
                courseId={courseId}
              />
              <Stack gap={4} className="mb-4 course-unit__xblocks">
                <DraggableList
                  itemList={unitXBlocks}
                  setState={setUnitXBlocks}
                  updateOrder={finalizeXBlockOrder}
                >
                  {unitXBlocks.map(({
                    name, id, blockType: type, shouldScroll, userPartitionInfo, validationMessages,
                  }) => (
                    <CourseXBlock
                      id={id}
                      key={id}
                      title={name}
                      type={type}
                      validationMessages={validationMessages}
                      shouldScroll={shouldScroll}
                      unitXBlockActions={unitXBlockActions}
                      handleConfigureSubmit={handleConfigureSubmit}
                      data-testid="course-xblock"
                      userPartitionInfo={userPartitionInfo}
                    />
                  ))}
                </DraggableList>
              </Stack>
              <AddComponent
                blockId={blockId}
                handleCreateNewCourseXBlock={handleCreateNewCourseXBlock}
              />
              {showPasteXBlock && canPasteComponent && (
                <PasteComponent
                  clipboardData={sharedClipboardData}
                  handleCreateNewCourseXBlock={handleCreateNewCourseXBlock}
                />
              )}
            </Layout.Element>
            <Layout.Element>
              <Stack gap={3}>
                <Sidebar blockId={blockId} data-testid="course-unit-sidebar" />
                <Sidebar isDisplayUnitLocation data-testid="course-unit-location-sidebar" />
              </Stack>
            </Layout.Element>
          </Layout>
        </section>
      </Container>
      <div className="alert-toast">
        <ProcessingNotification
          isShow={isShowProcessingNotification}
          title={processingNotificationTitle}
        />
        {isQueryPending && (
          <InternetConnectionAlert
            isFailed={isInternetConnectionAlertFailed}
            isQueryPending={savingStatus === RequestStatus.PENDING}
            onInternetConnectionFailed={handleInternetConnectionFailed}
          />
        )}
      </div>
    </>
  );
};

CourseUnit.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default injectIntl(CourseUnit);

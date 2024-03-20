import { COMPONENT_TYPES } from '../../../constants';
import {
  filterAndExtractResources,
  generateResourceTags,
  modifyVoidHrefToPreventDefault,
  normalizeResources,
  xblockIFrameConnector,
} from './tools';

/**
 * Given an XBlock's fragment data (HTML plus CSS and JS URLs), return the
 * inner HTML that should go into an IFrame in order to display that XBlock
 * and interact with the surrounding LabXchange UI and with the Studio.
 * @param html The XBlock's HTML
 * @param sourceResources The XBlock's resources - CSS, Javascript
 * @param studioBaseUrl The absolute URL of the Studio, e.g. http://localhost:18010
 *                   Only required for legacy XBlocks that don't declare their
 *                   JS and CSS dependencies properly.
 * @param type The XBlock's type (openassessment, discussion, video, etc.)
 */
export default function wrapBlockHtmlForIFrame(html, sourceResources, studioBaseUrl, type, variant) {
  const resources = normalizeResources(sourceResources);

  /* Extract CSS resources. */
  const cssUrls = filterAndExtractResources(resources, 'url', 'text/css');
  const sheets = filterAndExtractResources(resources, 'text', 'text/css');

  let cssTags = generateResourceTags(cssUrls, studioBaseUrl, type);
  cssTags += sheets.map(sheet => `<style>${sheet}</style>`).join('\n');

  /* Extract JS resources. */
  const jsUrls = filterAndExtractResources(resources, 'url', 'application/javascript');
  const scripts = filterAndExtractResources(resources, 'text', 'application/javascript');

  let jsTags = generateResourceTags(jsUrls, studioBaseUrl, type);
  jsTags += scripts.map(script => `<script>${script}</script>`).join('\n');

  let legacyIncludes = '';
  if (html.indexOf('wrapper-xblock-message') !== -1 || html.indexOf('xmodule_edit') !== -1) {
    legacyIncludes += `
      <!-- Built-in XBlocks (and some plugins) depends on Studio CSS -->
      <!-- At least one XBlock (drag and drop v2) expects Font Awesome -->
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
      <!-- Capa Problem Editing requires CodeMirror -->
      <link rel="stylesheet" href="${studioBaseUrl}/static/studio/js/vendor/CodeMirror/codemirror.css">
      <link rel="stylesheet" href="${studioBaseUrl}/static/studio/css/studio-main-v1.css">
      <link rel="stylesheet" href="${studioBaseUrl}/static/studio/css/vendor/font-awesome.css">
      <link rel="stylesheet" href="${studioBaseUrl}/static/studio/css/vendor/ui-lightness/jquery-ui-1.8.22.custom.css">
      <link rel="stylesheet" href="${studioBaseUrl}/static/studio/css/vendor/jquery.qtip.min.css">
      <link rel="stylesheet" href="${studioBaseUrl}/static/studio/js/vendor/markitup/skins/simple/style.css">
      <link rel="stylesheet" href="${studioBaseUrl}/static/studio/js/vendor/markitup/sets/wiki/style.css">
      <link rel="stylesheet" href="${studioBaseUrl}/static/studio/css/tinymce-studio-content-fonts.css">
      <link rel="stylesheet" href="${studioBaseUrl}/static/studio/js/vendor/tinymce/js/tinymce/skins/ui/studio-tmce5/content.min.css">
      <link rel="stylesheet" href="${studioBaseUrl}/static/studio/css/tinymce-studio-content.css">
      <link rel="stylesheet" href="${studioBaseUrl}/static/studio/js/vendor/tinymce/js/tinymce/skins/ui/studio-tmce5/skin.min.css">
      <link rel="stylesheet" href="${studioBaseUrl}/static/studio/js/vendor/timepicker/jquery.timepicker.css">
      <link rel="stylesheet" href="${studioBaseUrl}/static/studio/common/css/vendor/common.min.css">
      <link rel="stylesheet" href="${studioBaseUrl}/static/studio/common/css/vendor/editImageModal.min.css">
      <link rel="stylesheet" href="${studioBaseUrl}/static/studio/css/SequenceBlockDisplay.css">
      <link rel="stylesheet" href="${studioBaseUrl}/xblock/resource/drag-and-drop-v2/public/css/drag_and_drop.css">
      <link rel="stylesheet" href="${studioBaseUrl}/static/studio/debug_toolbar/css/print.css">
      <link rel="stylesheet" href="${studioBaseUrl}/static/studio/debug_toolbar/css/toolbar.css">
      <link rel="stylesheet" href="${studioBaseUrl}/static/studio/css/vendor/html5-input-polyfills/number-polyfill.css">
      <link rel="stylesheet" href="${studioBaseUrl}/static/studio/css/WordCloudBlockDisplay.css">
      <link rel="stylesheet" href="XBlockIframe.css">

      <!-- JS scripts that can be used by XBlocks -->
      <!-- gettext & XBlock JS i18n code -->
      <script type="text/javascript" src="${studioBaseUrl}/static/studio/js/i18n/en/djangojs.js"></script>
      <!-- Most XBlocks require jQuery: -->
      <script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
      <!-- The Video XBlock requires "ajaxWithPrefix" -->
      <script type="text/javascript">
          $.postWithPrefix = $.post;
          $.getWithPrefix = $.get;
          $.ajaxWithPrefix = $.ajax;
      </script>
      <!-- The Video XBlock requires "Slider" from jQuery-UI: -->
      <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
      <!-- The video XBlock depends on Underscore.JS -->
      <script type="text/javascript" src="${studioBaseUrl}/static/studio/common/js/vendor/underscore.js"></script>
      <!-- The video XBlock depends on jquery-cookie -->
      <script type="text/javascript" src="${studioBaseUrl}/static/studio/js/vendor/jquery.cookie.js"></script>
      <!--The Video XBlock has an undeclared dependency on 'Logger' -->
      <script>
          window.Logger = { log: function() { } };
      </script>
      <!-- Builtin XBlock types depend on RequireJS -->
      <script type="text/javascript" src="${studioBaseUrl}/static/studio/common/js/vendor/require.js"></script>
      <script type="text/javascript" src="${studioBaseUrl}/static/studio/js/RequireJS-namespace-undefine.js"></script>
      <script>
        // The minimal RequireJS configuration required for common Studio building XBlock types to work:
        (function (require, define) {
          require.config({
            baseUrl: "${studioBaseUrl}/static/studio/",
            paths: {
              accessibility: 'js/src/accessibility_tools',
              draggabilly: 'js/vendor/draggabilly',
              hls: 'common/js/vendor/hls',
              moment: 'common/js/vendor/moment-with-locales',
              HtmlUtils: 'edx-ui-toolkit/js/utils/html-utils',
            }
          });
            define('gettext', [], function() { return window.gettext; });
            define('jquery', [], function() { return window.jQuery; });
            define('jquery-migrate', [], function() { return window.jQuery; });
            define('underscore', [], function() { return window._; });
        }).call(this, require || RequireJS.require, define || RequireJS.define);
      </script>
      <!-- edX HTML Utils requires GlobalLoader -->
      <script type="text/javascript" src="${studioBaseUrl}/static/studio/edx-ui-toolkit/js/utils/global-loader.js"></script>
      <script>
      // The video XBlock has an undeclared dependency on edX HTML Utils
      RequireJS.require(['HtmlUtils'], function (HtmlUtils) {
        window.edx.HtmlUtils = HtmlUtils;
        // The problem XBlock depends on window.SR, though 'accessibility_tools' has an undeclared dependency on HtmlUtils:
        RequireJS.require(['accessibility']);
      });
      RequireJS.require(['edx-ui-toolkit/js/utils/string-utils'], function (StringUtils) {
        window.edx.StringUtils = StringUtils;
      });
      </script>
      <!-- 
          commons.js: this file produced by webpack contains many shared chunks of code.
          By including this, you have only to also import any of the smaller entrypoint
          files (defined in webpack.common.config.js) to get that entry point and all
          of its dependencies.
      -->
      <script type="text/javascript" src="${studioBaseUrl}/static/studio/bundles/commons.js"></script>
      <!-- The video XBlock expect this global: -->
      <script>
        window.onTouchBasedDevice = function() { return navigator.userAgent.match(/iPhone|iPod|iPad|Android/i); };
      </script>
      <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/mathjax@2.7.5/MathJax.js?config=TeX-MML-AM_SVG&delayStartupUntil=configured"></script>
      <script type="text/javascript" src="${studioBaseUrl}/static/studio/js/src/jquery.immediateDescendents.js"></script>
      <script type="text/javascript" src="${studioBaseUrl}/static/studio/common/js/xblock/core.js"></script>
      <script type="text/javascript" src="${studioBaseUrl}/static/studio/common/js/xblock/runtime.v1.js"></script>
      <script type="text/javascript" src="${studioBaseUrl}/xblock/resource/drag-and-drop-v2/public/js/vendor/virtual-dom-1.3.0.min.js"></script>
      <script type="text/javascript" src="${studioBaseUrl}/xblock/resource/drag-and-drop-v2/public/js/drag_and_drop.js"></script>
      <script type="text/javascript" src="${studioBaseUrl}/xblock/resource/drag-and-drop-v2/public/js/translations/en/text.js"></script>
      <script type="text/javascript" src="${studioBaseUrl}/static/studio/js/src/utility.js"></script>
      <script type="text/javascript" src="${studioBaseUrl}/static/studio/js/src/logger.js"></script>
      <script type="text/javascript" src="${studioBaseUrl}/static/studio/common/js/vendor/jquery-migrate.js"></script>
      <script type="text/javascript" src="${studioBaseUrl}/static/studio/common/js/vendor/underscore.string.js"></script>
      <script type="text/javascript" src="${studioBaseUrl}/static/studio/common/js/vendor/backbone.js"></script>
      <script type="text/javascript" src="${studioBaseUrl}/static/studio/edx-ui-toolkit/js/utils/string-utils.js"></script>
      <script type="text/javascript" src="${studioBaseUrl}/static/studio/edx-ui-toolkit/js/utils/html-utils.js"></script>
      <script type="text/javascript" src="${studioBaseUrl}/static/studio/cms/js/require-config.js"></script>
      <script type="text/javascript" src="${studioBaseUrl}/static/studio/bundles/js/factories/context_course.js"></script>
      <script type="text/javascript" src="${studioBaseUrl}/static/studio/bundles/js/sock.js"></script>
      <script type="text/javascript" src="${studioBaseUrl}/static/studio/bundles/js/factories/container.js"></script>
      <script type="text/javascript" src="${studioBaseUrl}/static/studio/debug_toolbar/js/toolbar.js"></script>
      <script type="text/javascript" src="${studioBaseUrl}/static/studio/js/vendor/url.min.js"></script>
      <script type="text/javascript" src="${studioBaseUrl}/static/studio/js/vendor/URI.min.js"></script>
      <script type="text/javascript" src="${studioBaseUrl}/static/studio/js/models/xblock_info.js"></script>
      <script type="text/javascript" src="${studioBaseUrl}/static/studio/js/views/xblock.js"></script>
      <script type="text/javascript" src="${studioBaseUrl}/static/studio/js/views/utils/xblock_utils.js"></script>
      <script type="text/javascript" src="${studioBaseUrl}/static/studio/common/js/components/utils/view_utils.js"></script>
      <script type="text/javascript" src="${studioBaseUrl}/static/studio/js/utils/module.js"></script>
      <script type="text/javascript" src="${studioBaseUrl}/static/studio/js/views/baseview.js"></script>
      <script type="text/javascript" src="${studioBaseUrl}/static/studio/common/js/components/views/feedback_notification.js"></script>
      <script type="text/javascript" src="${studioBaseUrl}/static/studio/common/js/components/views/feedback_prompt.js"></script>
      <script type="text/javascript" src="${studioBaseUrl}/static/studio/js/utils/handle_iframe_binding.js"></script>
      <script type="text/javascript" src="${studioBaseUrl}/static/studio/js/utils/templates.js"></script>
      <script type="text/javascript" src="${studioBaseUrl}/static/studio/common/js/components/views/feedback.js"></script>
      <script type="text/javascript" src="${studioBaseUrl}/static/studio/js/vendor/requirejs/text.js"></script>
      <script type="text/javascript" src="${studioBaseUrl}/xblock/resource/split_test/public/js/split_test_author_view.js"></script>
      <script type="text/javascript" src="${studioBaseUrl}/static/studio/bundles/WordCloudBlockDisplay.js"></script>
      <script type="text/javascript" src="${studioBaseUrl}/xblock/resource/library_content/public/js/library_content_edit.js"></script>
      <script type="text/javascript" src="${studioBaseUrl}/static/studio/bundles/HtmlBlockDisplay.js"></script>
      <script type="text/javascript" src="https://app.getbeamer.com/js/beamer-embed.js"></script>
      <script type="text/javascript" src="https://studio.edx.org/c4x/edX/DemoX/asset/jquery.loupeAndLightbox.js"></script>
      <!-- Configure and load MathJax -->
      <script type="text/x-mathjax-config">
        MathJax.Hub.Config({
          tex2jax: {
            inlineMath: [
              ['\\\\(','\\\\)'],
              ['[mathjaxinline]','[/mathjaxinline]']
            ],
            displayMath: [
              ['\\\\[','\\\\]'],
              ['[mathjax]','[/mathjax]']
            ]
          }
        });
      </script>
      <script type="text/x-mathjax-config">
        MathJax.Hub.signal.Interest(function(message) {
          if(message[0] === "End Math") {
            set_mathjax_display_div_settings();
          }
        });
        function set_mathjax_display_div_settings() {
          $('.MathJax_Display').each(function( index ) {
            this.setAttribute('tabindex', '0');
            this.setAttribute('aria-live', 'off');
            this.removeAttribute('role');
            this.removeAttribute('aria-readonly');
          });
        }
      </script>
      <script type="text/javascript">
        // Activating Mathjax accessibility files
        window.MathJax = {
          menuSettings: {
            collapsible: true,
            autocollapse: false,
            explorer: true
          }
        };
      </script>
      <!-- This must appear after all mathjax-config blocks, so it is after the imports from the other templates.
           It can't be run through static.url because MathJax uses crazy url introspection to do lazy loading of
           MathJax extension libraries -->
      <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/mathjax@2.7.5/MathJax.js?config=TeX-MML-AM_SVG"></script>
      <script>
        $.ajaxSetup({
          xhrFields: { withCredentials: true }
        });
        
        const originalAjax = $.ajax;
        
        $.ajax = function(options) {
           // Due to the use of edx-platform scripts in MFE, it is necessary to provide additional protection
           // against random "undefined" that may appear in URLs before sending AJAX requests.
           if (options.url && options.url.includes('undefined')) {
             options.url = options.url.replace('undefined', '');
           }

           // AJAX requests, must follow certain settings, such as including credentials (x-csrf token, cookie, etc.)
           // and ensuring consistent URL formatting.
           if (!/^https?:\\/\\//i.test(options.url)) {
             options.url = "${studioBaseUrl}" + options.url;
           }

           return originalAjax.call(this, options);
        };
      </script>
    `;
  }

  let result = '';
  let modifiedHtml = '';

  modifiedHtml = modifyVoidHrefToPreventDefault(html);
  // Due to the use of edx-platform scripts in MFE, it is necessary to ensure that the paths for static files
  // and important data-attributes are correct.
  modifiedHtml = modifiedHtml.replace('url(&#39;/assets', `url('${studioBaseUrl}/assets`);
  modifiedHtml = modifiedHtml.replace('src="/assets', `src="${studioBaseUrl}/assets`);
  modifiedHtml = modifiedHtml.replace('src=&#34;/static/studio', `src=&#34;${studioBaseUrl}/static/studio`);
  modifiedHtml = modifiedHtml.replace('data-target="/preview/xblock', `data-target="${studioBaseUrl}/preview/xblock`);

  const hasCustomButtons = html.includes('editor-with-buttons');
  const hasCustomTabs = html.includes('editor-with-tabs');
  const hasPlugins = html.includes('wrapper-comp-plugins');
  console.log('TYPE:', type);
  console.log('VARIANT:', variant);
  const getDataEditor = html.includes('wrapper-comp-editor');

  const editingModalHeader = `          
    <div class="modal-header">
        <h2 id="modal-window-title" class="title modal-window-title">
            <span class="modal-button-title">
                Editing: displayName
            </span> 
            <button data-tooltip="Edit Title" class="btn-default action-edit title-edit-button">
                <span class="icon fa fa-pencil" aria-hidden="true"></span>
                <span class="sr"> Edit Title</span>
            </button>
        </h2>
        <ul class="editor-modes action-list action-modes">        
            <li class="action-item" data-mode="editor">
                <a href="#" class="editor-button is-set">Editor</a>
            </li>
            <li class="action-item" data-mode="settings">
                <a href="#" class="settings-button">Settings</a>
            </li>
        </ul>  
    </div>`;

  const defaultModalTitle = `
    <div class="modal-header">
        <h2 id="modal-window-title" class="title modal-window-title">Editing: displayName</h2>
        <ul class="editor-modes action-list action-modes"></ul>
    </div>`;

  const getActionBar = `
    <div class="modal-actions" style="display: block;">
        <h3 class="sr">Actions</h3>
        <ul>
            <li class="action-item">
                <a href="#" class="button action-primary action-save">Save</a>
            </li>
            <li class="action-item">
                <a href="#" class="button  action-cancel">Cancel</a>
            </li>
        </ul>
    </div>`;

  if (
    type === COMPONENT_TYPES.discussion
    || type === COMPONENT_TYPES.dragAndDrop
    || type === COMPONENT_TYPES.html
  ) {
    result = `
    <!DOCTYPE html>
    <html>
    <head>
      <base target="_blank">
      <meta charset="UTF-8">
      ${legacyIncludes}
      ${cssTags}
    </head>
    <body class="wrapper-xblock level-page studio-xblock-wrapper">
        <article class="xblock-render">
            <div class="xblock xblock-author_view xblock-author_view-vertical xblock-initialized">
                <div class="reorderable-container ui-sortable">
                    <div class="studio-xblock-wrapper is-draggable">
                        <section class="wrapper-xblock is-collapsible level-element">
                            ${modifiedHtml}         
                        </section>
                    </div>
                </div>
            </div>
        </article> 
      ${jsTags}
      <script>
        window.addEventListener('load', (${xblockIFrameConnector.toString()}));
      </script>
    </body>
    </html>
  `;
  } else if (COMPONENT_TYPES.advanced) {
    result = `
    <!DOCTYPE html>
    <html>
    <head>
      <base target="_blank">
      <meta charset="UTF-8">
      ${legacyIncludes}
      ${cssTags}
    </head>
    <body class="wrapper-xblock level-page studio-xblock-wrapper">
      <section class="wrapper-xblock is-collapsible level-element">
        <article class="xblock-render">
            ${modifiedHtml}
        </article>
      </section>
      ${jsTags}
      <script>
        window.addEventListener('load', (${xblockIFrameConnector.toString()}));
      </script>
    </body>
    </html>
  `;
  } else {
    result = `
    <!DOCTYPE html>
    <html>
    <head>
      <base target="_blank">
      <meta charset="UTF-8">
      ${legacyIncludes}
      ${cssTags}
    </head>
    <body>
      ${modifiedHtml}
      ${jsTags}
      <script>
        window.addEventListener('load', (${xblockIFrameConnector.toString()}));
      </script>
    </body>
    </html>
  `;
  }

  if (variant === 'edit-modal') {
    result = `
    <!DOCTYPE html>
    <html>
    <head>
      <!-- Open links in a new tab, not this iframe -->
      <base target="_blank">
      <meta charset="UTF-8">
      ${legacyIncludes}
      ${cssTags}
    </head>
    <!-- A Studio-served stylesheet will set the body min-height to 100% (a common strategy to allow for background
    images to fill the viewport), but this has the undesireable side-effect of causing an infinite loop via the
    onResize event listeners in certain situations.  Resetting it to the default "auto" skirts the problem. -->
    <body style="min-height: auto; background-color: #0000006b; overflow: hidden;" class="course container view-container">
    <div class="wrapper wrapper-modal-window wrapper-modal-window-edit-xblock">
        <div class="modal-window-overlay"></div>
        <div class="modal-window modal-editor confirm modal-lg modal-type-discussion" tabindex="-1" aria-labelledby="modal-window-title" style="top: 238.5px; left: 17px;">
            <div class="edit-xblock-modal">
              ${!hasCustomTabs && getDataEditor ? editingModalHeader : defaultModalTitle}
              <div class="modal-content">
                  ${html}      
              </div>
              ${!hasCustomButtons ? getActionBar : ''}
            </div>
        </div>
    </div>
      ${jsTags}
      <script>
        window.addEventListener('load', (${xblockIFrameConnector.toString()}));
      </script>
    </body>
    </html>
  `;
  }

  return result;
}

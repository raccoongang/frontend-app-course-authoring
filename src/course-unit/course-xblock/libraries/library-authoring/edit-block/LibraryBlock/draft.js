function StudioEditableXBlockMixin(runtime, element) {
  "use strict";

  var fields = [];
  var tinyMceAvailable = (typeof $.fn.tinymce !== 'undefined');
  var datepickerAvailable = (typeof $.fn.datepicker !== 'undefined');

  $(element).find('.field-data-control').each(function() {
    var $field = $(this);
    var $wrapper = $field.closest('li');
    var $resetButton = $wrapper.find('button.setting-clear');
    var type = $wrapper.data('cast');
    fields.push({
      name: $wrapper.data('field-name'),
      isSet: function() { return $wrapper.hasClass('is-set'); },
      hasEditor: function() { return tinyMceAvailable && $field.tinymce(); },
      val: function() {
        var val = $field.val();
        if (type == 'boolean')
          return (val == 'true' || val == '1');
        if (type == "integer")
          return parseInt(val, 10);
        if (type == "float")
          return parseFloat(val);
        if (type == "generic" || type == "list" || type == "set") {
          val = val.trim();
          if (val === "")
            val = null;
          else
            val = JSON.parse(val);
        }
        return val;
      },
      removeEditor: function() {
        $field.tinymce().remove();
      }
    });
    var fieldChanged = function() {
      $wrapper.addClass('is-set');
      $resetButton.removeClass('inactive').addClass('active');
    };
    $field.bind("change input paste", fieldChanged);
    $resetButton.click(function() {
      $field.val($wrapper.attr('data-default'));
      $wrapper.removeClass('is-set');
      $resetButton.removeClass('active').addClass('inactive');
    });
    if (type == 'html' && tinyMceAvailable) {
      // ... код TinyMCE ...
    }
    if (type == 'datepicker' && datepickerAvailable) {
      $field.datepicker('destroy');
      $field.datepicker({dateFormat: "m/d/yy"});
    }
  });

  $(element).find('.wrapper-list-settings .list-set').each(function() {
    // ... код для обработки списков ...
  });

  var studio_submit = function(data) {
    var handlerUrl = runtime.handlerUrl(element, 'submit_studio_edits');
    runtime.notify('save', {state: 'start', message: gettext("Saving")});
    $.ajax({
      type: "POST",
      url: handlerUrl,
      data: JSON.stringify(data),
      dataType: "json",
      global: false,
      success: function(response) { runtime.notify('save', {state: 'end'}); }
    }).fail(function(jqXHR) {
      var message = gettext("This may be happening because of an error with our server or your internet connection. Try refreshing the page or making sure you are online.");
      if (jqXHR.responseText) {
        try {
          // ... обработка ошибок ...
        } catch (error) { message = jqXHR.responseText.substr(0, 300); }
      }
      runtime.notify('error', {title: gettext("Unable to update settings"), message: message});
    });
  };

  $('.save-button', element).bind('click', function(e) {
    e.preventDefault();
    var values = {};
    var notSet = [];
    for (var i in fields) {
      var field = fields[i];
      if (field.isSet()) {
        values[field.name] = field.val();
      } else {
        notSet.push(field.name);
      }
      if (field.hasEditor()) {
        field.removeEditor();
      }
    }
    studio_submit({values: values, defaults: notSet});
  });

  $(element).find('.cancel-button').bind('click', function(e) {
    for (var i in fields) {
      var field = fields[i];
      if (field.hasEditor()) {
        field.removeEditor();
      }
    }
    e.preventDefault();
    runtime.notify('cancel', {});
  });
}

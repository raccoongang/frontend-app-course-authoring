module.exports = {
  advancedModules: {
    deprecated: false,
    displayName: 'Advanced Module List',
    help: 'Enter the names of the advanced modules to use in your course.',
    hideOnEnabledPublisher: false,
    value: [],
  },
  allowProctoringOptOut: {
    deprecated: false,
    displayName: 'Allow Opting Out of Proctored Exams',
    help: 'Enter true or false. If this value is true, learners can choose to take proctored exams without proctoring. If this value is false, all learners must take the exam with proctoring. This setting only applies if proctored exams are enabled for the course.',
    hideOnEnabledPublisher: false,
    value: true,
  },
  catalogVisibility: {
    deprecated: false,
    displayName: 'Course Visibility In Catalog',
    help: "Defines the access permissions for showing the course in the course catalog. This can be set to one of three values: 'both' (show in catalog and allow access to about page), 'about' (only allow access to about page), 'none' (do not show in catalog and do not allow access to an about page).",
    hideOnEnabledPublisher: false,
    value: 'both',
  },
};

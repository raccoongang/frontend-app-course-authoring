import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import './course-unit/data/__factories__';
import { configureStore } from '@reduxjs/toolkit';
import { getConfig, mergeConfig } from '@edx/frontend-platform';
import { configure as configureLogging } from '@edx/frontend-platform/logging';
import { configure as configureAuth, getAuthenticatedHttpClient, MockAuthService } from '@edx/frontend-platform/auth';
import { configure as configureI18n } from '@edx/frontend-platform/i18n';
import MockAdapter from 'axios-mock-adapter';
/* eslint-disable import/no-extraneous-dependencies */
import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import buildSimpleCourseAndSequenceMetadata from './course-unit/data/__factories__/sequenceMetadata.factory';
import { buildOutlineFromBlocks } from './course-unit/data/__factories__/learningSequencesOutline.factory';
import { reducer as modelsReducer } from './generic/model-store';
import 'babel-polyfill';
import messages from './i18n';
import { fetchSequence, fetchCourse } from './course-unit/data/thunk';
import { reducer as coursewareReducer } from './course-unit/data/slice';

Enzyme.configure({ adapter: new Adapter() });

/* need to mock window for tinymce on import, as it is JSDOM incompatible */

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock Intersection Observer which is unavailable in the context of a test.
global.IntersectionObserver = jest.fn(function mockIntersectionObserver() {
  this.observe = jest.fn();
  this.disconnect = jest.fn();
});

// Mock getComputedStyle which some Paragon components use to do size calculations.  In general
// These calculations don't matter for our test suite.
window.getComputedStyle = jest.fn(() => ({
  getPropertyValue: jest.fn(),
}));

// Ensure app-specific configs are loaded during tests since
// initialize() is not called.
mergeConfig({
  SUPPORT_URL: process.env.SUPPORT_URL || null,
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || null,
  LEARNING_BASE_URL: process.env.LEARNING_BASE_URL,
  EXAMS_BASE_URL: process.env.EXAMS_BASE_URL || null,
  CALCULATOR_HELP_URL: process.env.CALCULATOR_HELP_URL || null,
  ENABLE_PROGRESS_GRAPH_SETTINGS: process.env.ENABLE_PROGRESS_GRAPH_SETTINGS || 'false',
  ENABLE_TEAM_TYPE_SETTING: process.env.ENABLE_TEAM_TYPE_SETTING === 'true',
}, 'CourseAuthoringConfig');

// Mock the plugins repo so jest will stop complaining about ES6 syntax
jest.mock('frontend-components-tinymce-advanced-plugins', () => {});

export function logUnhandledRequests(axiosMock) {
  axiosMock.onAny().reply((config) => {
    // eslint-disable-next-line no-console
    console.log(config.method, config.url);
    return [200, {}];
  });
}

// Helper, that is used to forcibly finalize all promises
// in thunk before running matcher against state.
export const executeThunk = async (thunk, dispatch, getState) => {
  await thunk(dispatch, getState);
  await new Promise(setImmediate);
};

// Utility function for appending the browser timezone to the url
// Can be used on the backend when the user timezone is not set in the user account
export const appendBrowserTimezoneToUrl = (url) => {
  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const urlObject = new URL(url);
  if (browserTimezone) {
    urlObject.searchParams.append('browser_timezone', browserTimezone);
  }
  return urlObject.href;
};

class MockLoggingService {
  // eslint-disable-next-line no-console
  logInfo = jest.fn(infoString => console.log(infoString));

  // eslint-disable-next-line no-console
  logError = jest.fn(errorString => console.log(errorString));
}

export function initializeMockApp() {
  mergeConfig({
    CONTACT_URL: process.env.CONTACT_URL || null,
    DISCUSSIONS_MFE_BASE_URL: process.env.DISCUSSIONS_MFE_BASE_URL || null,
    INSIGHTS_BASE_URL: process.env.INSIGHTS_BASE_URL || null,
    STUDIO_BASE_URL: process.env.STUDIO_BASE_URL || null,
    TWITTER_URL: process.env.TWITTER_URL || null,
    authenticatedUser: {
      userId: 'abc123',
      username: 'MockUser',
      roles: [],
      administrator: false,
    },
    SUPPORT_URL_ID_VERIFICATION: 'http://example.com',
  });

  const loggingService = configureLogging(MockLoggingService, {
    config: getConfig(),
  });
  const authService = configureAuth(MockAuthService, {
    config: getConfig(),
    loggingService,
  });

  // i18n doesn't have a service class to return.
  configureI18n({
    config: getConfig(),
    loggingService,
    messages,
  });

  return { loggingService, authService };
}

let globalStore;

export async function initializeTestStore(options = {}, overrideStore = true) {
  const store = configureStore({
    reducer: {
      models: modelsReducer,
      courseware: coursewareReducer,
      // courseHome: courseHomeReducer,
      // learningAssistant: learningAssistantReducer,
    },
  });
  if (overrideStore) {
    globalStore = store;
  }
  initializeMockApp();
  const axiosMock = new MockAdapter(getAuthenticatedHttpClient());
  axiosMock.reset();

  const {
    courseBlocks, sequenceBlocks, courseMetadata, sequenceMetadata, courseHomeMetadata,
  } = buildSimpleCourseAndSequenceMetadata(options);

  let courseMetadataUrl = `${getConfig().LMS_BASE_URL}/api/courseware/course/${courseMetadata.id}`;
  courseMetadataUrl = appendBrowserTimezoneToUrl(courseMetadataUrl);

  const learningSequencesUrlRegExp = new RegExp(`${getConfig().LMS_BASE_URL}/api/learning_sequences/v1/course_outline/*`);
  let courseHomeMetadataUrl = `${getConfig().LMS_BASE_URL}/api/course_home/course_metadata/${courseMetadata.id}`;
  const discussionConfigUrl = new RegExp(`${getConfig().LMS_BASE_URL}/api/discussion/v1/courses/*`);
  courseHomeMetadataUrl = appendBrowserTimezoneToUrl(courseHomeMetadataUrl);

  const provider = options?.provider || 'legacy';

  axiosMock.onGet(courseMetadataUrl).reply(200, courseMetadata);
  axiosMock.onGet(courseHomeMetadataUrl).reply(200, courseHomeMetadata);
  axiosMock.onGet(learningSequencesUrlRegExp).reply(200, buildOutlineFromBlocks(courseBlocks));
  axiosMock.onGet(discussionConfigUrl).reply(200, { provider });
  sequenceMetadata.forEach(metadata => {
    const sequenceMetadataUrl = `${getConfig().LMS_BASE_URL}/api/courseware/sequence/${metadata.item_id}`;
    axiosMock.onGet(sequenceMetadataUrl).reply(200, metadata);
    const proctoredExamApiUrl = `${getConfig().LMS_BASE_URL}/api/edx_proctoring/v1/proctored_exam/attempt/course_id/${courseMetadata.id}/content_id/${sequenceMetadata.item_id}?is_learning_mfe=true`;
    axiosMock.onGet(proctoredExamApiUrl).reply(200, { exam: {}, active_attempt: {} });
  });

  logUnhandledRequests(axiosMock);

  // eslint-disable-next-line no-unused-expressions
  !options.excludeFetchCourse && await executeThunk(fetchCourse(courseMetadata.id), store.dispatch);

  if (!options.excludeFetchSequence) {
    await Promise.all(sequenceBlocks
      .map(block => executeThunk(fetchSequence(block.id), store.dispatch)));
  }

  return store;
}

// Re-export everything.
export * from '@testing-library/react';

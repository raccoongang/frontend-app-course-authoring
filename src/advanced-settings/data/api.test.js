import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import {
  getCourseApps,
  updateCourseApp,
  getCourseAdvancedSettings,
  updateCourseAdvancedSettings,
} from './api';

jest.mock('@edx/frontend-platform/auth');

describe('getCourseApps', () => {
  beforeEach(() => {
    getAuthenticatedHttpClient.mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: {} }),
    });
  });

  it('fetches course apps for a given course ID', async () => {
    const courseId = 'course-123';
    const result = await getCourseApps(courseId);

    expect(getAuthenticatedHttpClient().get).toHaveBeenCalledWith(
      expect.stringContaining(`/api/course_apps/v1/apps/${courseId}`),
    );
    expect(result).toEqual({});
  });
});

describe('updateCourseApp', () => {
  beforeEach(() => {
    getAuthenticatedHttpClient.mockReturnValue({
      patch: jest.fn().mockResolvedValue(),
    });
  });

  it('updates the status of a course app', async () => {
    const courseId = 'course-123';
    const appId = 'app-123';
    const state = true;

    await updateCourseApp(courseId, appId, state);

    expect(getAuthenticatedHttpClient().patch).toHaveBeenCalledWith(
      expect.stringContaining(`/api/course_apps/v1/apps/${courseId}`),
      {
        id: appId,
        enabled: state,
      },
    );
  });
});

describe('getCourseAdvancedSettings', () => {
  beforeEach(() => {
    getAuthenticatedHttpClient.mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: {} }),
    });
  });

  it('fetches advanced settings for a given course ID', async () => {
    const courseId = 'course-123';
    const result = await getCourseAdvancedSettings(courseId);

    expect(getAuthenticatedHttpClient().get).toHaveBeenCalledWith(
      expect.stringContaining(`/api/contentstore/v0/advanced_settings/course-v1:${courseId}`),
    );
    expect(result).toEqual({});
  });
});

describe('updateCourseAdvancedSettings', () => {
  beforeEach(() => {
    getAuthenticatedHttpClient.mockReturnValue({
      patch: jest.fn().mockResolvedValue({ data: {} }),
    });
  });

  it('updates an advanced setting for a given course ID', async () => {
    const courseId = 'course-123';
    const setting = 'settingKey';
    const value = 'settingValue';

    const result = await updateCourseAdvancedSettings(courseId, setting, value);

    expect(getAuthenticatedHttpClient().patch).toHaveBeenCalledWith(
      expect.stringContaining(`/api/contentstore/v0/advanced_settings/course-v1:${courseId}`),
      { setting_key: { value: 'settingValue' } },
    );
    expect(result).toEqual({});
  });
});

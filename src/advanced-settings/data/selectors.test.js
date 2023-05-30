import {
  getLoadingStatus,
  getSavingStatus,
  getCourseAppsApiStatus,
  getCourseAppSettingValue,
} from './selectors';

describe('Selectors', () => {
  describe('getLoadingStatus', () => {
    it('returns the loading status from the state', () => {
      const state = {
        advancedSettings: {
          loadingStatus: true,
        },
      };
      const loadingStatus = getLoadingStatus(state);
      expect(loadingStatus).toBe(true);
    });
  });

  describe('getSavingStatus', () => {
    it('returns the saving status from the state', () => {
      const state = {
        advancedSettings: {
          savingStatus: false,
        },
      };
      const savingStatus = getSavingStatus(state);
      expect(savingStatus).toBe(false);
    });
  });

  describe('getCourseAppsApiStatus', () => {
    it('returns the course apps API status from the state', () => {
      const state = {
        advancedSettings: {
          courseAppsApiStatus: 'success',
        },
      };
      const courseAppsApiStatus = getCourseAppsApiStatus(state);
      expect(courseAppsApiStatus).toBe('success');
    });
  });

  describe('getCourseAppSettingValue', () => {
    it('returns the value of a course app setting from the state', () => {
      const state = {
        advancedSettings: {
          courseAppSettings: {
            setting1: { value: 'value1' },
            setting2: { value: 'value2' },
          },
        },
      };
      const settingValueSelector = getCourseAppSettingValue('setting1');
      const settingValue = settingValueSelector(state);
      expect(settingValue).toBe('value1');
    });

    it('returns undefined if the course app setting does not exist in the state', () => {
      const state = {
        advancedSettings: {
          courseAppSettings: {},
        },
      };
      const settingValueSelector = getCourseAppSettingValue('nonexistentSetting');
      const settingValue = settingValueSelector(state);
      expect(settingValue).toBeUndefined();
    });
  });
});

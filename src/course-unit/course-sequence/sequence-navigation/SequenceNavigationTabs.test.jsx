import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AppProvider } from '@edx/frontend-platform/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { initializeMockApp } from '@edx/frontend-platform';
import MockAdapter from 'axios-mock-adapter';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import initializeStore from '../../../store';
import SequenceNavigationTabs from './SequenceNavigationTabs';
import { getCourseSectionVerticalApiUrl, getCourseSectionVerticalData, getXBlocksBaseApiUrl } from '../../data/api';
import { courseUnitIndexMock } from '../../__mocks__';
import { executeThunk } from '../../../utils';
import { addNewSequenceNavigationUnit, fetchCourseSectionVerticalData } from '../../data/thunk';
import messages from '../messages';
import userEvent from '@testing-library/user-event';
import { getCourseAdvancedSettingsApiUrl } from '../../../advanced-settings/data/api';
import { advancedSettingsMock } from '../../../advanced-settings/__mocks__';
import { updateCourseAppSetting } from '../../../advanced-settings/data/thunks';
// import { initialState } from '../../../custom-pages/factories/mockApiResponses';

let axiosMock;
let store;
const courseId = 'course-v1:edX+DemoX+Demo_Course';
const sequenceId = 'block-v1:edX+DemoX+Demo_Course+type@sequential+block@19a30717eff543078a5d94ae9d6c18a5';

const unitIdMock = 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@867dddb6f55d410caaa9c1eb9c6743ec';

const unitIdsMock = [
  'block-v1:edX+DemoX+Demo_Course+type@vertical+block@867dddb6f55d410caaa9c1eb9c6743ec',
  'block-v1:edX+DemoX+Demo_Course+type@vertical+block@4f6c1b4e316a419ab5b6bf30e6c708e9',
  'block-v1:edX+DemoX+Demo_Course+type@vertical+block@3dc16db8d14842e38324e95d4030b8a0',
  // 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@4a1bba2a403f40bca5ec245e945b0d76',
  // 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@256f17a44983429fb1a60802203ee4e0',
  // 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@e3601c0abee6427d8c17e6d6f8fdddd1',
  // 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@a79d59cd72034188a71d388f4954a606',
  // 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@134df56c516a4a0dbb24dd5facef746e',
  // 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@d91b9e5d8bc64d57a1332d06bf2f2193',
  // 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@cfa92608acef40829d5405a11f6cf980',
  // 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@603638c0de0d4da19d313c82fcab8aff',
  // 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@d8966a2735be4c0fb192fd22d8920c8f',
  // 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@91c01e58cf9e493a8aa8404618f81af2',
  // 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@f5b7b706c15941ceaf3d342808282d94',
  // 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@86d6b861f1154629ae4e5e952dce02c2',
  // 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@5969c3c1e87947edbac81d7461040224',
  // 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@809bb2e0d69b499fbdeec06b66ce5c2e',
];

const unitsMock = {
  'block-v1:edX+DemoX+Demo_Course+type@vertical+block@867dddb6f55d410caaa9c1eb9c6743ec': {
    id: 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@867dddb6f55d410caaa9c1eb9c6743ec',
    sequenceId: 'block-v1:edX+DemoX+Demo_Course+type@sequential+block@19a30717eff543078a5d94ae9d6c18a5',
    title: 'Getting Started',
    graded: false,
  },
  'block-v1:edX+DemoX+Demo_Course+type@vertical+block@4f6c1b4e316a419ab5b6bf30e6c708e9': {
    id: 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@4f6c1b4e316a419ab5b6bf30e6c708e9',
    sequenceId: 'block-v1:edX+DemoX+Demo_Course+type@sequential+block@19a30717eff543078a5d94ae9d6c18a5',
    title: 'Working with Videos',
    graded: false,
  },
  'block-v1:edX+DemoX+Demo_Course+type@vertical+block@3dc16db8d14842e38324e95d4030b8a0': {
    id: 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@3dc16db8d14842e38324e95d4030b8a0',
    sequenceId: 'block-v1:edX+DemoX+Demo_Course+type@sequential+block@19a30717eff543078a5d94ae9d6c18a5',
    title: 'Videos on edX',
    graded: false,
  },
  // 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@4a1bba2a403f40bca5ec245e945b0d76': {
  //   id: 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@4a1bba2a403f40bca5ec245e945b0d76',
  //   sequenceId: 'block-v1:edX+DemoX+Demo_Course+type@sequential+block@19a30717eff543078a5d94ae9d6c18a5',
  //   title: 'Video Demonstrations',
  //   graded: false,
  // },
  // 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@256f17a44983429fb1a60802203ee4e0': {
  //   id: 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@256f17a44983429fb1a60802203ee4e0',
  //   sequenceId: 'block-v1:edX+DemoX+Demo_Course+type@sequential+block@19a30717eff543078a5d94ae9d6c18a5',
  //   title: 'Video Presentation Styles',
  //   graded: false,
  // },
  // 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@e3601c0abee6427d8c17e6d6f8fdddd1': {
  //   id: 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@e3601c0abee6427d8c17e6d6f8fdddd1',
  //   sequenceId: 'block-v1:edX+DemoX+Demo_Course+type@sequential+block@19a30717eff543078a5d94ae9d6c18a5',
  //   title: 'Interactive Questions',
  //   graded: false,
  // },
  // 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@a79d59cd72034188a71d388f4954a606': {
  //   id: 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@a79d59cd72034188a71d388f4954a606',
  //   sequenceId: 'block-v1:edX+DemoX+Demo_Course+type@sequential+block@19a30717eff543078a5d94ae9d6c18a5',
  //   title: 'Exciting Labs and Tools',
  //   graded: false,
  // },
  // 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@134df56c516a4a0dbb24dd5facef746e': {
  //   id: 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@134df56c516a4a0dbb24dd5facef746e',
  //   sequenceId: 'block-v1:edX+DemoX+Demo_Course+type@sequential+block@19a30717eff543078a5d94ae9d6c18a5',
  //   title: 'Reading Assignments',
  //   graded: false,
  // },
  // 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@d91b9e5d8bc64d57a1332d06bf2f2193': {
  //   id: 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@d91b9e5d8bc64d57a1332d06bf2f2193',
  //   sequenceId: 'block-v1:edX+DemoX+Demo_Course+type@sequential+block@19a30717eff543078a5d94ae9d6c18a5',
  //   title: 'When Are Your Exams? ',
  //   graded: false,
  // },
  // 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@cfa92608acef40829d5405a11f6cf980': {
  //   id: 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@cfa92608acef40829d5405a11f6cf980',
  //   sequenceId: 'block-v1:edX+DemoX+Demo_Course+type@sequential+block@19a30717eff543078a5d94ae9d6c18a5',
  //   title: 'Unit_TEST',
  //   graded: false,
  // },
  // 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@603638c0de0d4da19d313c82fcab8aff': {
  //   id: 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@603638c0de0d4da19d313c82fcab8aff',
  //   sequenceId: 'block-v1:edX+DemoX+Demo_Course+type@sequential+block@19a30717eff543078a5d94ae9d6c18a5',
  //   title: 'Unit_TEST',
  //   graded: false,
  // },
  // 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@d8966a2735be4c0fb192fd22d8920c8f': {
  //   id: 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@d8966a2735be4c0fb192fd22d8920c8f',
  //   sequenceId: 'block-v1:edX+DemoX+Demo_Course+type@sequential+block@19a30717eff543078a5d94ae9d6c18a5',
  //   title: 'Unit_TEST',
  //   graded: false,
  // },
  // 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@91c01e58cf9e493a8aa8404618f81af2': {
  //   id: 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@91c01e58cf9e493a8aa8404618f81af2',
  //   sequenceId: 'block-v1:edX+DemoX+Demo_Course+type@sequential+block@19a30717eff543078a5d94ae9d6c18a5',
  //   title: 'Unit_TEST_2',
  //   graded: false,
  // },
  // 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@f5b7b706c15941ceaf3d342808282d94': {
  //   id: 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@f5b7b706c15941ceaf3d342808282d94',
  //   sequenceId: 'block-v1:edX+DemoX+Demo_Course+type@sequential+block@19a30717eff543078a5d94ae9d6c18a5',
  //   title: 'Unit_TEST_2',
  //   graded: false,
  // },
  // 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@86d6b861f1154629ae4e5e952dce02c2': {
  //   id: 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@86d6b861f1154629ae4e5e952dce02c2',
  //   sequenceId: 'block-v1:edX+DemoX+Demo_Course+type@sequential+block@19a30717eff543078a5d94ae9d6c18a5',
  //   title: 'Unit_TEST_2',
  //   graded: false,
  // },
  // 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@5969c3c1e87947edbac81d7461040224': {
  //   id: 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@5969c3c1e87947edbac81d7461040224',
  //   sequenceId: 'block-v1:edX+DemoX+Demo_Course+type@sequential+block@19a30717eff543078a5d94ae9d6c18a5',
  //   title: 'Unit',
  //   graded: false,
  // },
  // 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@809bb2e0d69b499fbdeec06b66ce5c2e': {
  //   id: 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@809bb2e0d69b499fbdeec06b66ce5c2e',
  //   sequenceId: 'block-v1:edX+DemoX+Demo_Course+type@sequential+block@19a30717eff543078a5d94ae9d6c18a5',
  //   title: 'Unit',
  //   graded: false,
  // },
};

const initialState = {
  courseDetail: {
    courseId,
    status: 'sucessful',
  },
  customPages: {
    customPagesIds: [
      'mOckID1',
    ],
    loadingStatus: 'successful',
    savingStatus: '',
    deletingStatus: '',
    addingStatus: '',
    customPagesApiStatus: {},
  },
  models: {
    units: unitsMock,
  },
};

const renderComponent = () => render(
  <AppProvider store={store}>
    <IntlProvider locale="en">
      <SequenceNavigationTabs courseId={courseId} unitId={unitIdMock} unitIds={unitIdsMock} />
    </IntlProvider>
  </AppProvider>,
);

describe('<SequenceNavigationTabs>', () => {
  beforeEach(async () => {
    initializeMockApp({
      authenticatedUser: {
        userId: 3,
        username: 'abc123',
        administrator: true,
        roles: [],
      },
    });

    store = initializeStore(initialState);
    axiosMock = new MockAdapter(getAuthenticatedHttpClient());
    axiosMock
      .onGet(getCourseSectionVerticalApiUrl(courseId))
      .reply(200, courseUnitIndexMock);
    await executeThunk(fetchCourseSectionVerticalData(courseId, sequenceId), store.dispatch);
  });

  it('renders navigation tabs correctly', () => {
    const { getByRole } = renderComponent();
    const gettingStartedTab = getByRole('link', { name: 'Getting Started' });
    const workingWithVideosTab = getByRole('link', { name: 'Working with Videos' });
    const videosOnEdXTab = getByRole('link', { name: 'Videos on edX' });

    expect(gettingStartedTab).toBeInTheDocument();
    expect(workingWithVideosTab).toBeInTheDocument();
    expect(videosOnEdXTab).toBeInTheDocument();
  });

  it('123', async () => {
    const { getByRole } = renderComponent();
    const addNewUnitBtn = getByRole('button', { name: messages.newUnitBtnText.defaultMessage });
    screen.debug();
    await waitFor(() => {
      expect(addNewUnitBtn).toBeInTheDocument();
    });
  });

  it('clicking on a navigation tab updates the route', async () => {
    const { getByRole, getAllByTestId } = renderComponent();
    const addNewUnitBtn = getByRole('button', { name: messages.newUnitBtnText.defaultMessage });
    const unitButtons = getAllByTestId('add-new-unit-btn');
    // screen.debug();
    const handleTitleEditSubmit = jest.fn();
    // expect(unitButtons).toHaveLength(3);

    axiosMock
      .onPost(getXBlocksBaseApiUrl)
      .reply(200, {
        courseKey: courseId,
        locator: 'block-v1:edX+DemoX+Demo_Course+type@vertical+block@551f361c555a4516aa94158eff6777ca',
      });

    userEvent.click(addNewUnitBtn);
    expect(handleTitleEditSubmit).toHaveLength(1);
  });
});

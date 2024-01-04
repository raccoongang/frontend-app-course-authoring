// eslint-disable-next-line import/no-extraneous-dependencies
import { Factory } from 'rosie';

import { initializeTestStore, render } from '../../../setupTest';
import UnitIcon from './UnitIcon';

describe('Unit Icon', () => {
  const types = {
    video: 'video',
    other: 'other',
    vertical: 'vertical',
    problem: 'problem',
    lock: 'lock',
    undefined: 'undefined',
  };

  const courseMetadata = Factory.build('courseMetadata');
  const unitBlocks = Object.keys(types).map(contentType => Factory.build(
    'block',
    { id: contentType, type: contentType },
    { courseId: courseMetadata.id },
  ));

  beforeAll(async () => {
    await initializeTestStore({ courseMetadata, unitBlocks });
  });

  unitBlocks.forEach(block => {
    it(`renders correct icon for ${block.type} unit`, () => {
      // Suppress warning for undefined prop type.
      if (block.type === 'undefined') {
        jest.spyOn(console, 'error').mockImplementation(() => {});
      }

      const { container, getByText } = render(<UnitIcon type={block.type} />);
      const srOnlyElement = getByText(types[block.type], { selector: '.sr-only' });
      expect(srOnlyElement).toBeInTheDocument();
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });
});

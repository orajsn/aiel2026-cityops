import { render } from '@testing-library/react';
import { LabLink } from '../../src/overlay/LabLink';
import { LAB_LINKS } from '../../src/content/labLinks';

// the link of each lab on its first page (owner, 4 Nov): Lab 1 on 1.0, Lab 2 on 0.4, Lab 3 on 3.0 with Lab 2's link
test('the labs show their own links on their first pages, and no other page shows one', () => {
  expect(LAB_LINKS['1.0'].url).toBe('https://aiscloud.app/aielbkk26-lab1');
  expect(LAB_LINKS['0.4'].url).toBe('https://aiscloud.app/aielbkk26-lab2');
  expect(LAB_LINKS['3.0'].url).toBe('https://aiscloud.app/aielbkk26-lab2');
  const a = render(<LabLink sceneId="1.0" />).container;
  expect(a.textContent).toContain('aiscloud.app/aielbkk26-lab1');
  expect(a.querySelector('svg[role="img"] path')).not.toBeNull();
  expect(render(<LabLink sceneId="2.2" />).container.querySelector('[data-lab-link]')).toBeNull();
});

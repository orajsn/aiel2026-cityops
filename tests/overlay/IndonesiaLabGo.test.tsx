import { render } from '@testing-library/react';
import { LabGo, type LabGoProps } from '../../src/overlay/concepts/LabGo';
import { GO_LAB1, GO_LAB2, GO_LAB3, GO_LAB3_CODE } from '../../src/scenes/labGo';
import { qrPath } from '../../src/engine/follow';

test.each([
  [GO_LAB1, 'https://tinyurl.com/idlab01', 'AI Experience Indonesia: The Economics of AI - Lab 1'],
  [GO_LAB2, 'https://tinyurl.com/idlab02', 'AI Experience Indonesia: AI Labs 2 & 3'],
  [GO_LAB3, 'https://tinyurl.com/idlab02', 'AI Experience Indonesia: AI Labs 2 & 3'],
  [GO_LAB3_CODE, 'https://tinyurl.com/idlab02', 'AI Experience Indonesia: AI Labs 2 & 3'],
] as const)('handoff %s uses the Indonesia address in the link and QR', (scene, url, title) => {
  const props = scene.overlayProps as unknown as LabGoProps;
  const { container, getByRole } = render(<LabGo {...props} />);
  expect(props.url).toBe(url);
  expect(props.listed).toBe(title);
  expect(getByRole('link', { name: url.replace('https://', '') })).toHaveAttribute('href', url);
  const qr = getByRole('img', { name: `QR code for ${url.replace('https://', '')}` });
  expect(qr.querySelector('path')).toHaveAttribute('d', qrPath(url).d);
  expect(qr.querySelector('rect')).toHaveAttribute('x', '-4');
  expect(container.textContent).not.toContain('Thailand');
  expect(container.textContent).not.toContain('aiscloud.app');
  expect(container.querySelector('[data-lab-listed] img')).toHaveAttribute('alt', `The LiveLabs page: ${title}`);
});

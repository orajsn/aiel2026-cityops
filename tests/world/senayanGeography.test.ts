import DATA from '../../src/world/senayanData';
import { projectSenayan, senayanEdgeVisibility } from '../../src/world/senayanBounds';
import { harborBridgeFrame, toBridgeLocal } from '../../src/world/bridgeFrame';

test('the mapped Kali Grogol crossing projects onto the lesson bridge anchor', () => {
  const point = projectSenayan(106.79572992068474, -6.228184396421049);
  const frame = harborBridgeFrame();
  expect(point[0]).toBeCloseTo(frame.x, 5);
  expect(point[1]).toBeCloseTo(frame.z, 5);
  const endpoints = [[106.7956627, -6.2281634], [106.7957882, -6.2282026]];
  const mapped = endpoints.map(([lon, lat]) => projectSenayan(lon, lat));
  const length = Math.hypot(mapped[1][0] - mapped[0][0], mapped[1][1] - mapped[0][1]);
  expect(length / DATA.meta.units_per_metre).toBeCloseTo(14.5576, 3);
  for (const point of mapped) expect(toBridgeLocal(...point).lz).toBeCloseTo(0, 4);
});

test('the required venues have distinct mapped footprints, source identifiers and district coverage', () => {
  const ids = ['relation/14717268', 'way/162174048', 'way/119772912', 'way/48036723', 'way/682984153'];
  for (const id of ids) {
    const landmark = DATA.landmarks[id];
    expect(landmark.polygons[0][0].length).toBeGreaterThanOrEqual(4);
    expect(senayanEdgeVisibility(...landmark.center)).toBe(1);
  }
  // Geographic orientation: the hotel and stadium are north of the canal crossing.
  expect(DATA.landmarks['relation/14717268'].center[1]).toBeLessThan(DATA.meta.world_anchor[1]);
  expect(DATA.landmarks['way/682984153'].center[1]).toBeLessThan(DATA.landmarks['relation/14717268'].center[1]);
});

test('height provenance distinguishes the official-floor discrepancy and interpreted hotel massing', () => {
  const office = DATA.buildings.find((building) => building.id === 'way/162174048')!;
  expect(office.height_basis).toMatch(/official.*18stories/);
  expect(office.height_basis).toContain('OSM19levels differs');
  const hotel = DATA.buildings.find((building) => building.id === 'relation/14717268')!;
  expect(hotel.height_basis).toContain('Estimated');
  expect(hotel.height_basis).toContain('not surveyed');
  expect(DATA.meta.source).toContain('OpenStreetMap');
  expect(DATA.meta.license).toContain('ODbL');
});

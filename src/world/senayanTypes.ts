/** Projected map geometry: x/z world coordinates, 0.1 units per metre. */
export type Point = [number, number];
export type Bounds = [number, number, number, number];
export type Polygon = Point[][];
export type Polygons = Polygon[];

export interface SenayanBuilding {
  id: string;
  name: string;
  polygons: Polygons;
  height: number;
  height_m: number;
  height_basis: string;
  levels: number | null;
  landmark: boolean;
  kind: string | null;
  center: Point;
  bounds: Bounds;
}

export interface SenayanRoad {
  id: string;
  line: Point[];
  width: number;
  kind: string;
  name: string;
  bridge: boolean;
  layer: number;
  oneway: boolean;
}

export interface SenayanWaterArea {
  id: string;
  name: string;
  polygons: Polygons;
  line?: never;
  width?: never;
  width_basis?: never;
}

export interface SenayanWaterLine {
  id: string;
  name: string;
  line: Point[];
  width: number;
  width_basis: string;
  polygons?: never;
}

export type SenayanWater = SenayanWaterArea | SenayanWaterLine;

export interface SenayanLand {
  id: string;
  name: string;
  kind: string;
  polygons: Polygons;
}

export interface SenayanLandmark {
  name: string;
  center: Point;
  bounds: Bounds;
  polygons: Polygons;
}

export interface SenayanMeta {
  source: string;
  license: string;
  source_url: string;
  retrieved: string;
  units_per_metre: number;
  bridge_lonlat: Point;
  world_anchor: Point;
  road_axis_EN: Point;
  world_yaw: number;
  height_note: string;
  bounds: Bounds;
}

export interface SenayanData {
  buildings: SenayanBuilding[];
  roads: SenayanRoad[];
  water: SenayanWater[];
  land: SenayanLand[];
  landmarks: Record<string, SenayanLandmark>;
  trees: Point[];
  meta: SenayanMeta;
}

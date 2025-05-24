export type OBFPage = {
  buttons: OBFButton[];
  grid: OBFGrid;
  images: OBFImage[];
  id: string;
  locale: string;
  name: string;
};

export type OBFButton = {
  id: number;
  label: string;
  border_color: string;
  background_color: string;
  ext_coughdrop_add_vocalization?: boolean;
  ext_coughdrop_part_of_speech: string;
  image_id: string;
  load_board?: OBFLoadBoard;
  action?: string;
};

export type OBFLoadBoard = {
  id: string;
};

export type OBFGrid = {
  rows: number;
  columns: number;
  order: number[][];
};

export type OBFImage = {
  id: string;
  url: string;
  path: string;
};

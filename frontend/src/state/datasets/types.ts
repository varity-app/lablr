export interface Dataset {
  name: string;
  description: string;
  dataset_id: number;
  created_at: string;
}

export interface LabelDefinition {
  name: string;
  variant: "numerical" | "boolean";
  minimum?: number;
  maximum?: number;
  interval?: number;
}

export interface DatasetDetailed extends Dataset {
  labels: LabelDefinition[];
  labeled_percent: number;
}

export interface DatasetCreate {
  name: string;
  description: string;
  csv64: string;
  id_field: string;
  text_field: string;

  labels: LabelDefinition[];
}

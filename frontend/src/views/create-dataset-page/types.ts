export interface FormValues {
  name: string;
  description: string;
  file: string;
  id_field: string;
  text_field: string;

  labels: LabelDefinition[];
}

export interface FormErrors {
  [field: string]: string | string[];
}

export interface FormTouched {
  [fields: string]: boolean | boolean[];
}

export interface LabelDefinition {
  name: string;
  variant: "boolean" | "numerical";
  interval?: number;
  minimum?: number;
  maximum?: number;
}

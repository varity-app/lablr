export interface FormValues {
  name: string;
  description: string;
  file: string;
  id_field: string;
  text_field: string;

  labels: {
    name: string;
    variant: string;
    minimum?: number;
    maximum?: number;
    interval?: number;
  }[];
}

export interface FormErrors {
  [field: string]: string | string[];
}

export interface FormTouched {
  [fields: string]: boolean | boolean[];
}

export interface Sample {
  sample_id: string;
  original_id: string;
  text: string;
  labels: {
    [label: string]: number;
  };
  save_for_later: boolean;
}

export interface SampleMetadata {
  labeled_percent: number;
  pagination: {
    offset: number;
    limit: number;
    next_offset: number;
    total: number;
  };
}

export interface SamplesGetResponse {
  samples: Sample[];
  metadata: SampleMetadata;
}

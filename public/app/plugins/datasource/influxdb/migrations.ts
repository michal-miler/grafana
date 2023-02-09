type LegacyAnnotation = {
  query?: string;
  queryType?: string;
  fromAnnotations?: boolean;
  tagsColumn?: string;
  textColumn?: string;
  timeEndColumn?: string;
  titleColumn?: string;
  name?: string;
  target: {
    limit: number;
    matchAny: boolean;
    tags: string[];
    type: string;
  };
};

// this becomes the target in the migrated annotations
const migrateLegacyAnnotation = (json: LegacyAnnotation) => {
  return {
    query: json.query ?? '',
    queryType: 'tags',
    fromAnnotations: true,
    tagsColumn: json.tagsColumn ?? '',
    textColumn: json.textColumn ?? '',
    timeEndColumn: json.timeEndColumn ?? '',
    titleColumn: json.titleColumn ?? '',
    name: json.name ?? '',
    // handle json target fields
    limit: json.target ? json.target.limit : 0,
    matchAny: json.target ? json.target.matchAny : false,
    tags: json.target ? json.target.tags : [],
    type: json.target ? json.target.type : '',
  };
};

// eslint-ignore-next-line
export const prepareAnnotation = (json: any) => {
  // make sure that any additional target fields are migrated
  json.target = json.target && !json.target?.query ? migrateLegacyAnnotation(json) : json.target;

  return json;
};

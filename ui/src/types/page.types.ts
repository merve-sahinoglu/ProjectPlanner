type PageState = 'view' | 'edit' | 'create';

type PageFilter = {
  query: string;
  showActives: boolean;
};

export type { PageState, PageFilter };
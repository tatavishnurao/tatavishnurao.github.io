export type Publication = {
  title: string;
  authors: string;
  venue: string;
  year: string;
  abstract: string;
  links: Array<{
    label: string;
    href: string;
  }>;
};

export const publications: Publication[] = [];

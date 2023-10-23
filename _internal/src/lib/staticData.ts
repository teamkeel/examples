type category = {
  title: string;
  description: string;
  tag: string;
  docsLink?: string;
};

export const guideCategories: {
  general: category[];
  features: category[];
} = {
  general: [
    {
      title: "Frontends",
      description: "Building frontends with a Keel backend",
      tag: "frontend",
    },
    {
      title: "Integrations",
      description: "Using Keel with other tools and services",
      tag: "integration",
    },
  ],
  features: [
    {
      title: "APIs",
      description: "Using Keel with other tools and services",
      tag: "api",
    },
    {
      title: "Functions",
      description: "Building frontends with a Keel backend",
      tag: "functions",
    },
    {
      title: "Identity & permissions",
      description: "Which I haven't figured out yet",
      tag: "permissions",
    },
    {
      title: "Events",
      description: "Use events to run actions asynchronously",
      tag: "events",
    },
    {
      title: "Jobs",
      description: "Building frontends with a Keel backend",
      tag: "jobs",
    },
    {
      title: "Secrets & environment variables",
      description: "Using Keel with other tools and services",
      tag: "secrets",
    },
    {
      title: "Database",
      description: "Building frontends with a Keel backend",
      tag: "database",
    },
    {
      title: "Testing",
      description: "Building frontends with a Keel backend",
      tag: "database",
    },
  ],
};

export const flatGuideCategories = [
  ...guideCategories.general,
  ...guideCategories.features,
];

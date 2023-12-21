import type { MaterialSymbolProps } from "react-material-symbols";

export type Category = {
  title: string;
  description: string;
  tag: string;
  docsLink?: string;
  icon: MaterialSymbolProps["icon"];
};

export const guideCategories: {
  general: Category[];
  features: Category[];
} = {
  general: [
    {
      title: "Frontends",
      description: "Building frontends with a Keel backend",
      tag: "frontend",
      icon: "preview",
    },
    {
      title: "Integrations",
      description: "Using Keel with other tools and services",
      tag: "integration",
      icon: "linked_services",
    },
  ],
  features: [
    {
      title: "APIs",
      description: "Using Keel with other tools and services",
      tag: "api",
      icon: "api",
    },
    {
      title: "Functions",
      description: "Building frontends with a Keel backend",
      tag: "functions",
      icon: "functions",
    },
    {
      title: "Identity & permissions",
      description: "Which I haven't figured out yet",
      tag: "permissions",
      icon: "security",
    },
    {
      title: "Events",
      description: "Use events to run actions asynchronously",
      tag: "events",
      icon: "event",
    },
    {
      title: "Jobs",
      description: "Building frontends with a Keel backend",
      tag: "jobs",
      icon: "pending_actions",
    },
    {
      title: "Secrets & environment variables",
      description: "Using Keel with other tools and services",
      tag: "secrets",
      icon: "password",
    },
    {
      title: "Database",
      description: "Building frontends with a Keel backend",
      tag: "database",
      icon: "storage",
    },
    {
      title: "Testing",
      description: "Building frontends with a Keel backend",
      tag: "database",
      icon: "bug_report",
    },
  ],
};

export const flatGuideCategories = [
  ...guideCategories.general,
  ...guideCategories.features,
];

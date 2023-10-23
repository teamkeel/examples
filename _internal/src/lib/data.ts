import fs from "fs/promises";
import fm from "front-matter";
import { ZodObject, z } from "zod";
import { highlight } from "./highlight";

const baseSchema = z.object({
  slug: z.string(),
  tags: z.string().array(),
  title: z.string().optional(),
  readme: z.string().optional(),
  files: z
    .object({
      name: z.string(),
      contents: z.string(),
      highlightedContent: z.string().optional(),
    })
    .array(),
});

const featuresSchema = baseSchema.extend({
  features: z.string().array(),
});

export type Entry = z.infer<typeof baseSchema>;

const directories = [
  {
    name: "patterns",
    type: baseSchema,
  },
  {
    name: "guides",
    type: baseSchema,
  },
];

export const loadData = async () => {
  const res: {
    [key: string]: Entry[];
  } = {};

  for (const dir of directories) {
    const data = await loadDirectory(dir.name, dir.type);
    res[dir.name] = data;
  }

  console.log("all data", res);

  return res;
};

export const loadDirectory = async (
  baseDir: string,
  schema: ZodObject<any>
) => {
  const directories = await fs.readdir(process.cwd() + "/../" + baseDir, {
    withFileTypes: true,
  });

  const entries: Entry[] = [];

  for await (const dir of directories
    .filter((d) => d.isDirectory)
    .filter((d) => d.name != ".DS_Store")) {
    let entry: Entry = {
      slug: dir.name,
      tags: [],
      files: [],
    };

    const fileMatches = [
      {
        dir: "/",
        extension: ["readme.md"],
      },
      {
        dir: "/",
        extension: [".keel"],
      },
      {
        dir: "/",
        extension: ["keelconfig.yaml"],
      },
      {
        dir: "/jobs",
        extension: [".ts"],
      },
      {
        dir: "/functions",
        extension: [".ts"],
      },
      {
        dir: "/subscribers",
        extension: [".ts"],
      },
    ];

    const rootDir = `${process.cwd()}/../${baseDir}/${dir.name}`;

    for (const match of fileMatches) {
      const result = await loadFiles(rootDir, match.dir, match.extension);
      entry.files = entry.files.concat(result);
    }

    const readmeFile = entry.files.find((file) => file.name === "readme.md");
    if (readmeFile) {
      const data = fm<{
        tags: string;
        [key: string]: any;
      }>(readmeFile.contents);

      entry.readme = data.body;
      entry.tags = data.attributes.tags?.split(",").map((s) => s.trim()) || [];
      entry.title = data.attributes.title;

      // If we can't extract a title then skip this
      if (!entry.title) {
        continue;
      }

      // Extract any data from front matter that matches the zod schema of this entry type
      const { tags, ...attributesWithoutTags } = data.attributes;
      const parsed = schema.deepPartial().safeParse(attributesWithoutTags);
      if (parsed.success) {
        entry = {
          ...entry,
          ...parsed.data,
        };
      }
    } else {
      // skip the file if no readme
      continue;
    }

    // Highlight and sort files
    entry = await highlightFiles(entry);

    entries.push(entry);
  }

  return entries;
};

const loadFiles = async (
  rootPath: string,
  dir: string,
  extension: string[]
) => {
  let files = [];
  try {
    files = (await fs.readdir(rootPath + dir)).filter((file) =>
      extension.some((ext) => file.endsWith(ext))
    );
  } catch (err) {
    // Skip for directories that don't exist. E.g projects that don't have functions
    return [];
  }

  const loadedFiles: Entry["files"] = [];

  for (const file of files) {
    try {
      const contents = await fs.readFile(`${rootPath + dir}/${file}`, "utf-8");
      loadedFiles.push({
        name: file,
        contents: contents,
      });
    } catch (err) {
      console.log("Failed to load file", file, err);
      continue;
    }
  }

  return loadedFiles;
};

const highlightFiles = async (entry: Entry) => {
  // Run all files through the processor
  const files = await Promise.all(
    entry.files
      // Remove readmes from our file list as we handle that content elsewhere
      .filter((file) => file.name != "readme.md")
      // Sort with .keel files first and then grouped by extension in alphabetical order
      .sort((a, b) => {
        const extA = getExtension(a.name);
        const extB = getExtension(b.name);
        if (extA === "keel" && extB !== "keel") {
          return -1;
        }
        if (extA !== "keel" && extB === "keel") {
          return 1;
        }
        return a.name.localeCompare(b.name);
      })
      .map(async (file) => {
        const highlightedFile = file;
        try {
          highlightedFile.highlightedContent = await highlight(
            file.contents,
            getExtension(file.name)
          );
        } catch (error) {
          console.error(`Failed to highlight file: ${file.name}`, error);
          return file;
        }
        return highlightedFile;
      })
  );

  return {
    ...entry,
    files,
  };
};

function getExtension(filename: string): string {
  return filename.split(".").pop() || "";
}

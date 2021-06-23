import * as TypeDoc from 'typedoc';

interface Context {
  project: {
    getReflectionsByKind: (kind: TypeDoc.ReflectionKind) => TypeDoc.Reflection[];
    removeReflection: (reflection: TypeDoc.Reflection) => void;
  };
};

export async function main() {
  const app = new TypeDoc.Application();

  // If you want TypeDoc to load tsconfig.json / typedoc.json files
  app.options.addReader(new TypeDoc.TSConfigReader());
  app.options.addReader(new TypeDoc.TypeDocReader());



  // removes re-exports from being shown in the top level page.
  app.converter.on(TypeDoc.Converter.EVENT_RESOLVE_BEGIN, 
    (context: Context) => {
    for (const reflection of context.project.getReflectionsByKind(TypeDoc.ReflectionKind.Reference)) {
      context.project.removeReflection(reflection)
    }
  })

  app.bootstrap({
    // typedoc options here
    entryPoints: ['index.ts'],
    theme: `./node_modules/typedoc-neo-theme/bin/default`,
    plugin: ['typedoc-neo-theme']
  });

  const project = app.convert();
  if (project) {
    // Project may not have converted correctly
    const outputDir = 'docs';

    // Rendered docs
    await app.generateDocs(project, outputDir);
  }
}

// eslint-disable-next-line no-console
main().catch(console.error);
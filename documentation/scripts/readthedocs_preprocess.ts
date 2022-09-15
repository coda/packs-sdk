import fs from 'fs';
import { print } from '../../testing/helpers';
import * as yaml from 'js-yaml';

const FilePath = 'mkdocs.yml';

const EnvScalarYamlType = new yaml.Type('!ENV', {
  kind: 'scalar',
  resolve (data: string) {
    return data !== null;
  },

  construct (data: string): string | undefined {
    return process.env[data];
  },
});

const EnvSequenceYamlType = new yaml.Type('!ENV', {
  kind: 'sequence',
  resolve (data: string[]) {
    return data !== null && data.length > 0;
  },

  construct (data: string[]): string | number | boolean | undefined {
    let fallback;
    if (data.length > 1) {
      fallback = data.pop();
    }
    for (const envvar of data) {
      const value = process.env[envvar];
      if (value) {
        try {
          return JSON.parse(value);
        } catch (e) {}
        return value;
      }
    }
    return fallback;
  },
});

class CustomTag {
  type?: string;
  data?: any;
  constructor(type: string, data: any) {
    this.type = type;
    this.data = data;
  }
}

const UnknownYamlTypes = [ 'scalar', 'sequence', 'mapping' ].map(kind => {

  // first argument here is a prefix, so this type will handle anything starting with !
  return new yaml.Type('tag:', {
    kind: kind as 'scalar' | 'sequence' | 'mapping',
    multi: true,
    representName (object: CustomTag) {
      return object.type;
    },
    represent (object: CustomTag) {
      return object.data ?? '';
    },
    instanceOf: CustomTag,
    construct (data: any, type) {
      return new CustomTag(type as string, data);
    }
  });
});

const schema = yaml.DEFAULT_SCHEMA.extend([
  EnvScalarYamlType,
  EnvSequenceYamlType,
  ...UnknownYamlTypes
]);

// Manually set the site_url, since ReadTheDocs can't load environment variables in mkdocs.yml.
// https://github.com/readthedocs/readthedocs.org/issues/8529#issuecomment-929063527
let siteUrl = `https://${process.env.READTHEDOCS_PROJECT}.readthedocs-hosted.com/${process.env.READTHEDOCS_LANGUAGE}/${process.env.READTHEDOCS_VERSION}/`;
if (process.env.READTHEDOCS_VERSION_TYPE === 'external') {
  siteUrl = `https://${process.env.READTHEDOCS_PROJECT}--${process.env.READTHEDOCS_VERSION}.com.readthedocs.build/en/${process.env.READTHEDOCS_VERSION}/`;
}
process.env.MK_DOCS_SITE_URL = siteUrl;
print(`Set MK_DOCS_SITE_URL to: ${siteUrl}`);

let content = fs.readFileSync(FilePath, 'utf8');
const doc = yaml.load(content, {schema});
content = yaml.dump(doc, {schema});
fs.writeFileSync(FilePath, content);

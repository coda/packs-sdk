/**
 * Pre-processing script that runs before Read the Docs generates the documentation.
 * See .readthedocs.yaml for where it is executed.
 */

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

/**
 * Read the Docs generates a unique URL for each version / PR, so you can't set a static value for MK_DOCS_SITE_URL.
 * They don't expose a way to access the full generated URL, but using other environment variables you can reconstruct
 * it. This helper function generates that URL and saves it to MK_DOCS_SITE_URL.
 *
 *
 * @see {@link https://github.com/readthedocs/readthedocs.org/issues/8260}
 */
function setSiteUrl() {
  let siteUrl = `https://${process.env.READTHEDOCS_PROJECT}.readthedocs-hosted.com/${process.env.READTHEDOCS_LANGUAGE}/${process.env.READTHEDOCS_VERSION}/`;
  if (process.env.READTHEDOCS_VERSION_TYPE === 'external') {
    siteUrl = `https://${process.env.READTHEDOCS_PROJECT}--${process.env.READTHEDOCS_VERSION}.com.readthedocs.build/en/${process.env.READTHEDOCS_VERSION}/`;
  }
  process.env.MK_DOCS_SITE_URL = siteUrl;
  print(`Set MK_DOCS_SITE_URL to: ${siteUrl}`);
}

/**
 * Read the Docs doesn't handle the !ENV tag in mkdocs.yml that loads values from environment variables. This helper
 * script manually replaces !ENV tags with the corresponding environment variable values and saves the file back.
 *
 * @see {@link https://github.com/readthedocs/readthedocs.org/issues/8529#issuecomment-929063527}
 */
function replaceEnvVars() {
  const schema = yaml.DEFAULT_SCHEMA.extend([
    EnvScalarYamlType,
    EnvSequenceYamlType,
    ...UnknownYamlTypes
  ]);

  let content = fs.readFileSync(FilePath, 'utf8');
  const doc = yaml.load(content, {schema});
  content = yaml.dump(doc, {schema});
  fs.writeFileSync(FilePath, content);
}

setSiteUrl();
replaceEnvVars();

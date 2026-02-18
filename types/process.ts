import {
	copyFileSync,
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	statSync,
	writeFileSync
} from 'fs';
import { join } from 'path';
import { exit } from 'process';
import { propertiesReader } from 'properties-reader';
import packageJson from '../package.json';

const JS_UTILS_VERSION = packageJson.dependencies['@enonic/js-utils'];
console.info('JS_UTILS_VERSION', JS_UTILS_VERSION);

const TYPE_FEST_VERSION = packageJson.devDependencies['type-fest'];
console.info('TYPE_FEST_VERSION', TYPE_FEST_VERSION);

const XP_TYPES_VERSION = packageJson.devDependencies['@enonic-types/global'];
console.info('XP_TYPES_VERSION', XP_TYPES_VERSION);

function readGradleProperty(filePath: string, propertyName: string): string | null | undefined {
	try {
		const properties = propertiesReader({
			sourceFile: filePath,
		});
		const propertyValue = properties.get(propertyName) as string | null;
		return propertyValue;
	} catch (error) {
		console.error(`Error reading Gradle property: ${error}`);
		return undefined;
	}
}

function replaceInFile(filePath: string, searchValue: string, replaceValue: string) {
	const content = readFileSync(filePath, 'utf8');
	const updatedContent = content.replace(new RegExp(searchValue, 'g'), replaceValue);
	writeFileSync(filePath, updatedContent, 'utf8');
}

function replaceInDir(dir: string, searchValue: string, replaceValue: string) {
	const files = readdirSync(dir);
	files.forEach(file => {
		const filePath = join(dir, file);
		if (statSync(filePath).isDirectory()) {
			replaceInDir(filePath, searchValue, replaceValue);
		} else {
			replaceInFile(filePath, searchValue, replaceValue);
		}
	});
}

// function prefixFile(filePath: string, message: string) {
//   const content = readFileSync(filePath, 'utf8');
//   const updatedContent = `${message}\n${content}`;
//   writeFileSync(filePath, updatedContent, 'utf8');
// }

function copyDir(from: string, to: string): void {
  // Create target directory if it doesn't exist
  if (!existsSync(to)) {
    mkdirSync(to, { recursive: true });
  }

  // Read all items in source directory
  const entries = readdirSync(from);

  for (const entry of entries) {
    const srcPath = join(from, entry);
    const destPath = join(to, entry);

    const stats = statSync(srcPath);

    if (stats.isDirectory()) {
      // Recursively copy subdirectory
      copyDir(srcPath, destPath);
    } else if (stats.isFile()) {
      // Copy file (similar to your copyFile)
      copyFileSync(srcPath, destPath);
    }
    // we ignore symlinks, fifos, etc. for simplicity
  }
}

function copyFile(from: string, to: string) {
	writeFileSync(to, readFileSync(from, 'utf8'), 'utf8');
}

function copyReplaceAndRename(from: string, to: string, searchValue: string, replaceValue: string) {
	const content = readFileSync(from, 'utf8');
	const updatedContent = content.replace(new RegExp(searchValue, 'g'), replaceValue);
	writeFileSync(to, updatedContent, 'utf8');
}

replaceInFile('./build/types/collector/index.d.ts', '/lib/explorer/collector', '.');

copyDir('./src/main/resources/lib/explorer/types', './build/types/types')
copyFile('./src/main/resources/lib/explorer/types.d.ts', './build/types/types.d.ts')

replaceInDir('./build/types', '/lib/explorer', '.');
replaceInDir('./build/types', '/lib/xp/auth', '@enonic-types/lib-auth');
replaceInDir('./build/types', '/lib/xp/common', '@enonic-types/lib-common');
replaceInDir('./build/types', '/lib/xp/context', '@enonic-types/lib-context');
replaceInDir('./build/types', '/lib/xp/event', '@enonic-types/lib-event');
replaceInDir('./build/types', '/lib/xp/io', '@enonic-types/lib-io');
replaceInDir('./build/types', '/lib/xp/mail', '@enonic-types/lib-mail');
replaceInDir('./build/types', '/lib/xp/node', '@enonic-types/lib-node');
replaceInDir('./build/types', '/lib/xp/portal', '@enonic-types/lib-portal');
replaceInDir('./build/types', '/lib/xp/repo', '@enonic-types/lib-repo');
replaceInDir('./build/types', '/lib/xp/scheduler', '@enonic-types/lib-scheduler');
replaceInDir('./build/types', '/lib/xp/task', '@enonic-types/lib-task');
replaceInDir('./build/types', '/lib/xp/value', '@enonic-types/lib-value');

// replaceInDir('./build/types', '../types/', '..');
// replaceInDir('./build/types', '../types.d', '../index.d');


// This must come after the above replacements to avoid /lib/enonic/react4xp becoming . in the README.md
copyFile('types/README.md', 'build/types/README.md');

// prefixFile('build/types/index.d.ts', `declare global {
//   interface XpLibraries {
//     '/lib/enonic/react4xp': typeof import('./index');
//   }
// }`);

if (JS_UTILS_VERSION) {
	copyReplaceAndRename('types/package.template.json', 'build/types/package.json', '%JS_UTILS_VERSION%', JS_UTILS_VERSION);
} else {
	console.error('Unable to read JS_UTILS_VERSION from package.json!!!');
	exit(1);
}

if (TYPE_FEST_VERSION) {
	replaceInFile('build/types/package.json', '%TYPE_FEST_VERSION%', TYPE_FEST_VERSION)
} else {
	console.error('Unable to read TYPE_FEST_VERSION from package.json!!!');
	exit(1);
}

const VERSION = readGradleProperty('gradle.properties', 'version');

if (VERSION) {
	console.info('VERSION', VERSION);
	replaceInFile('build/types/package.json', '%VERSION%', VERSION);
} else {
	console.error('Unable to read version from gradle.properties!!!');
	exit(1);
}

// const XP_VERSION = readGradleProperty('gradle.properties', 'xpVersion');
if (XP_TYPES_VERSION) {
	replaceInFile('build/types/package.json', '%XP_TYPES_VERSION%', XP_TYPES_VERSION);
} else {
	console.error('Unable to read XP_TYPES_VERSION from package.json!!!');
	// console.error('Unable to read XP_VERSION from gradle.properties!!!');
	exit(1);
}

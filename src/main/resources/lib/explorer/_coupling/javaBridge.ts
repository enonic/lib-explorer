import type {EventLib} from '@enonic/js-utils/src/types/index.d';
import type {JavaBridge} from './types.d';


import event from '/lib/xp/event';
import {connect} from '/lib/xp/node';
import * as repo from '/lib/xp/repo';
import * as value from '/lib/xp/value';

//@ts-ignore
import {javaLocaleToSupportedLanguage as stemmingLanguageFromLocale} from '/lib/explorer/stemming/javaLocaleToSupportedLanguage';
//import {javaLocaleToSupportedLanguage as stemmingLanguageFromLocale} from '../stemming/javaLocaleToSupportedLanguage';


export const javaBridge :JavaBridge = {
	app,
	connect,
	event: event as EventLib,
	log,
	repo,
	stemmingLanguageFromLocale,
	value
};

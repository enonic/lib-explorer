import type React from 'react';
import type {SemanticUiReactForm} from 'semantic-ui-react-form';
import type {Application} from '../../../index.d';
import type {CollectionFormValues} from './Collection.d';
import type {TaskName} from './Task.d';
import type {AnyObject} from './Utility.d';

//──────────────────────────────────────────────────────────────────────────────
// Collector UI
//──────────────────────────────────────────────────────────────────────────────

export type ContentTypeOptions = Array<unknown>;
export type SiteOptions = Array<unknown>;

export type Fields = Record<string,{
	label :string
	values :Record<string,{
		label :string
	}>
}>;

export type CollectorProps<CollectorConfig extends AnyObject = AnyObject> = {
	context :SemanticUiReactForm.State<CollectionFormValues<CollectorConfig>>
	dispatch :React.Dispatch<SemanticUiReactForm.Action>
	explorer :{
		contentTypeOptions :ContentTypeOptions
		fields :Fields
		siteOptions :SiteOptions
	}
	isFirstRun :React.MutableRefObject<boolean>
	path :string
};

//──────────────────────────────────────────────────────────────────────────────
// Collector API
//──────────────────────────────────────────────────────────────────────────────

export type CollectorId = string


export type CollectorReactComponentParams = {
	context :{
		values :unknown
	}
	dispatch :() => void
	path :string
}

export type Collector = {
	appName :Application.Key
	collectTaskName :TaskName
	componentPath :string
	configAssetPath :string
	displayName :string
}

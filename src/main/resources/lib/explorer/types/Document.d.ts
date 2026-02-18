import type {
	Aggregations,
	FieldSortDsl,
	Filter,
	QueryDsl,
} from '@enonic-types/core';
import type { RepoConnection } from '@enonic-types/lib-node';

import type { RequiredNodeProperties } from './Node.d';

export interface RequiredMetaData {
	collection: string
	collector: {
		id: string
		version: string
	}
	createdTime: Date | string
	documentType: string
	language: string
	stemmingLanguage: string
	valid: boolean
}


export interface MetaData extends RequiredMetaData {
	modifiedTime?: Date | string
}

export interface CreatedMetaData extends RequiredMetaData {
	modifiedTime: never
}

export interface UpdatedMetaData extends RequiredMetaData {
	modifiedTime: Date | string
}


export interface DocumentNode extends RequiredNodeProperties {
	document_metadata: MetaData; // modifiedTime is optional
	//[key: string]: unknown
}

export interface CreatedDocumentNode extends RequiredNodeProperties {
	document_metadata: CreatedMetaData // modifiedTime is never
}

export type QueryDocumentsParams<AggregationInput extends Aggregations = never> = {
	aggregations?: AggregationInput;
	count?: number;
	filters?: Filter | Filter[];
	query?: QueryDsl;
	sort?: FieldSortDsl;
	start?: number;
}

export type QueryDocumentsParamsWithConnection<
	AggregationInput extends Aggregations = never
> = QueryDocumentsParams<AggregationInput> & {
	collectionRepoReadConnection: RepoConnection;
}

export interface UpdatedDocumentNode extends RequiredNodeProperties {
	document_metadata: UpdatedMetaData // modifiedTime is required
}

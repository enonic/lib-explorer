/*
 Due to references between nodes: Do we have to be careful when migrating?

 Collection references:
 * Fields
 * FieldValues
 * Owner

 FieldValue references:
 * Field
 * Owner

 Interface references:
 * Collections
 * Fields
 * FieldValues
 * Owner
 * Stopwords
 * Thesauri

 Stopwords references:
 * Owner

 Thesauri references:
 * Owner

 Synonym references:
 * Owner
 * Thesaurus

 Document references:
 * Owner

 Journal references:
 * Owner
────────────────────────────────────────────────────────────────────────────────

 * Query for all nodes of a type
 * Foreach node
   * lookup reference id from strings
   * modify using a editor function
*/

//import {stopwords} from '/lib/explorer/migrations/2/stopwords';
//import {thesauri} from '/lib/explorer/migrations/2/thesauri';
//import {synonyms} from '/lib/explorer/migrations/2/synonyms';
//import {fields} from '/lib/explorer/migrations/2/fields';
//import {fieldValues} from '/lib/explorer/migrations/2/fieldValues';
//import {collections} from '/lib/explorer/migrations/2/collections';
//import {interfaces} from '/lib/explorer/migrations/2/interfaces';


export function migrate() {
	//stopwords();
	//thesauri();
	//synonyms();
	//fields();
	//fieldValues();
	//collections();
	//interfaces();
}

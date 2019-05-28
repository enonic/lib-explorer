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

import {stopwords} from '/lib/explorer/migrations/2/stopwords';


export function migrate() {
	stopwords();
}

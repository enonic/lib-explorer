# enonic-xp-lib-yase

	include 'com.enonic.lib:yase:1.0.0-SNAPSHOT'

	<input name="thesauri" type="CustomSelector">
		<label>Thesauri (synonyms)</label>
		<occurrences minimum="0" maximum="0"/>
		<config>
			<service>thesauriSelector</service>
		</config>
	</input>

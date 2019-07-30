const BEAN = __.newBean('com.enonic.explorer.BinaryExtractorProvider');


export class ExtractedData {
	constructor(source) {
		this.javaObj = BEAN.extract(source);
	}

	get(name) {
		return __.toNativeObject(this.javaObj.get(name));
	}

	getMetadata() {
		return __.toNativeObject(this.javaObj.getMetadata());
	}

	getText() {
		return this.javaObj.getText();
	}

	names() {
		return __.toNativeObject(this.javaObj.names());
	}
} // class ExtractedData

interface JavaObj {
	get: (name: string) => unknown
	getMetadata: () => unknown
	getText: () => string
	names: () => unknown
}


const BEAN = __.newBean<{
	extract: (source :unknown) => JavaObj
}>('com.enonic.explorer.BinaryExtractorProvider');


export class ExtractedData {
	javaObj: JavaObj

	constructor(source :unknown) {
		this.javaObj = BEAN.extract(source);
	}

	get(name: string) {
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

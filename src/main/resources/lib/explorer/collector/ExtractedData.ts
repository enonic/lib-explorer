//@ts-ignore
const BEAN = __.newBean('com.enonic.explorer.BinaryExtractorProvider');


export class ExtractedData {
	javaObj :{
		get :(name :string) => unknown
		getMetadata :() => unknown
		getText :() => string
		names :() => unknown
	}

	constructor(source :unknown) {
		this.javaObj = BEAN.extract(source);
	}

	get(name :string) {
		//@ts-ignore
		return __.toNativeObject(this.javaObj.get(name));
	}

	getMetadata() {
		//@ts-ignore
		return __.toNativeObject(this.javaObj.getMetadata());
	}

	getText() {
		return this.javaObj.getText();
	}

	names() {
		//@ts-ignore
		return __.toNativeObject(this.javaObj.names());
	}
} // class ExtractedData

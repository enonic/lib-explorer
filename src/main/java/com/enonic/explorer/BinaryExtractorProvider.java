package com.enonic.explorer;

import com.google.common.io.ByteSource;

import com.enonic.xp.extractor.BinaryExtractor;
import com.enonic.xp.extractor.ExtractedData;
import com.enonic.xp.script.bean.BeanContext;
import com.enonic.xp.script.bean.ScriptBean;

public class BinaryExtractorProvider
	implements ScriptBean
{
	private BinaryExtractor binaryExtractor;

	public ExtractedData extract( final ByteSource source )
	{
		return binaryExtractor.extract( source );
	}

	@Override
	public void initialize( final BeanContext context )
	{
		this.binaryExtractor = context.getService( BinaryExtractor.class ).get();
	}
}

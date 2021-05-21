package com.enonic.explorer;

import java.util.function.Supplier;

import com.enonic.xp.app.Application;
import com.enonic.xp.app.Applications;
import com.enonic.xp.app.ApplicationKey;
import com.enonic.xp.app.ApplicationKeys;
import com.enonic.xp.app.ApplicationService;
import com.enonic.xp.script.bean.BeanContext;
import com.enonic.xp.script.bean.ScriptBean;

public class ApplicationServiceBean implements ScriptBean {
	private Supplier<ApplicationService> applicationServiceSupplier;

	@Override
    public void initialize( final BeanContext context )
    {
        applicationServiceSupplier = context.getService( ApplicationService.class );
    }

	public Application getInstalledApplication( ApplicationKey key ) {
		return applicationServiceSupplier.get().getInstalledApplication(key);
	}

	public Applications getInstalledApplications() {
		return applicationServiceSupplier.get().getInstalledApplications();
	}

	public ApplicationKeys getInstalledApplicationKeys() {
		return applicationServiceSupplier.get().getInstalledApplicationKeys();
	}
}

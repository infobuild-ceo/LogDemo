Ext.define("CustomersApp.store.Customers", {
    extend: "Ext.data.Store",
    requires: "Ext.data.proxy.HwcProxy",
    config: {
        model: "CustomersApp.model.Customer",
	    proxy: {
	        type: "HwcProxy",
			mboconfig: {
				mboName: 'Customer'
			},
	    },
        sorters: [{ property: 'company_name', direction: 'ASC'}],
        grouper: {
            sortProperty: "company_name",
            direction: "ASC",
            groupFn: function(record) {
                return record.get('company_name')[0];
            }        
	    }
    }
});

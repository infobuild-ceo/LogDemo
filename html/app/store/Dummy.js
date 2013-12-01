Ext.define("CustomersApp.store.Dummy", {
    extend: "Ext.data.Store",
    config: {
        model: "CustomersApp.model.Detalle",
	autoLoad: true,
	data: []
    }
});

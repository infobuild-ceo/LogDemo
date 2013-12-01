Ext.define("CustomersApp.model.Detalle", {
    extend: "Ext.data.Model",
    config: {
	belongsTo: "Pedido",
        fields: [
        	{name: "item", type: "int"},
	        {name: "material", type: "string"},
	        {name: "cantidad", type: "int"}
        ]
    }
});

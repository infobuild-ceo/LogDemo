Ext.define("CustomersApp.model.Camion", {
    extend: "Ext.data.Model",
    config: {
        idProperty: 'id',
        fields: [
        	{name: "id", type: "int"},
	        {name: "patente", type: "string"},
	        {name: "tipo", type: "string"},
	        {name: "chofer", type: "string"},
		{name: "lat", type: "float"},
		{name: "lon", type: "float"}
        ]
    }
});

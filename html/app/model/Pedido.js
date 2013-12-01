Ext.define("CustomersApp.model.Pedido", {
    extend: "Ext.data.Model",
    config: {
        idProperty: 'id',
        fields: [
        	{name: "id", type: "int"},
	        {name: "direccion", type: "string"},
	        {name: "estado", type: "string"},
	        {name: "camionId", type: "int"}
        ],
	hasMany: { model: "CustomersApp.model.Detalle", name: "detalles" }
    }
});

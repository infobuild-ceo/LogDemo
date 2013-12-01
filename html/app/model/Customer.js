Ext.define("CustomersApp.model.Customer", {
    extend: "Ext.data.Model",
    requires: 'Ext.data.proxy.HwcProxy',

    config: {
        idProperty: 'id',
        fields: [
        	{name: "id", type: "int"},
	        {name: "company_name", type: "string"},
	        {name: "address", type: "string"},
	        {name: "city", type: "string"},
	        {name: "fname", type: "string" },
	        {name: "lname", type: "string"},
	        {name: "phone", type: "string"},
	        {name: "state", type: "string"},
	        {name: "zip", type: "string"}
        ],


        validations: [
            { type: 'presence', field: 'id' },
            { type: 'presence', field: 'company_name' },
            { type: 'presence', field: 'state', message: 'Please enter a city for this customer.' }
        ]
    }
});
Ext.application({
    name: "CustomersApp",

    models: ["Customer","Camion",'Pedido','Detalle'],
    stores: ["Customers","Camiones",'Pedidos','Dummy'],
    controllers: ["Customers"],
    views: ["CustomersList", "CustomerEditor"],

    launch: function () {

        var customersListView = {
            xtype: "customerslistview"
        };
        var customerEditorView = {
            xtype: "customereditorview"
        };

        Ext.Viewport.add([customersListView, customerEditorView]);

    }
});

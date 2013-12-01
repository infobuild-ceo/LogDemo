Ext.define("CustomersApp.controller.Customers", {

    extend: "Ext.app.Controller",
    config: {
        refs: {
            customersListView: "customerslistview",
            customerEditorView: "customereditorview",
            customersList: "#camionesList",
            mapView: "#mapaView"
        },
        control: {
            customersListView: {
                // The commands fired by the customers list container.
                camionSeleccionadoEvent: "onCamionSeleccionado",
                pedidoSeleccionadoEvent: "onPedidoSeleccionado",
		verDetalleEvent: "onVerDetalleTap",
		volverEvent: "onVolverTap"
            },
            customerEditorView: {
                // The commands fired by the customer editor.
                saveCustomerCommand: "onSaveCustomerCommand",
                deleteCustomerCommand: "onDeleteCustomerCommand",
                backToHomeCommand: "onBackToHomeCommand"
            }

        }
    },
    // Transitions
    slideLeftTransition: { type: 'slide', direction: 'left' },
    slideRightTransition: { type: 'slide', direction: 'right' },

    onVerDetalleTap: function( vista, btn ){
	var pan = btn.up("#cardPanel");
	pan.setActiveItem(1);
    },
    onVolverTap: function( vista, btn ){
	var pan = btn.up("#cardPanel");
	pan.setActiveItem(0);
    },
    onPedidoSeleccionado: function( vista, rec ){
	console.log( vista.down("#detallePedidoList") );
	vista.down("#detallePedidoList").setStore(rec.detalles());
	var geoc = new google.maps.Geocoder();
	geoc.geocode( { address: rec.data.direccion }, Ext.Function.bind(this.addressToMap, this, rec, true));
    },

    addressToMap: function( res, estado, rec){
	if( estado == google.maps.GeocoderStatus.OK ){
		var flag = new google.maps.MarkerImage(
			'resources/images/flag.png',
			new google.maps.Size(32, 36),
			new google.maps.Point(0, 0),
			new google.maps.Point(16, 36)
		);
		var pos = res[0].geometry.location;
		if ( this.destMarker ) this.destMarker.setVisible(false);
		
		this.destMarker = new google.maps.Marker({
			position: pos,
			title : rec.data.direccion,
			icon: flag,
			map: this.getMapView().getMap()
		});
		this.getMapView().getMap().panTo( pos );
	}	
    },  

    onCamionSeleccionado: function (lista, rec) {
	var image = new google.maps.MarkerImage(
                'resources/images/truck.png',
                new google.maps.Size(32, 32),
                new google.maps.Point(0, 0),
                new google.maps.Point(16, 32)
        );


        var pedidosStore = Ext.getStore("Pedidos");
	pedidosStore.clearFilter();
        pedidosStore.filter('camionId', rec.data.id);
	var position = new google.maps.LatLng( rec.data.lat, rec.data.lon);
	//this.getMapView().setMapCenter({ latitude: rec.data.lat, longitude: rec.data.lon });

	if( this.marker ){
		this.marker.setVisible(false);
	}

	this.marker = new google.maps.Marker({
        	position: position,
                title : rec.data.chofer,
		icon: image,
                map: this.getMapView().getMap()
	});
	this.getMapView().setMapCenter( position );

        this.getCustomersListView().setMasked(false);  //Note: Set this to false to hide this in favor of HWC spinner
        console.log("cargando pedidos camion: " + rec.data.id);
    },    
    // Helper functions
    getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    activateCustomerEditor: function (record) {

        var customerEditorView = this.getCustomerEditorView();
        customerEditorView.setRecord(record); // load() is deprecated.
        Ext.Viewport.animateActiveItem(customerEditorView, this.slideLeftTransition);
    },
    activateCustomersList: function () {
        Ext.Viewport.animateActiveItem(this.getCustomersListView(), this.slideRightTransition);
    },

    // Commands.
    
    onCloseCustomerCommand: function () {
    	closeWorkflow();
    },
    
    onNewCustomerCommand: function () {

        console.log("onNewCustomerCommand");

        var now = new Date();
        var customerId =  (this.getRandomInt(0, 128000)).toString();

        var newCustomer = Ext.create("CustomersApp.model.Customer", {
            id: customerId,
            company_name: "",
            state: ""
        });

        this.activateCustomerEditor(newCustomer);

    },
    onEditCustomerCommand: function (list, record) {

        console.log("onEditCustomerCommand");
        
    	// We need this to send old values of the record (for conflict resolution)
        // Note: old_record cache the record before it gets deleted
    	old_record = record.copy(record.getId());

        this.activateCustomerEditor(record);
    },
    onSaveCustomerCommand: function () {

        console.log("onSaveCustomerCommand");

        var customerEditorView = this.getCustomerEditorView();

        var currentCustomer = customerEditorView.getRecord();
        var newValues = customerEditorView.getValues();

        // Update the current customer's fields with form values.
        currentCustomer.set("company_name", newValues.company_name);
        currentCustomer.set("state", newValues.state);

        var errors = currentCustomer.validate();

        if (!errors.isValid()) {
            Ext.Msg.alert('Wait!', errors.getByField("title")[0].getMessage(), Ext.emptyFn);
            currentCustomer.reject();
            return;
        }

        var customersStore = Ext.getStore("Customers");

        if (null == customersStore.findRecord('id', currentCustomer.data.id)) {
			currentCustomer.phantom = true;
            customersStore.add(currentCustomer);
        } 

        customersStore.sync();

        customersStore.sort([{ property: 'dateCreated', direction: 'DESC'}]);

        this.activateCustomersList();
    },
    onDeleteCustomerCommand: function () {

        console.log("onDeleteCustomerCommand");

        var customerEditorView = this.getCustomerEditorView();
        var currentCustomer = customerEditorView.getRecord();
        var customersStore = Ext.getStore("Customers");
        
        // Note: old_record cache the record before it gets deleted (used for conflict resolution)
    	old_record = currentCustomer.copy(currentCustomer.getId());

    	customersStore.remove(currentCustomer);
        customersStore.sync();

        this.activateCustomersList();
    },
    onBackToHomeCommand: function () {

        console.log("onBackToHomeCommand");
        this.activateCustomersList();
    },

    // Base Class functions.
    launch: function () {
        this.callParent(arguments);
        var camionesStore = Ext.getStore("Camiones");
        camionesStore.load();
        this.getCustomersListView().setMasked(false);  //Note: Set this to false to hide this in favor of HWC spinner
        console.log("launch");
    },
    init: function () {
        this.callParent(arguments);
        console.log("init");
    }
});

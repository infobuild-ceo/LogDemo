Ext.define("CustomersApp.view.CustomersList", {
    extend: "Ext.Container",
    requires: "Ext.dataview.List",
    alias: "widget.customerslistview",

    config: {
	fullscreen: true,
        layout: 'vbox',
        items: [{
	    xtype: 'titlebar',
	    docked: 'top',
	    title: 'Demo Sistema Control Logístico'
	},{
	    xtype: 'container',
	    layout: {
		type: 'hbox',
		pack: 'center'
	    },
	    flex: 1,
	    items: [{
		xtype: 'list',
		store: "Camiones",
		itemId:"camionesList",
            	emptyText: "<div>Sin camiones</div>",
            	itemTpl: "<div><table width=\"100%\"><tr><td width=\"25%\">{patente}</td><td width=\"50%\">{chofer}</td><td width=\"25%\">{tipo}</td></tr></table></div>",
		flex: 1,
		items: [{
			xtype: 'toolbar',
			docked: 'top',
			layout: {
				type: 'hbox',
				pack: 'center'
			},
			items:[{
			    xtype: 'label',
			    align: 'left',
			    html: 'Patente',
			    flex: 1
			},{
			    xtype: 'label',
			    align: 'center',
			    html: 'Nombre Chofer',
			    flex: 2
			},{
			    xtype: 'label',
			    align: 'right',
			    html: 'Tipo',
			    flex: 1
			}]
		}]
            },{
		xtype: 'map',
    		//useCurrentLocation: true,
		flex: 1,
		itemId: "mapaView",
		mapOptions : {
                	center : new google.maps.LatLng(-33.444513,-70.656087),  //Santiago centro
                	zoom : 15,
                	mapTypeId : google.maps.MapTypeId.ROADMAP,
                	navigationControl: true,
                	navigationControlOptions: {
                    		style: google.maps.NavigationControlStyle.DEFAULT
                	}
            	}	
	    }]
	},{
	    xtype: 'panel',
	    layout: 'card',
	    itemId: "cardPanel",
	    flex: 1,
	    items: [{
		xtype: 'list',
		store: "Pedidos",
		itemId:"pedidosList",
		emptyText: "<div>Sin Pedidos.</div>",
		itemTpl: "<div><table width=\"100%\"><tr><td width=\"10%\">{id}</td><td width=\"75%\">{direccion}</td><td width=\"15%\">{estado}</td></tr></table></div>",
		items: [{
		    xtype: 'toolbar',
		    docked: 'top',
		    layout: {
		    	type: 'hbox',
		    	pack: 'center'
		    },
		    items:[{
		        xtype: 'label',
		        html: 'N. Pedido',
				
		        flex: 1
		    },{
		        xtype: 'label',
		        align: 'center',
		        html: 'Direcci&oacute;n',
		        flex: 8
		    },{
		        xtype: 'label',
		        html: 'Estado',
		        flex: 1
		    },{
		        xtype: 'button',
		        text: 'Detalle',
			ui: 'forward',
			itemId: "verDetalleBtn",
		        flex: 0.5
		    }]
	    	}]
	    },{
		xtype: 'list',
		store: 'Dummmy',
		itemId: 'detallePedidoList',
		emptyText: "<div>Debe seleccionar un pedido.</div>",
		itemTpl: "<div><table width=\"100%\"><tr><td width=\"15%\">{item}</td><td width=\"75%\">{material}</td><td width=\"10%\">{cantidad}</td></tr></table></div>",
		items: [{
		    xtype: 'toolbar',
		    docked: 'top',
		    layout: {
		    	type: 'hbox',
		    	pack: 'center'
		    },
		    items:[{
		        xtype: 'button',
		        text: 'Volver',
			ui: 'back',
			itemId: "volverBtn",
		        flex: 0.5
		    },{
		        xtype: 'label',
		        html: 'Item',
		        flex: 1
		    },{
		        xtype: 'label',
		        align: 'center',
		        html: 'Producto',
		        flex: 8
		    },{
		        xtype: 'label',
		        html: 'Cantidad',
		        flex: 1
		    }]
	    	}]
	    }]
        }],
        listeners: [{
            delegate: "#camionesList",
            event: "select",
            fn: "onCamionSelect"
        },{
            delegate: "#pedidosList",
            event: "select",
            fn: "onPedidoSelect"
        },{
            delegate: "#verDetalleBtn",
            event: "tap",
            fn: "onVerDetalleTap"
        },{
            delegate: "#volverBtn",
            event: "tap",
            fn: "onVolverTap"
        }]
    },    
    onCamionSelect: function (lista, rec, eOpts) {
        console.log("Camion Seleccionado");
        this.fireEvent("camionSeleccionadoEvent", this, rec);
    },
    onPedidoSelect: function ( lista, rec, eOpts) {
        console.log("Pedido seleccionado");
        this.fireEvent("pedidoSeleccionadoEvent", this, rec);
    },
    onVerDetalleTap: function ( btn, ev, eOpts) {
        this.fireEvent("verDetalleEvent", this, btn);
    } ,
    onVolverTap: function ( btn, ev, eOpts) {
        this.fireEvent("volverEvent", this, btn);
    }    
});

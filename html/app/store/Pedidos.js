Ext.define("CustomersApp.store.Pedidos", {
    extend: "Ext.data.Store",
    config: {
        model: "CustomersApp.model.Pedido",
	autoLoad: true,
	data: [{
		id: 1000,
		direccion: 'Providencia 1000, Santiago, Chile',
		estado: 'Entregado',
		camionId: 1,
		detalles: [
			{ item: 1, material: "Producto 1", cantidad: 10 },
			{ item: 2, material: "Producto 2", cantidad: 4 },
			{ item: 3, material: "Producto 3", cantidad: 23 }
		]
	},{
		id: 1001,
		direccion: 'Providencia 1500, Santiago, Chile',
		estado: 'Pendiente',
		camionId: 1,
		detalles: [
			{ item: 1, material: "Producto 1", cantidad: 10 },
			{ item: 2, material: "Producto 2", cantidad: 4 },
			{ item: 3, material: "Producto 3", cantidad: 23 }
		]
	},{
		id: 1002,
		direccion: 'Providencia 2100, Santiago, Chile',
		estado: 'Pendiente',
		camionId: 1,
		detalles: [
			{ item: 1, material: "Producto 1", cantidad: 10 },
			{ item: 2, material: "Producto 2", cantidad: 4 },
			{ item: 3, material: "Producto 3", cantidad: 23 }
		]
	},{
		id: 2000,
		direccion: 'Apoquindo 3000, Santiago, Chile',
		estado: 'Entregado',
		camionId: 2,
		detalles: [
			{ item: 1, material: "Producto 1", cantidad: 10 },
			{ item: 2, material: "Producto 2", cantidad: 4 },
			{ item: 3, material: "Producto 3", cantidad: 23 }
		] 
	},{
		id: 2001,
		direccion: 'Apoquindo 5000, Santiago, Chile',
		estado: 'Pendiente',
		camionId: 2,
		detalles: [
			{ item: 1, material: "Producto 1", cantidad: 10 },
			{ item: 2, material: "Producto 2", cantidad: 4 },
			{ item: 3, material: "Producto 3", cantidad: 23 }
		] 
	},{
		id: 2002,
		direccion: 'Apoquindo 6000, Santiago, Chile',
		estado: 'Pendiente',
		camionId: 2,
		detalles: [
			{ item: 1, material: "Producto 1", cantidad: 10 },
			{ item: 2, material: "Producto 2", cantidad: 4 },
			{ item: 3, material: "Producto 3", cantidad: 23 }
		] 
	},{
		id: 3000,
		direccion: 'Tobalaba 701, Santiago, Chile',
		estado: 'Entregado',
		camionId: 3,
		detalles: [
			{ item: 1, material: "Producto 1", cantidad: 10 },
			{ item: 2, material: "Producto 2", cantidad: 4 },
			{ item: 3, material: "Producto 3", cantidad: 23 }
		] 
	},{
		id: 3001,
		direccion: 'Tobalaba 1503, Santiago, Chile',
		estado: 'Pendiente',
		camionId: 3,
		detalles: [
			{ item: 1, material: "Producto 1", cantidad: 10 },
			{ item: 2, material: "Producto 2", cantidad: 4 },
			{ item: 3, material: "Producto 3", cantidad: 23 }
		] 
	},{
		id: 3002,
		direccion: 'Tobalaba 2005, Santiago, Chile',
		estado: 'Pendiente',
		camionId: 3,
		detalles: [
			{ item: 1, material: "Producto 1", cantidad: 10 },
			{ item: 2, material: "Producto 2", cantidad: 4 },
			{ item: 3, material: "Producto 3", cantidad: 23 }
		] 
	}],
	filters: [{ property: 'camionId', value: 0}]
    }
});

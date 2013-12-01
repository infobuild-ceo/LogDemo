Ext.define("CustomersApp.store.Camiones", {
    extend: "Ext.data.Store",
    config: {
        model: "CustomersApp.model.Camion",
	autoLoad: true,
	data: [{
		id: 1,
		patente: 'AA0001',
		tipo: 'Tipo 1',
		chofer: 'Juan Perez',
		lat: -33.434593,
		lon: -70.627588 
	},{
		id: 2,
		patente: 'BB0002',
		tipo: 'Tipo 2',
		chofer: 'Pedro Cardenas',
		lat: -33.407979,
		lon: -70.563966
	},{
		id: 3,
		patente: 'CC0001',
		tipo: 'Tipo 1',
		chofer: 'Samuel Villarroel',
		lat: -33.434306,
		lon: -70.581969
	}]
    }
});

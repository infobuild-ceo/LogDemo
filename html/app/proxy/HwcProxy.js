/**
 * @author Raman Sethi (ra.sethi@sap.com)
 *
 * HwcProxy is simply a proxy to propogate CRUD calls from Sencha application to HWC runtime   
 * It calls the MBOs CRUD generated in Workflow.js and handles data binding with Sencha components.  
 * 
 */

Ext.define('Ext.data.proxy.HwcProxy', {
    extend: 'Ext.data.proxy.Client', // Extend from the client proxy 
    alias: 'proxy.HwcProxy',
    alternateClassName: 'proxy.HwcProxy',

    	// Strings used to construct keys for CRUD operation
    	createKey: '{0}_create_{1}_paramKey', 
    	readKey: '{0}_{1}_attribKey',
    	updateKey: '{0}_{1}_attribKey',
    	deleteKey: '{0}_{1}_attribKey',
    	oldValKey: '_old.{0}.{1}',
        batchOrder: 'create,update,destroy',
        batchActions: true,
        
        // contructor method that takes arguments. The config contains the MBO name
	    constructor: function(args) {
			var me = this;
	        me.mboconfig = args.mboconfig;
		},
    	
		// Overiding batch() to overcome bug 
		// See http://www.sencha.com/forum/showthread.php?157356-Ext.data.Store-CRUD-operations-fail-for-remote-store
		batch: function(options, listeners) {
	        var me = this,
	            useBatch = me.batchActions,
	            model = this.getModel(),
	            batch,
	            records;

	        if (options.operations === undefined) {
	            // the old-style (operations, listeners) signature was called
	            // so convert to the single options argument syntax
	            options = {
	                operations: options,
	                batch: {
	                    listeners: listeners
	                }
	            };

	            // <debug warn>
	            Ext.Logger.deprecate('Passes old-style signature to Proxy.batch (operations, listeners). Please convert to single options argument syntax.');
	            // </debug>
	        }

	        if (options.batch) {
	             if (options.batch.isBatch) {
	                 options.batch.setProxy(me);
	             } else {
	                 options.batch.proxy = me;
	             }
	        } else {
	             options.batch = {
	                 proxy: me,
	                 listeners: options.listeners || {}
	             };
	        }

	        if (!batch) {
	            batch = new Ext.data.Batch(options.batch);
	        }

	        batch.on('complete', Ext.bind(me.onBatchComplete, me, [options], 0));

	        Ext.each(me.batchOrder.split(','), function(action) {
	             records = options.operations[action];
	             if (records) {
	                 if (useBatch) {
	                     batch.add(new Ext.data.Operation({
	                         action: action,
	                         records: records,
	                         model: model
	                     }));
	                 } else {
	                     Ext.each(records, function(record) {
	                         batch.add(new Ext.data.Operation({
	                             action : action,
	                             records: [record],
	                             model: model
	                         }));
	                     });
	                 }
	             }
	        }, me);

	        batch.start();
	        return batch;
		 },

	    // create method for proxy
        create: function(operation, callback, scope) {

      	  	//init a workflow message 
        	workflowMessage = new WorkflowMessage("");

            var records = operation.getRecords(),
            length  = records.length,
            thisProxy = this,
            id, record, i, mvc;

            // mark operation as started
            operation.setStarted();

            // Iterate over the newly created records 
	        for (i = 0; i < length; i++) {
	            record = records[i];
	            record.data.id = '' + record.data.id;
	
	            if (record.phantom) {
	            	// unset the phantom flag
	                record.phantom = false;
	                // call private helper method to prepare workflowMessage
		            thisProxy.createRecord(record);
	            }
	        }

			// call the proxy create function that in turn calls the create operation on MBO
			proxy_createfn(function() { 
                operation.setSuccessful();
                operation.setCompleted();
	            if (typeof callback === 'function') {
	                callback.call(scope || thisProxy, operation);
	            }
			});

        },
        
	    // read method for proxy
        read: function(operation, callback, scope) {

	        var records    = [],
	            model      = this.getModel(),
	            idProperty = model.getIdProperty(),
	            params     = operation.getParams() || {},
	            i, record;

        	var thisProxy = this;
        	
      	  	//init a workflow message 
            workflowMessage = new WorkflowMessage("");

            // mark operation as started
	   		operation.setStarted();

	   		// invoke the Workflow.js method to retrieve data
       		proxy_readfn(
       			function(incomingWorkflowMessage) 
       			{
       				var mvc = getCurrentMessageValueCollection();
       			    var itemList = mvc.getData(thisProxy.mboconfig.mboName).getValue();
       			    
       			    // parse record at a time to build the collection 
		            for (var i = 0; i < itemList.length; i++) {
						var record = thisProxy.parseRecord(itemList[i]);
						records.push(record);
		        	}

		            // Set the resultset 
			        operation.setResultSet(Ext.create('Ext.data.ResultSet', {
			            records: records,
			            total  : records.length
			        }));

	                //announce success
	                operation.setSuccessful();
	                operation.setCompleted();
	                //finish with callback
	                if (typeof callback == "function") {
	                    callback.call(scope || thisProxy, operation);
	                }
				});
				
		},
		
		// Update method for the proxy
	    update: function(operation, callback, scope) {
        	//init a workflow message and mark operation as started
            workflowMessage = new WorkflowMessage("");

            var records = operation.getRecords(),
            length  = records.length,
            thisProxy = this,
            id, record, i, mvc;

            // mark operation as started
            operation.setStarted();

	        for (i = 0; i < length; i++) {
	            record = records[i];

	            // Note: workaround to avoid double firing of update event in HWC
	            record.dirty = false;
		        
	            thisProxy.updateRecord(record);
	        }

	        // call update method on MBO in Workflow.js
			proxy_updatefn(function() { 
                operation.setSuccessful();
                operation.setCompleted();
	            if (typeof callback === 'function') {
	                callback.call(scope || thisProxy, operation);
	            }
			});

        },
        
		// Delete method for the proxy
        destroy: function(operation, callback, scope) {
        	//init a workflow message and mark operation as started
            workflowMessage = new WorkflowMessage("");

            var records = operation.getRecords(),
            length  = records.length,
            thisProxy = this,
            id, record, i, mvc;

            // mark operation as started
            operation.setStarted();

	        for (i = 0; i < length; i++) {
	            record = records[i];
		        
	            // workaround to avoid double firing of update event in HWC
	            record.dirty = false;

	            // call helper method to prepare workflowMessage object before HWC call
	            thisProxy.updateRecord(record);
	        }

	        // call the delete method in Workflow.js
			proxy_deletefn(function() { 
                operation.setSuccessful();
                operation.setCompleted();
	            if (typeof callback === 'function') {
	                callback.call(scope || thisProxy, operation);
	            }
			});
        },
	    
        // Helper method to parse the record returned by SUP server
        parseRecord: function(hwcItem) {
           var thisProxy = this,
           data    = {},
           Model   = thisProxy.getModel(),
           fields  = Model.getFields().items,
           length  = fields.length,
           idProperty = Model.getIdProperty(),
           i, field, name, record, rawData, dateFormat, rdkey, idVal, idKey;

           if (!hwcItem) {
               return;
           }

           // Parse the record by validating it against the schema
           for (i = 0; i < length; i++) {
               field = fields[i];
               name  = field.getName();  
	           rdkey = thisProxy.readKey.format(thisProxy.mboconfig.mboName, name); 
			   data[name] = hwcItem.getData(rdkey).getValue(); 
           }

           // create the Sencha record and return it
           record = new Model(data);
		   return record; 
        },
        
        // Helper method for create a record
        createRecord: function(senchaRecord) {
            var thisProxy = this,
            Model   = thisProxy.getModel(),
            fields  = Model.getFields().items,
            length  = fields.length,
            mvc = getWorkflowMessage().getValues(),
            data = senchaRecord.getData(),
            i, field, name, rawData, dateFormat, createkey, mv;

            // Use Model to prepare the MessageValueCollection for HWC's create operation
            for (i = 0; i < length; i++) {
               field = fields[i];
               name  = field.getName();  
               createkey = thisProxy.createKey.format(thisProxy.mboconfig.mboName, name); 
			   mv = thisProxy.createMessageValue(data[name], createkey, thisProxy.hwcType(field.getType().type));
			   mvc.add(mv.getKey(), mv);
            }
         },

         updateRecord: function(senchaRecord) {
             var thisProxy = this,
             Model   = thisProxy.getModel(),
             fields  = Model.getFields().items,
             length  = fields.length,
             mvc = getWorkflowMessage().getValues(),
             data = senchaRecord.getData(),
             // Use the old_record to send old values of the record
			 oldData = old_record.getData(),
             i, field, name, rawData, dateFormat, updkey, oldKey, mv, mv2;

             // Use Model to prepare the MessageValueCollection for HWC's update operation
             for (i = 0; i < length; i++) {
               field = fields[i];
               name  = field.getName();
               
               updkey = thisProxy.updateKey.format(thisProxy.mboconfig.mboName, name); 
 			   mv = thisProxy.createMessageValue(data[name], updkey, thisProxy.hwcType(field.getType().type));
 			   mvc.add(mv.getKey(), mv);

 			   // Send the old value of the record
 			   oldKey = thisProxy.oldValKey.format(thisProxy.mboconfig.mboName, name); 
 			   mv2 = thisProxy.createMessageValue(oldData[name], oldKey, thisProxy.hwcType(field.getType().type));
 			   mvc.add(mv2.getKey(), mv2);
             }
             
  	       //idKey = thisProxy.readKey.format(thisProxy.mboconfig.mboName, idProperty);

          },
        
         // Helper method to create MessageValue pair (see WorkflowMessage.js for details)
         createMessageValue: function(value, key, type) {
             var mv = new MessageValue();
             mv.setValue(value);
             mv.setKey(key);
             mv.setType(type);
             return mv;
         },
         
         // Helper method to map HWC data type to Sencha data type
         hwcType: function(senchaType) {
         	if(senchaType == 'string')
         		return "TEXT";
         	else if(senchaType == 'int' || senchaType == 'auto' ) 
         		return "NUMBER";
         	else if(senchaType == 'date') 
         		return "DATETIME";
         	else if(senchaType == 'booolean') 
         		return "BOOLEAN";
         	else return null;
         }

         

});

String.prototype.format = function(i, safe, arg) {

	  function format() {
	    var str = this, len = arguments.length+1;

	    // For each {0} {1} {n...} replace with the argument in that position.  If 
	    // the argument is an object or an array it will be stringified to JSON.
	    for (i=0; i < len; arg = arguments[i++]) {
	      safe = typeof arg === 'object' ? JSON.stringify(arg) : arg;
	      str = str.replace(RegExp('\\{'+(i-1)+'\\}', 'g'), safe);
	    }
	    return str;
	  }

	  // Save a reference of what may already exist under the property native.  
	  // Allows for doing something like: if("".format.native) { /* use native */ }
	  format.native = String.prototype.format;

	  // Replace the prototype property
	  return format;

}();

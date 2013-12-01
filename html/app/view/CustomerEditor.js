Ext.define("CustomersApp.view.CustomerEditor", {
    extend: "Ext.form.Panel",
    requires: "Ext.form.FieldSet",
    alias: "widget.customereditorview",
    config: {
        scrollable: 'vertical',
        items: [
            {
                xtype: "toolbar",
                docked: "top",
                title: "Edit Customer",
                items: [
                    {
                        xtype: "button",
                        ui: "back",
                        text: "Home",
                        itemId: "backButton"
                    },
                    { xtype: "spacer" },
                    {
                        xtype: "button",
                        ui: "action",
                        text: "Save",
                        itemId: "saveButton"
                    }
                ]
            },
            { 
                xtype: "panel",
                height: 20,
                docked: "bottom",
                html: "iOS PhoneGap workaround."
            },            
            {
                xtype: "toolbar",
                docked: "bottom",
                items: [
                    {
                        xtype: "button",
                        iconCls: "trash",
                        iconMask: true,
                        itemId: "deleteButton"
                    }
                ]
            },
            { xtype: "fieldset",
                items: [
                    {
                        xtype: 'textfield',
                        name: 'company_name',
                        label: 'Company',
                        required: true
                    },
                    {
                        xtype: 'textfield',
                        name: 'state',
                        label: 'State',
                        required: true
                    }
                ]
            }
        ],
        listeners: [
            {
                delegate: "#backButton",
                event: "tap",
                fn: "onBackButtonTap"
            },
            {
                delegate: "#saveButton",
                event: "tap",
                fn: "onSaveButtonTap"
            },
            {
                delegate: "#deleteButton",
                event: "tap",
                fn: "onDeleteButtonTap"
            }
        ]
    },
    onSaveButtonTap: function () {
        console.log("saveCustomerCommand");
        this.fireEvent("saveCustomerCommand", this);
    },
    onDeleteButtonTap: function () {
        console.log("deleteCustomerCommand");
        this.fireEvent("deleteCustomerCommand", this);
    },
    onBackButtonTap: function () {
        console.log("backToHomeCommand");
        this.fireEvent("backToHomeCommand", this);
    }

});


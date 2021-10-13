sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel",
		"sap/m/MessageToast",
		"sap/m/MessageBox",
	],
	function (Controller, JSONModel, MessageToast, MessageBox) {
		"use strict";

		return Controller.extend("suppliers.app.controller.FirstPage", {
			onInit: function () {
				this.oAppViewModel = new JSONModel({
					edit: false,
				});

				this.getView().setModel(this.oAppViewModel, "appView");
			},

			onEditPress: function () {
				this.oAppViewModel.setProperty("/edit", true);
			},

			onSavePress: function () {
				this.oAppViewModel.setProperty("/edit", false);

				var oODataModel = this.getView().getModel("odata");

				oODataModel.submitChanges();
			},

			onCancelPress: function () {
				this.oAppViewModel.setProperty("/edit", false);

				var oODataModel = this.getView().getModel("odata");

				oODataModel.resetChanges();
			},

			onDeleteSupplierPress: function (oEvent) {
				var oCtx = oEvent.getSource().getBindingContext("odata");
				var oODataModel = oCtx.getModel();
				var sKey = oODataModel.createKey("/Suppliers", oCtx.getObject());

				MessageBox.confirm("Are you sure you want to delete this supplier?", {
					actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
					onClose: function (oAction) {
						if (oAction === "OK") {
							oODataModel.remove(sKey, {
								success: function () {
									MessageToast.show("Supplier was successfully deleted!");
								},
								error: function () {
									MessageBox.error("Error while removing supplier!");
								},
							});
						}
					},
				});
			},

			onCreateSupplierPress: function () {
				var oView = this.getView();

				var oODataModel = oView.getModel("odata");

				if (!this.oDialog) {
					this.oDialog = sap.ui.xmlfragment(
						oView.getId(),
						"suppliers.app.view.fragments.SupplierDialog",
						this
					);

					oView.addDependent(this.oDialog);
				}

				var oEntryCtx = oODataModel.createEntry("/Suppliers", {
					properties: {
						ID: new Date().getTime().toString().slice(11),
					},
				});

				this.oDialog.setBindingContext(oEntryCtx);
				this.oDialog.setModel(oODataModel);
				this.oDialog.open();
			},

			onDialogCreatePress: function () {
				var oODataModel = this.getView().getModel("odata");

				oODataModel.submitChanges();

				this.oDialog.close();
			},

			onDialogCancelPress: function () {
				var oODataModel = this.getView().getModel("odata");

				var oCtx = this.oDialog.getBindingContext();

				oODataModel.deleteCreatedEntry(oCtx);

				this.oDialog.close();
			},

			onOpenSupplierProductsPage: function (oEvent) {
				var oSelectedSupplier = oEvent.getSource();
				var oCtx = oSelectedSupplier.getBindingContext("odata");

				this.getOwnerComponent()
					.getRouter()
					.navTo("SupplierProducts", { supplierId: oCtx.getObject("ID") });
			},
		});
	}
);

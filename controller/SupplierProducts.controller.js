sap.ui.define(
	["sap/ui/core/mvc/Controller", "sap/ui/core/routing/History"],
	function (Controller, History) {
		"use strict";

		return Controller.extend("suppliers.app.controller.SupplierProducts", {
			onInit: function () {
				this.getOwnerComponent()
					.getRouter()
					.getRoute("SupplierProducts")
					.attachPatternMatched(this.onPatternMatched, this);
			},

			onAfterRendering: function () {
				var oODataModel = this.getView().getModel("odata");
				var oProductsTable = this.byId("ProductsTable");
				var oBinding = oProductsTable.getBinding("items");

				oBinding.attachDataReceived(function () {
					var oCtx = oProductsTable.getBindingContext("odata");
					var sStoresPath = oODataModel.createKey(
						"/Suppliers",
						oCtx.getObject()
					);
				});
			},

			onPatternMatched: function (oEvent) {
				var that = this;
				var mRouteArguments = oEvent.getParameter("arguments");
				var sSupplierID = mRouteArguments.supplierId;
				var oODataModel = this.getView().getModel("odata");

				oODataModel.metadataLoaded().then(function () {
					var sKey = oODataModel.createKey("/Suppliers", { ID: sSupplierID });
					that.getView().bindObject({
						path: sKey,
						model: "odata",
					});
				});
			},

			onNavBack: function () {
				var oHistory, sPreviousHash;

				oHistory = History.getInstance();
				sPreviousHash = oHistory.getPreviousHash();

				if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {
					this.getRouter().navTo("Home", {}, true);
				}
			},
		});
	}
);

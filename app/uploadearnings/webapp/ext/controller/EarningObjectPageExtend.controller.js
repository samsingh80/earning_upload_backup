sap.ui.define(['sap/ui/core/mvc/ControllerExtension', "sap/ui/model/json/JSONModel",], function (ControllerExtension, JSONModel) {
	'use strict';

	return ControllerExtension.extend('com.scb.uploadearnings.ext.controller.EarningObjectPageExtend', {
		// this section allows to extend lifecycle hooks or hooks provided by Fiori elements
		override: {
			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 * @memberOf com.scb.uploadearnings.ext.controller.EarningObjectPageExtend
			 */
			onAfterRendering: function () {

				const additionalUrl = this.base.editFlow.getAppComponent()._componentConfig?.url?.slice(0, -1);
				const additionalModel = new JSONModel({
					additionalUrl: additionalUrl || ""
				});
				this.getView().setModel(additionalModel, "configs");
			},
			onNavButtonPress: function () {
				const oHistory = History.getInstance();
				const sPreviousHash = oHistory.getPreviousHash();
		  
				if (sPreviousHash !== undefined) {
				  window.history.go(-1);
				} else {
				  this.getAppComponent().getRouter().navTo("EarningFilesList", {}, true);
				}
			  }
		}
	});
});

sap.ui.define([
	"miningIOT/MiningIOT/controller/BaseController",
	"sap/ui/core/routing/History"
], function (BaseController, History) {
	"use strict";

	return BaseController.extend("miningIOT.MiningIOT.controller.DetailVibrationView", {
		
		formatNotificationLink: function(sNotificationNumber) {
			if(sNotificationNumber !== "") {
				return "https://" + 
				       "ldcisd4.wdf.sap.corp:44302/sap/bc/ui2/flp?sap-client=001&sap-language=EN#MaintenanceNotification-displayFactSheet&//C_ObjPgMaintNotification('" + 
				       sNotificationNumber + "')";
			}
		},
		
		/**
		 * Function to use back navigation to worklist page
		 * @public
		 */
		onNavBack: function(oEvent) {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("OverView", true);
			}
		}
	});

});
sap.ui.define([
	"miningIOT/MiningIOT/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("miningIOT.MiningIOT.controller.Main", {
		
		OnSCPTilePress : function(oEvent) {
			this.getRouter().navTo("OverView", {});
		}
	});
});
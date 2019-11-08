sap.ui.define([
	"miningIOT/MiningIOT/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function (BaseController, Filter, FilterOperator, MessageBox, MessageToast) {
	"use strict";

	return BaseController.extend("miningIOT.MiningIOT.controller.OverView", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf miningIOT.MiningIOT.view.OverView
		 */
		onInit: function () {
			var oVibrationSensorModel = new sap.ui.model.json.JSONModel();
			
			var aSensors = [{
				"Sensor": "MySensor"
			},{
				"Sensor": "MySensorMQ"
			}];
			
			var aMachines = [{
				"Machine": "Air Compressor"
			},{
				"Machine": "Generator-CHP"
			},{
				"Machine": "Water Pumps"
			}];
			
			var aStatus = [{
				"Status": "Healthy"
			},{
				"Status": "Critical"
			}];
			
			var aSearchColumns = ["MachineName", "Location", "Status", "OrderId"]; 
			
			var aUIFixedSensorData = [{
				"SensorId": "7512a84c-8c46-4c8d-9ea7-5886b2e8cdf4",
				"MachineId": "af6e1ca8-6b35-4398-8abb-fcf0b4e84613",
				"EquipmentNumber": "",
				"SensorName": "",
				"MachineName": "",
				"Location": "Point Impossible Beach, Victoria, Australia",
				"VibrationSpeed": "",
				"TimeStamp": "",
				"Threshold": 0.55,
				"MaxSpeed": 2,
				"Delta": 10,
				"Status": "Healthy",
				"IsMaintainanceOrder": "",
				"OrderId": "",
				"InstallationTime": new Date(1523970000000),
				"Make": "HJR-493",
				"Model": "2007",           
				"Data": []
			},{
				"SensorId": "7d23b5db-2cd0-4c1e-b6df-633fdc5bd420",
				"MachineId": "3dbdb0d8-3b8a-482b-b299-2f18347a8d5d",
				"EquipmentNumber": "",
				"SensorName": "",
				"MachineName": "",
				"Location": "Anglesea Mine, Victoria, Australia",
				"VibrationSpeed": "",
				"TimeStamp": "",
				"Threshold": 0.55,
				"MaxSpeed": 2,
				"Delta": 10,
				"Status": "Healthy",
				"IsMaintainanceOrder": "",
				"OrderId": "",
				"InstallationTime": new Date(1533970000000),
				"Make": "TSR-123",
				"Model": "2005",
				"Data": []
			},{
				"SensorId": "9916fd43-b079-4a81-83d5-c7276cf597c4",
				"MachineId": "9a86ec06-3764-44b4-bfcc-78a45ee317da",
				"EquipmentNumber": "",
				"SensorName": "",
				"MachineName": "",
				"Location": "Torquay VIC 3228, Australia",
				"VibrationSpeed": "",
				"TimeStamp": "",
				"Threshold": 0.55,
				"MaxSpeed": 2,
				"Delta": 10,
				"Status": "Healthy",
				"IsMaintainanceOrder": "",
				"OrderId": "",
				"InstallationTime": new Date(1543970000000),
				"Make": "ISD-968",
				"Model": "2009",
				"Data": []
			}];
			
			oVibrationSensorModel.setProperty("/Sensor", jQuery.extend(true, [], aSensors));
			oVibrationSensorModel.setProperty("/Machine", jQuery.extend(true, [], aMachines));
			oVibrationSensorModel.setProperty("/Status", jQuery.extend(true, [], aStatus));
			oVibrationSensorModel.setProperty("/SearchColumn", jQuery.extend(true, [], aSearchColumns));
			oVibrationSensorModel.setProperty("/UIFixedSensorData", jQuery.extend(true, [], aUIFixedSensorData));
			oVibrationSensorModel.setProperty("/SelectedVibrationSensor", {});
			
			this.getOwnerComponent().setModel(oVibrationSensorModel, "VibrationSensorModel");
			
			this.getSCPData();
		},
		
		onExit:function() {
		    if (this.intervalHandle) {
				clearInterval(this.intervalHandle);
		    }
		}, 
		
		onAfterRendering: function() {
			var oMyOptions = {zoom:12,
			                 center:new google.maps.LatLng(20,77),
			                 mapTypeId: google.maps.MapTypeId.ROADMAP
			                 };
			var oMap = new google.maps.Map(this.getView().byId("idGoogleMapTrial").getDomRef(), oMyOptions);
			
			var oMarker1 = new google.maps.Marker({map: oMap,
											 position: new google.maps.LatLng(-38.3860094, 144.1810526)
			});
			
			var oMarker2 = new google.maps.Marker({map: oMap,
				                             position: new google.maps.LatLng(-38.3122321,144.3629695)
			});
			
			var oMarker3 = new google.maps.Marker({map: oMap,
				                             position: new google.maps.LatLng(-38.3192143,144.3210314)
			});
			
			var oInfowindow1 = new google.maps.InfoWindow({content:'<strong></strong><br>Generator-CHP<br>'});
	        oInfowindow1.open(oMap, oMarker1);
	        
	        var oInfowindow2 = new google.maps.InfoWindow({content:'<strong></strong><br>Air Compressor<br>'});
	        oInfowindow2.open(oMap, oMarker2);
	        
	        var oInfowindow3 = new google.maps.InfoWindow({content:'<strong></strong><br>Water Pumps<br>'});
	        oInfowindow3.open(oMap, oMarker3);
		},
		
		getSCPData: function() {
			jQuery.ajax({
                type: "GET",
                contentType: "application/json",
                crossDomain: true,
                url: "/mining/4ec5ecac-dc28-4411-83d5-7f3377a7790c/iot/cockpit/core/tenant/590260208/devices",
                xhrFields: {
                    withCredentials: true
                },
                username: "root",
                password: "wZDBqZjh6AL4GXB",
                dataType: "json",
                async: false,
                success: function (data, textStatus, jqXHR) {
                	this.getOwnerComponent().getModel("VibrationSensorModel").setProperty("/ServerIOTDevices", jQuery.extend(true, [], data));
                	
                    jQuery.ajax({
		                type: "GET",
		                contentType: "application/json",
		                crossDomain: true,
		                url:  "/mining/iot/processing/api/v1/tenant/590260208/measures/capabilities/9de0d630-5d08-46d6-b97c-29a558de820a?top=250&orderby=timestamp%20desc",
		                 //url: "https://ibso-iot-services-poc.leonardo-iot.cfapps.eu10.hana.ondemand.com/comsapleonardoiot.iotuithingmodelerodata/appiot-mds/Things('4F88162A2BC542E78EA7EE6695F59B9D')/ibso.iotservicespoc.mining.demo:VibrationType/VibrationThingDemo?timerange=3M",
		                xhrFields: {
		                    withCredentials: true
		                },
		                username: "root",
		                password: "wZDBqZjh6AL4GXB",
		                dataType: "json",
		                async: false,
		                success: function (data, textStatus, jqXHR) {
		                    this.getOwnerComponent().getModel("VibrationSensorModel").setProperty("/ServerIOTData", jQuery.extend(true, [], data));
		                    this.getOwnerComponent().getModel().read("/EquipNotifSet", {success: function(oData) {
		                    	this.getOwnerComponent().getModel("VibrationSensorModel").setProperty("/NotificationData", oData.results);
				            	this.modifyServerData();
				            }.bind(this)});
		                }.bind(this),
		                error: function (oError) {
		                    console.log(oError);
		                }.bind(this)
					});
                }.bind(this),
                error: function (oError) {
                    console.log(oError);
                }.bind(this)
			});
		},
		
		modifyServerData: function() {
			var oVibrationSensorModel = this.getOwnerComponent().getModel("VibrationSensorModel");
			var aIOTDevices = jQuery.extend(true, [], oVibrationSensorModel.getProperty("/ServerIOTDevices")); 
			var aIOTData = jQuery.extend(true, [], oVibrationSensorModel.getProperty("/ServerIOTData")); 
			var aUIFixedSensorData = jQuery.extend(true, [], oVibrationSensorModel.getProperty("/UIFixedSensorData"));
			var aNotificationData = jQuery.extend(true, [], oVibrationSensorModel.getProperty("/NotificationData"));
			var aSensors = [];
			var oSensor = {};
			var aMatchedNotifications = [];
			
			for (var intI = 0; intI < aIOTDevices.length; intI++) {
				for (var intJ = 0; intJ < aIOTDevices[intI].sensors.length; intJ++) {
					oSensor = aIOTDevices[intI].sensors[intJ];
				}
				oSensor.deviceName = aIOTDevices[intI].name;
				aSensors.push(oSensor);
				oSensor = {};
			}
			
			for (var intM = 0; intM < aSensors.length; intM++) {
				aSensors[intM].Data = aIOTData.filter(function(oIOTData) {
					return oIOTData.sensorId === aSensors[intM].id;
				});
			}
			
			for (var intK = 0; intK < aUIFixedSensorData.length; intK++) {
				for (var intL = 0; intL < aSensors.length; intL++) {
					if(aSensors[intL].id === aUIFixedSensorData[intK].SensorId) {
						aUIFixedSensorData[intK].SensorName  = aSensors[intL].name;
						aUIFixedSensorData[intK].MachineName  = aSensors[intL].deviceName;
						if(aSensors[intL].Data.length > 0) {
							aUIFixedSensorData[intK].VibrationSpeed = aSensors[intL].Data[0].measure.maxvib;
						    aUIFixedSensorData[intK].TimeStamp = new Date(aSensors[intL].Data[0].timestamp);
						    for (var intN = 0; intN < aSensors[intL].Data.length; intN++) {
						    	aSensors[intL].Data[intN].timestamp = new Date(aSensors[intL].Data[intN].timestamp);
						    }
						} else {
							aUIFixedSensorData[intK].VibrationSpeed = "";
						    aUIFixedSensorData[intK].TimeStamp = "";
						}
						aUIFixedSensorData[intK].Data = aSensors[intL].Data;
					}
				}
			}
			
			for (var intS = 0; intS < aUIFixedSensorData.length; intS++) {
				aNotificationData.filter(function(oNotificationData) {
					if(oNotificationData.Eqktx === aUIFixedSensorData[intS].MachineName) {
						if(oNotificationData.Qmnum !== "") {
							aUIFixedSensorData[intS].OrderId = oNotificationData.Qmnum;
							aUIFixedSensorData[intS].Status = "Critical";
							aUIFixedSensorData[intS].IsMaintainanceOrder = "false";
						}
						aUIFixedSensorData[intS].EquipmentNumber = oNotificationData.Equnr;
					}
				});
			}
			
			for (var intR = 0; intR < aUIFixedSensorData.length; intR++) {
                if(aUIFixedSensorData[intJ].VibrationSpeed !== "" && 
                                                (aUIFixedSensorData[intR].VibrationSpeed < 2 || aUIFixedSensorData[intR].VibrationSpeed > 7)) {
                                aUIFixedSensorData[intR].Status = "Critical";
                } else {
                                aUIFixedSensorData[intR].Status = "Healthy";
                }
		    }
			
			oVibrationSensorModel.setProperty("/UIFixedSensorData", jQuery.extend(true, [], aUIFixedSensorData));
			
			for (var intR = 0; intR < aUIFixedSensorData.length; intR++) {
				if(aUIFixedSensorData[intR].OrderId === "" && 
						(aUIFixedSensorData[intJ].VibrationSpeed !== "" && 
						(aUIFixedSensorData[intR].VibrationSpeed < 2 || aUIFixedSensorData[intR].VibrationSpeed > 7))) {
							
					this.maintainanceOrWorkOrder(aUIFixedSensorData[intR].EquipmentNumber);
				}
			}
			
		    oVibrationSensorModel.setProperty("/UIFixedSensorData", jQuery.extend(true, [], aUIFixedSensorData));
			
			this.updateModelData();
		},
		
		updateModelData: function() {
			var self = this;
				this.intervalHandle = setInterval(function() { 
				  self.refreshModelData();
			},  30000);
		},
		
		refreshModelData: function() {
			jQuery.ajax({
                type: "GET",
                contentType: "application/json",
                crossDomain: true,
                url: "/mining/iot/processing/api/v1/tenant/590260208/measures/capabilities/9de0d630-5d08-46d6-b97c-29a558de820a?top=250&orderby=timestamp%20desc",
                xhrFields: {
                    withCredentials: true
                },
                username: "root",
                password: "wZDBqZjh6AL4GXB",
                dataType: "json",
                async: false,
                success: function (data, textStatus, jqXHR) {
                    this.getOwnerComponent().getModel("VibrationSensorModel").setProperty("/ServerIOTData", jQuery.extend(true, [], data));
                    this.getOwnerComponent().getModel().read("/EquipNotifSet", {success: function(oData) {
                    	this.getOwnerComponent().getModel("VibrationSensorModel").setProperty("/NotificationData", oData.results);
		            	this.modifyDynamicallyRefreshedData();
		            }.bind(this)});
                }.bind(this),
                error: function (oError) {
                    console.log(oError);
                }.bind(this)
			});
		},
		
		modifyDynamicallyRefreshedData: function() {
			var oVibrationSensorModel = this.getOwnerComponent().getModel("VibrationSensorModel");
			var aIOTData = jQuery.extend(true, [], oVibrationSensorModel.getProperty("/ServerIOTData")); 
			var aUIFixedSensorData = jQuery.extend(true, [], oVibrationSensorModel.getProperty("/UIFixedSensorData"));
			var aParticularDeviceData = [];
			var aNotificationData = jQuery.extend(true, [], oVibrationSensorModel.getProperty("/NotificationData"));
			
			for (var intK = 0; intK < aIOTData.length; intK++) {
		    	aIOTData[intK].timestamp = new Date(aIOTData[intK].timestamp);
		    }
			
			for (var intI = 0; intI < aUIFixedSensorData.length; intI++) {
				aParticularDeviceData = [];
				aParticularDeviceData = aIOTData.filter(function(oIOTData) {
					return oIOTData.sensorId === aUIFixedSensorData[intI].SensorId;
				});
				
				aNotificationData.filter(function(oNotificationData) {
					if(oNotificationData.Eqktx === aUIFixedSensorData[intI].MachineName) {
						aUIFixedSensorData[intI].OrderId = oNotificationData.Qmnum;
						aUIFixedSensorData[intI].IsMaintainanceOrder = "false";
					}
				});
				
				aUIFixedSensorData[intI].Status = (aUIFixedSensorData[intI].OrderId !== "") ? "Critical" : "Healthy";
				aUIFixedSensorData[intI].Data = aParticularDeviceData;
				
				if(aParticularDeviceData.length > 0) {
					aUIFixedSensorData[intI].TimeStamp = new Date(aParticularDeviceData[0].timestamp);
					aUIFixedSensorData[intI].VibrationSpeed = aParticularDeviceData[0].measure.maxvib;
				} else {
					aUIFixedSensorData[intI].TimeStamp = "";
					aUIFixedSensorData[intI].VibrationSpeed = "";
				}
			}
			
			for (var intJ = 0; intJ < aUIFixedSensorData.length; intJ++) {
                if(aUIFixedSensorData[intJ].VibrationSpeed !== "" && 
                        (aUIFixedSensorData[intJ].VibrationSpeed < 2 || aUIFixedSensorData[intJ].VibrationSpeed > 7)) {
                    aUIFixedSensorData[intJ].Status = "Critical";
                } else {
                    aUIFixedSensorData[intJ].Status = "Healthy";
                }
            }
			
			oVibrationSensorModel.setProperty("/UIFixedSensorData", jQuery.extend(true, [], aUIFixedSensorData));
			
			if(!jQuery.isEmptyObject(oVibrationSensorModel.getProperty("/SelectedVibrationSensor"))) {
				var oSensorId = oVibrationSensorModel.getProperty("/SelectedVibrationSensor/SensorId");
				var iMatchIndex = this.findWithAttr(aUIFixedSensorData, "SensorId", oSensorId);
				var oUpdatedData = jQuery.extend(true, {}, aUIFixedSensorData[iMatchIndex]);
				
				oVibrationSensorModel.setProperty("/SelectedVibrationSensor", oUpdatedData);
			}
			
			// oVibrationSensorModel.setProperty("/UIFixedSensorData", jQuery.extend(true, [], aUIFixedSensorData));
			
			for (var intJ = 0; intJ < aUIFixedSensorData.length; intJ++) {
				if(aUIFixedSensorData[intJ].OrderId === "" && 
						(aUIFixedSensorData[intJ].VibrationSpeed !== "" && 
						(aUIFixedSensorData[intJ].VibrationSpeed < 2 || aUIFixedSensorData[intJ].VibrationSpeed > 7))) {
							
					
					this.maintainanceOrWorkOrder(aUIFixedSensorData[intJ].EquipmentNumber);
				}
				
			}
			
			oVibrationSensorModel.setProperty("/UIFixedSensorData", jQuery.extend(true, [], aUIFixedSensorData));
		},
		
		maintainanceOrWorkOrder: function(sEquipmentNumber) {
			this.getOwnerComponent().getModel().read(this.getOwnerComponent().getModel().createKey("/Maintenance_PlanSet", 
				{Equnr: sEquipmentNumber}), 
				{success: function(oData) {
					var sMachineName = this.getMachineName(oData.Equnr);
					
                	if(oData.Nplda && oData.Nplda.getTime() > 0) {
       //         		if(!sap.ui.getCore().byId("id" + sMachineName + "MaintainanceMessageBox")) {
       //         			MessageBox.show("Information", {
	      //          			id: "id" + sMachineName + "MaintainanceMessageBox",
							// 	icon: MessageBox.Icon.INFORMATION,
							// 	title: "Information",
							// 	details: "Maintenance order " + oData.Warpl + " for machine " + sMachineName + " is scheduled on " + oData.Nplda,
							// 	actions: [MessageBox.Action.OK]
							// });
       //         		} else {
       //         			//Do nothing
       //         		}
                		
                		// MessageToast.show("Maintenance order " + oData.Warpl + " for machine " + sMachineName + " is scheduled on " + oData.Nplda, {width: "60rem"});
                		this.updateMaintainanceOrder(oData);	
                	} else {
                		this.getOwnerComponent().getModel().create("/EquipNotifSet",
							{Equnr: oData.Equnr, Eqktx: sMachineName}, 
							{success: function(oResultData) {
		                    	this.updateWorkOrderData(oResultData);
			            	}.bind(this)
						});
                	}
            	}.bind(this)
			});
		},
		
		updateMaintainanceOrder: function(oData) {
			var oVibrationSensorModel = this.getOwnerComponent().getModel("VibrationSensorModel");
			var aUIFixedSensorData = jQuery.extend(true, [], oVibrationSensorModel.getProperty("/UIFixedSensorData"));
			var iMatchIndex = this.findWithAttr(aUIFixedSensorData, "EquipmentNumber", oData.Equnr);
			
			aUIFixedSensorData[iMatchIndex].Status = "Critical";
		    aUIFixedSensorData[iMatchIndex].OrderId = oData.Warpl;
		    aUIFixedSensorData[iMatchIndex].IsMaintainanceOrder = "true";
		    
		    oVibrationSensorModel.setProperty("/UIFixedSensorData", jQuery.extend(true, [], aUIFixedSensorData));
		    
		    if(!jQuery.isEmptyObject(oVibrationSensorModel.getProperty("/SelectedVibrationSensor"))) {
				var oSensorId = oVibrationSensorModel.getProperty("/SelectedVibrationSensor/SensorId");
				var iSensorIndex = this.findWithAttr(aUIFixedSensorData, "SensorId", oSensorId);
				var oUpdatedData = jQuery.extend(true, {}, aUIFixedSensorData[iSensorIndex]);
				
				oVibrationSensorModel.setProperty("/SelectedVibrationSensor", oUpdatedData);
			}
		},
		
		getMachineName: function(sEquipmentNumber) {
			var aUIFixedSensorData = jQuery.extend(true, [], this.getOwnerComponent().getModel("VibrationSensorModel").getProperty(
				"/UIFixedSensorData"));
			var iMatchIndex = this.findWithAttr(aUIFixedSensorData, "EquipmentNumber", sEquipmentNumber);
			
			return aUIFixedSensorData[iMatchIndex].MachineName;
		},
		
		updateWorkOrderData: function(oData) {
			var oVibrationSensorModel = this.getOwnerComponent().getModel("VibrationSensorModel");
			var aUIFixedSensorData = jQuery.extend(true, [], oVibrationSensorModel.getProperty("/UIFixedSensorData"));
			var iMatchIndex = this.findWithAttr(aUIFixedSensorData, "EquipmentNumber", oData.Equnr);
			
			aUIFixedSensorData[iMatchIndex].Status = "Critical";
		    aUIFixedSensorData[iMatchIndex].OrderId = oData.Qmnum;
		    aUIFixedSensorData[iMatchIndex].IsMaintainanceOrder = "false";
		    
		    oVibrationSensorModel.setProperty("/UIFixedSensorData", jQuery.extend(true, [], aUIFixedSensorData));
		    
		    if(!jQuery.isEmptyObject(oVibrationSensorModel.getProperty("/SelectedVibrationSensor"))) {
				var oSensorId = oVibrationSensorModel.getProperty("/SelectedVibrationSensor/SensorId");
				var iSensorIndex = this.findWithAttr(aUIFixedSensorData, "SensorId", oSensorId);
				var oUpdatedData = jQuery.extend(true, {}, aUIFixedSensorData[iSensorIndex]);
				
				oVibrationSensorModel.setProperty("/SelectedVibrationSensor", oUpdatedData);
			}
			
			// MessageToast.show("Notification " + oData.Qmnum + " is created for Device " + aUIFixedSensorData[iMatchIndex].MachineName, {width: "30rem"});
		},
		
		findWithAttr: function(aColumnList, sAttr, sValue) {
			for (var intI = 0; intI < aColumnList.length; intI += 1) {
				if (aColumnList[intI] && aColumnList[intI][sAttr] === sValue) {
					return intI;
				}
			}
			return -1;
		},
		
		formatBulletMicroChartGood1: function(iThreshold, iDelta) {
			return (Math.round((iThreshold - ((iThreshold * iDelta) / 100)) * 100) / 100);
		},
		
		formatBulletMicroChartGood2: function(iThreshold, iDelta) {
			return (Math.round((iThreshold + ((iThreshold * iDelta) / 100)) * 100) / 100);
		},
		
		formatBulletMicroChart: function(iVibrationSpeed) {
			if(iVibrationSpeed >= 2 && iVibrationSpeed < 7) {
				return "Good";
			} else {
				return "Critical";
			}
		},
		
		formatNotificationLink: function(sNotificationNumber) {
			if(sNotificationNumber !== "") {
				return "https://" + 
				       "ldcisd4.wdf.sap.corp:44302/sap/bc/ui2/flp?sap-client=001&sap-language=EN#MaintenanceNotification-displayFactSheet&//C_ObjPgMaintNotification('" + 
				       sNotificationNumber + "')";
			}
		},
		
		onVibrationDetailPress: function(oEvent){
	        var oSensorData = oEvent.getSource().getBindingContext("VibrationSensorModel").getObject();
	        
	        this.getOwnerComponent().getModel("VibrationSensorModel").setProperty("/SelectedVibrationSensor", oSensorData);
	        
	        this.getRouter().navTo("DetailVibration",{});
        },
        
        onPressSearch: function(oEvent) {
        	var sSearchQuery = this.getView().byId("idSearchField").getValue();
        	var aTableColumns = this.getOwnerComponent().getModel("VibrationSensorModel").getProperty("/SearchColumn");
        	// var sSensor = this.getView().byId("idSensorField").getValue();
        	var sMachine = this.getView().byId("idMachineField").getValue(); 
        	var sStatus = this.getView().byId("idStatusField").getValue();
        	var aFilters = [];
        	
        	this.getView().byId("idVibrationTableSensorTable").getBinding("items").filter();
        	
        	if(sSearchQuery) {
        		for(var intI = 0; intI < aTableColumns.length; intI++) {
        			aFilters.push(new Filter(aTableColumns[intI], FilterOperator.Contains, sSearchQuery));
        		}
    		 }
        	
        	// if(sSensor) {
        	// 	aFilters.push(new Filter("SensorName", FilterOperator.EQ, sSensor));
        	// }
        	
        	if(sMachine) {
        		aFilters.push(new Filter("MachineName", FilterOperator.EQ, sMachine));
        	}
        	
        	if(sStatus) {
        		aFilters.push(new Filter("Status", FilterOperator.EQ, sStatus));
        	}
        	
        	if(aFilters.length > 0) {
        		this.getView().byId("idVibrationTableSensorTable").getBinding("items").filter(new Filter(aFilters, false)); 
        	} else {
        		this.getView().byId("idVibrationTableSensorTable").getBinding("items").filter();
        	}
        }
	});

});
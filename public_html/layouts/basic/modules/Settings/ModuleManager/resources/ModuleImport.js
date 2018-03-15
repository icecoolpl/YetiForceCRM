/*+***********************************************************************************
 * The contents of this file are subject to the vtiger CRM Public License Version 1.0
 * ("License"); You may not use this file except in compliance with the License
 * The Original Code is:  vtiger CRM Open Source
 * The Initial Developer of the Original Code is vtiger.
 * Portions created by vtiger are Copyright (C) vtiger.
 * All Rights Reserved.
 *************************************************************************************/
jQuery.Class('Settings_Module_Import_Js', {}, {
	/**
	 * Function to get import module step1 params
	 */
	getImportModuleStep1Params: function () {
		var params = {
			'module': app.getModuleName(),
			'parent': app.getParentModuleName(),
			'view': 'ModuleImport'
		}
		return params;
	},

	/**
	 * Function to get import module with respect to view
	 */
	getImportModuleStepView: function (params) {
		var aDeferred = jQuery.Deferred();
		var progressIndicatorElement = jQuery.progressIndicator({
			'position': 'html',
			'blockInfo': {
				'enabled': true
			}
		});

		AppConnector.request(params).then(
			function (data) {
				progressIndicatorElement.progressIndicator({'mode': 'hide'});
				aDeferred.resolve(data);
			},
			function (error) {
				progressIndicatorElement.progressIndicator({'mode': 'hide'});
				aDeferred.reject(error);
			}
		);
		return aDeferred.promise();
	},

	/**
	 * Function to register event for step1 of import module
	 */
	registerEventForStep1: function () {
		var detailContentsHolder = jQuery('.contentsDiv');
		app.showScrollBar(jQuery('.extensionDescription'), {'height': '120px', 'width': '100%', 'railVisible': true});
		this.registerEventsForImportModuleStep1(detailContentsHolder);
	},

	/**
	 * Function to register event related to Import extrension Modules in step1
	 */
	registerEventsForImportModuleStep1: function (container) {
		var thisInstance = this;
		jQuery(container).find('.installExtension').on('click', function (e) {
			var element = jQuery(e.currentTarget);
			var extensionContainer = element.closest('.extension_container');
			var extensionId = extensionContainer.find('[name="extensionId"]').val();
			var moduleAction = extensionContainer.find('[name="moduleAction"]').val();
			var extensionName = extensionContainer.find('[name="extensionName"]').val();
			var params = {
				'module': app.getModuleName(),
				'parent': app.getParentModuleName(),
				'view': 'ModuleImport',
				'mode': 'step2',
				'extensionId': extensionId,
				'moduleAction': moduleAction,
				'extensionName': extensionName
			}

			thisInstance.getImportModuleStepView(params).then(function (data) {
				var detailContentsHolder = jQuery('.contentsDiv');
				detailContentsHolder.html(data);
				app.showScrollBar(jQuery('#extensionLicense'), {'height': 'auto'});
				thisInstance.registerEventsForImportModuleStep2(detailContentsHolder);
			});
		})
	},

	/**
	 * Function to register event related to Import extrension Modules in step2
	 */
	registerEventsForImportModuleStep2: function (container) {
		var container = jQuery(container);
		var thisInstance = this;

		container.find('#installExtension').on('click', function () {
			var extensionId = jQuery('[name="extensionId"]').val();
			var targetModule = jQuery('[name="targetModule"]').val();
			var moduleType = jQuery('[name="moduleType"]').val();
			var moduleAction = jQuery('[name="moduleAction"]').val();
			var fileName = jQuery('[name="fileName"]').val();

			var params = {
				'module': app.getModuleName(),
				'parent': app.getParentModuleName(),
				'view': 'ModuleImport',
				'mode': 'step3',
				'extensionId': extensionId,
				'moduleAction': moduleAction,
				'targetModule': targetModule,
				'moduleType': moduleType,
				'fileName': fileName
			}

			thisInstance.getImportModuleStepView(params).then(function (step3Data) {
				var callBackFunction = function (data) {
					var installationStatus = jQuery(data).find('[name="installationStatus"]').val();
					if (installationStatus == "success") {
						jQuery('#installExtension').remove();
					}
					app.showScrollBar(jQuery('#installationLog'), {'height': '150px'});
					jQuery(data).find('#importCompleted').on('click', function (e) {
						container.find('#declineExtension').trigger('click');
					})
				}
				var modalData = {
					data: step3Data,
					unblockcb: function () {
						container.find('#declineExtension').trigger('click');
					},
					css: {'width': '60%', 'height': '40%'},
					cb: callBackFunction
				};
				app.showModalWindow(modalData);
			});
		})

		container.find('#declineExtension').on('click', function () {
			var params = thisInstance.getImportModuleStep1Params();
			thisInstance.getImportModuleStepView(params).then(function (data) {
				var detailContentsHolder = jQuery('.contentsDiv');
				detailContentsHolder.html(data);
				thisInstance.registerEventForStep1();
			});
		})
	},

	registerEvents: function () {
		this.registerEventForStep1();
	}
});


jQuery(document).ready(function () {
	var settingModuleImportInstance = new Settings_Module_Import_Js();
	settingModuleImportInstance.registerEvents();
})




'use strict';
var util = require('util'),
    fs = require('fs'),
	inflections = require('underscore.inflections'),
	yeoman = require('yeoman-generator');


var crudEntityGenerator = yeoman.generators.NamedBase.extend({
	init: function() {
		this.slugifiedName = this._.slugify(this.name);

		this.slugifiedPluralName = inflections.pluralize(this.slugifiedName);
		this.slugifiedSingularName = inflections.singularize(this.slugifiedName);

		this.camelizedPluralName = this._.camelize(this.slugifiedPluralName);
		this.camelizedSingularName = this._.camelize(this.slugifiedSingularName);

		this.classifiedPluralName = this._.classify(this.slugifiedPluralName);
		this.classifiedSingularName = this._.classify(this.slugifiedSingularName);

		this.humanizedPluralName = this._.humanize(this.slugifiedPluralName);
		this.humanizedSingularName = this._.humanize(this.slugifiedSingularName);
	},
    askForModuleName: function() {
        var modulesFolder = process.cwd() + '/public/modules/';
        var done = this.async();

        var prompts = [
            {
                type: 'list',
                name: 'moduleName',
                default: 'core',
                message: 'Which module does this route belongs to?',
                choices: []
            }];

        // Add module choices
        if (fs.existsSync(modulesFolder)) {

            fs.readdirSync(modulesFolder).forEach(function(folder) {
                var stat = fs.statSync(modulesFolder + '/' + folder);

                if (stat.isDirectory()) {
                    prompts[0].choices.push({
                        value: folder,
                        name: folder
                    });
                }
            });
        }

        this.prompt(prompts, function(props) {
            this.moduleName = props.moduleName;
            //this.controllerName = props.controllerName;

            this.slugifiedModuleName = this._.slugify(this.moduleName);
            this.humanizedModuleName = this._.humanize(this.moduleName);
            this.slugifiedPluralModuleName = inflections.pluralize(this.slugifiedModuleName);
            //this.slugifiedName = this._.slugify(this._.humanize(this.name));
            //this.classifiedName = this._.classify(this.slugifiedName);
            //this.humanizedName = this._.humanize(this.slugifiedName);

            done();
        }.bind(this));
    },
	askForEntityFolders: function() {
		var done = this.async();

		var prompts = [{
			type: 'checkbox',
			name: 'folders',
			message: 'Which supplemental folders would you like to include in your angular module?',
			choices: [{
				value: 'addCSSFolder',
				name: 'css',
				checked: false
			}, {
				value: 'addImagesFolder',
				name: 'img',
				checked: false
			}, {
				value: 'addDirectivesFolder',
				name: 'directives',
				checked: true
			}, {
				value: 'addFiltersFolder',
				name: 'filters',
				checked: true
			}]
		}, {
			type: 'confirm',
			name: 'addMenuItems',
			message: 'Would you like to add the CRUD module links to a menu?',
			default: true
		}];

		this.prompt(prompts, function(props) {
			this.addCSSFolder = this._.contains(props.folders, 'addCSSFolder');
			this.addImagesFolder = this._.contains(props.folders, 'addImagesFolder');
			this.addDirectivesFolder = this._.contains(props.folders, 'addDirectivesFolder');
			this.addFiltersFolder = this._.contains(props.folders, 'addFiltersFolder');

			this.addMenuItems = props.addMenuItems;

			done();
		}.bind(this));
	},

	askForMenuId: function() {
		if (this.addMenuItems) {
			var done = this.async();

			var prompts = [{
				name: 'menuId',
                //do want this to be added as part of the module menu
				message: 'What is your menu identifier(Leave it empty and press ENTER for the default "topbar" menu)?',
				default: 'topbar'
			}];

			this.prompt(prompts, function(props) {
				this.menuId = props.menuId;

				done();
			}.bind(this));
		}
	},

	renderModule: function() {
		// Create entity folder under module folder
		this.mkdir('public/modules/'+ this.slugifiedModuleName +'/' + this.slugifiedPluralName);
//         this.mkdir('public/modules/' + this.slugifiedModuleName +'/' + this.slugifiedPluralName + '/config');
//         this.mkdir('public/modules/' + this.slugifiedModuleName +'/' + this.slugifiedPluralName + '/controllers');
//         this.mkdir('public/modules/' + this.slugifiedModuleName +'/' + this.slugifiedPluralName + '/services');
//         this.mkdir('public/modules/' + this.slugifiedModuleName +'/' + this.slugifiedPluralName + '/tests');
//        this.mkdir('public/modules/' + this.slugifiedModuleName +'/' + this.slugifiedPluralName + '/views');

		// Create entity supplemental folders
		if (this.addCSSFolder) this.mkdir('public/modules/'+ this.slugifiedModuleName +'/' + this.slugifiedPluralName + '/css');
		if (this.addImagesFolder) this.mkdir('public/modules/'+ this.slugifiedModuleName +'/' + this.slugifiedPluralName + '/img');
		if (this.addDirectivesFolder) this.mkdir('public/modules/'+ this.slugifiedModuleName +'/' + this.slugifiedPluralName + '/directives');
		if (this.addFiltersFolder) this.mkdir('public/modules/'+ this.slugifiedModuleName +'/' + this.slugifiedPluralName + '/filters');

		// Render express module files
		this.template('express-module/_.server.controller.js', 'app/controllers/' + this.slugifiedPluralName + '.server.controller.js');
		this.template('express-module/_.server.model.js', 'app/models/' + this.slugifiedSingularName + '.server.model.js');
		this.template('express-module/_.server.routes.js', 'app/routes/' + this.slugifiedPluralName + '.server.routes.js');
		this.template('express-module/_.server.model.test.js', 'app/tests/' + this.slugifiedSingularName + '.server.model.test.js');

		// Render angular entity files
		//this.template('angular-module/config/_.client.routes.js', 'public/modules/'+ this.slugifiedModuleName +'/' + this.slugifiedPluralName + '/config/' + this.slugifiedPluralName + '.client.routes.js');
		this.template('angular-module/controllers/_.client.controller.js', 'public/modules/'+ this.slugifiedModuleName +'/' + this.slugifiedPluralName + '/controllers/' + this.slugifiedPluralName + '.client.controller.js');
		this.template('angular-module/services/_.client.service.js', 'public/modules/'+ this.slugifiedModuleName +'/' + this.slugifiedPluralName + '/services/' + this.slugifiedPluralName + '.client.service.js');
		this.template('angular-module/tests/_.client.controller.test.js', 'public/modules/'+ this.slugifiedModuleName +'/' + this.slugifiedPluralName + '/tests/' + this.slugifiedPluralName + '.client.controller.test.js');

		// Render menu configuration for entity(as submenu for module menu)
		if (this.addMenuItems) {
			//this.template('angular-module/config/_.client.config.js', 'public/modules/'+ this.slugifiedModuleName +'/' + this.slugifiedPluralName + '/config/' + this.slugifiedPluralName + '.client.config.js');

			}

		// Render angular entity views
		this.template('angular-module/views/_.create.client.view.html', 'public/modules/'+ this.slugifiedModuleName +'/' + this.slugifiedPluralName + '/views/create-' + this.slugifiedSingularName + '.client.view.html');
		this.template('angular-module/views/_.edit.client.view.html', 'public/modules/'+ this.slugifiedModuleName +'/' + this.slugifiedPluralName + '/views/edit-' + this.slugifiedSingularName + '.client.view.html');
		this.template('angular-module/views/_.list.client.view.html', 'public/modules/'+ this.slugifiedModuleName +'/' + this.slugifiedPluralName + '/views/list-' + this.slugifiedPluralName + '.client.view.html');
		this.template('angular-module/views/_.view.client.view.html', 'public/modules/'+ this.slugifiedModuleName +'/' + this.slugifiedPluralName + '/views/view-' + this.slugifiedSingularName + '.client.view.html');

		// Render angular module definition
	//	this.template('angular-module/_.client.module.js', 'public/modules/'+ this.slugifiedModuleName +'/' + this.slugifiedPluralName + '/' + this.slugifiedPluralName + '.client.module.js');
	},
    renderRoute: function() {
        var routesFilePath = process.cwd() + '/public/modules/' + this.slugifiedModuleName + '/config/' + this.slugifiedModuleName + '.client.routes.js';
//this.template('angular-module/config/_.client.config.js', 'public/modules/' + this.slugifiedPluralName + '/config/' + this.slugifiedPluralName + '.client.config.js');

        // If routes file exists we add a new state otherwise we render a new one
        if (fs.existsSync(routesFilePath)) {
            // Read the source routes file content
            var routesFileContent = this.readFileAsString(routesFilePath);

            // Append the new state
            routesFileContent = routesFileContent.replace('$stateProvider.', this.engine(this.read('angular-module/config/_.client.routes.js'), this));

            // Save route file
            this.writeFileFromString(routesFileContent, routesFilePath);
        } else {
           // this.template('angular-module/config/_.client.config.js', 'public/modules/' + this.slugifiedModuleName + '/config/' + this.slugifiedModuleName + '.client.routes.js')
        }
    },
    renderConfig: function() {
        var configFilePath = process.cwd() + '/public/modules/' + this.slugifiedModuleName + '/config/' + this.slugifiedModuleName + '.client.config.js';
//this.template('angular-module/config/_.client.config.js', 'public/modules/' + this.slugifiedPluralName + '/config/' + this.slugifiedPluralName + '.client.config.js');

        // If config file exists we add a new entity CRUD menu otherwise we render a new one
        if (fs.existsSync(configFilePath)) {
            // Read the source routes file content
            var configFileContent = this.readFileAsString(configFilePath);

            // Append the new state
            configFileContent = configFileContent.replace('}', this.engine(this.read('angular-module/config/_.client.config.js'), this));

            // Save route file
            this.writeFileFromString(configFileContent, configFilePath);
        } else {
           // this.template('angular-module/config/_.client.config.js', 'public/modules/' + this.slugifiedModuleName + '/config/' + this.slugifiedModuleName + '.client.config.js')
        }
    }
});

module.exports = crudEntityGenerator;
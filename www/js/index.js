/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var picker = null;
var modal = null;
var historyLimit = 5;
var loading = null;
var app = {
	history: [],
	currentDate: 0,
	contentContainer: null,
    // Application Constructor
    initialize: function() {
		this.currentDate = moment();
		this.contentContainer = document.getElementById("comic-container");
		modal = document.querySelector(".modal-overlay");
		loading = document.querySelector(".loading");
		this.updateComic();
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		var prev = document.getElementById("nav-prev");
		console.log(prev);
		var next = document.getElementById("nav-next");
		console.log(next);
		prev.addEventListener('click', this.prevComic, false);
		next.addEventListener('click', this.nextComic, false);
		modal.addEventListener('click', function(e) {
			if(modal == (e.srcElement || e.originalTarget)) {
				app.hideModal();
			}
		}, true);
		
		picker = new Pikaday({
			onSelect: function(date) {
				app.currentDate = picker.getMoment();
				picker.el.style.display = "none";
				app.updateComic();
			}
		});
		picker.el.style.display = "none";
		modal.children[0].appendChild(picker.el);
		document.getElementById("calendar").addEventListener('click', function() {
			picker.el.style.display = "";
			app.showModal();
		}, false);
    },
	pushHistory: function() {
		if(app.history.length >= historyLimit)
			app.history.shift();
		app.history.push(app.currentDate.format("YYYY-MM-DD"));
	},
	popHistory: function() {
		if(app.history.length > 0)
			app.currentDate = moment(app.history.pop());
		else
			app.currentDate = moment().add(-1, 'days');
	},
	prevComic: function() {
		app.currentDate = app.currentDate.subtract(1, "days");
		app.updateComic();
	},
	nextComic: function() {
		app.currentDate = app.currentDate.add(1, "days");
		app.updateComic();
	},
	fixScroll: function() {
		
		if(app.contentContainer.scrollTo !== undefined)
			app.contentContainer.scrollTo(0, 0);
		app.contentContainer.scrollTop = 0;
		app.contentContainer.scrollLeft = 0;
	},
	updateComic: function() {
		loading.style.display = "";
		app.showModal();
		var src = "http://zebfross.com/dilbert/" + app.currentDate.format("YYYY/MM/DD");
		var img = document.createElement("img");
		img.onload = function() {
			app.pushHistory();
			var dateContainer = document.getElementById("date-container");
			dateContainer.textContent = app.currentDate.format("YYYY-MM-DD");
			var container = document.getElementById("comic-container");
			if(container.children.length > 0)
				container.removeChild(container.children[0]);
			container.appendChild(img);
			app.fixScroll();
			app.hideModal();
		};
		img.onerror = function() {
			app.currentDate = moment(app.history[app.history.length-1]);
			app.hideModal();
		}
		img.src = src;
	},
	hideModal: function() {
		loading.style.display = "none";
		picker.el.style.display = "none";
		modal.style.display = "none";
	},
	showModal: function() {
		modal.style.display = "";
	},
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        /*var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
		*/
        console.log('Received Event: ' + id);
    }
};

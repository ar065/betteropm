// ==UserScript==
// @name        opm but better
// @namespace   Violentmonkey Scripts
// @match       https://ourworldofpixels.com/
// @grant       none
// @version     1.0
// @author      Lapis
// @description 2/3/2022, 12:07:00 AM
// @run-at      document-start
// ==/UserScript==

let moduleList = []

let originalFunction = Object.defineProperty
Object.defineProperty = function() {
  let returnValue = originalFunction.call(originalFunction, ...arguments)
  let object = arguments[0]
  if (!object?.__esModule) return returnValue
  moduleList.push(object)
  if (moduleList.length === 1) {
    setTimeout(() => {
      finishedLoading()
    }, 0)
  }
  return returnValue
}

let modules = {}

function finishedLoading() {
  modules.bucket = moduleList.find(module => module.Bucket)
  modules.canvas_renderer = moduleList.find(module => module.unloadFarClusters)
  modules.captcha = moduleList.find(module => module.loadAndRequestCaptcha)
  modules.conf = moduleList.find(module => module.EVENTS)
  modules.context = moduleList.find(module => module.createContextMenu)
  modules.Fx = moduleList.find(module => module.PLAYERFX)
  modules.global = moduleList.find(module => module.PublicAPI)
  modules.local_player = moduleList.find(module => module.networkRankVerification)
  modules.main = moduleList.find(module => module.revealSecrets)
  modules.misc = moduleList.find(module => module.setCookie)
  modules.net = moduleList.find(module => module.net)
  modules.Player = moduleList.find(module => module.Player)
  modules.tools = moduleList.find(module => module.showToolsWindow)
  modules.windowsys = moduleList.find(module => module.windowSys)
  modules.World = moduleList.find(module => module.World)

  modules.events = modules.global.eventSys.constructor
  modules.all = moduleList //it's unsafe to access these by index as those values may change

  //set OWOP.net and prevent revealSecrets from removing it
  OWOP.net = modules.net.net
  modules.main.revealSecrets = () => {}

  //add OWOP.eventSys
  OWOP.eventSys = modules.global.eventSys

  //add OWOP.misc
  OWOP.misc = modules.main.misc

  //add OWOP.require
  OWOP.require = function getModule(name) {
    if (modules[name]) {
      return modules[name]
    } else {
      throw new Error(`No module by the name ${name}`)
    }
  }
}

let style = document.createElement('style')
style.innerHTML = `
/* General */

#opm p {
	margin-top: 0;
}
#opm a {
	color: #52d6ff;
}
#opm button {
	box-sizing: border-box;
	border: 1px solid rgba(0, 0, 0, 0.5);
	border-radius: 3px;
	padding: 6px 8px;
	font: 16px pixel-op, sans-serif;
	color: #fff;
	text-shadow: 0 1px 0px #000;
}
#opm input,
#opm textarea,
#opm select {
	margin-bottom: 8px;
	padding: 4px;
	background-color: #867050;
	border: 1px solid rgba(0, 0, 0, 0.5);
	border-radius: 3px;
	color: #fff;
	font: 16px pixel-op, sans-serif;
	transition: border-color 200ms;
}
#opm input::-webkit-input-placeholder,
#opm textarea::-webkit-input-placeholder {
	color: rgba(255, 255, 255, 0.5);
}
#opm input::-moz-placeholder,
#opm textarea::-moz-placeholder {
	color: rgba(255, 255, 255, 0.5);
}
#opm input:-ms-input-placeholder,
#opm textarea:-ms-input-placeholder {
	color: rgba(255, 255, 255, 0.5);
}
#opm input::-ms-input-placeholder,
#opm textarea::-ms-input-placeholder {
	color: rgba(255, 255, 255, 0.5);
}
#opm input::placeholder,
#opm textarea::placeholder {
	color: rgba(255, 255, 255, 0.5);
}
#opm input:focus,
#opm textarea:focus,
#opm select:focus {
	outline: none;
	border-color: #d8d8d8;
}

/* OPM container */

#opm {
	display: flex;
	flex-direction: column;

	position: absolute;
	bottom: 0;
	left: 450px;
	width: 48px;
	height: 48px;
	margin: 8px;

	border: 1px solid rgba(0, 0, 0, 0.6);
	border-radius: 4px;
	background-color: #b99664;
	color: #fff;
	text-shadow: 0 1px 0px #000;

	overflow: hidden;
	transition: width 300ms, height 300ms, transform 0.75s;
	transition-timing-function: ease-in-out;

	/* transform: translateY(200%); */
}
#opm.open {
	width: 600px;
	height: 600px;
}
#opm > header {
	position: relative;
	width: 100%;
	padding: 8px;
	box-sizing: border-box;
	border-bottom: 1px solid rgba(0, 0, 0, 0.2);
	z-index: 3;
	cursor: pointer;
}

#opm > header > .title {
	position: absolute;
	width: 100%;
	left: 0;
	line-height: 32px;
	text-align: center;
	z-index: -1;
}
#opm-bal {
	float: right;
	font-size: 0;
	display: none;
}
#opm.open #opm-bal {
	display: block;
}
#opm-user-balance {
	padding: 4px 8px;
	background-color: #826771;
	border: 1px solid rgba(0, 0, 0, 0.4);
	border-right: none;
	border-radius: 4px 0 0 4px;
	font-size: 16px;
}
button#opm-deposit-btn {
	background-color: #e0c35a;
	padding: 7px 11px;
}
#opm > main {
	display: none;
	flex: 1;
	background-color: rgba(0, 0, 0, 0.1);
}

#opm.login > #opm-login-tab { display: block; }
#opm.packages > #opm-packages-tab { display: block; }
#opm.details > #opm-details-tab { display: block; }
#opm.upload > #opm-upload-tab { display: flex; }
#opm.deposit > #opm-deposit-tab { display: flex; }

/***********
* Packages *
***********/

#opm-packages-tab {
	overflow-y: scroll;
}
#opm-packages {
	padding: 8px;
	margin: 0;
	list-style: none;
}
#opm-packages > li {
	display: flex;
	position: relative;
	margin-bottom: 8px;
	background-color: #caa87a;
	border: 1px solid rgba(0, 0, 0, 0.5);
	border-radius: 4px;
	cursor: pointer;
	transition: background-color 200ms;
}
#opm-packages > li:hover {
	background-color: #d4b181;
}
#opm-packages > li > img {
	width: 128px;
	height: 128px;
	background-size: 128px 128px;
	background-repeat: no-repeat;
}
#opm-packages > li > .body {
	flex: 1;
	display: flex;
	flex-direction: column;
}
#opm-packages > li > .body > header > .title {
	display: inline-block;
	margin: 4px 8px;
	font-size: 32px;
}
#opm-packages > li > .body > header > .version {
	color: #948270;
}
#opm-packages > li > .body > header > .author {
	float: right;
	margin-top: 8px;
	margin-right: 8px;
	background-color: rgba(0, 0, 0, 0.2);
	padding: 6px 8px;
	border-radius: 3px;
}
#opm-packages > li > .body > .description {
	flex: 1;
	margin: 0 8px;
}
#opm-packages > li > .body > footer {
	padding: 8px;
}
#opm-packages > li > .body > footer > .categories {
	display: inline-block;
	padding: 0;
	margin: 0;
	list-style: none;
}
#opm-packages > li > .body > footer > .categories > li {
	display: inline-block;
	margin-right: 8px;
	padding: 6px;
	background-color: rgba(0, 0, 0, 0.2);
	border-radius: 3px;
}
#opm-packages > li > .body > footer > .install {
	float: right;
	background-color: #73b551;
}

#opm-packages > li > .body > footer > .buy {
    float: right;
    background-color: #a768b5;
}

#opm-packages > li > .body > footer > .uninstall {
	float: right;
	background-color: #7c81a9;
}
#opm-packages > li > .body > footer > .downloads {
	float: right;
	margin: 6px;
}
#opm-packages > li > .body > footer > .downloads::before {
	content: "";
	display: inline-block;
	width: 16px;
	height: 16px;
	vertical-align: sub;
	margin-right: 4px;
	background-image: url(https://opm.dimden.dev/client/img/downloads-icon.png);
	opacity: 0.4;
}

#opm-packages > button {
	display: block;
	width: 100%;
	padding: 8px;
	background-color: #73b551;
}
`

let htmlText = `
<div id="opm" class="packages">
<header id="opm-header">
<img src="https://opm.dimden.dev/client/img/opm-2.png" />
<span class="title">OWOP Package Manager 2</span>
</header>
<main id="opm-packages-tab">

<ul id="opm-packages"></ul>
</main>
<main id="opm-details-tab"></main>
</div>
`

addEventListener("load", () => {
    document.head.appendChild(style)
    document.body.insertAdjacentHTML("beforeend", htmlText);
    document.getElementById("opm-header").addEventListener("click", function(t) {
        document.getElementById("opm").classList.toggle("open")
    })
})

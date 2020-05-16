!function(e){function n(n){for(var s,a,o=n[0],l=n[1],c=n[2],p=0,u=[];p<o.length;p++)a=o[p],Object.prototype.hasOwnProperty.call(i,a)&&i[a]&&u.push(i[a][0]),i[a]=0;for(s in l)Object.prototype.hasOwnProperty.call(l,s)&&(e[s]=l[s]);for(d&&d(n);u.length;)u.shift()();return r.push.apply(r,c||[]),t()}function t(){for(var e,n=0;n<r.length;n++){for(var t=r[n],s=!0,o=1;o<t.length;o++){var l=t[o];0!==i[l]&&(s=!1)}s&&(r.splice(n--,1),e=a(a.s=t[0]))}return e}var s={},i={0:0},r=[];function a(n){if(s[n])return s[n].exports;var t=s[n]={i:n,l:!1,exports:{}};return e[n].call(t.exports,t,t.exports,a),t.l=!0,t.exports}a.m=e,a.c=s,a.d=function(e,n,t){a.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,n){if(1&n&&(e=a(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(a.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var s in e)a.d(t,s,function(n){return e[n]}.bind(null,s));return t},a.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(n,"a",n),n},a.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},a.p="";var o=window.webpackJsonp=window.webpackJsonp||[],l=o.push.bind(o);o.push=n,o=o.slice();for(var c=0;c<o.length;c++)n(o[c]);var d=l;r.push([164,1]),t()}({161:function(e,n,t){var s={"./af":32,"./af.js":32,"./ar":33,"./ar-dz":34,"./ar-dz.js":34,"./ar-kw":35,"./ar-kw.js":35,"./ar-ly":36,"./ar-ly.js":36,"./ar-ma":37,"./ar-ma.js":37,"./ar-sa":38,"./ar-sa.js":38,"./ar-tn":39,"./ar-tn.js":39,"./ar.js":33,"./az":40,"./az.js":40,"./be":41,"./be.js":41,"./bg":42,"./bg.js":42,"./bm":43,"./bm.js":43,"./bn":44,"./bn.js":44,"./bo":45,"./bo.js":45,"./br":46,"./br.js":46,"./bs":47,"./bs.js":47,"./ca":48,"./ca.js":48,"./cs":49,"./cs.js":49,"./cv":50,"./cv.js":50,"./cy":51,"./cy.js":51,"./da":52,"./da.js":52,"./de":53,"./de-at":54,"./de-at.js":54,"./de-ch":55,"./de-ch.js":55,"./de.js":53,"./dv":56,"./dv.js":56,"./el":57,"./el.js":57,"./en-SG":58,"./en-SG.js":58,"./en-au":59,"./en-au.js":59,"./en-ca":60,"./en-ca.js":60,"./en-gb":61,"./en-gb.js":61,"./en-ie":62,"./en-ie.js":62,"./en-il":63,"./en-il.js":63,"./en-nz":64,"./en-nz.js":64,"./eo":65,"./eo.js":65,"./es":66,"./es-do":67,"./es-do.js":67,"./es-us":68,"./es-us.js":68,"./es.js":66,"./et":69,"./et.js":69,"./eu":70,"./eu.js":70,"./fa":71,"./fa.js":71,"./fi":72,"./fi.js":72,"./fo":73,"./fo.js":73,"./fr":74,"./fr-ca":75,"./fr-ca.js":75,"./fr-ch":76,"./fr-ch.js":76,"./fr.js":74,"./fy":77,"./fy.js":77,"./ga":78,"./ga.js":78,"./gd":79,"./gd.js":79,"./gl":80,"./gl.js":80,"./gom-latn":81,"./gom-latn.js":81,"./gu":82,"./gu.js":82,"./he":83,"./he.js":83,"./hi":84,"./hi.js":84,"./hr":85,"./hr.js":85,"./hu":86,"./hu.js":86,"./hy-am":87,"./hy-am.js":87,"./id":88,"./id.js":88,"./is":89,"./is.js":89,"./it":90,"./it-ch":91,"./it-ch.js":91,"./it.js":90,"./ja":92,"./ja.js":92,"./jv":93,"./jv.js":93,"./ka":94,"./ka.js":94,"./kk":95,"./kk.js":95,"./km":96,"./km.js":96,"./kn":97,"./kn.js":97,"./ko":98,"./ko.js":98,"./ku":99,"./ku.js":99,"./ky":100,"./ky.js":100,"./lb":101,"./lb.js":101,"./lo":102,"./lo.js":102,"./lt":103,"./lt.js":103,"./lv":104,"./lv.js":104,"./me":105,"./me.js":105,"./mi":106,"./mi.js":106,"./mk":107,"./mk.js":107,"./ml":108,"./ml.js":108,"./mn":109,"./mn.js":109,"./mr":110,"./mr.js":110,"./ms":111,"./ms-my":112,"./ms-my.js":112,"./ms.js":111,"./mt":113,"./mt.js":113,"./my":114,"./my.js":114,"./nb":115,"./nb.js":115,"./ne":116,"./ne.js":116,"./nl":117,"./nl-be":118,"./nl-be.js":118,"./nl.js":117,"./nn":119,"./nn.js":119,"./pa-in":120,"./pa-in.js":120,"./pl":121,"./pl.js":121,"./pt":122,"./pt-br":123,"./pt-br.js":123,"./pt.js":122,"./ro":124,"./ro.js":124,"./ru":125,"./ru.js":125,"./sd":126,"./sd.js":126,"./se":127,"./se.js":127,"./si":128,"./si.js":128,"./sk":129,"./sk.js":129,"./sl":130,"./sl.js":130,"./sq":131,"./sq.js":131,"./sr":132,"./sr-cyrl":133,"./sr-cyrl.js":133,"./sr.js":132,"./ss":134,"./ss.js":134,"./sv":135,"./sv.js":135,"./sw":136,"./sw.js":136,"./ta":137,"./ta.js":137,"./te":138,"./te.js":138,"./tet":139,"./tet.js":139,"./tg":140,"./tg.js":140,"./th":141,"./th.js":141,"./tl-ph":142,"./tl-ph.js":142,"./tlh":143,"./tlh.js":143,"./tr":144,"./tr.js":144,"./tzl":145,"./tzl.js":145,"./tzm":146,"./tzm-latn":147,"./tzm-latn.js":147,"./tzm.js":146,"./ug-cn":148,"./ug-cn.js":148,"./uk":149,"./uk.js":149,"./ur":150,"./ur.js":150,"./uz":151,"./uz-latn":152,"./uz-latn.js":152,"./uz.js":151,"./vi":153,"./vi.js":153,"./x-pseudo":154,"./x-pseudo.js":154,"./yo":155,"./yo.js":155,"./zh-cn":156,"./zh-cn.js":156,"./zh-hk":157,"./zh-hk.js":157,"./zh-tw":158,"./zh-tw.js":158};function i(e){var n=r(e);return t(n)}function r(e){if(!t.o(s,e)){var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}return s[e]}i.keys=function(){return Object.keys(s)},i.resolve=r,e.exports=i,i.id=161},162:function(e,n){(async()=>{const{timeBetweenUpdates:e=6e4,requireLogin:n=!0}=nodecg.bundleConfig,t=NodeCG.Replicant("login.status","nodecg-twitchie");await NodeCG.waitForReplicants(t);const s=async()=>{try{await(async()=>{const e=await fetch("/login/twitch/verify",{method:"GET",credentials:"include"});if(!e.ok)throw new Error("Login endpoint returned error",e.status);return e.status})(),t.value=!0}catch(e){t.value=!1}setTimeout(s,e)};s(),t.on("change",e=>{n&&!e&&window.top.location.replace("/login/twitch")})})()},164:function(e,n,t){"use strict";t.r(n);var s=t(10);t(165),t(166),t(159),t(163),t(29);const i=NodeCG.Replicant("channel.id","nodecg-twitchie"),r=NodeCG.Replicant("user.info","nodecg-twitchie");class a extends s.a{static get template(){return s.b`
    <style include="twitchie-style">
      .c-channel-field-group {
        align-items: flex-end;
      }

      .c-channel-logo {
        width: 3em;
        height: 3em;
        margin: 0 0 0 1em;
        background-color: #ccc;
      }
    </style>

    <div class="c-field-group c-channel-field-group">
      <paper-input class="c-flush-input" label="Channel ID" value="{{channelId}}"></paper-input>
      <iron-image class="c-channel-logo" src="[[channelIcon]]" sizing="contain" preload="" fade=""></iron-image>
    </div>
`}static get is(){return"twitchie-channel-field"}static get properties(){return{channelId:{type:String},channelIcon:{type:String}}}_onChannelIdUpdate(e){i.value=e}ready(){super.ready(),NodeCG.waitForReplicants(i,r).then(()=>{i.on("change",e=>{this.channelId=e}),r.on("change",e=>{this.channelIcon=e?e.profile_image_url:void 0}),this._createPropertyObserver("channelId",this._onChannelIdUpdate)})}}customElements.define(a.is,a);var o=t(0),l=t.n(o);class c extends s.a{static get template(){return s.b`
    [[counterText]]
    `}static get is(){return"twitchie-duration-counter"}static get properties(){return{started:{type:Number,value:0,observer:"updateTimer"},fallbackText:{type:String,value:"Offline"}}}tick(){const e=l.a.utc().diff(this.startedMoment);this.counterText=(e=>{const n=l.a.utc(e);return n.format(n.hours()>0?"H:mm:ss":"m:ss")})(e)}updateTimer(e){clearTimeout(this.tickTimer),e?(this.startedMoment=l.a.utc(e),this.tick(),this.tickTimer=setInterval(()=>this.tick(),1e3)):this.counterText=this.fallbackText}}customElements.define(c.is,c);const d=NodeCG.Replicant("user.info","nodecg-twitchie"),p=NodeCG.Replicant("stream.info","nodecg-twitchie");class u extends s.a{static get template(){return s.b`
    <style include="twitchie-style">
      .c-stats {
        display: flex;
        flex-flow: row wrap;
      }

      .c-stat {
        width: 50%;
      }

      .c-stat--full {
        width: 100%;
      }

      .c-stat__icon {
        display: inline-block;
        vertical-align: -3px;
      }
    </style>

    <div class="c-stats">
      <div class="viewers c-stat">
        <svg class="c-stat__icon" height="16px" version="1.1" viewBox="0 0 16 16" width="16px" x="0px" y="0px">
          <path clip-rule="evenodd" d="M11,14H5H2v-1l3-3h2L5,8V2h6v6l-2,2h2l3,3v1H11z" fill-rule="evenodd"></path>
        </svg>

        {{viewers}}
      </div>

      <div class="followers c-stat">
        <svg class="c-stat__icon" height="16px" version="1.1" viewBox="0 0 16 16" width="16px" x="0px" y="0px">
          <path d="M8,13.5L1.5,7V4l2-2h3L8,3.5L9.5,2h3l2,2v3L8,13.5z"></path>
        </svg>

        {{followers}}
      </div>

      <div class="timer c-stat c-stat--full">
        <svg class="c-stat__icon" height="18px" version="1.1" viewBox="0 0 18 18" width="18px" x="0px" y="0px">
          <path clip-rule="evenodd" d="M15,14l-4-4v4H8.707l-0.5-0.5h-1L7.5,13.207V8.5h-5v4.707L2.793,13.5h-1l-0.5,0.5H1V4h10v4l4-4h2v10H15z M3,14h1l-1-1V9h1h2h1v4l-1,1h1h1l1,1v2H1v-2l1-1H3z" fill-rule="evenodd"></path>
        </svg>

        <twitchie-duration-counter started="[[streamStartedAt]]"></twitchie-duration-counter>
      </div>
    </div>
`}static get is(){return"twitchie-channel-status"}static get properties(){return{viewers:{type:Number,value:0},followers:{type:Number,value:0},streamStartedAt:{type:Number}}}ready(){super.ready(),NodeCG.waitForReplicants(p,d).then(()=>{d.on("change",({followers:e=0}={})=>{this.followers=e}),p.on("change",e=>{this.viewers=e?e.viewer_count:0,this.streamStartedAt=e?e.started_at:void 0})})}}customElements.define(u.is,u);const h=NodeCG.Replicant("user.info","nodecg-twitchie");class j extends s.a{static get template(){return s.b`
    <style include="twitchie-style"></style>

    <twitchie-channel-field></twitchie-channel-field>

    <iron-pages
      id="pages"
      selected="status"
      attr-for-selected="name"
    >
      <section name="error">
        We couldn't find any channels with that ID on Twitch.
      </section>

      <section name="status">
        <div id="loading" class="c-loading">
          <div class="c-loading__message">
            <paper-spinner class="c-loading__spinner" active></paper-spinner>
            <span>Retrieving channel info&hellip;</span>
          </div>
        </div>

        <twitchie-channel-status></twitchie-channel-status>
      </section>
    </iron-pages>
    `}static get is(){return"twitchie-channel-info"}ready(){super.ready(),NodeCG.waitForReplicants(h).then(()=>{h.on("change",e=>{this.$.loading.classList.toggle("is-loading",!e)})})}}customElements.define(j.is,j);t(162);document.getElementById("app").innerHTML="\n  <twitchie-channel-info></twitchie-channel-info>\n"},29:function(e,n){const t=document.createElement("dom-module");t.innerHTML="<template>\n  <style>\n    :root {\n      --background-color: #2F3A4F;\n      --primary-text-color: #fff;\n      --secondary-text-color: rgba(255, 255, 255, 0.5);\n      --primary-color: #6441a4;\n    }\n\n    h1,\n    h2,\n    h3,\n    h4 {\n      margin: 0 auto 0.5rem;\n    }\n\n    h5 {\n      margin: 0 auto;\n      font-size: 1em;\n    }\n\n    paper-button {\n      display: flex;\n      flex-flow: row nowrap;\n      flex-direction: row;\n\n      background: #6441a4;\n      color: #fff;\n      text-align: center;\n    }\n\n    paper-button iron-icon {\n      margin: 0 0.5em 0 0;\n    }\n\n    paper-icon-button {\n      color: #6441a4;\n      width: 1.5em;\n      height: 1.5em;\n      padding: 0;\n    }\n\n    paper-spinner {\n      --paper-spinner-layer-1-color: var(--primary-color);\n      --paper-spinner-layer-2-color: var(--paper-spinner-layer-1-color);\n      --paper-spinner-layer-3-color: var(--paper-spinner-layer-1-color);\n      --paper-spinner-layer-4-color: var(--paper-spinner-layer-1-color);\n    }\n\n    paper-checkbox {\n      --paper-checkbox-size: 1.5em;\n    }\n\n    iron-icon {\n      --iron-icon-width: 1em;\n      --iron-icon-height: 1em;\n    }\n\n    section {\n      position: relative;\n    }\n\n    .c-flush-input {\n      margin: -8px 0;\n    }\n\n    .c-field-group {\n      display: flex;\n      flex-flow: row nowrap;\n      flex-direction: row;\n      margin: 0 auto 1em;\n    }\n\n    .c-field-group .c-field-group__field {\n      margin-right: 1em;\n      flex-grow: 1;\n      flex-basis: 100%;\n    }\n\n    .c-field-group .c-field-group__field:last-child {\n      margin-right: 0;\n    }\n\n    .c-loading {\n      position: absolute;\n      top: 0;\n      left: 0;\n      width: 100%;\n      height: 100%;\n\n      display: flex;\n      align-items: center;\n      justify-content: center;\n\n      background: var(--background-color);\n      opacity: 0;\n      visibility: hidden;\n      transition: 0.3s all ease-in-out;\n    }\n\n    .c-loading.is-loading {\n      visibility: visible;\n      opacity: 1;\n    }\n\n    .c-loading__message {\n      display: flex;\n      align-items: center;\n      justify-content: center;\n    }\n\n    .c-loading__spinner {\n      margin: 0 0.5em 0 0;\n    }\n\n    svg {\n      fill: currentColor;\n    }\n  </style>\n</template>",t.register("twitchie-style")}});
(this["webpackJsonpaudio-tool"]=this["webpackJsonpaudio-tool"]||[]).push([[0],{229:function(e,t,n){},394:function(e,t,n){},396:function(e,t,n){"use strict";n.r(t);var r=n(0),o=n.n(r),a=n(57),u=n.n(a),i=(n(229),n(109)),c=n(78),s=(n(172),n(27)),d=n(1),l=n(5),f=n(4),p=n(10),h=n(405),g=n(407),b=n(221),v=n(89),j=n.n(v),O=n(76),m=new function e(){var t=this;Object(d.a)(this,e),this.createUniqueId=function(){return t.idCounter+=1,t.idCounter},this.registerNode=function(e,n){t.nodeMap[n]=e},this.deregisterNode=function(e){delete t.nodeMap[e]},this.connectNodes=function(e,n){t.nodeMap[e].connect(t.nodeMap[n])},this.disconnectNodes=function(e,n){var r;null===(r=t.nodeMap[e])||void 0===r||r.disconnect(t.nodeMap[n])},this.isAudioNode=function(e){return e in t.nodeMap},this.areConnected=function(e,n){return t.nodeMap[e].is},this.nodeMap={},this.idCounter=0},I=new function e(){var t=this;Object(d.a)(this,e),this.createUniqueId=function(){return t.idCounter+=1,t.idCounter},this.registerOutputNode=function(e){e in t.triggererMap||(t.triggererMap[e]=new Set);return function(n,r){return t.triggererMap[e].forEach((function(e){return t.triggereeMap[e](n,r)}))}},this.deregisterOutputNode=function(e){t.triggererMap[e].forEach((function(n){return t.disconnectNodes(e,n)})),delete t.triggererMap[e]},this.registerInputNode=function(e,n){var r=e;t.triggereeMap[r]=n},this.deregisterInputNode=function(e){delete t.triggereeMap[e]},this.connectNodes=function(e,n){t.triggererMap[e].add(n)},this.disconnectNodes=function(e,n){var r;null===(r=t.triggererMap[e])||void 0===r||r.delete(n)},this.isBangNode=function(e){return e in t.triggereeMap||e in t.triggererMap},this.triggereeMap={},this.triggererMap={},this.idCounter=0},E=n(23),S=n(64),x=n(9),N=n(168),y=n.n(N),w=n(75),C=n(17),H=function e(t,n){Object(d.a)(this,e),this.bpm=t,this.ppb=n,this.pulsePerSecond=n*t/60,this.secondPerPulse=1/this.pulsePerSecond},k=function e(t,n){var r=this;Object(d.a)(this,e),this.toSeconds=function(){return r.pulse/r.res.pulsePerSecond},this.toPulse=function(){return r.pulse},this.add=function(t){return new e(r.pulse+t.pulse,r.res)},this.subtract=function(t){return new e(r.pulse-t.pulse,r.res)},this.multiply=function(t){return new e(r.pulse*t,r.res)},this.isBefore=function(e){return r.toSeconds()<e.toSeconds()},this.isAfter=function(e){return r.toSeconds()>e.toSeconds()},this.isOnOrBefore=function(e){return!r.isAfter(e)},this.isOnOrAfter=function(e){return!r.isBefore(e)},this.isNever=function(){return r.pulse===Number.POSITIVE_INFINITY},this.pulse=t,this.res=n};k.fromSeconds=function(e,t){var n=e%t.secondPerPulse,r=Math.floor(e*t.pulsePerSecond)+(n?1:0);return new k(r,t)},k.fromPulse=function(e,t){return new k(e,t)},k.fromBarNotation=function(e,t){var n=0;return e.split(":").forEach((function(e,r){var o=Math.floor(4*t.ppb/(1<<2*r));n+=Number(e)*o})),new k(n,t)};var T=function(e){Object(l.a)(n,e);var t=Object(f.a)(n);function n(e,r){var o;return Object(d.a)(this,n),(o=t.call(this,e,r.getResolution())).schedule=function(e,t){return o.scheduler.schedule(e,Object(x.a)(o),t)},o.scheduleLater=function(e,t,n){return o.add(t).schedule(e,n)},o.scheduleDraw=function(e){o.scheduler.scheduleDraw(e,Object(x.a)(o))},o.add=function(e){return new n(o.pulse+e.pulse,o.scheduler)},o.multiply=function(e){return new n(o.pulse*e,o.scheduler)},o.subtract=function(e){return new n(o.pulse-e.pulse,o.scheduler)},o.mod=function(e){return new n(o.pulse%e.pulse,o.scheduler)},o.toString=function(){return o.pulse===Number.POSITIVE_INFINITY?"time(Infinity)":"time(pulse=".concat(o.pulse,")")},o.justBefore=function(){return new n(o.pulse-1,o.scheduler)},o.justAfter=function(){return new n(o.pulse+1,o.scheduler)},o.scheduler=r,o}return n}(k);T.fromTime=function(e,t){return new T(e.toPulse(),t)},T.fromSeconds=function(e,t){var n=k.fromSeconds(e,t.getResolution());return T.fromTime(n,t)},T.fromBarNotation=function(e,t){var n=k.fromBarNotation(e,t.getResolution());return T.fromTime(n,t)},T.fromPulse=function(e,t){var n=k.fromPulse(e,t.getResolution());return T.fromTime(n,t)};var A=new(function(e){Object(l.a)(n,e);var t=Object(f.a)(n);function n(){var e,r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},o=r.ppb,a=void 0===o?64:o,u=r.bpm,i=void 0===u?120:u,c=r.lookAhead,s=void 0===c?12:c;return Object(d.a)(this,n),(e=t.call(this)).debug=function(t){console.debug("[Scheduler]{".concat(e.now().toPulse(),"}: "),t)},e.isRunning=function(){return!e.doStop},e.getResolution=function(){return e.resolution},e.getNewEventId=function(){return e.lastScheduledEventId+=1,e.lastScheduledEventId},e._rescheduleDispatch=function(){clearTimeout(e.dispatchTimeoutID),e.doStop?e.dispatchTimeoutID=null:e.dispatchTimeoutID=setTimeout(e.dispatch,e.lookAhead.toSeconds()/2)},e.clear=function(){for(;!e.eventQueue.isEmpty();)e.eventQueue.poll()},e.stop=function(){e.doStop=!0,e.clear(),e.emit("stop")},e.start=function(){e.doStop=!1,e.emit("start"),e.dispatch()},e.dispatch=function(){for(;!e.doStop&&!e.eventQueue.isEmpty()&&e.eventQueue.peek().time.isBefore(e.now().add(e.lookAhead));){var t=e.eventQueue.poll(),n=t.time,r=t.id,o=e.callbackRegister[r],a=e.dataRegister[r];e.debug("Dispatching event with id ".concat(r," scheduled for pulse [").concat(n,"]")),o(n,a),e._cleanUp(r)}e._rescheduleDispatch()},e.schedule=function(t,n,r){Object(C.a)(n instanceof k,"Scheduling time must be Time object.");var o=e.getNewEventId();return e.eventQueue.add({time:n,id:o}),e.callbackRegister[o]=t,e.dataRegister[o]=r,e.debug("Scheduled event with id ".concat(o," for pulse  [").concat(n.toPulse(),"]")),o},e.unschedule=function(t){e.debug("Unscheduled event ".concat(t)),!t in e.callbackRegister&&console.warn("Removed inexistant event with id ",t),e.eventQueue.removeOne((function(e){return e.id===t})),e._cleanUp(t)},e._cleanUp=function(t){delete e.callbackRegister[t],delete e.dataRegister[t]},e.replaceScheduledCallback=function(t,n){Object(C.a)(t in e.callbackRegister,"Tried replacing data of inexistant event"),e.callbackRegister[t]=n},e.replaceEventData=function(t,n){Object(C.a)(t in e.dataRegister,"Tried replacing data of inexistant event"),e.dataRegister[t]=n},e.now=function(){return e.s(w.d().now())},e.scheduleDraw=function(e,t){w.a.schedule(e,t.toSeconds())},e.eventQueue=new y.a((function(e,t){return e.time.isBefore(t.time)})),e.resolution=new H(i,a),e.dispatchTimeoutID=null,e.p=function(t){return T.fromPulse(t,Object(x.a)(e))},e.s=function(t){return T.fromSeconds(t,Object(x.a)(e))},e.b=function(t){return T.fromBarNotation(t,Object(x.a)(e))},e.callbackRegister={},e.dataRegister={},e.lastScheduledEventId=0,e.doStop=!1,e.lookAhead=e.s(.001*s),e}return n}(w.b)),R=A.b,B=A.s,D=(A.p,B(Number.POSITIVE_INFINITY)),P=function(e){Object(r.useEffect)((function(){return A.on("start",e)}),[])},M=function(e){Object(r.useEffect)((function(){return A.on("stop",e)}),[])},F=n(22),_=function(e){var t=e.sourceX,n=e.sourceY,r=e.targetX,o=e.targetY,a=e.sourcePosition,u=e.targetPosition,i=e.style,c=e.id,s=Object(O.g)({sourceX:t,sourceY:n,sourcePosition:a,targetX:r,targetY:o,targetPosition:u});return Object(F.jsx)("path",{d:s,style:i,id:c})},G=n(3),L=n(409),U=function(e){return Object(F.jsx)(O.c,Object(p.a)(Object(p.a)({},e),{},{style:Object(p.a)(Object(p.a)({},e.style),{},{width:15,height:15},e.style)}))},q={audio:function(e){return Object(F.jsx)(U,Object(p.a)(Object(p.a)({},e),{},{style:{borderRadius:"100%",backgroundColor:"orange"}}))},bang:function(e){return Object(F.jsx)(U,Object(p.a)(Object(p.a)({},e),{},{style:Object(p.a)({borderRadius:0,backgroundColor:"grey",border:0},e.style)}))}},Y=function(e){var t=e.kind,n=e.parentId,o=Object(S.a)(e,["kind","parentId"]),a=Object(O.h)();if(Object(r.useEffect)((function(){return a(n)}),[]),t in q){var u=q[t];return Object(F.jsx)(u,Object(p.a)({},o))}throw"Unknown handle kind ".concat(t)},Q=(n(250),n(411)),z=new Set,K=n(410),V=(n(131),n(53),function e(t){var n=this;Object(d.a)(this,e),this.getUniqueEventId=function(){var e;return n.eventIdCounter=(null!==(e=n.eventIdCounter)&&void 0!==e?e:0)+1,n.eventIdCounter},this.schedule=function(e){Object(C.a)(!n.isScheduled(e),"Tried scheduling already schedueld event");var t=n.tpEvents[e],r=t.tptime,o=t.callback,a=t.data,u=r.add(n.glStartTime),i=u.schedule((function(t,r){delete n.tp2glEvents[e],o(t,r)}),a);n.tp2glEvents[e]={glid:i,gltime:u}},this.start=function(e){n.glStartTime=e,Object.keys(n.tpEvents).forEach((function(e){n.isScheduled(e)&&n.unschedule(e),n.schedule(e)})),n.nextControlEventId&&A.unschedule(n.nextControlEventId),n.interval.isBefore(D)&&(n.nextControlEventId=e.add(n.interval).schedule(n.start))},this.stop=function(e){n.nextControlEventId&&A.unschedule(n.nextControlEventId),Object.entries(n.tp2glEvents).forEach((function(t){var r=Object(E.a)(t,2),o=r[0];r[1].gltime.isAfter(e)&&n.isScheduled(o)&&n.unschedule(o)}))},this.isRunning=function(){return n.glStartTime.isBefore(A.now())},this.isScheduled=function(e){return e in n.tp2glEvents},this.addEvent=function(e,t,r){var o=n.getUniqueEventId();n.tpEvents[o]={callback:t,data:r,tptime:e},n.isRunning()&&n.getTpNow().isOnOrBefore(e)&&n.schedule(o)},this.removeEvent=function(e){n.isScheduled(e)&&n.unschedule(e),delete n.tpEvents[e]},this.removeAllEvents=function(){Object.keys(n.tpEvents).forEach((function(e){return n.removeEvent(e)}))},this.setEventData=function(e,t){if(n.isScheduled(e)){var r=n.tp2glEvents[e].glid;A.replaceEventData(r,t)}n.tpEvents[e]=Object(p.a)(Object(p.a)({},n.tpEvents[e]),{},{data:t})},this.setEventCallback=function(e,t){if(n.isScheduled(e)){var r=n.tp2glEvents[e].glid;A.replaceEventCallback(r,t)}n.tpEvents[e]=Object(p.a)(Object(p.a)({},n.tpEvents[e]),{},{callback:t})},this.setLoopInterval=function(e){if(n.interval=e,n.nextControlEventId&&A.unschedule(n.nextControlEventId),n.interval.isBefore(D)&&n.isRunning()){var t=A.now(),r=n.getTpNow(t),o=t.subtract(n.glStartTime),a=t.subtract(o.mod(e));n.glStartTime=a,Object.keys(n.tp2glEvents).forEach((function(e){return n.unschedule(e)})),Object.entries(n.tpEvents).forEach((function(e){var t=Object(E.a)(e,2),o=t[0];t[1].tptime.isOnOrAfter(r)&&n.schedule(o)})),n.nextControlEventId=a.add(e).schedule(n.start)}},this.getTpNow=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:A.now();return e.subtract(n.glStartTime)},this.unschedule=function(e){var t=n.tp2glEvents[e].glid;A.unschedule(t),delete n.tp2glEvents[e]},this.tpEvents={},this.tp2glEvents={},this.interval=null!==t&&void 0!==t?t:D,this.nextControlEventId=null,this.glStartTime=D,A.on("stop",(function(){return n.stop(B(0))}))}),J=function e(t,n){var r=this,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[];Object(d.a)(this,e),this.debug=function(e){console.debug("[StepSequencer]{".concat(A.now().toPulse(),"} ").concat(e))},this.setValues=function(e){r.debug("Set new values"),r.values=e,r.transport.removeAllEvents();var t=function(e,t){var n=t.v,o=t.i;return r.callback(e,n,o)};r.values.forEach((function(e,n){return r.transport.addEvent(r.interval.multiply(n),t,{v:e,i:n})})),r.setInterval(r.interval)},this.setInterval=function(e){r.interval=e,r.transport.setLoopInterval(r.interval.multiply(r.values.length))},this.start=function(e){return r.transport.start(e)},this.stop=function(e){return r.transport.stop(e)},this.callback=t,this.interval=n,this.transport=new V(n.multiply(Math.max(o.length,1))),this.transportEventIds=[],this.transport.setLoopInterval(n)},X=function(e){var t=e.isToggled,n=e.toggle,r=e.isActive;return Object(F.jsx)("div",{style:{width:20,height:20,border:"4px solid ".concat(r?"orange":"transparent"),backgroundColor:t?"#555":"#bbb",margin:2,padding:0,display:"inline-block",borderRadius:"1px"},onClick:n})},W={sequencer:function(e){var t=e.useData,n=e.useBangInputHandle,o=(e.useBangOutputHandle,e.useBangOutputHandles),a=t(16,"no-cols"),u=Object(E.a)(a,2),i=u[0],c=(u[1],t(4,"no-rows")),d=Object(E.a)(c,2),l=d[0],f=(d[1],t(Array(i).fill().map((function(){return Array(l).fill(!1)})),"bang-grid")),p=Object(E.a)(f,2),h=p[0],g=p[1],b=Object(r.useState)(-1),v=Object(E.a)(b,2),O=v[0],m=v[1],I=o(h[0].map((function(e,t){return"bang-out-".concat(t)}))),S=Object(r.useState)((function(){return new J((function(e,t,n){t.map((function(t,n){t&&I[n](e)})),e.scheduleDraw((function(){return m(n)}))}),R("0:0:1"))})),x=Object(E.a)(S,1)[0];return n((function(e){return x.start(e)}),"sequencer-start"),Object(r.useEffect)((function(){return x.setValues(h)}),[h]),M((function(){return m(-1)})),j.a.zip.apply(j.a,Object(s.a)(h)).map((function(e,t){return Object(F.jsx)("div",{children:e.map((function(e,n){return Object(F.jsx)(X,{isToggled:e,toggle:function(){return function(e,t){return g((function(n){return n.map((function(n,r){return r!==t?n:n.map((function(t,n){return n!==e?t:!t}))}))}))}(t,n)},isActive:O===n},n)}))},t)}))},comment:function(e){var t=e.useData,n=t("Hello"),r=Object(E.a)(n,2),o=r[0],a=r[1],u=t("There"),i=Object(E.a)(u,2),c=i[0],s=i[1];return Object(F.jsxs)(F.Fragment,{children:[Object(F.jsx)(g.a.TextArea,{autoSize:{minRows:1,maxRows:5},bordered:!1,value:o,placeholder:"Add comment...",onChange:function(e){return a(e.target.value)}}),Object(F.jsx)(g.a.TextArea,{autoSize:{minRows:1,maxRows:5},bordered:!1,value:c,placeholder:"Add comment...",onChange:function(e){return s(e.target.value)}})]})},urbang:function(e){var t=e.useTitle,n=e.useBangOutputHandle;t();var o=Object(r.useState)(!1),a=Object(E.a)(o,2),u=a[0],i=a[1];P((function(){return i(!0)})),M((function(){return i(!1)}));var c=n("urbang-out");return P((function(){return A.now().add(B(.1)).schedule(c)})),u?Object(F.jsx)(b.a,{onClick:function(){return A.stop()},children:"\ud83d\udfe6"}):Object(F.jsx)(b.a,{onClick:function(){return A.start()},children:"\ud83d\udca5"})},sampler:function(e){var t=e.useTitle,n=e.useAudioOutputHandle,o=e.useBangInputHandle,a=e.useData;t("Sampler");var u=Object(r.useState)((function(){return new w.c})),i=Object(E.a)(u,1)[0],s=Object(r.useRef)();n(i.output,"audio-out"),o((function(e){return function(e){var t,n=null!==(t=s.current)&&void 0!==t?t:B(-1);n.isOnOrAfter(e)?console.error("Tried scheduling player playback in non-increasing fashion. Last playback: ".concat(n,", current playback: ").concat(e)):(s.current=e,i.start(e.toSeconds()))}(e)}),"player-start");var d=a(!1,"loop"),l=Object(E.a)(d,2),f=l[0],p=l[1],h=a("808/Clap","path"),v=Object(E.a)(h,2),j=v[0],O=v[1];Object(r.useEffect)((function(){return i.set({loop:f})}),[f]);var m=Object(r.useState)(!1),I=Object(E.a)(m,2),S=I[0],x=I[1];return Object(r.useEffect)((function(){x(!1);var e="sounds/drums/".concat(j,".wav");i.load(e).then((function(){return x(!0)}))}),[j]),M((function(){return i.stop()})),Object(F.jsxs)(F.Fragment,{children:[Object(F.jsx)(c.a,{style:{width:"120px"},children:Object(F.jsx)(g.a,{onPressEnter:function(e){return O(e.target.value)},defaultValue:j})}),Object(F.jsx)(K.a,{onChange:function(e){return p(e.target.checked)},checked:f,children:"Loop"}),Object(F.jsx)(b.a,{onClick:function(){return i.start()},disabled:!S,children:"Play"})]})},audioout:function(e){(0,e.useAudioInputHandle)(w.e(),"master-in");var t=Object(r.useState)(!1),n=Object(E.a)(t,2),o=n[0],a=n[1];return Object(F.jsx)(b.a,{onClick:function(){w.f(),a(!0)},type:o?"text":"default",children:"\ud83d\udd0a"})}},Z={audio:function(e){var t=e.selected,n=Object(S.a)(e,["selected"]);return Object(r.useEffect)((function(){return m.connectNodes(n.sourceHandleId,n.targetHandleId),function(){return m.disconnectNodes(n.sourceHandleId,n.targetHandleId)}}),[]),Object(F.jsx)(_,Object(p.a)(Object(p.a)({},n),{},{style:{strokeWidth:3,fill:"none",stroke:t?"#555":"#cccc"}}))},bang:function(e){var t=e.selected,n=Object(S.a)(e,["selected"]);Object(r.useEffect)((function(){return I.connectNodes(n.sourceHandleId,n.targetHandleId),function(){return I.disconnectNodes(n.sourceHandleId,n.targetHandleId)}}),[]);var o=Object(r.useState)(!1),a=Object(E.a)(o,2),u=a[0],i=a[1],c=function(e){return A.scheduleDraw((function(){i(!0),setTimeout((function(){return i(!1)}),100)}),e)},s="edge(".concat(n.sourceHandleId,"-").concat(n.targetHandleId,")");Object(r.useEffect)((function(){return I.registerInputNode(s,c),function(){return I.deregisterInputNode(s)}}),[]),Object(r.useEffect)((function(){return I.connectNodes(n.sourceHandleId,s),function(){return I.disconnectNodes(n.sourceHandleId,s)}}),[]);var d=u?"orange":t?"#555":"#ccc";return Object(F.jsx)(_,Object(p.a)(Object(p.a)({},n),{},{style:{strokeWidth:3,fill:"none",stroke:d}}))}},$=[{id:"urbang",type:"urbang",position:{x:100,y:100}},{id:"audioout",type:"audioout",position:{x:300,y:300}}].map((function(e){var t;return Object(p.a)(Object(p.a)({},e),{},{position:Object(p.a)({},null!==(t=e.position)&&void 0!==t?t:{x:100,y:100})})})),ee=function(e){Object(l.a)(n,e);var t=Object(f.a)(n);function n(e){var o;return Object(d.a)(this,n),(o=t.call(this,e)).localStorageKey="graph",o.componentDidMount=function(){var e;o.loadGraph(),o.idCounter=null!==(e=o.idCounter)&&void 0!==e?e:0},o.getUniqueId=function(){return o.state.elements.length+1},o.addElement=function(e){o.setState((function(t){return{elements:[].concat(Object(s.a)(t.elements),[e])}}))},o.removeElement=function(e){o.setState((function(t){return{elements:j.a.reject(t.elements,{id:e.id})}}))},o.addEdge=function(e){var t=e.source,n=e.sourceHandle,r=e.target,a=e.targetHandle,u="edge(".concat(t,"//").concat(n," >> ").concat(r,"//").concat(a,")");o.addElement(Object(p.a)(Object(p.a)({},e),{},{id:u}))},o.findEdge=function(e){var t=e.source,n=e.target;return o.state.elements.find((function(e){var r=e.source_,o=e.target_;return r===t&&o===n}))},o.removeEdge=function(e){var t=e.source,n=e.target,r=o.findEdge({source:t,target:n});o.removeElement(r)},o.addNode=function(e){var t=e.type,n=e.position,r=e.data,a="n(".concat(t,", )");o.addElement({id:a,type:t,position:n,data:Object(p.a)(Object(p.a)({},r),{},{setData:function(e){o.setNode(a,{data:e})}})})},o.findNode=function(e){return o.state.elements.find((function(t){return t.id_===e}))},o.setNode=function(e,t){var n=o.findNode(e);o.removeNode(e),o.addNode(Object(p.a)(Object(p.a)({id:e},n),t))},o.removeNode=function(e){var t=e.id,n=o.findNode(t);o.removeElement(n)},o.onReactFlowLoad=function(e){o.reactFlowInstance=e},o.getGraphAsReactFlowObject=function(){var e=Array.from(z).map((function(e){return e.getAsReactFlowElement()})),t=o.reactFlowInstance.getElements(),n=function(t){var n;return null===(n=e.find((function(e){return e.id===t})))||void 0===n?void 0:n.data};return t.map((function(e){return Object(p.a)(Object(p.a)({},e),{},{position:(r=e.id,t.find((function(e){return e.id===r})).position),data:n(e.id)});var r}))},o.saveGraph=function(){var e=o.getGraphAsReactFlowObject();localStorage.setItem(o.localStorageKey,JSON.stringify(e))},o.loadGraph=function(){var e,t=null!==(e=JSON.parse(localStorage.getItem(o.localStorageKey)))&&void 0!==e?e:$;o.setState({elements:t})},o.clearSaved=function(){localStorage.removeItem(o.localStorageKey)},o.addNodeOfType=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{x:100,y:100},n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:void 0;if(e in o.nodeTypes){var r="".concat(e,"(").concat(o.getUniqueId(),")");console.log("New id",r);var a={id:r,type:e,position:t,data:n};o.setState((function(e){return{elements:[].concat(Object(s.a)(e.elements),[a])}}))}else console.error("No node of type",e)},o.onConnectHandles=function(e){var t=e.sourceHandle,n=e.targetHandle;o.audioGraph.isAudioNode(t)&&o.audioGraph.isAudioNode(n)?o.addEdge(Object(p.a)(Object(p.a)({},e),{},{type:"audio"})):o.bangGraph.isBangNode(t)&&o.bangGraph.isBangNode(n)?o.addEdge(Object(p.a)(Object(p.a)({},e),{},{type:"bang"})):console.log("Can't connect handles ",t,"and",n,"of different types")},o.onElementsRemove=function(e){e.forEach((function(e){"source"in e?o.onEdgeRemove(e):o.onNodeRemove(e)}))},o.onEdgeRemove=function(e){o.removeElement(e)},o.onNodeRemove=function(e){o.removeElement(e)},o.onPaneClick=function(e){e.preventDefault(),e.stopPropagation(),console.log(e),o.setState({addNodePopup:{position:{x:e.pageX-20,y:e.pageY-25},visible:!0}})},o.onDragOver=function(e){e.preventDefault(),e.dataTransfer.dropEffect="move"},o.onDrop=function(e){e.preventDefault();var t=JSON.parse(e.dataTransfer.getData("app/audio-tool/preset-dnd")),n=o.reactFlowInstance.project({x:e.clientX,y:e.clientY});o.addNodeOfType(t.type,n,t.data)},o.render=function(){return Object(F.jsx)(h.a,{style:{margin:10},children:Object(F.jsxs)("div",{style:{height:900},children:[Object(F.jsx)(g.a.Group,{children:Object(F.jsxs)(i.a,{gutter:5,children:[Object(F.jsx)(c.a,{children:Object(F.jsx)(b.a,{onClick:function(){return o.saveGraph()},children:"Save"})}),Object(F.jsx)(c.a,{children:Object(F.jsx)(b.a,{onClick:function(){return o.clearSaved()},children:"Clear"})})]})}),Object(F.jsx)(O.e,{children:Object(F.jsxs)(O.f,{elements:o.state.elements,nodeTypes:o.nodeTypes,edgeTypes:o.edgeTypes,onLoad:o.onReactFlowLoad,onConnect:o.onConnectHandles,deleteKeyCode:"Delete",onElementsRemove:o.onElementsRemove,onDragOver:o.onDragOver,onDrop:o.onDrop,onContextMenu:o.onPaneClick,children:[Object(F.jsx)(O.a,{variant:"dots",gap:24,size:.5}),Object(F.jsx)(O.d,{}),Object(F.jsx)(O.b,{})]})}),o.state.addNodePopup.visible?Object(F.jsx)("div",{style:{left:o.state.addNodePopup.position.x+"px",top:o.state.addNodePopup.position.y+"px",position:"absolute"},children:Object(F.jsx)(g.a,{placeholder:"Add new element...",onPressEnter:function(e){o.addNodeOfType(e.target.value,o.state.addNodePopup.position),e.target.blur()},autoFocus:!0,onBlur:function(){return o.setState({addNodePopup:{visible:!1}})}})}):Object(F.jsx)(F.Fragment,{})]})})},o.state={elements:e.elements,addNodePopup:{position:{x:0,y:0},visible:!1}},o.reactFlowInstance=null,o.audioGraph=m,o.bangGraph=I,o.nodeTypes=j.a.mapValues(W,(function(e){return t=e,function(e){Object(l.a)(o,e);var n=Object(f.a)(o);function o(e){var a,u;return Object(d.a)(this,o),(u=n.call(this,e)).createUniqueId=function(){var e;return u._idCounter=(null!==(e=u._idCounter)&&void 0!==e?e:-1)+1,u._idCounter},u.pushHandle=function(e,t,n,r){var o={id:e,kind:t,type:n,position:r};u.setState((function(e){return{handles:[].concat(Object(s.a)(e.handles),[o])}}))},u.pullHandle=function(e){u.setState((function(t){return{handles:j.a.reject(t.handles,{id:e})}}))},u.getData=function(){return u.data},u.toAudioNodeIdentifier=function(e){return"audioNode(".concat(u.id,"//").concat(e,")")},u.toBangInputNodeIdentifier=function(e){return"bangInputNode(".concat(u.id,"//").concat(e,")")},u.toBangOutputNodeIdentifier=function(e){return"bangOutputNode(".concat(u.id,"//").concat(e,")")},u.addAudioInputHandle=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"top",r=u.toAudioNodeIdentifier(t);return m.registerNode(e,r),u.pushHandle(r,"audio","target",n),r},u.removeAudioInputHandle=function(e){var t=u.toAudioNodeIdentifier(e);m.deregisterNode(t),u.pullHandle(t)},u.addAudioOutputHandle=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"bottom",r=u.toAudioNodeIdentifier(t);return m.registerNode(e,r),u.pushHandle(r,"audio","source",n),r},u.removeAudioOutputHandle=function(e){var t=u.toAudioNodeIdentifier(e);m.deregisterNode(t),u.pullHandle(t)},u.addBangInputHandle=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"left",r=u.toBangInputNodeIdentifier(t);return I.registerInputNode(r,e),u.pushHandle(r,"bang","target",n),r},u.removeBangInputHandle=function(e){var t=u.toBangInputNodeIdentifier(e);I.deregisterInputNode(t),u.pullHandle(t)},u.addBangOutputHandle=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"right",n=u.toBangOutputNodeIdentifier(e),r=I.registerOutputNode(n);return u.pushHandle(n,"bang","source",t),[n,r]},u.removeBangOutputHandle=function(e){var t=u.toBangInputNodeIdentifier(e);I.deregisterOutputNode(t),u.pullHandle(t)},u.componentDidMount=function(){z.add(Object(x.a)(u)),u.nodeComponent=Object(F.jsx)(t,{useTitle:function(e){return Object(r.useEffect)((function(){return u.setState({title:e})}),[e])},useData:function(e,t,n){var o=Object(r.useState)((function(){return void 0===t?u.useDataCallsiteIdCounter++:t})),a=Object(E.a)(o,1)[0],i=Object(r.useState)((function(){var t;return a in(null!==(t=u.props.data)&&void 0!==t?t:{})&&!n?u.props.data[a]:e})),c=Object(E.a)(i,2),s=c[0],d=c[1];return Object(r.useEffect)((function(){u.data[a]=s}),[]),[s,function(e){u.data[a]=e instanceof Function?e(u.data[a]):e,d(e)}]},useAudioInputHandle:function(e,t,n){Object(r.useEffect)((function(){return u.addAudioInputHandle(e,t,n),function(){return u.removeAudioInputHandle(t)}}),[])},useAudioOutputHandle:function(e,t,n){Object(r.useEffect)((function(){return u.addAudioOutputHandle(e,t,n),function(){u.removeAudioOutputHandle(t)}}),[])},useBangInputHandle:function(e,t,n){Object(r.useEffect)((function(){return u.addBangInputHandle(e,t,n),function(){u.removeBangInputHandle(t)}}),[])},useBangOutputHandle:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"right",n=Object(r.useState)((function(){return u.toBangOutputNodeIdentifier(e)})),o=Object(E.a)(n,1)[0],a=Object(r.useState)((function(){return I.registerOutputNode(o)})),i=Object(E.a)(a,1)[0];return Object(r.useEffect)((function(){return u.pushHandle(o,"bang","source",t),function(){return I.deregisterOutputNode(o)}}),[]),i},useBangOutputHandles:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"right",n=Object(r.useState)((function(){return e.map((function(e){return u.toBangOutputNodeIdentifier(e)}))})),o=Object(E.a)(n,1)[0],a=Object(r.useState)((function(){return o.map((function(e){return I.registerOutputNode(e)}))})),i=Object(E.a)(a,1)[0];return Object(r.useEffect)((function(){return o.map((function(e){return u.pushHandle(e,"bang","source",t)})),function(){o.map((function(e){return I.deregisterOutputNode(e)})),o.map((function(e){return u.pullHandle(e)}))}}),e),i}})},u.componentWillUnmount=function(){z.delete(Object(x.a)(u))},u.getAsReactFlowElement=function(){return{data:u.getData(),id:u.id,type:u.type}},u.id=e.id,u.type=e.type,u.state={title:"",handles:[]},u.useDataCallsiteIdCounter=0,u.data=null!==(a=u.props.data)&&void 0!==a?a:{},u}return Object(G.a)(o,[{key:"render",value:function(){var e=this,t={border:"1px solid ".concat(this.props.selected?"black":"lightgrey"),minWidth:"30px",minHeight:"30px",fontSize:"smaller",borderRadius:"2px",boxShadow:"0px 0px 1px lightgrey",backgroundColor:"white",margin:"4px"},n=Object(F.jsx)("span",{style:{paddingLeft:5},children:Object(F.jsx)(L.a,{count:Object(F.jsx)(Q.a,{}),onClick:function(){return console.log(e.data)}})}),o=function(t){var n=80/(e.state.handles.length-1);return"".concat(20+n*t,"%")};return Object(F.jsxs)("div",{style:t,children:[this.state.handles.map((function(t,n){return Object(r.createElement)(Y,Object(p.a)(Object(p.a)({},t),{},{key:t.id,parentId:e.id,style:{top:o(n)}}))})),Object(F.jsxs)("div",{style:{backgroundColor:"rgb(235, 235, 235)",fontSize:"x-small",padding:"2px",paddingLeft:"6px",minHeight:"7px"},children:[this.state.title,n]}),Object(F.jsx)("div",{style:{padding:"3px",cursor:"pointer"},className:"nodrag",children:this.nodeComponent})]},this.id)}}]),o}(r.Component);var t})),o.edgeTypes=Z,o}return n}(r.Component),te=n(408),ne=n(406),re={sampler:[]};["Clap","Cow","Hihat1_closed","Hihat3_closed","Hihat_open","Kick","Snare","Snare3","Snare5","Clap2","Crash","Hihat2_closed","Hihat4_closed","Hihat_open_2","Kick2","Snare2","Snare4"].forEach((function(e){return re.sampler.push({name:"808 ".concat(e),data:{loop:!1,path:"808/".concat(e)}})}));var oe=function(e){return Object(F.jsx)(te.a,{style:{margin:10},children:Object.keys(re).map((function(e){return Object(F.jsx)(te.a.Panel,{header:e,children:Object(F.jsx)(ne.b,{size:"small",bordered:!0,dataSource:re[e],renderItem:function(t){return Object(F.jsx)(ne.b.Item,{draggable:!0,onDragStart:function(n){n.dataTransfer.setData("app/audio-tool/preset-dnd",JSON.stringify({type:e,data:t.data})),n.dataTransfer.effectAllowed="move"},children:t.name},t.name)}})},e)}))})};n(394),n(395);var ae=function(){return Object(F.jsxs)(i.a,{children:[Object(F.jsx)(c.a,{span:18,children:Object(F.jsx)(ee,{})}),Object(F.jsx)(c.a,{span:6,children:Object(F.jsx)(oe,{})})]})},ue=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,412)).then((function(t){var n=t.getCLS,r=t.getFID,o=t.getFCP,a=t.getLCP,u=t.getTTFB;n(e),r(e),o(e),a(e),u(e)}))};u.a.render(Object(F.jsx)(o.a.StrictMode,{children:Object(F.jsx)(ae,{})}),document.getElementById("root")),ue()}},[[396,1,2]]]);
//# sourceMappingURL=main.1cdc918e.chunk.js.map
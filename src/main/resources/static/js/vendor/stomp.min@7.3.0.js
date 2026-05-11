function e(e,t){e.terminate=function(){const s=()=>{};this.onerror=s;this.onmessage=s;this.onopen=s;const n=new Date;const i=Math.random().toString().substring(2,8);const o=this.onclose;this.onclose=e=>{const s=(new Date).getTime()-n.getTime();t(`Discarded socket (#${i})  closed after ${s}ms, with code/reason: ${e.code}/${e.reason}`)};this.close();o?.call(e,{code:4001,reason:`Quick discarding socket (#${i}) without waiting for the shutdown sequence.`,wasClean:false})}}const t={LF:"\n",NULL:"\0"};class FrameImpl{get body(){!this._body&&this.isBinaryBody&&(this._body=(new TextDecoder).decode(this._binaryBody));return this._body||""}get binaryBody(){this._binaryBody||this.isBinaryBody||(this._binaryBody=(new TextEncoder).encode(this._body));return this._binaryBody}constructor(e){const{command:t,headers:s,body:n,binaryBody:i,escapeHeaderValues:o,skipContentLengthHeader:r}=e;this.command=t;this.headers=Object.assign({},s||{});if(i){this._binaryBody=i;this.isBinaryBody=true}else{this._body=n||"";this.isBinaryBody=false}this.escapeHeaderValues=o||false;this.skipContentLengthHeader=r||false}static fromRawFrame(e,t){const s={};const n=e=>e.replace(/^\s+|\s+$/g,"");for(const i of e.headers.reverse()){i.indexOf(":");const o=n(i[0]);let r=n(i[1]);t&&e.command!=="CONNECT"&&e.command!=="CONNECTED"&&(r=FrameImpl.hdrValueUnEscape(r));s[o]=r}return new FrameImpl({command:e.command,headers:s,binaryBody:e.binaryBody,escapeHeaderValues:t})}toString(){return this.serializeCmdAndHeaders()}serialize(){const e=this.serializeCmdAndHeaders();return this.isBinaryBody?FrameImpl.toUnit8Array(e,this._binaryBody).buffer:e+this._body+t.NULL}serializeCmdAndHeaders(){const e=[this.command];this.skipContentLengthHeader&&delete this.headers["content-length"];for(const t of Object.keys(this.headers||{})){const s=this.headers[t];this.escapeHeaderValues&&this.command!=="CONNECT"&&this.command!=="CONNECTED"?e.push(`${t}:${FrameImpl.hdrValueEscape(`${s}`)}`):e.push(`${t}:${s}`)}(this.isBinaryBody||!this.isBodyEmpty()&&!this.skipContentLengthHeader)&&e.push(`content-length:${this.bodyLength()}`);return e.join(t.LF)+t.LF+t.LF}isBodyEmpty(){return this.bodyLength()===0}bodyLength(){const e=this.binaryBody;return e?e.length:0}static sizeOfUTF8(e){return e?(new TextEncoder).encode(e).length:0}static toUnit8Array(e,t){const s=(new TextEncoder).encode(e);const n=new Uint8Array([0]);const i=new Uint8Array(s.length+t.length+n.length);i.set(s);i.set(t,s.length);i.set(n,s.length+t.length);return i}static marshall(e){const t=new FrameImpl(e);return t.serialize()}static hdrValueEscape(e){return e.replace(/\\/g,"\\\\").replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/:/g,"\\c")}static hdrValueUnEscape(e){return e.replace(/\\r/g,"\r").replace(/\\n/g,"\n").replace(/\\c/g,":").replace(/\\\\/g,"\\")}}const s=0;const n=10;const i=13;const o=58;class Parser{constructor(e,t){this.onFrame=e;this.onIncomingPing=t;this._encoder=new TextEncoder;this._decoder=new TextDecoder;this._token=[];this._initState()}parseChunk(e,t=false){let s;s=typeof e==="string"?this._encoder.encode(e):new Uint8Array(e);if(t&&s[s.length-1]!==0){const e=new Uint8Array(s.length+1);e.set(s,0);e[s.length]=0;s=e}for(let e=0;e<s.length;e++){const t=s[e];this._onByte(t)}}_collectFrame(e){if(e!==s&&e!==i)if(e!==n){this._onByte=this._collectCommand;this._reinjectByte(e)}else this.onIncomingPing()}_collectCommand(e){if(e!==i)if(e!==n)this._consumeByte(e);else{this._results.command=this._consumeTokenAsUTF8();this._onByte=this._collectHeaders}}_collectHeaders(e){if(e!==i)if(e!==n){this._onByte=this._collectHeaderKey;this._reinjectByte(e)}else this._setupCollectBody()}_reinjectByte(e){this._onByte(e)}_collectHeaderKey(e){if(e!==o)this._consumeByte(e);else{this._headerKey=this._consumeTokenAsUTF8();this._onByte=this._collectHeaderValue}}_collectHeaderValue(e){if(e!==i)if(e!==n)this._consumeByte(e);else{this._results.headers.push([this._headerKey,this._consumeTokenAsUTF8()]);this._headerKey=void 0;this._onByte=this._collectHeaders}}_setupCollectBody(){const e=this._results.headers.filter((e=>e[0]==="content-length"))[0];if(e){this._bodyBytesRemaining=parseInt(e[1],10);this._onByte=this._collectBodyFixedSize}else this._onByte=this._collectBodyNullTerminated}_collectBodyNullTerminated(e){e!==s?this._consumeByte(e):this._retrievedBody()}_collectBodyFixedSize(e){this._bodyBytesRemaining--!==0?this._consumeByte(e):this._retrievedBody()}_retrievedBody(){this._results.binaryBody=this._consumeTokenAsRaw();try{this.onFrame(this._results)}catch(e){console.log("Ignoring an exception thrown by a frame handler. Original exception: ",e)}this._initState()}_consumeByte(e){this._token.push(e)}_consumeTokenAsUTF8(){return this._decoder.decode(this._consumeTokenAsRaw())}_consumeTokenAsRaw(){const e=new Uint8Array(this._token);this._token=[];return e}_initState(){this._results={command:void 0,headers:[],binaryBody:void 0};this._token=[];this._headerKey=void 0;this._onByte=this._collectFrame}}var r;(function(e){e[e.CONNECTING=0]="CONNECTING";e[e.OPEN=1]="OPEN";e[e.CLOSING=2]="CLOSING";e[e.CLOSED=3]="CLOSED"})(r||(r={}));var a;(function(e){e[e.ACTIVE=0]="ACTIVE";e[e.DEACTIVATING=1]="DEACTIVATING";e[e.INACTIVE=2]="INACTIVE"})(a||(a={}));var c;(function(e){e[e.LINEAR=0]="LINEAR";e[e.EXPONENTIAL=1]="EXPONENTIAL"})(c||(c={}));var h;(function(e){e.Interval="interval";e.Worker="worker"})(h||(h={}));class Ticker{constructor(e,t=h.Interval,s){this._interval=e;this._strategy=t;this._debug=s;this._workerScript=`\n    var startTime = Date.now();\n    setInterval(function() {\n        self.postMessage(Date.now() - startTime);\n    }, ${this._interval});\n  `}start(e){this.stop();this.shouldUseWorker()?this.runWorker(e):this.runInterval(e)}stop(){this.disposeWorker();this.disposeInterval()}shouldUseWorker(){return typeof Worker!=="undefined"&&this._strategy===h.Worker}runWorker(e){this._debug("Using runWorker for outgoing pings");if(!this._worker){this._worker=new Worker(URL.createObjectURL(new Blob([this._workerScript],{type:"text/javascript"})));this._worker.onmessage=t=>e(t.data)}}runInterval(e){this._debug("Using runInterval for outgoing pings");if(!this._timer){const t=Date.now();this._timer=setInterval((()=>{e(Date.now()-t)}),this._interval)}}disposeWorker(){if(this._worker){this._worker.terminate();delete this._worker;this._debug("Outgoing ping disposeWorker")}}disposeInterval(){if(this._timer){clearInterval(this._timer);delete this._timer;this._debug("Outgoing ping disposeInterval")}}}class Versions{constructor(e){this.versions=e}supportedVersions(){return this.versions.join(",")}protocolVersions(){return this.versions.map((e=>`v${e.replace(".","")}.stomp`))}}Versions.V1_0="1.0";Versions.V1_1="1.1";Versions.V1_2="1.2";Versions.default=new Versions([Versions.V1_2,Versions.V1_1,Versions.V1_0]);class StompHandler{get connectedVersion(){return this._connectedVersion}get connected(){return this._connected}constructor(e,t,s){this._client=e;this._webSocket=t;this._connected=false;this._serverFrameHandlers={CONNECTED:e=>{this.debug(`connected to server ${e.headers.server}`);this._connected=true;this._connectedVersion=e.headers.version;this._connectedVersion===Versions.V1_2&&(this._escapeHeaderValues=true);this._setupHeartbeat(e.headers);this.onConnect(e)},MESSAGE:e=>{const t=e.headers.subscription;const s=this._subscriptions[t]||this.onUnhandledMessage;const n=e;const i=this;const o=this._connectedVersion===Versions.V1_2?n.headers.ack:n.headers["message-id"];n.ack=(e={})=>i.ack(o,t,e);n.nack=(e={})=>i.nack(o,t,e);s(n)},RECEIPT:e=>{const t=this._receiptWatchers[e.headers["receipt-id"]];if(t){t(e);delete this._receiptWatchers[e.headers["receipt-id"]]}else this.onUnhandledReceipt(e)},ERROR:e=>{this.onStompError(e)}};this._counter=0;this._subscriptions={};this._receiptWatchers={};this._partialData="";this._escapeHeaderValues=false;this._lastServerActivityTS=Date.now();this.debug=s.debug;this.stompVersions=s.stompVersions;this.connectHeaders=s.connectHeaders;this.disconnectHeaders=s.disconnectHeaders;this.heartbeatIncoming=s.heartbeatIncoming;this.heartbeatToleranceMultiplier=s.heartbeatGracePeriods;this.heartbeatOutgoing=s.heartbeatOutgoing;this.splitLargeFrames=s.splitLargeFrames;this.maxWebSocketChunkSize=s.maxWebSocketChunkSize;this.forceBinaryWSFrames=s.forceBinaryWSFrames;this.logRawCommunication=s.logRawCommunication;this.appendMissingNULLonIncoming=s.appendMissingNULLonIncoming;this.discardWebsocketOnCommFailure=s.discardWebsocketOnCommFailure;this.onConnect=s.onConnect;this.onDisconnect=s.onDisconnect;this.onStompError=s.onStompError;this.onWebSocketClose=s.onWebSocketClose;this.onWebSocketError=s.onWebSocketError;this.onUnhandledMessage=s.onUnhandledMessage;this.onUnhandledReceipt=s.onUnhandledReceipt;this.onUnhandledFrame=s.onUnhandledFrame;this.onHeartbeatReceived=s.onHeartbeatReceived;this.onHeartbeatLost=s.onHeartbeatLost}start(){const e=new Parser((e=>{const t=FrameImpl.fromRawFrame(e,this._escapeHeaderValues);this.logRawCommunication||this.debug(`<<< ${t}`);const s=this._serverFrameHandlers[t.command]||this.onUnhandledFrame;s(t)}),(()=>{this.debug("<<< PONG");this.onHeartbeatReceived()}));this._webSocket.onmessage=t=>{this.debug("Received data");this._lastServerActivityTS=Date.now();if(this.logRawCommunication){const e=t.data instanceof ArrayBuffer?(new TextDecoder).decode(t.data):t.data;this.debug(`<<< ${e}`)}e.parseChunk(t.data,this.appendMissingNULLonIncoming)};this._webSocket.onclose=e=>{this.debug(`Connection closed to ${this._webSocket.url}`);this._cleanUp();this.onWebSocketClose(e)};this._webSocket.onerror=e=>{this.onWebSocketError(e)};const t=()=>{const e=Object.assign({},this.connectHeaders);this.debug("Web Socket Opened...");e["accept-version"]=this.stompVersions.supportedVersions();e["heart-beat"]=[this.heartbeatOutgoing,this.heartbeatIncoming].join(",");this._transmit({command:"CONNECT",headers:e})};this._webSocket.readyState===r.OPEN?t():this._webSocket.onopen=t}_setupHeartbeat(e){if(e.version!==Versions.V1_1&&e.version!==Versions.V1_2)return;if(!e["heart-beat"])return;const[s,n]=e["heart-beat"].split(",").map((e=>parseInt(e,10)));if(this.heartbeatOutgoing!==0&&n!==0){const e=Math.max(this.heartbeatOutgoing,n);this.debug(`send PING every ${e}ms`);this._pinger=new Ticker(e,this._client.heartbeatStrategy,this.debug);this._pinger.start((()=>{if(this._webSocket.readyState===r.OPEN){this._webSocket.send(t.LF);this.debug(">>> PING")}}))}if(this.heartbeatIncoming!==0&&s!==0){const e=Math.max(this.heartbeatIncoming,s);this.debug(`check PONG every ${e}ms`);this._ponger=setInterval((()=>{const t=Date.now()-this._lastServerActivityTS;if(t>e*this.heartbeatToleranceMultiplier){this.debug(`did not receive server activity for the last ${t}ms`);this.onHeartbeatLost();this._closeOrDiscardWebsocket()}}),e)}}_closeOrDiscardWebsocket(){if(this.discardWebsocketOnCommFailure){this.debug("Discarding websocket, the underlying socket may linger for a while");this.discardWebsocket()}else{this.debug("Issuing close on the websocket");this._closeWebsocket()}}forceDisconnect(){this._webSocket&&(this._webSocket.readyState!==r.CONNECTING&&this._webSocket.readyState!==r.OPEN||this._closeOrDiscardWebsocket())}_closeWebsocket(){this._webSocket.onmessage=()=>{};this._webSocket.close()}discardWebsocket(){typeof this._webSocket.terminate!=="function"&&e(this._webSocket,(e=>this.debug(e)));this._webSocket.terminate()}_transmit(e){const{command:t,headers:s,body:n,binaryBody:i,skipContentLengthHeader:o}=e;const r=new FrameImpl({command:t,headers:s,body:n,binaryBody:i,escapeHeaderValues:this._escapeHeaderValues,skipContentLengthHeader:o});let a=r.serialize();this.logRawCommunication?this.debug(`>>> ${a}`):this.debug(`>>> ${r}`);this.forceBinaryWSFrames&&typeof a==="string"&&(a=(new TextEncoder).encode(a));if(typeof a==="string"&&this.splitLargeFrames){let e=a;while(e.length>0){const t=e.substring(0,this.maxWebSocketChunkSize);e=e.substring(this.maxWebSocketChunkSize);this._webSocket.send(t);this.debug(`chunk sent = ${t.length}, remaining = ${e.length}`)}}else this._webSocket.send(a)}dispose(){if(this.connected)try{const e=Object.assign({},this.disconnectHeaders);e.receipt||(e.receipt="close-"+this._counter++);this.watchForReceipt(e.receipt,(e=>{this._closeWebsocket();this._cleanUp();this.onDisconnect(e)}));this._transmit({command:"DISCONNECT",headers:e})}catch(e){this.debug(`Ignoring error during disconnect ${e}`)}else this._webSocket.readyState!==r.CONNECTING&&this._webSocket.readyState!==r.OPEN||this._closeWebsocket()}_cleanUp(){this._connected=false;if(this._pinger){this._pinger.stop();this._pinger=void 0}if(this._ponger){clearInterval(this._ponger);this._ponger=void 0}}publish(e){const{destination:t,headers:s,body:n,binaryBody:i,skipContentLengthHeader:o}=e;const r=Object.assign({destination:t},s);this._transmit({command:"SEND",headers:r,body:n,binaryBody:i,skipContentLengthHeader:o})}watchForReceipt(e,t){this._receiptWatchers[e]=t}subscribe(e,t,s={}){s=Object.assign({},s);s.id||(s.id="sub-"+this._counter++);s.destination=e;this._subscriptions[s.id]=t;this._transmit({command:"SUBSCRIBE",headers:s});const n=this;return{id:s.id,unsubscribe(e){return n.unsubscribe(s.id,e)}}}unsubscribe(e,t={}){t=Object.assign({},t);delete this._subscriptions[e];t.id=e;this._transmit({command:"UNSUBSCRIBE",headers:t})}begin(e){const t=e||"tx-"+this._counter++;this._transmit({command:"BEGIN",headers:{transaction:t}});const s=this;return{id:t,commit(){s.commit(t)},abort(){s.abort(t)}}}commit(e){this._transmit({command:"COMMIT",headers:{transaction:e}})}abort(e){this._transmit({command:"ABORT",headers:{transaction:e}})}ack(e,t,s={}){s=Object.assign({},s);this._connectedVersion===Versions.V1_2?s.id=e:s["message-id"]=e;s.subscription=t;this._transmit({command:"ACK",headers:s})}nack(e,t,s={}){s=Object.assign({},s);this._connectedVersion===Versions.V1_2?s.id=e:s["message-id"]=e;s.subscription=t;return this._transmit({command:"NACK",headers:s})}}class Client{
/**
     * Provides access to the underlying WebSocket instance.
     * This property is **read-only**.
     *
     * Example:
     * ```javascript
     * const webSocket = client.webSocket;
     * if (webSocket) {
     *   console.log('WebSocket is connected:', webSocket.readyState === WebSocket.OPEN);
     * }
     * ```
     *
     * **Caution:**
     * Directly interacting with the WebSocket instance (e.g., sending or receiving frames)
     * can interfere with the proper functioning of this library. Such actions may cause
     * unexpected behavior, disconnections, or invalid state in the library's internal mechanisms.
     *
     * Instead, use the library's provided methods to manage STOMP communication.
     *
     * @returns The WebSocket instance used by the STOMP handler, or `undefined` if not connected.
     */
get webSocket(){return this._stompHandler?._webSocket}get disconnectHeaders(){return this._disconnectHeaders}set disconnectHeaders(e){this._disconnectHeaders=e;this._stompHandler&&(this._stompHandler.disconnectHeaders=this._disconnectHeaders)}
/**
     * Indicates whether there is an active connection to the STOMP broker.
     *
     * Usage:
     * ```javascript
     * if (client.connected) {
     *   console.log('Client is connected to the broker.');
     * } else {
     *   console.log('No connection to the broker.');
     * }
     * ```
     *
     * @returns `true` if the client is currently connected, `false` otherwise.
     */get connected(){return!!this._stompHandler&&this._stompHandler.connected}
/**
     * The version of the STOMP protocol negotiated with the server during connection.
     *
     * This is a **read-only** property and reflects the negotiated protocol version after
     * a successful connection.
     *
     * Example:
     * ```javascript
     * console.log('Connected STOMP version:', client.connectedVersion);
     * ```
     *
     * @returns The negotiated STOMP protocol version or `undefined` if not connected.
     */get connectedVersion(){return this._stompHandler?this._stompHandler.connectedVersion:void 0}
/**
     * Indicates whether the client is currently active.
     *
     * A client is considered active if it is connected or actively attempting to reconnect.
     *
     * Example:
     * ```javascript
     * if (client.active) {
     *   console.log('The client is active.');
     * } else {
     *   console.log('The client is inactive.');
     * }
     * ```
     *
     * @returns `true` if the client is active, otherwise `false`.
     */get active(){return this.state===a.ACTIVE}_changeState(e){this.state=e;this.onChangeState(e)}
/**
     * Constructs a new STOMP client instance.
     *
     * The constructor initializes default values and sets up no-op callbacks for all events.
     * Configuration can be passed during construction, or updated later using `configure`.
     *
     * Example:
     * ```javascript
     * const client = new Client({
     *   brokerURL: 'wss://broker.example.com',
     *   reconnectDelay: 5000
     * });
     * ```
     *
     * @param conf Optional configuration object to initialize the client with.
     */constructor(e={}){this.stompVersions=Versions.default;this.connectionTimeout=0;this.reconnectDelay=5e3;this._nextReconnectDelay=0;this.maxReconnectDelay=9e5;this.reconnectTimeMode=c.LINEAR;this.heartbeatIncoming=1e4;this.heartbeatToleranceMultiplier=2;this.heartbeatOutgoing=1e4;this.heartbeatStrategy=h.Interval;this.splitLargeFrames=false;this.maxWebSocketChunkSize=8192;this.forceBinaryWSFrames=false;this.appendMissingNULLonIncoming=false;this.discardWebsocketOnCommFailure=false;this.state=a.INACTIVE;const t=()=>{};this.debug=t;this.beforeConnect=t;this.onConnect=t;this.onDisconnect=t;this.onUnhandledMessage=t;this.onUnhandledReceipt=t;this.onUnhandledFrame=t;this.onHeartbeatReceived=t;this.onHeartbeatLost=t;this.onStompError=t;this.onWebSocketClose=t;this.onWebSocketError=t;this.logRawCommunication=false;this.onChangeState=t;this.connectHeaders={};this._disconnectHeaders={};this.configure(e)}
/**
     * Updates the client's configuration.
     *
     * All properties in the provided configuration object will override the current settings.
     *
     * Additionally, a warning is logged if `maxReconnectDelay` is configured to a
     * value lower than `reconnectDelay`, and `maxReconnectDelay` is adjusted to match `reconnectDelay`.
     *
     * Example:
     * ```javascript
     * client.configure({
     *   reconnectDelay: 3000,
     *   maxReconnectDelay: 10000
     * });
     * ```
     *
     * @param conf Configuration object containing the new settings.
     */configure(e){Object.assign(this,e);if(this.maxReconnectDelay>0&&this.maxReconnectDelay<this.reconnectDelay){this.debug(`Warning: maxReconnectDelay (${this.maxReconnectDelay}ms) is less than reconnectDelay (${this.reconnectDelay}ms). Using reconnectDelay as the maxReconnectDelay delay.`);this.maxReconnectDelay=this.reconnectDelay}}activate(){const e=()=>{if(this.active)this.debug("Already ACTIVE, ignoring request to activate");else{this._changeState(a.ACTIVE);this._nextReconnectDelay=this.reconnectDelay;this._connect()}};if(this.state===a.DEACTIVATING){this.debug("Waiting for deactivation to finish before activating");this.deactivate().then((()=>{e()}))}else e()}async _connect(){await this.beforeConnect(this);if(this._stompHandler){this.debug("There is already a stompHandler, skipping the call to connect");return}if(!this.active){this.debug("Client has been marked inactive, will not attempt to connect");return}if(this.connectionTimeout>0){this._connectionWatcher&&clearTimeout(this._connectionWatcher);this._connectionWatcher=setTimeout((()=>{if(!this.connected){this.debug(`Connection not established in ${this.connectionTimeout}ms, closing socket`);this.forceDisconnect()}}),this.connectionTimeout)}this.debug("Opening Web Socket...");const e=this._createWebSocket();this._stompHandler=new StompHandler(this,e,{debug:this.debug,stompVersions:this.stompVersions,connectHeaders:this.connectHeaders,disconnectHeaders:this._disconnectHeaders,heartbeatIncoming:this.heartbeatIncoming,heartbeatGracePeriods:this.heartbeatToleranceMultiplier,heartbeatOutgoing:this.heartbeatOutgoing,heartbeatStrategy:this.heartbeatStrategy,splitLargeFrames:this.splitLargeFrames,maxWebSocketChunkSize:this.maxWebSocketChunkSize,forceBinaryWSFrames:this.forceBinaryWSFrames,logRawCommunication:this.logRawCommunication,appendMissingNULLonIncoming:this.appendMissingNULLonIncoming,discardWebsocketOnCommFailure:this.discardWebsocketOnCommFailure,onConnect:e=>{if(this._connectionWatcher){clearTimeout(this._connectionWatcher);this._connectionWatcher=void 0}this._nextReconnectDelay=this.reconnectDelay;if(this.active)this.onConnect(e);else{this.debug("STOMP got connected while deactivate was issued, will disconnect now");this._disposeStompHandler()}},onDisconnect:e=>{this.onDisconnect(e)},onStompError:e=>{this.onStompError(e)},onWebSocketClose:e=>{this._stompHandler=void 0;this.state===a.DEACTIVATING&&this._changeState(a.INACTIVE);this.onWebSocketClose(e);this.active&&this._schedule_reconnect()},onWebSocketError:e=>{this.onWebSocketError(e)},onUnhandledMessage:e=>{this.onUnhandledMessage(e)},onUnhandledReceipt:e=>{this.onUnhandledReceipt(e)},onUnhandledFrame:e=>{this.onUnhandledFrame(e)},onHeartbeatReceived:()=>{this.onHeartbeatReceived()},onHeartbeatLost:()=>{this.onHeartbeatLost()}});this._stompHandler.start()}_createWebSocket(){let e;if(this.webSocketFactory)e=this.webSocketFactory();else{if(!this.brokerURL)throw new Error("Either brokerURL or webSocketFactory must be provided");e=new WebSocket(this.brokerURL,this.stompVersions.protocolVersions())}e.binaryType="arraybuffer";return e}_schedule_reconnect(){if(this._nextReconnectDelay>0){this.debug(`STOMP: scheduling reconnection in ${this._nextReconnectDelay}ms`);this._reconnector=setTimeout((()=>{if(this.reconnectTimeMode===c.EXPONENTIAL){this._nextReconnectDelay=this._nextReconnectDelay*2;this.maxReconnectDelay!==0&&(this._nextReconnectDelay=Math.min(this._nextReconnectDelay,this.maxReconnectDelay))}this._connect()}),this._nextReconnectDelay)}}
/**
     * Disconnects the client and stops the automatic reconnection loop.
     *
     * If there is an active STOMP connection at the time of invocation, the appropriate callbacks
     * will be triggered during the shutdown sequence. Once deactivated, the client will enter the
     * `INACTIVE` state, and no further reconnection attempts will be made.
     *
     * **Behavior**:
     * - If there is no active WebSocket connection, this method resolves immediately.
     * - If there is an active connection, the method waits for the underlying WebSocket
     *   to properly close before resolving.
     * - Multiple calls to this method are safe. Each invocation resolves upon completion.
     * - To reactivate, call [Client#activate]{@link Client#activate}.
     *
     * **Experimental Option:**
     * - By specifying the `force: true` option, the WebSocket connection is discarded immediately,
     *   bypassing both the STOMP and WebSocket shutdown sequences.
     * - **Caution:** Using `force: true` may leave the WebSocket in an inconsistent state,
     *   and brokers may not immediately detect the termination.
     *
     * Example:
     * ```javascript
     * // Graceful disconnect
     * await client.deactivate();
     *
     * // Forced disconnect to speed up shutdown when the connection is stale
     * await client.deactivate({ force: true });
     * ```
     *
     * @param options Configuration options for deactivation. Use `force: true` for immediate shutdown.
     * @returns A Promise that resolves when the deactivation process completes.
     */async deactivate(e={}){const t=e.force||false;const s=this.active;let n;if(this.state===a.INACTIVE){this.debug("Already INACTIVE, nothing more to do");return Promise.resolve()}this._changeState(a.DEACTIVATING);this._nextReconnectDelay=0;if(this._reconnector){clearTimeout(this._reconnector);this._reconnector=void 0}if(!this._stompHandler||this.webSocket.readyState===r.CLOSED){this._changeState(a.INACTIVE);return Promise.resolve()}{const e=this._stompHandler.onWebSocketClose;n=new Promise(((t,s)=>{this._stompHandler.onWebSocketClose=s=>{e(s);t()}}))}t?this._stompHandler?.discardWebsocket():s&&this._disposeStompHandler();return n}forceDisconnect(){this._stompHandler&&this._stompHandler.forceDisconnect()}_disposeStompHandler(){this._stompHandler&&this._stompHandler.dispose()}publish(e){this._checkConnection();this._stompHandler.publish(e)}_checkConnection(){if(!this.connected)throw new TypeError("There is no underlying STOMP connection")}
/**
     * Monitors for a receipt acknowledgment from the broker for specific operations.
     *
     * Add a `receipt` header to the operation (like subscribe or publish), and use this method with
     * the same receipt ID to detect when the broker has acknowledged the operation's completion.
     *
     * The callback is invoked with the corresponding {@link IFrame} when the receipt is received.
     *
     * Example:
     * ```javascript
     * const receiptId = "unique-receipt-id";
     *
     * client.watchForReceipt(receiptId, (frame) => {
     *   console.log("Operation acknowledged by the broker:", frame);
     * });
     *
     * // Attach the receipt header to an operation
     * client.publish({ destination: "/queue/test", headers: { receipt: receiptId }, body: "Hello" });
     * ```
     *
     * @param receiptId Unique identifier for the receipt.
     * @param callback Callback function invoked on receiving the RECEIPT frame.
     */watchForReceipt(e,t){this._checkConnection();this._stompHandler.watchForReceipt(e,t)}
/**
     * Subscribes to a destination on the STOMP broker.
     *
     * The callback is triggered for each message received from the subscribed destination. The message
     * is passed as an {@link IMessage} instance.
     *
     * **Subscription ID**:
     * - If no `id` is provided in `headers`, the library generates a unique subscription ID automatically.
     * - Provide an explicit `id` in `headers` if you wish to manage the subscription ID manually.
     *
     * Example:
     * ```javascript
     * const callback = (message) => {
     *   console.log("Received message:", message.body);
     * };
     *
     * // Auto-generated subscription ID
     * const subscription = client.subscribe("/queue/test", callback);
     *
     * // Explicit subscription ID
     * const mySubId = "my-subscription-id";
     * const subscription = client.subscribe("/queue/test", callback, { id: mySubId });
     * ```
     *
     * @param destination Destination to subscribe to.
     * @param callback Function invoked for each received message.
     * @param headers Optional headers for subscription, such as `id`.
     * @returns A {@link StompSubscription} which can be used to manage the subscription.
     */subscribe(e,t,s={}){this._checkConnection();return this._stompHandler.subscribe(e,t,s)}
/**
     * Unsubscribes from a subscription on the STOMP broker.
     *
     * Prefer using the `unsubscribe` method directly on the {@link StompSubscription} returned from `subscribe` for cleaner management:
     * ```javascript
     * const subscription = client.subscribe("/queue/test", callback);
     * // Unsubscribe using the subscription object
     * subscription.unsubscribe();
     * ```
     *
     * This method can also be used directly with the subscription ID.
     *
     * Example:
     * ```javascript
     * client.unsubscribe("my-subscription-id");
     * ```
     *
     * @param id Subscription ID to unsubscribe.
     * @param headers Optional headers to pass for the UNSUBSCRIBE frame.
     */unsubscribe(e,t={}){this._checkConnection();this._stompHandler.unsubscribe(e,t)}
/**
     * Starts a new transaction. The returned {@link ITransaction} object provides
     * methods for [commit]{@link ITransaction#commit} and [abort]{@link ITransaction#abort}.
     *
     * If `transactionId` is not provided, the library generates a unique ID internally.
     *
     * Example:
     * ```javascript
     * const tx = client.begin(); // Auto-generated ID
     *
     * // Or explicitly specify a transaction ID
     * const tx = client.begin("my-transaction-id");
     * ```
     *
     * @param transactionId Optional transaction ID.
     * @returns An instance of {@link ITransaction}.
     */begin(e){this._checkConnection();return this._stompHandler.begin(e)}
/**
     * Commits a transaction.
     *
     * It is strongly recommended to call [commit]{@link ITransaction#commit} on
     * the transaction object returned by [client#begin]{@link Client#begin}.
     *
     * Example:
     * ```javascript
     * const tx = client.begin();
     * // Perform operations under this transaction
     * tx.commit();
     * ```
     *
     * @param transactionId The ID of the transaction to commit.
     */commit(e){this._checkConnection();this._stompHandler.commit(e)}
/**
     * Aborts a transaction.
     *
     * It is strongly recommended to call [abort]{@link ITransaction#abort} directly
     * on the transaction object returned by [client#begin]{@link Client#begin}.
     *
     * Example:
     * ```javascript
     * const tx = client.begin();
     * // Perform operations under this transaction
     * tx.abort(); // Abort the transaction
     * ```
     *
     * @param transactionId The ID of the transaction to abort.
     */abort(e){this._checkConnection();this._stompHandler.abort(e)}
/**
     * Acknowledges receipt of a message. Typically, this should be done by calling
     * [ack]{@link IMessage#ack} directly on the {@link IMessage} instance passed
     * to the subscription callback.
     *
     * Example:
     * ```javascript
     * const callback = (message) => {
     *   // Process the message
     *   message.ack(); // Acknowledge the message
     * };
     *
     * client.subscribe("/queue/example", callback, { ack: "client" });
     * ```
     *
     * @param messageId The ID of the message to acknowledge.
     * @param subscriptionId The ID of the subscription.
     * @param headers Optional headers for the acknowledgment frame.
     */ack(e,t,s={}){this._checkConnection();this._stompHandler.ack(e,t,s)}
/**
     * Rejects a message (negative acknowledgment). Like acknowledgments, this should
     * typically be done by calling [nack]{@link IMessage#nack} directly on the {@link IMessage}
     * instance passed to the subscription callback.
     *
     * Example:
     * ```javascript
     * const callback = (message) => {
     *   // Process the message
     *   if (isError(message)) {
     *     message.nack(); // Reject the message
     *   }
     * };
     *
     * client.subscribe("/queue/example", callback, { ack: "client" });
     * ```
     *
     * @param messageId The ID of the message to negatively acknowledge.
     * @param subscriptionId The ID of the subscription.
     * @param headers Optional headers for the NACK frame.
     */nack(e,t,s={}){this._checkConnection();this._stompHandler.nack(e,t,s)}}class StompConfig{}class StompHeaders{}class HeartbeatInfo{constructor(e){this.client=e}get outgoing(){return this.client.heartbeatOutgoing}set outgoing(e){this.client.heartbeatOutgoing=e}get incoming(){return this.client.heartbeatIncoming}set incoming(e){this.client.heartbeatIncoming=e}}class CompatClient extends Client{constructor(e){super();this.maxWebSocketFrameSize=16384;this._heartbeatInfo=new HeartbeatInfo(this);this.reconnect_delay=0;this.webSocketFactory=e;this.debug=(...e)=>{console.log(...e)}}_parseConnect(...e){let t;let s;let n;let i={};if(e.length<2)throw new Error("Connect requires at least 2 arguments");if(typeof e[1]==="function")[i,s,n,t]=e;else switch(e.length){case 6:[i.login,i.passcode,s,n,t,i.host]=e;break;default:[i.login,i.passcode,s,n,t]=e}return[i,s,n,t]}connect(...e){const t=this._parseConnect(...e);t[0]&&(this.connectHeaders=t[0]);t[1]&&(this.onConnect=t[1]);t[2]&&(this.onStompError=t[2]);t[3]&&(this.onWebSocketClose=t[3]);super.activate()}disconnect(e,t={}){e&&(this.onDisconnect=e);this.disconnectHeaders=t;super.deactivate()}send(e,t={},s=""){t=Object.assign({},t);const n=t["content-length"]===false;n&&delete t["content-length"];this.publish({destination:e,headers:t,body:s,skipContentLengthHeader:n})}set reconnect_delay(e){this.reconnectDelay=e}get ws(){return this.webSocket}get version(){return this.connectedVersion}get onreceive(){return this.onUnhandledMessage}set onreceive(e){this.onUnhandledMessage=e}get onreceipt(){return this.onUnhandledReceipt}set onreceipt(e){this.onUnhandledReceipt=e}get heartbeat(){return this._heartbeatInfo}set heartbeat(e){this.heartbeatIncoming=e.incoming;this.heartbeatOutgoing=e.outgoing}}class Stomp{static client(e,t){t==null&&(t=Versions.default.protocolVersions());const s=()=>{const s=Stomp.WebSocketClass||WebSocket;return new s(e,t)};return new CompatClient(s)}static over(e){let t;if(typeof e==="function")t=e;else{console.warn("Stomp.over did not receive a factory, auto reconnect will not work. Please see https://stomp-js.github.io/api-docs/latest/classes/Stomp.html#over");t=()=>e}return new CompatClient(t)}}Stomp.WebSocketClass=null;export{a as ActivationState,Client,CompatClient,FrameImpl,Parser,c as ReconnectionTimeMode,Stomp,StompConfig,StompHeaders,r as StompSocketState,h as TickerStrategy,Versions};
//# sourceMappingURL=index.js.map

import Vue from 'vue';
import axios from 'axios';

class TMqClient {
    constructor() {
        this.config = {
            host: "dq.hhdata.cn",
            port: 31114,
            path: "",
            clientId: ['mqid', ((new Date()).getTime()).toString(), parseInt(1000 * Math.random()).toString()].join(''),
            uid: "student",
            pwd: "student",
            willMsg: {
                enable: true,
                topic: "/hh/ambulance/notify/all",
                msg: { msgId: 'offline', clientId: "" },
                willMsgClientId: ""
            },
            autoSubscribeTopics: [],
            responseTimeout: 10 * 1000,
            sysTopic: "/hh/ambV40"
        }
        this.events = {
            onDisconnected: e => {
                console.log('disconnect', e);
            },
            onRecMsg: (msg, topic, allData) => {
                console.log('rec msg.', topic, msg, allData);
            }
        }
        this.reqBuf = {};
        this.client = null;
        this.achandlers = {};
    }

    open() {
        var me = this;
        return new Promise((success, faild) => {
            try {
                var cb = function(callback, p0, p1, p2) {
                    try {
                        if (callback) {
                            callback(p0, p1, p2)
                        }
                    } catch (er) {
                        console.log(er);
                    }
                }
                var getOpts = function() {
                    var res = {
                        invocationContext: { host: me.config.host, port: me.config.port, path: me.config.path, clientId: me.config.clientId },
                        timeout: 10000,
                        keepAliveInterval: 60,
                        cleanSession: true,
                        useSSL: window.location.href.toLowerCase().indexOf("https://") >= 0,
                        reconnect: true,
                        userName: me.config.uid,
                        password: me.config.pwd,
                        onSuccess: function(e) {
                            //GateWay.Callback( GateWay.Events.OnConnected , GateWay);
                        },
                        onFailure: function(e) {
                            cb(me.events.onDisConnect, me.client, e);
                        }
                    };
                    if (me.config.willMsg.enable) {
                        var willMsg = me.config.willMsg.msg;
                        if (!willMsg || willMsg == null) {
                            willMsg = {};
                        }
                        willMsg.clientId = me.config.clientId;
                        willMsg.msgId = "offline";
                        willMsg.willMsgClientId = me.config.willMsg.willMsgClientId;
                        var wmsg = new Paho.Message(JSON.stringify(willMsg));
                        wmsg.destinationName = me.config.willMsg.topic;
                        res.willMessage = wmsg;
                    }
                    return res;
                }
                var client = new Paho.Client(me.config.host, Number(me.config.port), me.config.clientId);
                client.onConnected = function(e) {
                    console.log('connected');
                    if (me.config.autoSubscribeTopics && me.config.autoSubscribeTopics.length > 0) {
                        me.config.autoSubscribeTopics.forEach(topic => {
                            me.subscribe(topic);
                        })
                    }
                    success();
                };
                client.onConnectionLost = function(e) {
                    console.log('disconnect');
                    cb(me.events.onDisconnected);
                };
                client.onMessageArrived = function(e) {
                    var aResult = {
                        MsgContent: e.payloadString,
                        Topic: e.topic,
                        Retain: e.retained,
                        Qos: e.qos
                    };
                    try {
                        aResult.msg = JSON.parse(aResult.MsgContent);
                    } catch (Er) {
                        console.log(Er);
                    }
                    var isCallbackResult = aResult.msg.reqId && aResult.msg.reqId != null && aResult.msg.reqId.length > 0 &&
                        me.reqBuf && me.reqBuf[aResult.msg.reqId] && me.reqBuf[aResult.msg.reqId] != null;
                    if (isCallbackResult) {
                        var reqInfo = me.reqBuf[aResult.msg.reqId];
                        window.clearTimeout(reqInfo.timer);
                        delete client.reqBuf[aResult.msg.reqId];
                        try {
                            reqInfo.respMsg = aResult.msg;
                            reqInfo.handler(reqInfo);
                        } catch (Er) {
                            console.log(Er);
                        }
                    } else if (aResult.msg.msgId && aResult.msg.msgId != null && aResult.msg.msgId.length > 0 && me.achandlers[aResult.msg.msgId] && me.achandlers[aResult.msg.msgId] != null) {
                        try {
                            var handler = me.achandlers[aResult.msg.msgId];
                            if (handler && handler != null) {
                                handler(aResult.msg, aResult.Topic, aResult);
                            }
                        } catch (eer) {
                            console.log(eer);
                        }
                    } else {
                        cb(me.events.onRecMsg, aResult.msg, aResult.Topic, aResult);
                    }
                };
                client.connectionOptions = getOpts();
                me.client = client;
                client.connect(client.connectionOptions);

            } catch (er) {
                console.log(er);
                success();
            }
        })
    }
    close() {
        var me = this;
        try {
            if (me.client && me.client != null) {
                if (me.client.isConnected()) {
                    me.client.disconnect();
                }
                me.config.clientId = ['mqid', ((new Date()).getTime()).toString(), parseInt(1000 * Math.random()).toString()].join('');
                me.client = null;
            }
        } catch (er) {
            console.log(er);
        }
    }
    reset() {
        var me = this;
        return new Promise((success, faild) => {
            try {
                me.close();
                me.open().then(_ => {
                    success();
                })
            } catch (er) {
                console.log(er);
                success();
            }
        })
    }
    isConnected() {
        var me = this;
        var flag = false;
        try {
            if (me.client && me.client != null) {
                flag = me.client.isConnected();
            }
        } catch (er) {
            flag = false;
        }
        return flag;
    }
    subscribe(topic) {
        var me = this;
        try {
            if (me.client && me.client != null) {
                if (me.client.isConnected()) {
                    me.client.subscribe(topic);
                }
            }
        } catch (er) {
            console.log(er);
        }
    }
    publish(topic, msg) {
        var me = this;
        try {
            if (me.client && me.client != null) {
                if (me.client.isConnected()) {
                    var content = JSON.stringify(msg);
                    me.client.publish(topic, content);
                }
            }
        } catch (er) {
            console.log(er);
        }
    }
    registAction(msgId, acHandler) {
        var me = this;
        try {
            me.achandlers[msgId] = acHandler;
        } catch (er) {
            console.log(er);
        }
    }
    sendMsg(topic, msgId, msgInfo) {
        var me = this;
        try {
            var msg = {
                msgId: msgId,
                clientId: me.config.clientId
            };
            if (msgInfo && msgInfo != null) {
                Object.keys(msgInfo).forEach(k => {
                    msg[k] = msgInfo[k];
                })
            }
            me.publish(topic, msg)
        } catch (er) {
            console.log(er);
        }
    }
    sendMsgSync(topic, msgId, msgInfo) {
        var me = this;
        return new Promise((success, faild) => {
            try {
                var reqId = ["reqid", (new Date()).getTime(), parseInt(1000 * Math.random())].join("");
                var msg = {
                    msgId: msgId,
                    reqId: reqId
                };
                if (msgInfo && msgInfo != null) {
                    Object.keys(msgInfo).forEach(k => {
                        msg[k] = msgInfo[k];
                    })
                }
                me.reqBuf[reqId] = {
                    requestMsg: msg,
                    respMsg: null,
                    handler: success,
                    timer: window.setTimeout(() => {
                        var data = {
                            reqId: reqId,
                            requestMsg: msg,
                            respMsg: null
                        }
                        success(data);
                    }, me.config.responseTimeout)
                }
                me.send(topic, msg);
            } catch (er) {
                console.log(er);
                success();
            }
        })
    }
}
class TKmsModelClient {
    constructor() {
        this.config = {
            clientId: ['c', (new Date()).getTime(), parseInt(100 * Math.random())].join(''),
            apiUrl: "https://localhost:31023",
            dbKey: "re",
            version: "kmsModel.v21",
        };
        this.mq = new TMqClient();
        this.kmsConfig = null;
        this.kmsClient = null;
        this.devices = {};
    };
    callApi(apiPath, ps, method) {
        var me = this;
        return new Promise((success, faild) => {
            try {
                var url = [me.config.apiUrl, apiPath].join('/');

                var data = (ps && ps != null) ? ps : {};
                if (method == "GET") {
                    axios.get(url, data).then(res => {
                        success(res);
                    })
                } else {
                    axios.post(url, data).then(res => {
                        success(res);
                    })
                }
            } catch (er) {
                console.log(er);
                success();
            }
        });
    };
    query(key, ps) {
        var me = this;
        return new Promise((success, faild) => {
            try {
                var apiPath = "common/mysqldb/query";
                var postPs = {
                    appId: me.config.dbKey,
                    key: key,
                    psJson: JSON.stringify(ps)
                }
                me.callApi(apiPath, postPs, "POST").then(res => {
                    var result = res && res.data && res.data.data ? res.data.data.result : null;
                    success(result);
                })
            } catch (er) {
                console.log(er);
                success();
            }
        });
    };
    clearObjs() {
        var me = this;
        return new Promise((success, faild) => {
            try {
                me.callApi("kms/model/clearObjs", {}).then(_ => {
                    success();
                });
            } catch (er) {
                console.log(er);
                success();
            }
        });
    };
    getDevices() {
        var me = this;
        var res = {};
        return new Promise((success, faild) => {
            try {
                navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(_ => {
                    return navigator.mediaDevices.enumerateDevices();
                }).then(function(devs) {
                    try {
                        for (var i = 0; i < devs.length; i++) {
                            var item = devs[i];
                            if (!res[item.kind]) {
                                res[item.kind] = {
                                    items: [],
                                    index: 0
                                }
                            }
                            res[item.kind].items.push(item);
                        }
                        res.cameras = res.videoinput && res.videoinput.items ? res.videoinput.items : [];
                        res.mics = res.audioinput && res.audioinput.items ? res.audioinput.items : [];
                    } catch (er) {
                        console.log(er);
                    }
                    success(res);
                }).catch(function() {
                    success(res);
                });
            } catch (er) {
                console.log(er);
                success(res);
            }
        });
    };
    getKmsClient() {
        var me = this;
        return new Promise((success, faild) => {
            try {
                if (me.kmsClient && me.kmsClient != null) {
                    success(me.kmsClient);
                } else {
                    me.getKmsConfig().then(_ => {
                        kurentoClient(me.kmsConfig.kmsUrl, function(error, _client) {
                            me.kmsClient = _client;
                            if (error) {
                                console.log(error);
                                success(null)
                            } else {
                                _client.on('disconnect', function() {
                                    delete me['kmsClient'];
                                })
                                _client.getServerManager().then(_svr => {
                                    me.kmsSvr = _svr;
                                    return me.getDevices();
                                }).then(_devs => {
                                    me.devices = _devs;
                                    return me.getKmsConfig();
                                }).then(_config => {
                                    return me.openMqClient();
                                }).then(_ => {
                                    success(_client);
                                })

                            }
                        });
                    })
                }
            } catch (er) {
                console.log(er);
                success();
            }
        });
    };
    openMqClient() {
        var me = this;
        var res = {};
        return new Promise((success, faild) => {
            try {
                var topics = [];
                me.mq.config.autoSubscribeTopics = topics;
                me.mq.config.willMsg.enable = true;
                me.mq.config.willMsg.topic = "kmsModel/client/offline";
                me.mq.config.willMsg.willMsgClientId = me.config.clientId;
                me.mq.open().then(_ => {
                    success();
                })
            } catch (er) {
                console.log(er);
                success(res);
            }
        });
    };

    //-----------  model api -----------------
    getSvrTime() {
        var me = this;
        var res = {
            requestTm: 0,
            responseTm: 0,
            svrTm: 0,
        };
        return new Promise((success, faild) => {
            try {
                res.requestTm = (new Date()).getTime();
                me.callApi("kms/model/getSvrTime", {}).then(resObj => {
                    res.requestTm = (new Date()).getTime();
                    res.svrTm = resObj.data.data;
                    success(res);
                });
            } catch (er) {
                console.log(er);
                success();
            }
        });
    };
    getKmsConfig() {
        var me = this;
        return new Promise((success, faild) => {
            try {
                if (me.kmsConfig && me.kmsConfig != null) {
                    success(me.kmsConfig);
                } else {
                    me.callApi("kms/model/getConfig", {}).then(_config => {
                        me.kmsConfig = _config.data.data;
                        success(me.kmsConfig);
                    });
                }
            } catch (er) {
                console.log(er);
                success();
            }
        });
    };
    clearObjs() {
        var me = this;
        return new Promise((success, faild) => {
            try {
                if (me.kmsConfig && me.kmsConfig != null) {
                    success(me.kmsConfig);
                } else {
                    me.callApi("kms/model/clearObjs", {}).then(_config => {
                        success(me.kmsConfig);
                    });
                }
            } catch (er) {
                console.log(er);
                success();
            }
        });
    };
    closeClientObjects() {
        var me = this;
        return new Promise((success, faild) => {
            try {
                var ps = {
                    clientId: me.config.clientId
                }
                me.callApi("kms/model/closeClientObjects", ps).then(resObj => {
                    success();
                });
            } catch (er) {
                console.log(er);
                success();
            }
        });
    };
    getChannel(channelCode) {
        var me = this;
        var res = {};
        return new Promise((success, faild) => {
            try {
                me.callApi("kms/model/getChannel", { channelCode: channelCode }).then(resObj => {
                    res = resObj && resObj.data && resObj.data.data ? resObj.data.data : null;
                    success(res);
                });
            } catch (er) {
                console.log(er);
                success(res);
            }
        });
    };
    connectEndSeat(channelCode, seatCode, connectType, peerCode) {
        var me = this;
        var res = {};
        return new Promise((success, faild) => {
            try {
                var ps = {
                    channelCode,
                    seatCode,
                    connectType,
                    clientId: me.config.clientId,
                    peerCode
                }
                me.callApi("kms/model/connectEndSeat", ps).then(resObj => {
                    res = resObj && resObj.data && resObj.data.data ? resObj.data.data : null;
                    if (res.end && res.end.kmsId && res.end.kmsId.length > 0) {
                        me.getKmsClient().then(client => {
                            client.getMediaobjectById(res.end.kmsId, function(er, _end) {
                                res.end.obj = _end;
                                success(res);
                            })
                        });
                    } else {
                        success(res);
                    }
                });
            } catch (er) {
                console.log(er);
                success(res);
            }
        });
    };
    connectSourceSeat(channelCode, seatCode, srcUrl, peerCode) {
        var me = this;
        var res = {};
        return new Promise((success, faild) => {
            try {
                var ps = {
                    channelCode,
                    seatCode,
                    srcUrl,
                    clientId: me.config.clientId,
                    peerCode
                }
                me.callApi("kms/model/connectSourceSeat", ps).then(resObj => {
                    res = resObj && resObj.data && resObj.data.data ? resObj.data.data : null;
                    if (res.end && res.end.kmsId && res.end.kmsId.length > 0) {
                        me.getKmsClient().then(client => {
                            client.getMediaobjectById(res.end.kmsId, function(er, _end) {
                                res.end.obj = _end;
                                success(res);
                            })
                        });
                    } else {
                        success(res);
                    }
                });
            } catch (er) {
                console.log(er);
                success(res);
            }
        });
    };
    startRecord(srcId, recFn) {
        var me = this;
        var res = {};
        return new Promise((success, faild) => {
            try {
                var ps = {
                    srcId,
                    recFn
                }
                me.callApi("kms/model/startRecord", ps).then(resObj => {
                    res = resObj && resObj.data && resObj.data.data ? resObj.data.data : null;
                    success(res);
                });
            } catch (er) {
                console.log(er);
                success(res);
            }
        });
    };
    stopRecord(recorderId) {
        var me = this;
        var res = {};
        return new Promise((success, faild) => {
            try {
                var ps = {
                    recorderId
                }
                me.callApi("kms/model/stopRecord", ps).then(resObj => {
                    res = resObj && resObj.data && resObj.data.data ? resObj.data.data : null;
                    success(res);
                });
            } catch (er) {
                console.log(er);
                success(res);
            }
        });
    };
    //---------------- view peer ---------------------------
    createPeer(peerType, video) {
        var me = this;
        var res = {};
        return new Promise((success, faild) => {
            try {
                me.getKmsClient().then(_ => {
                    return me.getKmsConfig();
                }).then(_ => {
                    var peerFactories = {
                        s: kurentoUtils.WebRtcPeer.WebRtcPeerSendonly,
                        r: kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly,
                        sr: kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv
                    };
                    var createFactory = peerFactories[peerType];
                    var peerOptions = me.kmsConfig.peerOptions;
                    peerOptions.localVideo = peerType == 's' ? video : null;
                    peerOptions.remoteVideo = peerType == 'r' ? video : null;
                    var wrPeer = createFactory(peerOptions, function(erP) {
                        wrPeer.peerOptions = peerOptions;
                        wrPeer.isScreen = false;
                        success(wrPeer);
                    });
                })
            } catch (er) {
                console.log(er);
                success(res);
            }
        });
    };
    bindPeerEnd(peer, end) {
        var me = this;
        var res = {};
        return new Promise((success, faild) => {
            try {
                end.on('OnIceCandidate', function(event) {
                    var candidate = event.candidate;
                    peer.addIceCandidate(candidate);
                    console.log('candidate w->p', candidate);
                });
                peer.on('icecandidate', function(candidate) {
                    var iceCandidate = kurentoClient.register.complexTypes.IceCandidate(candidate);
                    end.addIceCandidate(iceCandidate);
                    console.log('candidate p->w', iceCandidate);
                });
                peer.generateOffer(function(er0, sdpOffer) {
                    end.processOffer(sdpOffer, function(er1, sdpAnswer) {
                        peer.processAnswer(sdpAnswer, function(er2) {
                            end.gatherCandidates(function(er3) {
                                success();
                            });
                        });
                    });
                });
            } catch (er) {
                console.log(er);
                success(res);
            }
        });
    };
    setCamera(peer, newDeviceId) {
        var me = this;
        return new Promise((success, faild) => {
            try {
                var currentDeviceId = peer.localVideo.srcObject.getVideoTracks()[0].getSettings().deviceId;
                if (currentDeviceId != newDeviceId) {
                    var stream = peer.localVideo.srcObject();
                    stream.getTracks().forEach(t => {
                        t.stop();
                    });
                }
                var mediaConstraints = peer.peerOptions.mediaConstraints;
                mediaConstraints.video.deviceId = newDeviceId;
                navigator.mediaDevices.getUserMedia(mediaConstraints).then(function(stream) {
                    try {
                        peer.localVideo.srcObject = stream;
                        var streamTracks = {};
                        stream.getTracks().forEach(st => {
                            try {
                                streamTracks[st.kind] = st;
                            } catch (eer) {
                                console.log(eer);
                            }
                        });
                        peer.peerConnection.getSenders().forEach(_sender => {
                            try {
                                var kind = _sender.track.kind;
                                _sender.track.stop();
                                var stTrack = streamTracks[kind];
                                _sender.replaceTrack(stTrack);
                            } catch (eer) {
                                console.log(eer);
                            }
                        });
                    } catch (eSet) {
                        console.log(eSet);
                    }
                    try {
                        success();
                    } catch (eer) {
                        console.log(eer);
                    }
                }).catch(function(erSet) {
                    console.log(erSet);
                    try {
                        success();
                    } catch (eer) {
                        console.log(eer);
                    }
                });

            } catch (er) {
                console.log(er);
                try {
                    success();
                } catch (eer) {
                    console.log(eer);
                }
            }
        });
    };
    setCameraByIndex(peer, index) {
        var me = this;
        return new Promise((success, faild) => {
            try {
                if (me.cameras.length > 0) {
                    var camera = index > me.cameras.length ? me.cameras[0] : me.cameras[index];
                    me.setCamera(peer, camera.deviceId).then(_res => {
                        success(_res);
                    })
                } else {
                    success();
                }
            } catch (er) {
                console.log(er);
                try {
                    success();
                } catch (eer) {
                    console.log(eer);
                }
            }
        });
    };
    shareScreen(peer, width, height) {
        var me = this;
        return new Promise((success, faild) => {
            try {
                var wWidth = width && width > 0 ? width : (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
                var wHeight = height && height > 0 ? height : (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);
                var screenConstraints = { video: { width: { max: wWidth }, height: { max: wHeight } }, audio: true };
                var sender = null;
                if (navigator.mediaDevices.getDisplayMedia) {
                    navigator.mediaDevices.getDisplayMedia(screenConstraints).then(
                        function(stream) {
                            let videoTrack = stream.getVideoTracks()[0];
                            peer.localVideo.srcObject = stream;
                            sender = peer.peerConnection.getSenders().find(function(s) {
                                return s.track.kind == videoTrack.kind;
                            });
                            sender.track.stop();
                            sender.replaceTrack(videoTrack);
                            success();
                        }
                    )
                } else {
                    success();
                }
            } catch (er) {
                console.log(er);
                success();
            }
        });
    };
    setPeerStream(peer, stream) {
        var me = this;
        return new Promise((success, faild) => {
            try {
                var oldStream = peer.getLocalStream();
                if (oldStream && oldStream != null) {
                    oldStream.getTracks().forEach(t => {
                        t.stop();
                    });
                }
                try {
                    peer.localVideo.srcObject = stream;
                    var streamTracks = {};
                    stream.getTracks().forEach(st => {
                        try {
                            streamTracks[st.kind] = st;
                        } catch (eer) {
                            console.log(eer);
                        }
                    });
                    peer.peerConnection.getSenders().forEach(_sender => {
                        try {
                            var kind = _sender.track.kind;
                            _sender.track.stop();
                            var stTrack = streamTracks[kind];
                            _sender.replaceTrack(stTrack);
                        } catch (eer) {
                            console.log(eer);
                        }
                    });
                } catch (eSet) {
                    console.log(eSet);
                }
                try {
                    success();
                } catch (eer) {
                    console.log(eer);
                }
            } catch (er) {
                console.log(er);
                success();
            }
        });
    };
    fullScreen(peer) {
        var me = this;
        return new Promise((success, faild) => {
            try {
                var element = peer.remoteVideo;
                me.fullScreenElement(element).then(_ => {
                    success();
                })
            } catch (er) {
                console.log(er);
                success();
            }
        });
    };
    fullScreenElement(element) {
        var me = this;
        return new Promise((success, faild) => {
            try {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.webkitRequestFullscreen) {
                    element.webkitRequestFullscreen();
                }
                success();
            } catch (er) {
                console.log(er);
                success();
            }
        });
    };
    //------------------  create view --------------------------
    createEndpointView(viewCode, channelCode, seatCode, viewType, video) {
        var me = this;
        var res = {};
        return new Promise((success, faild) => {
            try {
                me.getKmsClient().then(_ => {
                    return me.connectEndSeat(channelCode, seatCode, viewType, viewCode);
                }).then(_res => {
                    res = _res;
                    res.view = new TModelView(me, viewCode, viewType, video);
                    res.view.channel = _res.channel;
                    res.view.end = _res.end;
                    res.view.channelCode = channelCode;
                    res.view.seatCode = seatCode;
                    res.view.srcUrl = "";
                    return me.createPeer(res.view.viewType, res.view.video);
                }).then(_peer => {
                    res.view.peer = _peer;
                    return me.bindPeerEnd(res.view.peer, res.view.end.obj);
                }).then(_ => {
                    Object.keys(me.devices).forEach(k => {
                        res.view.devices[k] = me.devices[k];
                    });
                    success(res);
                })
            } catch (er) {
                console.log(er);
                success(res);
            }
        });
    };
    createSourceView(viewCode, channelCode, seatCode, srcUrl, video) {
        var me = this;
        var res = {};
        return new Promise((success, faild) => {
            try {
                me.getKmsClient().then(_ => {
                    return me.connectSourceSeat(channelCode, seatCode, srcUrl, viewCode);
                }).then(_res => {
                    res = _res;
                    res.view = new TModelView(me, viewCode, 'r', video);
                    res.view.channelCode = channelCode;
                    res.view.seatCode = seatCode;
                    res.view.srcUrl = srcUrl;
                    return res.view.open();
                }).then(_ => {
                    success(res);
                })
            } catch (er) {
                console.log(er);
                success(res);
            }
        });
    };
}
class TModelView {
    constructor(model, code, viewType, video) {
        this.code = code;
        this.channelCode = "";
        this.seatCode = "";
        this.srcUrl = "";
        this.viewType = viewType;
        this.model = model;
        this.video = video;
        this.devices = {
            audio: {
                items: [],
                index: 0
            },
            video: {
                items: [],
                index: 0
            },
            isScreen: false
        };
        this.channel = null;
        this.peer = null;
        this.end = null;
    };
    open() {
        var me = this;
        return new Promise((success, faild) => {
            try {
                var createChannelEnd = () => {
                    return new Promise((su, fa) => {
                        try {
                            var onGetChannel = () => {
                                if (me.end && me.end != null) {
                                    me.model.bindPeerEnd(me.peer, me.end.obj).then(_ => {
                                        su();
                                    })
                                } else {
                                    su();
                                }
                            };
                            var srcUrl = me.srcUrl;
                            if (srcUrl && srcUrl != null && srcUrl.length > 0) {
                                me.model.connectSourceSeat(me.channelCode, me.seatCode, me.srcUrl).then(ch => {
                                    me.channel = ch;
                                    me.end = ch.end;
                                    onGetChannel();
                                });
                            } else {
                                me.model.connectEndSeat(me.channelCode, me.seatCode).then(ch => {
                                    me.channel = ch;
                                    me.end = ch.end;
                                    onGetChannel();
                                })
                            }
                        } catch (error1) {
                            console.log(error1);
                        }
                    });
                };
                me.model.createPeer(me.viewType, me.video).then(_peer => {
                    me.peer = _peer;
                    return createChannelEnd();
                }).then(_ => {
                    Object.keys(me.model.devices).forEach(k => {
                        me.devices[k] = me.model.devices[k];
                    });
                    success();
                });
            } catch (error) {
                console.log(error);
                success();
            }
        });
    };
    close() {
        var me = this;
        return new Promise((success, faild) => {
            try {
                if (me.peer && me.peer != null) {
                    me.peer.dispose();
                    me.peer = null;
                }
                if (me.end && me.end != null) {
                    me.end.release().then(_ => {
                        me.end = null;
                        success();
                    });
                } else {
                    success();
                }
            } catch (error) {
                console.log(error);
            }
        });
    };
    setCamera(cameraIndex) {
        var me = this;
        return new Promise((success, faild) => {
            try {

            } catch (error) {
                console.log(error);
            }
        });
    };
    setMic(micIndex) {
        var me = this;
        return new Promise((success, faild) => {
            try {

            } catch (error) {
                console.log(error);
            }
        });
    };
    setVolume(volume) {
        var me = this;
        return new Promise((success, faild) => {
            try {

            } catch (error) {
                console.log(error);
            }
        });
    };
}
export {
    TMqClient,
    TKmsModelClient,
    TModelView
};

var comm = new TKmsModelClient();;
comm.config.dbKey = 're';
Vue.prototype.comm = comm;
//UMD通用接口
(function (root, factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        // AMD
        define('Flow', [], function () {
            return factory;
        });
    } else if (typeof exports === 'object') {
        // Node.js
        module.exports.Flow = factory;
    } else {
        // Browser globals
        root.Flow = factory;
    }
}(typeof window !== "undefined" ? window : this, function () {
    //数组去重
    var uniqueArray = function(arr){
        var res = [];
        var json = {};
        for(var i = 0; i < arr.length; i++){
            if(!json[arr[i]]){
                res.push(arr[i]);
                json[arr[i]] = 1;
            }
        }
        return res;
    };
    this.map = {};
    this.setMap = function (m) {
        this.map = {};
        for (var i = 0, len = m.length; i < len; i++) {
            var mI = m[i];
            // map表中参数判断
            if (typeof mI[0] !== 'string') throw 'node[0] type is not string';
            if (typeof mI[1] !== 'function') throw 'node[1] type is not function';

            if (typeof mI[2] !== 'function' && typeof mI[2] !== 'string') mI[2] = null;
            if (typeof mI[3] !== 'function' && typeof mI[3] !== 'string') mI[3] = null;
            if (mI[2] === '') mI[2] = null;
            if (mI[3] === '') mI[3] = null;

            var tmp = {};
            tmp.fn = mI[1];
            tmp.success = mI[2];
            tmp.fail = mI[3];
            this.map[mI[0]] = tmp;
        }
    };
    this.run = function (node) {
        var tmpNode = this.map[node];
        if (!tmpNode) throw 'not found node: ' + node;
        var self = this;
        var tmpArgs = [];
        for (var i = 1; i < arguments.length; i++) {
            tmpArgs.push(arguments[i]);
        }
        //判断是否存在用户自定义的回调函数若存在不增加回调
        if (typeof arguments[arguments.length - 1] === 'function') {
            //存在用户自定义的回调函数
        } else {
            tmpArgs.push(function (err) {
                var next, args = [];
                if (err) {
                    next = tmpNode.fail;
                    args.push(err);
                    for (var j = 1; j < arguments.length; j++) {
                        args.push(arguments[j]);
                    }

                } else {
                    next = tmpNode.success;
                    for (var i = 1; i < arguments.length; i++) {
                        args.push(arguments[i]);
                    }
                }
                if (next === null) return;
                if (typeof next === 'function') {
                    next.apply(null, args);
                } else {
                    self.run.apply(self, uniqueArray([next].concat(args)));
                }
            });
        }
        tmpNode.fn.apply(null, tmpArgs);
    };
}));

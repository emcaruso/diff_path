/*
 * FooTable v3 - FooTable is a jQuery plugin that aims to make HTML tables on smaller devices look awesome.
 * @version 3.1.0
 * @link http://fooplugins.com
 * @copyright Steven Usher & Brad Vincent 2015
 * @license Released under the GPLv3 license.
 */
! function(a, b) {
    window.console = window.console || { log: function() {}, error: function() {} }, a.fn.footable = function(a, c) { return a = a || {}, this.filter("table").each(function(d, e) { b.init(e, a, c) }) };
    var c = { events: [] };
    b.__debug__ = JSON.parse(localStorage.getItem("footable_debug")) || !1, b.__debug_options__ = JSON.parse(localStorage.getItem("footable_debug_options")) || c, b.debug = function(d, e) { return b.is["boolean"](d) ? (b.__debug__ = d, void(b.__debug__ ? (localStorage.setItem("footable_debug", JSON.stringify(b.__debug__)), b.__debug_options__ = a.extend(!0, {}, c, e || {}), b.is.hash(e) && localStorage.setItem("footable_debug_options", JSON.stringify(b.__debug_options__))) : (localStorage.removeItem("footable_debug"), localStorage.removeItem("footable_debug_options")))) : b.__debug__ }, b.get = function(b) { return a(b).first().data("__FooTable__") }, b.init = function(a, c, d) { var e = b.get(a); return e instanceof b.Table && e.destroy(), new b.Table(a, c, d) }, b.getRow = function(b) { var c = a(b).closest("tr"); return c.hasClass("footable-detail-row") && (c = c.prev()), c.data("__FooTableRow__") }
}(jQuery, FooTable = window.FooTable || {}),
function(a) {
    var b = function() { return !0 };
    a.arr = {}, a.arr.each = function(b, c) {
        if (a.is.array(b) && a.is.fn(c))
            for (var d = 0, e = b.length; e > d && c(b[d], d) !== !1; d++);
    }, a.arr.get = function(b, c) { var d = []; if (!a.is.array(b)) return d; if (!a.is.fn(c)) return b; for (var e = 0, f = b.length; f > e; e++) c(b[e], e) && d.push(b[e]); return d }, a.arr.any = function(c, d) {
        if (!a.is.array(c)) return !1;
        d = a.is.fn(d) ? d : b;
        for (var e = 0, f = c.length; f > e; e++)
            if (d(c[e], e)) return !0;
        return !1
    }, a.arr.contains = function(b, c) {
        if (!a.is.array(b) || a.is.undef(c)) return !1;
        for (var d = 0, e = b.length; e > d; d++)
            if (b[d] == c) return !0;
        return !1
    }, a.arr.first = function(c, d) {
        if (!a.is.array(c)) return null;
        d = a.is.fn(d) ? d : b;
        for (var e = 0, f = c.length; f > e; e++)
            if (d(c[e], e)) return c[e];
        return null
    }, a.arr.map = function(b, c) {
        var d = [],
            e = null;
        if (!a.is.array(b) || !a.is.fn(c)) return d;
        for (var f = 0, g = b.length; g > f; f++) null != (e = c(b[f], f)) && d.push(e);
        return d
    }, a.arr.remove = function(b, c) {
        var d = [],
            e = [];
        if (!a.is.array(b) || !a.is.fn(c)) return e;
        for (var f = 0, g = b.length; g > f; f++) c(b[f], f, e) && (d.push(f), e.push(b[f]));
        for (d.sort(function(a, b) { return b - a }), f = 0, g = d.length; g > f; f++) {
            var h = d[f] - f;
            b.splice(h, 1)
        }
        return e
    }, a.arr["delete"] = function(b, c) {
        var d = -1,
            e = null;
        if (!a.is.array(b) || a.is.undef(c)) return e;
        for (var f = 0, g = b.length; g > f; f++)
            if (b[f] == c) { d = f, e = b[f]; break } return -1 != d && b.splice(d, 1), e
    }, a.arr.replace = function(a, b, c) { var d = a.indexOf(b); - 1 !== d && (a[d] = c) }
}(FooTable),
function(a) {
    a.is = {}, a.is.type = function(a, b) { return typeof a === b }, a.is.defined = function(a) { return "undefined" != typeof a }, a.is.undef = function(a) { return "undefined" == typeof a }, a.is.array = function(a) { return "[object Array]" === Object.prototype.toString.call(a) }, a.is.date = function(a) { return "[object Date]" === Object.prototype.toString.call(a) && !isNaN(a.getTime()) }, a.is["boolean"] = function(a) { return "[object Boolean]" === Object.prototype.toString.call(a) }, a.is.string = function(a) { return "[object String]" === Object.prototype.toString.call(a) }, a.is.number = function(a) { return "[object Number]" === Object.prototype.toString.call(a) && !isNaN(a) }, a.is.fn = function(b) { return a.is.defined(window) && b === window.alert || "[object Function]" === Object.prototype.toString.call(b) }, a.is.error = function(a) { return "[object Error]" === Object.prototype.toString.call(a) }, a.is.object = function(a) { return "[object Object]" === Object.prototype.toString.call(a) }, a.is.hash = function(b) { return a.is.object(b) && b.constructor === Object && !b.nodeType && !b.setInterval }, a.is.element = function(a) { return "object" == typeof HTMLElement ? a instanceof HTMLElement : a && "object" == typeof a && null !== a && 1 === a.nodeType && "string" == typeof a.nodeName }, a.is.promise = function(b) { return a.is.object(b) && a.is.fn(b.then) && a.is.fn(b.promise) }, a.is.jq = function(b) { return a.is.defined(window.jQuery) && b instanceof jQuery && b.length > 0 }, a.is.moment = function(b) { return a.is.defined(window.moment) && a.is.object(b) && a.is["boolean"](b._isAMomentObject) }, a.is.emptyObject = function(b) {
        if (!a.is.hash(b)) return !1;
        for (var c in b)
            if (b.hasOwnProperty(c)) return !1;
        return !0
    }, a.is.emptyArray = function(b) { return a.is.array(b) ? 0 === b.length : !0 }, a.is.emptyString = function(b) { return a.is.string(b) ? 0 === b.length : !0 }
}(FooTable),
function(a) {
    a.str = {}, a.str.contains = function(b, c, d) { return !a.is.emptyString(b) && !a.is.emptyString(c) && c.length <= b.length && -1 !== (d ? b.toUpperCase().indexOf(c.toUpperCase()) : b.indexOf(c)) }, a.str.containsWord = function(b, c, d) {
        if (a.is.emptyString(b) || a.is.emptyString(c) || b.length < c.length) return !1;
        for (var e = b.split(/\W/), f = 0, g = e.length; g > f; f++)
            if (d ? e[f].toUpperCase() == c.toUpperCase() : e[f] == c) return !0;
        return !1
    }, a.str.from = function(a, b) { return this.contains(a, b) ? a.substring(a.indexOf(b) + 1) : a }, a.str.startsWith = function(a, b) { return a.slice(0, b.length) == b }, a.str.toCamelCase = function(a) { return a.toUpperCase() === a ? a.toLowerCase() : a.replace(/^([A-Z])|[-\s_](\w)/g, function(a, b, c) { return c ? c.toUpperCase() : b.toLowerCase() }) }, a.str.random = function(b) { return b = a.is.emptyString(b) ? "" : b, b + Math.random().toString(36).substr(2, 9) }, a.str.escapeRegExp = function(a) { return a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") }
}(FooTable),
function(a) {
    "use strict";

    function b() {} Object.create || (Object.create = function() {
        var b = function() {};
        return function(c) {
            if (arguments.length > 1) throw Error("Second argument not supported");
            if (!a.is.object(c)) throw TypeError("Argument must be an object");
            b.prototype = c;
            var d = new b;
            return b.prototype = null, d
        }
    }());
    var c = /xyz/.test(function() { xyz }) ? /\b_super\b/ : /.*/;
    b.__extend__ = function(b, d, e, f) { b[d] = a.is.fn(f) && c.test(e) ? function(a, b) { return function() { var a, c; return a = this._super, this._super = f, c = b.apply(this, arguments), this._super = a, c } }(d, e) : e }, b.extend = function(d, e) {
        function f(b, d, e, f) { b[d] = a.is.fn(f) && c.test(e) ? function(a, b, c) { return function() { var a, d; return a = this._super, this._super = c, d = b.apply(this, arguments), this._super = a, d } }(d, e, f) : e }
        var g = Array.prototype.slice.call(arguments);
        if (d = g.shift(), e = g.shift(), a.is.hash(d)) {
            var h = Object.create(this.prototype),
                i = this.prototype;
            for (var j in d) "__ctor__" !== j && f(h, j, d[j], i[j]);
            var k = a.is.fn(h.__ctor__) ? h.__ctor__ : function() {
                if (!a.is.fn(this.construct)) throw new SyntaxError('FooTable class objects must be constructed with the "new" keyword.');
                this.construct.apply(this, arguments)
            };
            return h.construct = a.is.fn(h.construct) ? h.construct : function() {}, k.prototype = h, h.constructor = k, k.extend = b.extend, k
        }
        a.is.string(d) && a.is.fn(e) && f(this.prototype, d, e, this.prototype[d])
    }, a.Class = b, a.ClassFactory = a.Class.extend({
        construct: function() { this.registered = {} },
        contains: function(b) { return a.is.defined(this.registered[b]) },
        names: function() { var a, b = []; for (a in this.registered) this.registered.hasOwnProperty(a) && b.push(a); return b },
        register: function(b, c, d) {
            if (a.is.string(b) && a.is.fn(c)) {
                var e = this.registered[b];
                this.registered[b] = { name: b, klass: c, priority: a.is.number(d) ? d : a.is.defined(e) ? e.priority : 0 }
            }
        },
        load: function(b, c, d) {
            var e, f, g = this,
                h = Array.prototype.slice.call(arguments),
                i = [],
                j = [];
            b = h.shift() || {};
            for (e in g.registered)
                if (g.registered.hasOwnProperty(e)) {
                    var k = g.registered[e];
                    b.hasOwnProperty(e) && (f = b[e], a.is.string(f) && (f = a.getFnPointer(b[e])), a.is.fn(f) && (k = { name: e, klass: f, priority: g.registered[e].priority })), i.push(k)
                } for (e in b) b.hasOwnProperty(e) && !g.registered.hasOwnProperty(e) && (f = b[e], a.is.string(f) && (f = a.getFnPointer(b[e])), a.is.fn(f) && i.push({ name: e, klass: f, priority: 0 }));
            return i.sort(function(a, b) { return b.priority - a.priority }), a.arr.each(i, function(b) { a.is.fn(b.klass) && j.push(g._make(b.klass, h)) }), j
        },
        make: function(b, c, d) {
            var e, f = this,
                g = Array.prototype.slice.call(arguments);
            return b = g.shift(), e = f.registered[b], a.is.fn(e.klass) ? f._make(e.klass, g) : null
        },
        _make: function(a, b) {
            function c() { return a.apply(this, b) }
            return c.prototype = a.prototype, new c
        }
    })
}(FooTable),
function(a, b) {
    b.css2json = function(c) { if (b.is.emptyString(c)) return {}; for (var d, e, f, g = {}, h = c.split(";"), i = 0, j = h.length; j > i; i++) d = h[i].split(":"), e = b.str.toCamelCase(a.trim(d[0])), f = a.trim(d[1]), g[e] = f; return g }, b.getFnPointer = function(a) {
        if (b.is.emptyString(a)) return null;
        var c = window,
            d = a.split(".");
        return b.arr.each(d, function(a) { c[a] && (c = c[a]) }), b.is.fn(c) ? c : null
    }, b.checkFnValue = function(a, c, d) {
        function e(a, c, d) { return b.is.fn(c) ? function() { return c.apply(a, arguments) } : d }
        return d = b.is.fn(d) ? d : null, b.is.fn(c) ? e(a, c, d) : b.is.type(c, "string") ? e(a, b.getFnPointer(c), d) : d
    }
}(jQuery, FooTable),
function(a, b) {
    b.Cell = b.Class.extend({
        construct: function(a, b, c, d) { this.ft = a, this.row = b, this.column = c, this.created = !1, this.define(d) },
        define: function(c) {
            this.$el = b.is.element(c) || b.is.jq(c) ? a(c) : null, this.$detail = null;
            var d = b.is.hash(c) && b.is.hash(c.options) && b.is.defined(c.value);
            this.value = this.column.parser.call(this.column, b.is.jq(this.$el) ? this.$el : d ? c.value : c, this.ft.o), this.o = a.extend(!0, { classes: null, style: null }, d ? c.options : {}), this.classes = b.is.jq(this.$el) && this.$el.attr("class") ? this.$el.attr("class").match(/\S+/g) : b.is.array(this.o.classes) ? this.o.classes : b.is.string(this.o.classes) ? this.o.classes.match(/\S+/g) : [], this.style = b.is.jq(this.$el) && this.$el.attr("style") ? b.css2json(this.$el.attr("style")) : b.is.hash(this.o.style) ? this.o.style : b.is.string(this.o.style) ? b.css2json(this.o.style) : {}
        },
        $create: function() { this.created || ((this.$el = b.is.jq(this.$el) ? this.$el : a("<td/>")).data("value", this.value).contents().detach().end().append(this.format(this.value)), this._setClasses(this.$el), this._setStyle(this.$el), this.$detail = a("<tr/>").addClass(this.row.classes.join(" ")).data("__FooTableCell__", this).append(a("<th/>")).append(a("<td/>")), this.created = !0) },
        collapse: function() { this.created && (this.$detail.children("th").html(this.column.title), this.$detail.children("td").first().attr("class", this.$el.attr("class")).attr("style", this.$el.attr("style")).css("display", "table-cell").append(this.$el.contents().detach()), b.is.jq(this.$detail.parent()) || this.$detail.appendTo(this.row.$details.find(".footable-details > tbody"))) },
        restore: function() {
            if (this.created) {
                if (b.is.jq(this.$detail.parent())) {
                    var a = this.$detail.children("td").first();
                    this.$el.attr("class", a.attr("class")).attr("style", a.attr("style")).css("display", this.column.hidden || !this.column.visible ? "none" : "table-cell").append(a.contents().detach())
                }
                this.$detail.detach()
            }
        },
        parse: function() { return this.column.parser.call(this.column, this.$el, this.ft.o) },
        format: function(a) { return this.column.formatter.call(this.column, a, this.ft.o) },
        val: function(c, d) {
            if (b.is.undef(c)) return this.value;
            var e = this,
                f = b.is.hash(c) && b.is.hash(c.options) && b.is.defined(c.value);
            if (this.o = a.extend(!0, { classes: e.classes, style: e.style }, f ? c.options : {}), this.value = f ? c.value : c, this.classes = b.is.array(this.o.classes) ? this.o.classes : b.is.string(this.o.classes) ? this.o.classes.match(/\S+/g) : [], this.style = b.is.hash(this.o.style) ? this.o.style : b.is.string(this.o.style) ? b.css2json(this.o.style) : {}, this.created) {
                this.$el.data("value", this.value).empty();
                var g = this.$detail.children("td").first().empty(),
                    h = b.is.jq(this.$detail.parent()) ? g : this.$el;
                h.append(this.format(this.value)), this._setClasses(h), this._setStyle(h), (b.is["boolean"](d) ? d : !0) && this.row.draw()
            }
        },
        _setClasses: function(a) {
            var c = !b.is.emptyArray(this.column.classes),
                d = !b.is.emptyArray(this.classes),
                e = null;
            a.removeAttr("class"), (c || d) && (c && d ? e = this.classes.concat(this.column.classes).join(" ") : c ? e = this.column.classes.join(" ") : d && (e = this.classes.join(" ")), b.is.emptyString(e) || a.addClass(e))
        },
        _setStyle: function(c) {
            var d = !b.is.emptyObject(this.column.style),
                e = !b.is.emptyObject(this.style),
                f = null;
            c.removeAttr("style"), (d || e) && (d && e ? f = a.extend({}, this.column.style, this.style) : d ? f = this.column.style : e && (f = this.style), b.is.hash(f) && c.css(f))
        }
    })
}(jQuery, FooTable),
function(a, b) {
    b.Column = b.Class.extend({
        construct: function(a, c, d) { this.ft = a, this.type = b.is.emptyString(d) ? "text" : d, this.virtual = b.is["boolean"](c.virtual) ? c.virtual : !1, this.$el = b.is.jq(c.$el) ? c.$el : null, this.index = b.is.number(c.index) ? c.index : -1, this.define(c), this.$create() },
        define: function(a) { this.hidden = b.is["boolean"](a.hidden) ? a.hidden : !1, this.visible = b.is["boolean"](a.visible) ? a.visible : !0, this.name = b.is.string(a.name) ? a.name : null, null == this.name && (this.name = "col" + (a.index + 1)), this.title = b.is.string(a.title) ? a.title : null, !this.virtual && null == this.title && b.is.jq(this.$el) && (this.title = this.$el.html()), null == this.title && (this.title = "Column " + (a.index + 1)), this.style = b.is.hash(a.style) ? a.style : b.is.string(a.style) ? b.css2json(a.style) : {}, this.classes = b.is.array(a.classes) ? a.classes : b.is.string(a.classes) ? a.classes.match(/\S+/g) : [], this.parser = b.checkFnValue(this, a.parser, this.parser), this.formatter = b.checkFnValue(this, a.formatter, this.formatter) },
        $create: function() {
            (this.$el = !this.virtual && b.is.jq(this.$el) ? this.$el : a("<th/>")).html(this.title)
        },
        parser: function(c) { return b.is.element(c) || b.is.jq(c) ? a(c).data("value") || a(c).text() : b.is.defined(c) && null != c ? c + "" : null },
        formatter: function(a) { return null == a ? "" : a },
        createCell: function(a) {
            var c = b.is.jq(a.$el) ? a.$el.children("td,th").get(this.index) : null,
                d = b.is.hash(a.value) ? a.value[this.name] : null;
            return new b.Cell(this.ft, a, this, c || d)
        }
    }), b.columns = new b.ClassFactory, b.columns.register("text", b.Column)
}(jQuery, FooTable),
function(a, b) {
    b.Component = b.Class.extend({
        construct: function(a, c) {
            if (!(a instanceof b.Table)) throw new TypeError("The instance parameter must be an instance of FooTable.Table.");
            this.ft = a, this.enabled = b.is["boolean"](c) ? c : !1
        },
        preinit: function(a) {},
        init: function() {},
        destroy: function() {},
        predraw: function() {},
        draw: function() {},
        postdraw: function() {}
    }), b.components = new b.ClassFactory
}(jQuery, FooTable),
function(a, b) { b.Defaults = function() { this.stopPropagation = !1, this.on = null }, b.defaults = new b.Defaults }(jQuery, FooTable),
function(a, b) {
    b.Row = b.Class.extend({
        construct: function(a, b, c) { this.ft = a, this.columns = b, this.created = !1, this.define(c) },
        define: function(c) {
            this.$el = b.is.element(c) || b.is.jq(c) ? a(c) : null, this.$toggle = a("<span/>", { "class": "footable-toggle fooicon fooicon-plus" });
            var d = b.is.hash(c),
                e = d && b.is.hash(c.options) && b.is.hash(c.value);
            this.value = d ? e ? c.value : c : null, this.o = a.extend(!0, { expanded: !1, classes: null, style: null }, e ? c.options : {}), this.expanded = b.is.jq(this.$el) ? this.$el.data("expanded") || this.o.expanded : this.o.expanded, this.classes = b.is.jq(this.$el) && this.$el.attr("class") ? this.$el.attr("class").match(/\S+/g) : b.is.array(this.o.classes) ? this.o.classes : b.is.string(this.o.classes) ? this.o.classes.match(/\S+/g) : [], this.style = b.is.jq(this.$el) && this.$el.attr("style") ? b.css2json(this.$el.attr("style")) : b.is.hash(this.o.style) ? this.o.style : b.is.string(this.o.style) ? b.css2json(this.o.style) : {}, this.cells = this.createCells();
            var f = this;
            f.value = {}, b.arr.each(f.cells, function(a) { f.value[a.column.name] = a.val() })
        },
        $create: function() {
            if (!this.created) {
                (this.$el = b.is.jq(this.$el) ? this.$el : a("<tr/>")).data("__FooTableRow__", this), this._setClasses(this.$el), this._setStyle(this.$el), "last" == this.ft.rows.toggleColumn && this.$toggle.addClass("last-column"), this.$details = a("<tr/>", { "class": "footable-detail-row" }).append(a("<td/>", { colspan: this.ft.columns.visibleColspan }).append(a("<table/>", { "class": "footable-details " + this.ft.classes.join(" ") }).append("<tbody/>")));
                var c = this;
                b.arr.each(c.cells, function(a) { a.created || a.$create(), c.$el.append(a.$el) }), c.$el.off("click.ft.row").on("click.ft.row", { self: c }, c._onToggle), this.created = !0
            }
        },
        createCells: function() { var a = this; return b.arr.map(a.columns, function(b) { return b.createCell(a) }) },
        val: function(c, d) {
            var e = this;
            if (!b.is.hash(c)) return b.is.hash(this.value) && !b.is.emptyObject(this.value) || (this.value = {}, b.arr.each(this.cells, function(a) { e.value[a.column.name] = a.val() })), this.value;
            this.collapse(!1);
            var f = b.is.hash(c),
                g = f && b.is.hash(c.options) && b.is.hash(c.value);
            if (this.o = a.extend(!0, { expanded: e.expanded, classes: e.classes, style: e.style }, g ? c.options : {}), this.expanded = this.o.expanded, this.classes = b.is.array(this.o.classes) ? this.o.classes : b.is.string(this.o.classes) ? this.o.classes.match(/\S+/g) : [], this.style = b.is.hash(this.o.style) ? this.o.style : b.is.string(this.o.style) ? b.css2json(this.o.style) : {}, f)
                if (g && (c = c.value), b.is.hash(this.value))
                    for (var h in c) c.hasOwnProperty(h) && (this.value[h] = c[h]);
                else this.value = c;
            else this.value = null;
            b.arr.each(this.cells, function(a) { b.is.defined(e.value[a.column.name]) && a.val(e.value[a.column.name], !1) }), this.created && (this._setClasses(this.$el), this._setStyle(this.$el), (b.is["boolean"](d) ? d : !0) && this.draw())
        },
        _setClasses: function(a) {
            var c = !b.is.emptyArray(this.classes),
                d = null;
            a.removeAttr("class"), c && (d = this.classes.join(" "), b.is.emptyString(d) || a.addClass(d))
        },
        _setStyle: function(a) {
            var c = !b.is.emptyObject(this.style),
                d = null;
            a.removeAttr("style"), c && (d = this.style, b.is.hash(d) && a.css(d))
        },
        expand: function() {
            if (this.created) {
                var a = this;
                a.ft.raise("expand.ft.row", [a]).then(function() { a.__hidden__ = b.arr.map(a.cells, function(a) { return a.column.hidden && a.column.visible ? a : null }), a.__hidden__.length > 0 && (a.$details.insertAfter(a.$el).children("td").first().attr("colspan", a.ft.columns.visibleColspan), b.arr.each(a.__hidden__, function(a) { a.collapse() })), a.$el.attr("data-expanded", !0), a.$toggle.removeClass("fooicon-plus").addClass("fooicon-minus"), a.expanded = !0 })
            }
        },
        collapse: function(a) {
            if (this.created) {
                var c = this;
                c.ft.raise("collapse.ft.row", [c]).then(function() { b.arr.each(c.__hidden__, function(a) { a.restore() }), c.$details.detach(), c.$el.removeAttr("data-expanded"), c.$toggle.removeClass("fooicon-minus").addClass("fooicon-plus"), (b.is["boolean"](a) ? a : !0) && (c.expanded = !1) })
            }
        },
        predraw: function() { this.created && (this.expanded && this.collapse(!1), this.$toggle.detach(), this.$el.detach()) },
        draw: function(a) {
            this.created || this.$create(), b.is.jq(a) && a.append(this.$el);
            var c = this;
            b.arr.each(c.cells, function(a) { a.$el.css("display", a.column.hidden || !a.column.visible ? "none" : "table-cell"), c.ft.rows.showToggle && c.ft.columns.hasHidden && ("first" == c.ft.rows.toggleColumn && a.column.index == c.ft.columns.firstVisibleIndex || "last" == c.ft.rows.toggleColumn && a.column.index == c.ft.columns.lastVisibleIndex) && a.$el.prepend(c.$toggle) }), this.expanded && this.expand()
        },
        toggle: function() { this.created && this.ft.columns.hasHidden && (this.expanded ? this.collapse() : this.expand()) },
        _onToggle: function(b) {
            var c = b.data.self;
            a(b.target).is(c.ft.rows.toggleSelector) && c.toggle()
        }
    })
}(jQuery, FooTable),
function(a, b) {
    b.instances = [], b.Table = b.Class.extend({
        construct: function(c, d, e) { this._resizeTimeout = null, this.id = b.instances.push(this), this.initialized = !1, this.$el = (b.is.jq(c) ? c : a(c)).first(), this.o = a.extend(!0, {}, b.defaults, d), this.data = this.$el.data() || {}, this.classes = [], this.components = b.components.load(b.is.hash(this.data.components) ? this.data.components : this.o.components, this), this.breakpoints = this.use(FooTable.Breakpoints), this.columns = this.use(FooTable.Columns), this.rows = this.use(FooTable.Rows), this._construct(e) },
        _construct: function(a) {
            var c = this;
            this._preinit().then(function() { return c._init() }).always(function(d) { return b.is.error(d) ? void console.error("FooTable: unhandled error thrown during initialization.", d) : c.raise("ready.ft.table").then(function() { b.is.fn(a) && a.call(c, c) }) })
        },
        _preinit: function() {
            var c = this;
            return this.raise("preinit.ft.table", [c.data]).then(function() {
                var d = c.$el.attr("class").match(/\S+/g);
                c.o.ajax = b.checkFnValue(c, c.data.ajax, c.o.ajax), c.o.stopPropagation = b.is["boolean"](c.data.stopPropagation) ? c.data.stopPropagation : c.o.stopPropagation;
                for (var e = 0, f = d.length; f > e; e++) b.str.startsWith(d[e], "footable") || c.classes.push(d[e]);
                var g = a("<div/>", { "class": "footable-loader" }).append(a("<span/>", { "class": "fooicon fooicon-loader" }));
                return c.$el.hide().after(g), c.execute(!1, !1, "preinit", c.data).always(function() { c.$el.show(), g.remove() })
            })
        },
        _init: function() {
            var c = this;
            return c.raise("init.ft.table").then(function() {
                var d = c.$el.children("thead"),
                    e = c.$el.children("tbody"),
                    f = c.$el.children("tfoot");
                return c.$el.addClass("footable footable-" + c.id), b.is.hash(c.o.on) && c.$el.on(c.o.on), 0 == f.length && c.$el.append(f = a("<tfoot/>")), 0 == e.length && c.$el.append("<tbody/>"), 0 == d.length && c.$el.prepend(d = a("<thead/>")), c.execute(!1, !0, "init").then(function() { return c.$el.data("__FooTable__", c), 0 == f.children("tr").length && f.remove(), 0 == d.children("tr").length && d.remove(), c.raise("postinit.ft.table").then(function() { return c.draw() }).always(function() { a(window).off("resize.ft" + c.id, c._onWindowResize).on("resize.ft" + c.id, { self: c }, c._onWindowResize), c.initialized = !0 }) })
            })
        },
        destroy: function() { var a = this; return a.raise("destroy.ft.table").then(function() { return a.execute(!0, !0, "destroy").then(function() { a.$el.removeData("__FooTable__").removeClass("footable-" + a.id), b.is.hash(a.o.on) && a.$el.off(a.o.on), a.initialized = !1 }) }).fail(function(a) { b.is.error(a) && console.error("FooTable: unhandled error thrown while destroying the plugin.", a) }) },
        raise: function(c, d) {
            var e = this,
                f = b.__debug__ && (b.is.emptyArray(b.__debug_options__.events) || b.arr.any(b.__debug_options__.events, function(a) { return b.str.contains(c, a) }));
            return d = d || [], d.unshift(this), a.Deferred(function(b) {
                var g = a.Event(c);
                1 == e.o.stopPropagation && e.$el.one(c, function(a) { a.stopPropagation() }), f && console.log("FooTable:" + c + ": ", d), e.$el.trigger(g, d), g.isDefaultPrevented() ? (f && console.log('FooTable: default prevented for the "' + c + '" event.'), b.reject(g)) : b.resolve(g)
            })
        },
        use: function(a) {
            for (var b = 0, c = this.components.length; c > b; b++)
                if (this.components[b] instanceof a) return this.components[b];
            return null
        },
        draw: function() { var a = this; return a.execute(!1, !0, "predraw").then(function() { return a.raise("predraw.ft.table").then(function() { return a.execute(!1, !0, "draw").then(function() { return a.raise("draw.ft.table").then(function() { return a.execute(!1, !0, "postdraw").then(function() { return a.raise("postdraw.ft.table") }) }) }) }) }).fail(function(a) { b.is.error(a) && console.error("FooTable: unhandled error thrown during a draw operation.", a) }) },
        execute: function(a, c, d, e, f) {
            var g = this,
                h = Array.prototype.slice.call(arguments);
            a = h.shift(), c = h.shift();
            var i = c ? b.arr.get(g.components, function(a) { return a.enabled }) : g.components.slice(0);
            return h.unshift(a ? i.reverse() : i), g._execute.apply(g, h)
        },
        _execute: function(c, d, e, f) {
            if (!c || !c.length) return a.when();
            var g, h = this,
                i = Array.prototype.slice.call(arguments);
            return c = i.shift(), d = i.shift(), g = c.shift(), b.is.fn(g[d]) ? a.Deferred(function(a) {
                try {
                    var c = g[d].apply(g, i);
                    if (b.is.promise(c)) return c.then(a.resolve, a.reject);
                    a.resolve(c)
                } catch (e) { a.reject(e) }
            }).then(function() { return h._execute.apply(h, [c, d].concat(i)) }) : h._execute.apply(h, [c, d].concat(i))
        },
        _onWindowResize: function(a) {
            var b = a.data.self;
            null != b._resizeTimeout && clearTimeout(b._resizeTimeout), b._resizeTimeout = setTimeout(function() { b._resizeTimeout = null, b.raise("resize.ft.table").then(function() { b.breakpoints.check() }) }, 300)
        }
    })
}(jQuery, FooTable),
function(a, b) {
    b.is.undef(window.moment) || (b.DateColumn = b.Column.extend({
        construct: function(a, c) { this._super(a, c, "date"), this.formatString = b.is.string(c.formatString) ? c.formatString : "MM-DD-YYYY" },
        parser: function(c) {
            if ((b.is.element(c) || b.is.jq(c)) && (c = a(c).data("value") || a(c).text(), b.is.string(c) && (c = isNaN(c) ? c : +c)), b.is.date(c)) return moment(c);
            if (b.is.object(c) && b.is["boolean"](c._isAMomentObject)) return c;
            if (b.is.string(c)) {
                if (isNaN(c)) return moment(c, this.formatString);
                c = +c
            }
            return b.is.number(c) ? moment(c) : null
        },
        formatter: function(a) { return b.is.object(a) && b.is["boolean"](a._isAMomentObject) ? a.format(this.formatString) : "" },
        filterValue: function(c) {
            if ((b.is.element(c) || b.is.jq(c)) && (c = a(c).data("filterValue") || a(c).text()), b.is.hash(c) && b.is.hash(c.options) && (b.is.string(c.options.filterValue) && (c = c.options.filterValue), b.is.defined(c.value) && (c = c.value)), b.is.object(c) && b.is["boolean"](c._isAMomentObject)) return c.format(this.formatString);
            if (b.is.string(c)) {
                if (isNaN(c)) return c;
                c = +c
            }
            return b.is.number(c) || b.is.date(c) ? moment(c).format(this.formatString) : b.is.defined(c) && null != c ? c + "" : ""
        }
    }), b.columns.register("date", b.DateColumn))
}(jQuery, FooTable),
function(a, b) { b.HTMLColumn = b.Column.extend({ construct: function(a, b) { this._super(a, b, "html") }, parser: function(c) { if (b.is.string(c) && (c = a(a.trim(c))), b.is.element(c) && (c = a(c)), b.is.jq(c)) { var d = c.prop("tagName").toLowerCase(); return "td" == d || "th" == d ? c.data("value") || c.contents() : c } return null } }), b.columns.register("html", b.HTMLColumn) }(jQuery, FooTable),
function(a, b) { b.NumberColumn = b.Column.extend({ construct: function(a, c) { this._super(a, c, "number"), this.decimalSeparator = b.is.string(c.decimalSeparator) ? c.decimalSeparator : ".", this.thousandSeparator = b.is.string(c.thousandSeparator) ? c.thousandSeparator : ",", this.decimalSeparatorRegex = new RegExp(b.str.escapeRegExp(this.decimalSeparator), "g"), this.thousandSeparatorRegex = new RegExp(b.str.escapeRegExp(this.thousandSeparator), "g"), this.cleanRegex = new RegExp("[^0-9" + b.str.escapeRegExp(this.decimalSeparator) + "]", "g") }, parser: function(c) { return (b.is.element(c) || b.is.jq(c)) && (c = a(c).data("value") || a(c).text().replace(this.cleanRegex, "")), b.is.string(c) && (c = c.replace(this.thousandSeparatorRegex, "").replace(this.decimalSeparatorRegex, "."), c = parseFloat(c)), b.is.number(c) ? c : null }, formatter: function(a) { if (null == a) return ""; var b = (a + "").split("."); return 2 == b.length && b[0].length > 3 && (b[0] = b[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, this.thousandSeparator)), b.join(this.decimalSeparator) } }), b.columns.register("number", b.NumberColumn) }(jQuery, FooTable),
function(a, b) { b.Breakpoint = b.Class.extend({ construct: function(a, b) { this.name = a, this.width = b } }) }(jQuery, FooTable),
function(a, b) {
    b.Breakpoints = b.Component.extend({
        construct: function(a) { this._super(a, !0), this.o = a.o, this.current = null, this.array = [], this.cascade = this.o.cascade, this.useParentWidth = this.o.useParentWidth, this.hidden = null, this._classNames = "", this.getWidth = b.checkFnValue(this, this.o.getWidth, this.getWidth) },
        preinit: function(a) {
            var c = this;
            return this.ft.raise("preinit.ft.breakpoints", [a]).then(function() {
                c.cascade = b.is["boolean"](a.cascade) ? a.cascade : c.cascade, c.o.breakpoints = b.is.hash(a.breakpoints) ? a.breakpoints : c.o.breakpoints, c.getWidth = b.checkFnValue(c, a.getWidth, c.getWidth), null == c.o.breakpoints && (c.o.breakpoints = { xs: 480, sm: 768, md: 992, lg: 1200 });
                for (var d in c.o.breakpoints) c.o.breakpoints.hasOwnProperty(d) && (c.array.push(new b.Breakpoint(d, c.o.breakpoints[d])), c._classNames += "breakpoint-" + d + " ");
                c.array.sort(function(a, b) { return b.width - a.width })
            })
        },
        init: function() { var a = this; return this.ft.raise("init.ft.breakpoints").then(function() { a.current = a.get() }) },
        draw: function() { this.ft.$el.removeClass(this._classNames).addClass("breakpoint-" + this.current.name) },
        calculate: function() { for (var a, c = this, d = null, e = [], f = null, g = c.getWidth(), h = 0, i = c.array.length; i > h; h++) a = c.array[h], (!d && h == i - 1 || g >= a.width && (f instanceof b.Breakpoint ? g < f.width : !0)) && (d = a), d || e.push(a.name), f = a; return e.push(d.name), c.hidden = e.join(" "), d },
        visible: function(a) {
            if (b.is.emptyString(a)) return !0;
            if ("all" === a) return !1;
            for (var c = a.split(" "), d = 0, e = c.length; e > d; d++)
                if (this.cascade ? b.str.containsWord(this.hidden, c[d]) : c[d] == this.current.name) return !1;
            return !0
        },
        check: function() {
            var a = this,
                c = a.get();
            c instanceof b.Breakpoint && c != a.current && a.ft.raise("before.ft.breakpoints", [a.current, c]).then(function() { var b = a.current; return a.current = c, a.ft.draw().then(function() { a.ft.raise("after.ft.breakpoints", [a.current, b]) }) })
        },
        get: function(a) { return b.is.undef(a) ? this.calculate() : a instanceof b.Breakpoint ? a : b.is.string(a) ? b.arr.first(this.array, function(b) { return b.name == a }) : b.is.number(a) && a >= 0 && a < this.array.length ? this.array[a] : null },
        getWidth: function() { return b.is.fn(this.o.getWidth) ? this.o.getWidth(this.ft) : 1 == this.useParentWidth ? this.getParentWidth() : this.getViewportWidth() },
        getParentWidth: function() { return this.ft.$el.parent().width() },
        getViewportWidth: function() { return Math.max(document.documentElement.clientWidth, window.innerWidth, 0) }
    }), b.components.register("breakpoints", b.Breakpoints, 1e3)
}(jQuery, FooTable),
function(a) { a.Column.prototype.breakpoints = null, a.Column.prototype.__breakpoints_define__ = function(b) { this.breakpoints = a.is.emptyString(b.breakpoints) ? null : b.breakpoints }, a.Column.extend("define", function(a) { this._super(a), this.__breakpoints_define__(a) }) }(FooTable),
function(a) { a.Defaults.prototype.breakpoints = null, a.Defaults.prototype.cascade = !1, a.Defaults.prototype.useParentWidth = !1, a.Defaults.prototype.getWidth = null }(FooTable),
function(a, b) {
    b.Columns = b.Component.extend({
        construct: function(a) { this._super(a, !0), this.o = a.o, this.array = [], this.$header = null, this.showHeader = a.o.showHeader },
        parse: function(c) {
            var d = this;
            return a.Deferred(function(c) {
                function e(c, d) {
                    var e = [];
                    if (0 == c.length || 0 == d.length) e = c.concat(d);
                    else {
                        var f = 0;
                        b.arr.each(c.concat(d), function(a) { a.index > f && (f = a.index) }), f++;
                        for (var g, h, i = 0; f > i; i++) g = {}, b.arr.each(c, function(a) { return a.index == i ? (g = a, !1) : void 0 }), h = {}, b.arr.each(d, function(a) { return a.index == i ? (h = a, !1) : void 0 }), e.push(a.extend(!0, {}, g, h))
                    }
                    return e
                }
                var f, g, h = [],
                    i = [],
                    j = d.ft.$el.find("tr.footable-header");
                if (0 == j.length && (j = d.ft.$el.find("thead > tr:last:has([data-breakpoints])")), 0 == j.length && (j = d.ft.$el.find("tbody > tr:first:has([data-breakpoints])")), 0 == j.length && (j = d.ft.$el.find("thead > tr:last")), 0 == j.length && (j = d.ft.$el.find("tbody > tr:first")), j.length > 0) {
                    var k = j.parent().is("tbody") && j.children().length == j.children("td").length;
                    k || (d.$header = j.addClass("footable-header")), j.children("td,th").each(function(b, c) { f = a(c), g = f.data(), g.index = b, g.$el = f, g.virtual = k, i.push(g) }), k && (d.showHeader = !1)
                }
                b.is.array(d.o.columns) ? (b.arr.each(d.o.columns, function(a, b) { a.index = b, h.push(a) }), d.parseFinalize(c, e(h, i))) : b.is.promise(d.o.columns) ? d.o.columns.then(function(a) { b.arr.each(a, function(a, b) { a.index = b, h.push(a) }), d.parseFinalize(c, e(h, i)) }, function(a) { c.reject(Error("Columns ajax request error: " + a.status + " (" + a.statusText + ")")) }) : d.parseFinalize(c, e(h, i))
            })
        },
        parseFinalize: function(a, c) {
            var d, e = this,
                f = [];
            b.arr.each(c, function(a) {
                (d = b.columns.contains(a.type) ? b.columns.make(a.type, e.ft, a) : new b.Column(e.ft, a)) && f.push(d)
            }), b.is.emptyArray(f) ? a.reject(Error("No columns supplied.")) : (f.sort(function(a, b) { return a.index - b.index }), a.resolve(f))
        },
        preinit: function(a) { var c = this; return c.ft.raise("preinit.ft.columns", [a]).then(function() { return c.parse(a).then(function(d) { c.array = d, c.showHeader = b.is["boolean"](a.showHeader) ? a.showHeader : c.showHeader }) }) },
        init: function() { var a = this; return this.ft.raise("init.ft.columns", [a.array]).then(function() { a.$create() }) },
        destroy: function() {
            var a = this;
            this.ft.raise("destroy.ft.columns").then(function() { a.$header.remove() })
        },
        predraw: function() {
            var a = this,
                c = !0;
            a.visibleColspan = 0, a.firstVisibleIndex = 0, a.lastVisibleIndex = 0, a.hasHidden = !1, b.arr.each(a.array, function(b) { b.hidden = !a.ft.breakpoints.visible(b.breakpoints), !b.hidden && b.visible && (c && (a.firstVisibleIndex = b.index, c = !1), a.lastVisibleIndex = b.index, a.visibleColspan++), b.hidden && (a.hasHidden = !0) })
        },
        draw: function() { b.arr.each(this.array, function(a) { a.$el.css("display", a.hidden || !a.visible ? "none" : "table-cell") }), !this.showHeader && b.is.jq(this.$header.parent()) && this.$header.detach() },
        $create: function() {
            var c = this;
            c.$header = b.is.jq(c.$header) ? c.$header : a("<tr/>", { "class": "footable-header" }), c.$header.children("th,td").detach(), b.arr.each(c.array, function(a) { c.$header.append(a.$el) }), c.showHeader && !b.is.jq(c.$header.parent()) && c.ft.$el.children("thead").append(c.$header)
        },
        get: function(a) { return a instanceof b.Column ? a : b.is.string(a) ? b.arr.first(this.array, function(b) { return b.name == a }) : b.is.number(a) ? b.arr.first(this.array, function(b) { return b.index == a }) : b.is.fn(a) ? b.arr.get(this.array, a) : null },
        ensure: function(a) {
            var c = this,
                d = [];
            return b.is.array(a) ? (b.arr.each(a, function(a) { d.push(c.get(a)) }), d) : d
        }
    }), b.components.register("columns", b.Columns, 900)
}(jQuery, FooTable),
function(a) { a.Defaults.prototype.columns = [], a.Defaults.prototype.showHeader = !0 }(FooTable),
function(a, b) {
    b.Rows = b.Component.extend({
        construct: function(a) { this._super(a, !0), this.o = a.o, this.array = [], this.all = [], this.showToggle = a.o.showToggle, this.toggleSelector = a.o.toggleSelector, this.toggleColumn = a.o.toggleColumn, this.emptyString = a.o.empty, this.expandFirst = a.o.expandFirst, this.expandAll = a.o.expandAll, this.$empty = null },
        parse: function() {
            var c = this;
            return a.Deferred(function(a) {
                var d = c.ft.$el.children("tbody").children("tr");
                b.is.jq(d) ? (c.parseFinalize(a, d), d.detach()) : b.is.array(c.o.rows) && c.o.rows.length > 0 ? c.parseFinalize(a, c.o.rows) : b.is.promise(c.o.rows) ? c.o.rows.then(function(b) { c.parseFinalize(a, b) }, function(b) { a.reject(Error("Rows ajax request error: " + b.status + " (" + b.statusText + ")")) }) : c.parseFinalize(a, [])
            })
        },
        parseFinalize: function(c, d) {
            var e = this,
                f = a.map(d, function(a) { return new b.Row(e.ft, e.ft.columns.array, a) });
            c.resolve(f)
        },
        preinit: function(a) { var c = this; return c.ft.raise("preinit.ft.rows", [a]).then(function() { return c.parse().then(function(d) { c.all = d, c.array = c.all.slice(0), c.showToggle = b.is["boolean"](a.showToggle) ? a.showToggle : c.showToggle, c.toggleSelector = b.is.string(a.toggleSelector) ? a.toggleSelector : c.toggleSelector, c.toggleColumn = b.is.string(a.toggleColumn) ? a.toggleColumn : c.toggleColumn, "first" != c.toggleColumn && "last" != c.toggleColumn && (c.toggleColumn = "first"), c.emptyString = b.is.string(a.empty) ? a.empty : c.emptyString, c.expandFirst = b.is["boolean"](a.expandFirst) ? a.expandFirst : c.expandFirst, c.expandAll = b.is["boolean"](a.expandAll) ? a.expandAll : c.expandAll }) }) },
        init: function() { var a = this; return a.ft.raise("init.ft.rows", [a.all]).then(function() { a.$create() }) },
        destroy: function() {
            var a = this;
            this.ft.raise("destroy.ft.rows").then(function() { b.arr.each(a.array, function(a) { a.predraw() }) })
        },
        predraw: function() { b.arr.each(this.array, function(a) { a.predraw() }), this.array = this.all.slice(0) },
        $create: function() { this.$empty = a("<tr/>", { "class": "footable-empty" }).append(a("<td/>").text(this.emptyString)) },
        draw: function() {
            var a = this,
                c = a.ft.$el.children("tbody"),
                d = !0;
            a.array.length > 0 ? (a.$empty.detach(), b.arr.each(a.array, function(b) {
                (a.expandFirst && d || a.expandAll) && (b.expanded = !0, d = !1), b.draw(c)
            })) : (a.$empty.children("td").attr("colspan", a.ft.columns.visibleColspan), c.append(a.$empty))
        },
        load: function(c, d) {
            var e = this,
                f = a.map(c, function(a) { return new b.Row(e.ft, e.ft.columns.array, a) });
            b.arr.each(this.array, function(a) { a.predraw() }), this.all = (b.is["boolean"](d) ? d : !1) ? this.all.concat(f) : f, this.array = this.all.slice(0), this.ft.draw()
        },
        expand: function() { b.arr.each(this.array, function(a) { a.expand() }) },
        collapse: function() { b.arr.each(this.array, function(a) { a.collapse() }) }
    }), b.components.register("rows", b.Rows, 800)
}(jQuery, FooTable),
function(a) { a.Defaults.prototype.rows = [], a.Defaults.prototype.empty = "No results", a.Defaults.prototype.showToggle = !0, a.Defaults.prototype.toggleSelector = "tr,td,.footable-toggle", a.Defaults.prototype.toggleColumn = "first", a.Defaults.prototype.expandFirst = !1, a.Defaults.prototype.expandAll = !1 }(FooTable),
function(a) { a.Table.prototype.loadRows = function(a, b) { this.rows.load(a, b) } }(FooTable),
function(a) {
    a.Filter = a.Class.extend({
        construct: function(b, c, d, e, f, g) { this.name = b, this.space = !a.is.string(e) || "OR" != e && "AND" != e ? "AND" : e, this.connectors = a.is["boolean"](f) ? f : !0, this.ignoreCase = a.is["boolean"](g) ? g : !0, this.query = new a.Query(c, this.space, this.connectors, this.ignoreCase), this.columns = d },
        match: function(b) { return a.is.string(b) ? (a.is.string(this.query) && (this.query = new a.Query(this.query, this.space, this.connectors, this.ignoreCase)), this.query instanceof a.Query ? this.query.match(b) : !1) : !1 },
        matchRow: function(b) {
            var c = this,
                d = a.arr.map(b.cells, function(b) { return a.arr.contains(c.columns, b.column) ? b.filterValue : null }).join(" ");
            return c.match(d)
        }
    })
}(FooTable),
function(a, b) {
    b.Filtering = b.Component.extend({
        construct: function(a) { this._super(a, a.o.filtering.enabled), this.filters = a.o.filtering.filters, this.delay = a.o.filtering.delay, this.min = a.o.filtering.min, this.space = a.o.filtering.space, this.connectors = a.o.filtering.connectors, this.ignoreCase = a.o.filtering.ignoreCase, this.placeholder = a.o.filtering.placeholder, this.position = a.o.filtering.position, this.$row = null, this.$cell = null, this.$dropdown = null, this.$input = null, this.$button = null, this._filterTimeout = null },
        preinit: function(a) {
            var c = this;
            this.ft.raise("preinit.ft.filtering").then(function() { c.ft.$el.hasClass("footable-filtering") && (c.enabled = !0), c.enabled = b.is["boolean"](a.filtering) ? a.filtering : c.enabled, c.enabled && (c.space = b.is.string(a.filterSpace) ? a.filterSpace : c.space, c.min = b.is.number(a.filterMin) ? a.filterMin : c.min, c.connectors = b.is["boolean"](a.filterConnectors) ? a.filterConnectors : c.connectors, c.ignoreCase = b.is["boolean"](a.filterIgnoreCase) ? a.filterIgnoreCase : c.ignoreCase, c.delay = b.is.number(a.filterDelay) ? a.filterDelay : c.delay, c.placeholder = b.is.string(a.filterPlaceholder) ? a.filterPlaceholder : c.placeholder, c.filters = b.is.array(a.filterFilters) ? c.ensure(a.filterFilters) : c.ensure(c.filters), c.ft.$el.hasClass("footable-filtering-left") && (c.position = "left"), c.ft.$el.hasClass("footable-filtering-center") && (c.position = "center"), c.ft.$el.hasClass("footable-filtering-right") && (c.position = "right"), c.position = b.is.string(a.filterPosition) ? a.filterPosition : c.position) }, function() { c.enabled = !1 })
        },
        init: function() {
            var a = this;
            this.ft.raise("init.ft.filtering").then(function() { a.$create() }, function() { a.enabled = !1 })
        },
        destroy: function() {
            var a = this;
            this.ft.raise("destroy.ft.filtering").then(function() { a.ft.$el.removeClass("footable-filtering").find("thead > tr.footable-filtering").remove() })
        },
        $create: function() {
            var c, d = this,
                e = a("<div/>", { "class": "form-group" }).append(a("<label/>", { "class": "sr-only", text: "Search" })),
                f = a("<div/>", { "class": "input-group" }).appendTo(e),
                g = a("<div/>", { "class": "input-group-btn" }),
                h = a("<button/>", { type: "button", "class": "btn btn-default dropdown-toggle" }).on("click", { self: d }, d._onDropdownToggleClicked).append(a("<span/>", { "class": "caret" }));
            switch (d.position) {
                case "left":
                    c = "footable-filtering-left";
                    break;
                case "center":
                    c = "footable-filtering-center";
                    break;
                default:
                    c = "footable-filtering-right"
            }
            d.ft.$el.addClass("footable-filtering").addClass(c), d.$row = a("<tr/>", { "class": "footable-filtering" }).prependTo(d.ft.$el.children("thead")), d.$cell = a("<th/>").attr("colspan", d.ft.columns.visibleColspan).appendTo(d.$row), d.$form = a("<form/>", { "class": "form-inline" }).append(e).appendTo(d.$cell), d.$input = a("<input/>", { type: "text", "class": "form-control", placeholder: d.placeholder }), d.$button = a("<button/>", { type: "button", "class": "btn btn-primary" }).on("click", { self: d }, d._onSearchButtonClicked).append(a("<span/>", { "class": "fooicon fooicon-search" })), d.$dropdown = a("<ul/>", { "class": "dropdown-menu dropdown-menu-right" }).append(b.arr.map(d.ft.columns.array, function(b) { return b.filterable ? a("<li/>").append(a("<a/>", { "class": "checkbox" }).append(a("<label/>", { text: b.title }).prepend(a("<input/>", { type: "checkbox", checked: !0 }).data("__FooTableColumn__", b)))) : null })), d.delay > 0 && (d.$input.on("keypress keyup", { self: d }, d._onSearchInputChanged), d.$dropdown.on("click", 'input[type="checkbox"]', { self: d }, d._onSearchColumnClicked)), g.append(d.$button, h, d.$dropdown), f.append(d.$input, g)
        },
        predraw: function() {
            if (!b.is.emptyArray(this.filters)) {
                var c = this;
                c.ft.rows.array = a.grep(c.ft.rows.array, function(a) { return a.filtered(c.filters) })
            }
        },
        draw: function() {
            this.$cell.attr("colspan", this.ft.columns.visibleColspan);
            var a = this.find("search");
            a instanceof b.Filter ? (this.$input.val(a.query.val()), this.$button.children(".fooicon").removeClass("fooicon-search").addClass("fooicon-remove")) : (this.$input.val(null), this.$button.children(".fooicon").removeClass("fooicon-remove").addClass("fooicon-search"))
        },
        addFilter: function(a, c, d) {
            var e = b.arr.first(this.filters, function(b) { return b.name == a });
            e instanceof b.Filter ? (e.name = a, e.query = c, e.columns = d) : this.filters.push({ name: a, query: c, columns: d })
        },
        removeFilter: function(a) { b.arr.remove(this.filters, function(b) { return b.name == a }) },
        filter: function() { var a = this; return a.filters = a.ensure(a.filters), a.ft.raise("before.ft.filtering", [a.filters]).then(function() { return a.filters = a.ensure(a.filters), a.ft.draw().then(function() { a.ft.raise("after.ft.filtering", [a.filters]) }) }) },
        clear: function() { return this.filters = [], this.filter() },
        find: function(a) { return b.arr.first(this.filters, function(b) { return b.name == a }) },
        columns: function() { return b.is.jq(this.$dropdown) ? this.$dropdown.find("input:checked").map(function() { return a(this).data("__FooTableColumn__") }).get() : this.ft.columns.get(function(a) { return a.filterable }) },
        ensure: function(a) {
            var c = this,
                d = [],
                e = c.columns();
            return b.is.emptyArray(a) || b.arr.each(a, function(a) { b.is.object(a) && (!b.is.emptyString(a.query) || a.query instanceof b.Query) && (a.name = b.is.emptyString(a.name) ? "anon" : a.name, a.columns = b.is.emptyArray(a.columns) ? e : c.ft.columns.ensure(a.columns), d.push(a instanceof b.Filter ? a : new b.Filter(a.name, a.query, a.columns, c.space, c.connectors, c.ignoreCase))) }), d
        },
        _onSearchInputChanged: function(a) {
            var c = a.data.self,
                d = "keypress" == a.type && !b.is.emptyString(String.fromCharCode(a.charCode)),
                e = "keyup" == a.type && (8 == a.which || 46 == a.which);
            (d || e) && (13 == a.which && a.preventDefault(), null != c._filterTimeout && clearTimeout(c._filterTimeout), c._filterTimeout = setTimeout(function() { c._filterTimeout = null, c.addFilter("search", c.$input.val()), c.filter() }, c.delay))
        },
        _onSearchButtonClicked: function(a) {
            a.preventDefault();
            var b = a.data.self;
            null != b._filterTimeout && clearTimeout(b._filterTimeout);
            var c = b.$button.children(".fooicon");
            c.hasClass("fooicon-remove") ? b.clear() : (b.addFilter("search", b.$input.val()), b.filter())
        },
        _onSearchColumnClicked: function(a) {
            var b = a.data.self;
            null != b._filterTimeout && clearTimeout(b._filterTimeout), b._filterTimeout = setTimeout(function() {
                b._filterTimeout = null;
                var a = b.$button.children(".fooicon");
                a.hasClass("fooicon-remove") && (a.removeClass("fooicon-remove").addClass("fooicon-search"), b.addFilter("search", b.$input.val()), b.filter())
            }, b.delay)
        },
        _onDropdownToggleClicked: function(b) {
            b.preventDefault(), b.stopPropagation();
            var c = b.data.self;
            c.$dropdown.parent().toggleClass("open"), c.$dropdown.parent().hasClass("open") ? a(document).on("click.footable", { self: c }, c._onDocumentClicked) : a(document).off("click.footable", c._onDocumentClicked)
        },
        _onDocumentClicked: function(b) {
            if (0 == a(b.target).closest(".dropdown-menu").length) {
                b.preventDefault();
                var c = b.data.self;
                c.$dropdown.parent().removeClass("open"), a(document).off("click.footable", c._onDocumentClicked)
            }
        }
    }), b.components.register("filtering", b.Filtering, 500)
}(jQuery, FooTable),
function(a) {
    a.Query = a.Class.extend({
        construct: function(b, c, d, e) { this._original = null, this._value = null, this.space = !a.is.string(c) || "OR" != c && "AND" != c ? "AND" : c, this.connectors = a.is["boolean"](d) ? d : !0, this.ignoreCase = a.is["boolean"](e) ? e : !0, this.left = null, this.right = null, this.parts = [], this.operator = null, this.val(b) },
        val: function(b) {
            if (a.is.emptyString(b)) return this._value;
            if (a.is.emptyString(this._original)) this._original = b;
            else if (this._original == b) return;
            this._value = b, this._parse()
        },
        match: function(b) { return a.is.emptyString(this.operator) || "OR" === this.operator ? this._left(b, !1) || this._match(b, !1) || this._right(b, !1) : "AND" === this.operator ? this._left(b, !0) && this._match(b, !0) && this._right(b, !0) : void 0 },
        _match: function(b, c) {
            var d = this,
                e = !1,
                f = a.is.emptyString(b);
            return a.is.emptyArray(d.parts) && d.left instanceof a.Query ? c : a.is.emptyArray(d.parts) ? e : ("OR" === d.space ? a.arr.each(d.parts, function(c) { if (c.empty && f) { if (e = !0, c.negate) return e = !1 } else { var g = a.str.contains(b, c.query, d.ignoreCase); if (g && !c.negate && (e = !0), g && c.negate) return e = !1 } }) : (e = !0, a.arr.each(d.parts, function(c) { if (c.empty) return (!f && !c.negate || f && c.negate) && (e = !1), e; var g = a.str.contains(b, c.query, d.ignoreCase); return (!g && !c.negate || g && c.negate) && (e = !1), e })), e)
        },
        _left: function(b, c) { return this.left instanceof a.Query ? this.left.match(b) : c },
        _right: function(b, c) { return this.right instanceof a.Query ? this.right.match(b) : c },
        _parse: function() {
            if (!a.is.emptyString(this._value))
                if (/\sOR\s/.test(this._value)) {
                    this.operator = "OR";
                    var b = this._value.split(/(?:\sOR\s)(.*)?/);
                    this.left = new a.Query(b[0], this.space, this.connectors, this.ignoreCase), this.right = new a.Query(b[1], this.space, this.connectors, this.ignoreCase)
                } else if (/\sAND\s/.test(this._value)) {
                this.operator = "AND";
                var c = this._value.split(/(?:\sAND\s)(.*)?/);
                this.left = new a.Query(c[0], this.space, this.connectors, this.ignoreCase), this.right = new a.Query(c[1], this.space, this.connectors, this.ignoreCase)
            } else {
                var d = this;
                this.parts = a.arr.map(this._value.match(/(?:[^\s"]+|"[^"]*")+/g), function(a) { return d._part(a) })
            }
        },
        _part: function(b) { var c = { query: b, negate: !1, phrase: !1, exact: !1, empty: !1 }; return a.str.startsWith(c.query, "-") && (c.query = a.str.from(c.query, "-"), c.negate = !0), /^"(.*?)"$/.test(c.query) ? (c.query = c.query.replace(/^"(.*?)"$/, "$1"), c.phrase = !0, c.exact = !0) : this.connectors && /(?:\w)+?([-_\+\.])(?:\w)+?/.test(c.query) && (c.query = c.query.replace(/(?:\w)+?([-_\+\.])(?:\w)+?/g, function(a, b) { return a.replace(b, " ") }), c.phrase = !0), c.empty = c.phrase && a.is.emptyString(c.query), c }
    })
}(FooTable),
function(a) { a.Cell.prototype.filterValue = null, a.Cell.prototype.__filtering_define__ = function(a) { this.filterValue = this.column.filterValue.call(this.column, a) }, a.Cell.prototype.__filtering_val__ = function(b) { a.is.defined(b) && (this.filterValue = this.column.filterValue.call(this.column, b)) }, a.Cell.extend("define", function(a) { this._super(a), this.__filtering_define__(a) }), a.Cell.extend("val", function(a) { var b = this._super(a); return this.__filtering_val__(a), b }) }(FooTable),
function(a, b) {
    b.Column.prototype.filterable = !0, b.Column.prototype.filterValue = function(c) {
        if (b.is.element(c) || b.is.jq(c)) return a(c).data("filterValue") || a(c).text();
        if (b.is.hash(c) && b.is.hash(c.options)) {
            if (b.is.string(c.options.filterValue)) return c.options.filterValue;
            b.is.defined(c.value) && (c = c.value)
        }
        return b.is.defined(c) && null != c ? c + "" : ""
    }, b.Column.prototype.__filtering_define__ = function(a) { this.filterable = b.is["boolean"](a.filterable) ? a.filterable : this.filterable }, b.Column.extend("define", function(a) { this._super(a), this.__filtering_define__(a) })
}(jQuery, FooTable),
function(a) { a.Defaults.prototype.filtering = { enabled: !1, filters: [], delay: 1200, min: 3, space: "AND", placeholder: "Search", position: "right", connectors: !0, ignoreCase: !0 } }(FooTable),
function(a) {
    a.Row.prototype.filtered = function(b) {
        var c = !0,
            d = this;
        return a.arr.each(b, function(a) { return 0 == (c = a.matchRow(d)) ? !1 : void 0 }), c
    }
}(FooTable),
function(a, b) { b.Sorter = b.Class.extend({ construct: function(a, b) { this.column = a, this.direction = b } }) }(jQuery, FooTable),
function(a, b) {
    b.Sorting = b.Component.extend({
        construct: function(a) { this._super(a, a.o.sorting.enabled), this.o = a.o.sorting, this.column = null, this.allowed = !0, this.initial = null },
        preinit: function(a) {
            var c = this;
            this.ft.raise("preinit.ft.sorting", [a]).then(function() { c.ft.$el.hasClass("footable-sorting") && (c.enabled = !0), c.enabled = b.is["boolean"](a.sorting) ? a.sorting : c.enabled, c.enabled && (c.column = b.arr.first(c.ft.columns.array, function(a) { return a.sorted })) }, function() { c.enabled = !1 })
        },
        init: function() {
            var c = this;
            this.ft.raise("init.ft.sorting").then(function() {
                if (!c.initial) {
                    var d = !!c.column;
                    c.initial = { isset: d, rows: c.ft.rows.all.slice(0), column: d ? c.column.name : null, direction: d ? c.column.direction : null }
                }
                b.arr.each(c.ft.columns.array, function(b) { b.sortable && b.$el.addClass("footable-sortable").append(a("<span/>", { "class": "fooicon fooicon-sort" })) }), c.ft.$el.on("click.footable", ".footable-sortable", { self: c }, c._onSortClicked)
            }, function() { c.enabled = !1 })
        },
        destroy: function() {
            var a = this;
            this.ft.raise("destroy.ft.paging").then(function() { a.ft.$el.off("click.footable", ".footable-sortable", a._onSortClicked), a.ft.$el.children("thead").children("tr.footable-header").children(".footable-sortable").removeClass("footable-sortable footable-asc footable-desc").find("span.fooicon").remove() })
        },
        predraw: function() {
            if (this.column) {
                var a = this,
                    b = a.column;
                a.ft.rows.array.sort(function(a, c) { return "DESC" == b.direction ? b.sorter(c.cells[b.index].sortValue, a.cells[b.index].sortValue) : b.sorter(a.cells[b.index].sortValue, c.cells[b.index].sortValue) })
            }
        },
        draw: function() {
            if (this.column) {
                var a = this,
                    b = a.ft.$el.find("thead > tr > .footable-sortable"),
                    c = a.column.$el;
                b.removeClass("footable-asc footable-desc").children(".fooicon").removeClass("fooicon-sort fooicon-sort-asc fooicon-sort-desc"), b.not(c).children(".fooicon").addClass("fooicon-sort"), c.addClass("ASC" == a.column.direction ? "footable-asc" : "footable-desc").children(".fooicon").addClass("ASC" == a.column.direction ? "fooicon-sort-asc" : "fooicon-sort-desc")
            }
        },
        sort: function(a, b) { return this._sort(a, b) },
        toggleAllowed: function(a) { a = b.is["boolean"](a) ? a : !this.allowed, this.allowed = a, this.ft.$el.toggleClass("footable-sorting-disabled", !this.allowed) },
        hasChanged: function() { return !(!this.initial || !this.column || this.column.name === this.initial.column && (this.column.direction === this.initial.direction || null === this.initial.direction && "ASC" === this.column.direction)) },
        reset: function() { this.initial && (this.initial.isset ? this.sort(this.initial.column, this.initial.direction) : (this.column && (this.column.$el.removeClass("footable-asc footable-desc"), this.column = null), this.ft.rows.all = this.initial.rows, this.ft.draw())) },
        _sort: function(c, d) {
            if (!this.allowed) return a.Deferred().reject("sorting disabled");
            var e = this,
                f = new b.Sorter(e.ft.columns.get(c), b.Sorting.dir(d));
            return e.ft.raise("before.ft.sorting", [f]).then(function() { return b.arr.each(e.ft.columns.array, function(a) { a != e.column && (a.direction = null) }), e.column = e.ft.columns.get(f.column), e.column && (e.column.direction = b.Sorting.dir(f.direction)), e.ft.draw().then(function() { e.ft.raise("after.ft.sorting", [f]) }) })
        },
        _onSortClicked: function(b) {
            var c = b.data.self,
                d = a(this).closest("th,td"),
                e = d.is(".footable-asc, .footable-desc") ? d.hasClass("footable-desc") ? "ASC" : "DESC" : "ASC";
            c._sort(d.index(), e)
        }
    }), b.Sorting.dir = function(a) { return !b.is.string(a) || "ASC" != a && "DESC" != a ? "ASC" : a }, b.components.register("sorting", b.Sorting, 600)
}(jQuery, FooTable),
function(a) { a.Cell.prototype.sortValue = null, a.Cell.prototype.__sorting_define__ = function(a) { this.sortValue = this.column.sortValue.call(this.column, a) }, a.Cell.prototype.__sorting_val__ = function(b) { a.is.defined(b) && (this.sortValue = this.column.sortValue.call(this.column, b)) }, a.Cell.extend("define", function(a) { this._super(a), this.__sorting_define__(a) }), a.Cell.extend("val", function(a) { var b = this._super(a); return this.__sorting_val__(a), b }) }(FooTable),
function(a, b) {
    b.Column.prototype.direction = null, b.Column.prototype.sortable = !0, b.Column.prototype.sorted = !1, b.Column.prototype.sorter = function(a, b) { return "string" == typeof a && (a = a.toLowerCase()), "string" == typeof b && (b = b.toLowerCase()), a === b ? 0 : b > a ? -1 : 1 }, b.Column.prototype.sortValue = function(c) {
        if (b.is.element(c) || b.is.jq(c)) return a(c).data("sortValue") || this.parser(c);
        if (b.is.hash(c) && b.is.hash(c.options)) {
            if (b.is.string(c.options.sortValue)) return c.options.sortValue;
            b.is.defined(c.value) && (c = c.value)
        }
        return b.is.defined(c) && null != c ? c : null
    }, b.Column.prototype.__sorting_define__ = function(a) { this.sorter = b.checkFnValue(this, a.sorter, this.sorter), this.direction = b.is.type(a.direction, "string") ? b.Sorting.dir(a.direction) : null, this.sortable = b.is["boolean"](a.sortable) ? a.sortable : !0, this.sorted = b.is["boolean"](a.sorted) ? a.sorted : !1 }, b.Column.extend("define", function(a) { this._super(a), this.__sorting_define__(a) })
}(jQuery, FooTable),
function(a) { a.Defaults.prototype.sorting = { enabled: !1 } }(FooTable),
function(a, b) {
    b.HTMLColumn.extend("__sorting_define__", function(c) { this._super(c), this.sortUse = b.is.string(c.sortUse) && -1 !== a.inArray(c.sortUse, ["html", "text"]) ? c.sortUse : "html" }), b.HTMLColumn.prototype.sortValue = function(c) {
        if (b.is.element(c) || b.is.jq(c)) return a(c).data("sortValue") || a.trim(a(c)[this.sortUse]());
        if (b.is.hash(c) && b.is.hash(c.options)) {
            if (b.is.string(c.options.sortValue)) return c.options.sortValue;
            b.is.defined(c.value) && (c = c.value)
        }
        return b.is.defined(c) && null != c ? c : null
    }
}(jQuery, FooTable),
function(a) { a.Table.prototype.sort = function(b, c) { return this.use(a.Sorting).sort(b, c) } }(FooTable),
function(a, b) { b.Pager = b.Class.extend({ construct: function(a, b, c, d, e) { this.total = a, this.current = b, this.size = c, this.page = d, this.forward = e } }) }(jQuery, FooTable),
function(a, b) {
    b.Paging = b.Component.extend({
        construct: function(a) { this._super(a, a.o.paging.enabled), this.strings = a.o.paging.strings, this.current = a.o.paging.current, this.size = a.o.paging.size, this.limit = a.o.paging.limit, this.position = a.o.paging.position, this.countFormat = a.o.paging.countFormat, this.total = -1, this.$row = null, this.$cell = null, this.$pagination = null, this.$count = null, this.detached = !1, this._previous = 1, this._total = 0 },
        preinit: function(a) {
            var c = this;
            this.ft.raise("preinit.ft.paging", [a]).then(function() { c.ft.$el.hasClass("footable-paging") && (c.enabled = !0), c.enabled = b.is["boolean"](a.paging) ? a.paging : c.enabled, c.enabled && (c.size = b.is.number(a.pagingSize) ? a.pagingSize : c.size, c.current = b.is.number(a.pagingCurrent) ? a.pagingCurrent : c.current, c.limit = b.is.number(a.pagingLimit) ? a.pagingLimit : c.limit, c.ft.$el.hasClass("footable-paging-left") && (c.position = "left"), c.ft.$el.hasClass("footable-paging-center") && (c.position = "center"), c.ft.$el.hasClass("footable-paging-right") && (c.position = "right"), c.position = b.is.string(a.pagingPosition) ? a.pagingPosition : c.position, c.countFormat = b.is.string(a.pagingCountFormat) ? a.pagingCountFormat : c.countFormat, c.total = Math.ceil(c.ft.rows.all.length / c.size)) }, function() { c.enabled = !1 })
        },
        init: function() {
            var a = this;
            this.ft.raise("init.ft.paging").then(function() { a.$create() }, function() { a.enabled = !1 })
        },
        destroy: function() {
            var a = this;
            this.ft.raise("destroy.ft.paging").then(function() { a.ft.$el.removeClass("footable-paging").find("tfoot > tr.footable-paging").remove(), a.detached = !1 })
        },
        predraw: function() { this.total = Math.ceil(this.ft.rows.array.length / this.size), this.current = this.current > this.total ? this.total : this.current < 1 ? 1 : this.current, this.ft.rows.array.length > this.size && (this.ft.rows.array = this.ft.rows.array.splice((this.current - 1) * this.size, this.size)) },
        draw: function() {
            if (this.total <= 1) this.detached || (this.$row.detach(), this.detached = !0);
            else {
                if (this.detached) {
                    var b = this.ft.$el.children("tfoot");
                    0 == b.length && (b = a("<tfoot/>"), this.ft.$el.append(b)), this.$row.appendTo(b), this.detached = !1
                }
                this.$cell.attr("colspan", this.ft.columns.visibleColspan), this._createLinks(), this._setVisible(this.current, this.current > this._previous), this._setNavigation(!0)
            }
        },
        $create: function() {
            var b = "footable-paging-center";
            switch (this.position) {
                case "left":
                    b = "footable-paging-left";
                    break;
                case "right":
                    b = "footable-paging-right"
            }
            this.ft.$el.addClass("footable-paging").addClass(b), this.$cell = a("<td/>").attr("colspan", this.ft.columns.visibleColspan);
            var c = this.ft.$el.children("tfoot");
            0 == c.length && (c = a("<tfoot/>"), this.ft.$el.append(c)), this.$row = a("<tr/>", { "class": "footable-paging" }).append(this.$cell).appendTo(c), this.$pagination = a("<ul/>", { "class": "pagination" }).on("click.footable", "a.footable-page-link", { self: this }, this._onPageClicked), this.$count = a("<span/>", { "class": "label label-default" }), this.$cell.append(this.$pagination, a("<div/>", { "class": "divider" }), this.$count), this.detached = !1, this._createLinks()
        },
        first: function() { return this._set(1) },
        prev: function() { return this._set(this.current - 1 > 0 ? this.current - 1 : 1) },
        next: function() { return this._set(this.current + 1 < this.total ? this.current + 1 : this.total) },
        last: function() { return this._set(this.total) },
        "goto": function(a) { return this._set(a > this.total ? this.total : 1 > a ? 1 : a) },
        prevPages: function() {
            var a = this.$pagination.children("li.footable-page.visible:first").data("page") - 1;
            this._setVisible(a, !0), this._setNavigation(!1)
        },
        nextPages: function() {
            var a = this.$pagination.children("li.footable-page.visible:last").data("page") + 1;
            this._setVisible(a, !1), this._setNavigation(!1)
        },
        pageSize: function(a) { return b.is.number(a) ? (this.size = a, this.total = Math.ceil(this.ft.rows.all.length / this.size), b.is.jq(this.$row) && this.$row.remove(), this.$create(), void this.ft.draw()) : this.size },
        _set: function(c) {
            var d = this,
                e = new b.Pager(d.total, d.current, d.size, c, c > d.current);
            return d.ft.raise("before.ft.paging", [e]).then(function() { return e.page = e.page > e.total ? e.total : e.page, e.page = e.page < 1 ? 1 : e.page, d.current == c ? a.when() : (d._previous = d.current, d.current = e.page, d.ft.draw().then(function() { d.ft.raise("after.ft.paging", [e]) })) })
        },
        _createLinks: function() {
            if (this._total !== this.total) {
                var b = this,
                    c = b.total > 1,
                    d = function(b, c, d) { return a("<li/>", { "class": d }).attr("data-page", b).append(a("<a/>", { "class": "footable-page-link", href: "#" }).data("page", b).html(c)) };
                b.$pagination.empty(), c && (b.$pagination.append(d("first", b.strings.first, "footable-page-nav")), b.$pagination.append(d("prev", b.strings.prev, "footable-page-nav")), b.limit > 0 && b.limit < b.total && b.$pagination.append(d("prev-limit", b.strings.prevPages, "footable-page-nav")));
                for (var e, f = 0; f < b.total; f++) e = d(f + 1, f + 1, "footable-page"), b.$pagination.append(e);
                c && (b.limit > 0 && b.limit < b.total && b.$pagination.append(d("next-limit", b.strings.nextPages, "footable-page-nav")), b.$pagination.append(d("next", b.strings.next, "footable-page-nav")), b.$pagination.append(d("last", b.strings.last, "footable-page-nav"))), b._total = b.total
            }
        },
        _setNavigation: function(a) { 1 == this.current ? this.$pagination.children('li[data-page="first"],li[data-page="prev"]').addClass("disabled") : this.$pagination.children('li[data-page="first"],li[data-page="prev"]').removeClass("disabled"), this.current == this.total ? this.$pagination.children('li[data-page="next"],li[data-page="last"]').addClass("disabled") : this.$pagination.children('li[data-page="next"],li[data-page="last"]').removeClass("disabled"), 1 == (this.$pagination.children("li.footable-page.visible:first").data("page") || 1) ? this.$pagination.children('li[data-page="prev-limit"]').addClass("disabled") : this.$pagination.children('li[data-page="prev-limit"]').removeClass("disabled"), (this.$pagination.children("li.footable-page.visible:last").data("page") || this.limit) == this.total ? this.$pagination.children('li[data-page="next-limit"]').addClass("disabled") : this.$pagination.children('li[data-page="next-limit"]').removeClass("disabled"), this.limit > 0 && this.total < this.limit ? this.$pagination.children('li[data-page="prev-limit"],li[data-page="next-limit"]').hide() : this.$pagination.children('li[data-page="prev-limit"],li[data-page="next-limit"]').show(), a && this.$pagination.children("li.footable-page").removeClass("active").filter('li[data-page="' + this.current + '"]').addClass("active") },
        _setVisible: function(a, b) {
            if (this.limit > 0 && this.total > this.limit) {
                if (!this.$pagination.children('li.footable-page[data-page="' + a + '"]').hasClass("visible")) {
                    var c = 0,
                        d = 0;
                    1 == b ? (d = a > this.total ? this.total : a, c = d - this.limit) : (c = 1 > a ? 0 : a - 1, d = c + this.limit), 0 > c && (c = 0, d = this.limit > this.total ? this.total : this.limit), d > this.total && (d = this.total, c = this.total - this.limit < 0 ? 0 : this.total - this.limit), this.$pagination.children("li.footable-page").removeClass("visible").slice(c, d).addClass("visible")
                }
            } else this.$pagination.children("li.footable-page").removeClass("visible").slice(0, this.total).addClass("visible");
            var e = this.size * (a - 1) + 1,
                f = this.size * a,
                g = this.ft.rows.all.length;
            0 == this.ft.rows.array.length ? (e = 0, f = 0) : f = f > g ? g : f, this._setCount(a, this.total, e, f, g)
        },
        _setCount: function(a, b, c, d, e) { this.$count.text(this.countFormat.replace(/\{CP}/g, a).replace(/\{TP}/g, b).replace(/\{PF}/g, c).replace(/\{PL}/g, d).replace(/\{TR}/g, e)) },
        _onPageClicked: function(b) {
            if (b.preventDefault(), !a(b.target).closest("li").is(".active,.disabled")) {
                var c = b.data.self,
                    d = a(this).data("page");
                switch (d) {
                    case "first":
                        return void c.first();
                    case "prev":
                        return void c.prev();
                    case "next":
                        return void c.next();
                    case "last":
                        return void c.last();
                    case "prev-limit":
                        return void c.prevPages();
                    case "next-limit":
                        return void c.nextPages();
                    default:
                        return void c._set(d)
                }
            }
        }
    }), b.components.register("paging", b.Paging, 400)
}(jQuery, FooTable),
function(a) { a.Defaults.prototype.paging = { enabled: !1, countFormat: "{CP} of {TP}", current: 1, limit: 5, position: "center", size: 10, strings: { first: "&laquo;", prev: "&lsaquo;", next: "&rsaquo;", last: "&raquo;", prevPages: "...", nextPages: "..." } } }(FooTable),
function(a) { a.Table.prototype.gotoPage = function(b) { return this.use(a.Paging)["goto"](b) }, a.Table.prototype.nextPage = function() { return this.use(a.Paging).next() }, a.Table.prototype.prevPage = function() { return this.use(a.Paging).prev() }, a.Table.prototype.firstPage = function() { return this.use(a.Paging).first() }, a.Table.prototype.lastPage = function() { return this.use(a.Paging).last() }, a.Table.prototype.nextPages = function() { return this.use(a.Paging).nextPages() }, a.Table.prototype.prevPages = function() { return this.use(a.Paging).prevPages() }, a.Table.prototype.pageSize = function(b) { return this.use(a.Paging).pageSize(b) } }(FooTable),
function(a, b) {
    b.Editing = b.Component.extend({
        construct: function(c) { this._super(c, c.o.editing.enabled), this.pageToNew = c.o.editing.pageToNew, this.alwaysShow = c.o.editing.alwaysShow, this.column = a.extend(!0, {}, c.o.editing.column, { visible: this.alwaysShow }), this.position = c.o.editing.position, this.showText = c.o.editing.showText, this.hideText = c.o.editing.hideText, this.addText = c.o.editing.addText, this.editText = c.o.editing.editText, this.deleteText = c.o.editing.deleteText, this.viewText = c.o.editing.viewText, this.allowAdd = c.o.editing.allowAdd, this.allowEdit = c.o.editing.allowEdit, this.allowDelete = c.o.editing.allowDelete, this.allowView = c.o.editing.allowView, this._$buttons = null, this.callbacks = { addRow: b.checkFnValue(this, c.o.editing.addRow), editRow: b.checkFnValue(this, c.o.editing.editRow), deleteRow: b.checkFnValue(this, c.o.editing.deleteRow), viewRow: b.checkFnValue(this, c.o.editing.viewRow) } },
        preinit: function(c) {
            var d = this;
            this.ft.raise("preinit.ft.editing", [c]).then(function() {
                if (d.ft.$el.hasClass("footable-editing") && (d.enabled = !0), d.enabled = b.is["boolean"](c.editing) ? c.editing : d.enabled, d.enabled) {
                    if (d.pageToNew = b.is["boolean"](c.editingPageToNew) ? c.editingPageToNew : d.pageToNew, d.alwaysShow = b.is["boolean"](c.editingAlwaysShow) ? c.editingAlwaysShow : d.alwaysShow, d.position = b.is.string(c.editingPosition) ? c.editingPosition : d.position, d.showText = b.is.string(c.editingShowText) ? c.editingShowText : d.showText, d.hideText = b.is.string(c.editingHideText) ? c.editingHideText : d.hideText, d.addText = b.is.string(c.editingAddText) ? c.editingAddText : d.addText, d.editText = b.is.string(c.editingEditText) ? c.editingEditText : d.editText, d.deleteText = b.is.string(c.editingDeleteText) ? c.editingDeleteText : d.deleteText, d.viewText = b.is.string(c.editingViewText) ? c.editingViewText : d.viewText, d.allowAdd = b.is["boolean"](c.editingAllowAdd) ? c.editingAllowAdd : d.allowAdd, d.allowEdit = b.is["boolean"](c.editingAllowEdit) ? c.editingAllowEdit : d.allowEdit, d.allowDelete = b.is["boolean"](c.editingAllowDelete) ? c.editingAllowDelete : d.allowDelete, d.allowView = b.is["boolean"](c.editingAllowView) ? c.editingAllowView : d.allowView, d.column = new b.EditingColumn(d.ft, d, a.extend(!0, {}, d.column, c.editingColumn, { visible: d.alwaysShow })), d.ft.$el.hasClass("footable-editing-left") && (d.position = "left"), d.ft.$el.hasClass("footable-editing-right") && (d.position = "right"), "right" === d.position) d.column.index = d.ft.columns.array.length;
                    else { d.column.index = 0; for (var e = 0, f = d.ft.columns.array.length; f > e; e++) d.ft.columns.array[e].index += 1 } d.ft.columns.array.push(d.column), d.ft.columns.array.sort(function(a, b) { return a.index - b.index }), d.callbacks.addRow = b.checkFnValue(d, c.editingAddRow, d.callbacks.addRow), d.callbacks.editRow = b.checkFnValue(d, c.editingEditRow, d.callbacks.editRow), d.callbacks.deleteRow = b.checkFnValue(d, c.editingDeleteRow, d.callbacks.deleteRow), d.callbacks.viewRow = b.checkFnValue(d, c.editingViewRow, d.callbacks.viewRow)
                }
            }, function() { d.enabled = !1 })
        },
        init: function() {
            var a = this;
            this.ft.raise("init.ft.editing").then(function() { a.$create() }, function() { a.enabled = !1 })
        },
        destroy: function() {
            var a = this;
            this.ft.raise("destroy.ft.editing").then(function() { a.ft.$el.removeClass("footable-editing footable-editing-always-show footable-editing-no-add footable-editing-no-edit footable-editing-no-delete footable-editing-no-view").off("click.ft.editing").find("tfoot > tr.footable-editing").remove() })
        },
        $create: function() {
            var b = this,
                c = "right" === b.position ? "footable-editing-right" : "footable-editing-left";
            b.ft.$el.addClass("footable-editing").addClass(c).on("click.ft.editing", ".footable-show", { self: b }, b._onShowClick).on("click.ft.editing", ".footable-hide", { self: b }, b._onHideClick).on("click.ft.editing", ".footable-edit", { self: b }, b._onEditClick).on("click.ft.editing", ".footable-delete", { self: b }, b._onDeleteClick).on("click.ft.editing", ".footable-view", { self: b }, b._onViewClick).on("click.ft.editing", ".footable-add", {
                self: b
            }, b._onAddClick), b.$cell = a("<td/>").attr("colspan", b.ft.columns.visibleColspan).append(b.$buttonShow()), b.allowAdd && b.$cell.append(b.$buttonAdd()), b.$cell.append(b.$buttonHide()), b.alwaysShow && b.ft.$el.addClass("footable-editing-always-show"), b.allowAdd || b.ft.$el.addClass("footable-editing-no-add"), b.allowEdit || b.ft.$el.addClass("footable-editing-no-edit"), b.allowDelete || b.ft.$el.addClass("footable-editing-no-delete"), b.allowView || b.ft.$el.addClass("footable-editing-no-view");
            var d = b.ft.$el.children("tfoot");
            0 == d.length && (d = a("<tfoot/>"), b.ft.$el.append(d)), b.$row = a("<tr/>", { "class": "footable-editing" }).append(b.$cell).appendTo(d)
        },
        $buttonShow: function() { return '<button type="button" class="btn btn-primary footable-show">' + this.showText + "</button>" },
        $buttonHide: function() { return '<button type="button" class="btn btn-default footable-hide">' + this.hideText + "</button>" },
        $buttonAdd: function() { return '<button type="button" class="btn btn-primary footable-add">' + this.addText + "</button> " },
        $buttonEdit: function() { return '<button type="button" class="btn btn-default footable-edit">' + this.editText + "</button> " },
        $buttonDelete: function() { return '<button type="button" class="btn btn-default footable-delete">' + this.deleteText + "</button>" },
        $buttonView: function() { return '<button type="button" class="btn btn-default footable-view">' + this.viewText + "</button> " },
        $rowButtons: function() { return b.is.jq(this._$buttons) ? this._$buttons.clone() : (this._$buttons = a('<div class="btn-group btn-group-xs" role="group"></div>'), this.allowView && this._$buttons.append(this.$buttonView()), this.allowEdit && this._$buttons.append(this.$buttonEdit()), this.allowDelete && this._$buttons.append(this.$buttonDelete()), this._$buttons) },
        draw: function() { this.$cell.attr("colspan", this.ft.columns.visibleColspan) },
        _onEditClick: function(c) {
            c.preventDefault();
            var d = c.data.self,
                e = a(this).closest("tr").data("__FooTableRow__");
            e instanceof b.Row && d.ft.raise("edit.ft.editing", [e]).then(function() { d.callbacks.editRow.call(d.ft, e) })
        },
        _onDeleteClick: function(c) {
            c.preventDefault();
            var d = c.data.self,
                e = a(this).closest("tr").data("__FooTableRow__");
            e instanceof b.Row && d.ft.raise("delete.ft.editing", [e]).then(function() { d.callbacks.deleteRow.call(d.ft, e) })
        },
        _onViewClick: function(c) {
            c.preventDefault();
            var d = c.data.self,
                e = a(this).closest("tr").data("__FooTableRow__");
            e instanceof b.Row && d.ft.raise("view.ft.editing", [e]).then(function() { d.callbacks.viewRow.call(d.ft, e) })
        },
        _onAddClick: function(a) {
            a.preventDefault();
            var b = a.data.self;
            b.ft.raise("add.ft.editing").then(function() { b.callbacks.addRow.call(b.ft) })
        },
        _onShowClick: function(a) {
            a.preventDefault();
            var b = a.data.self;
            b.ft.raise("show.ft.editing").then(function() { b.ft.$el.addClass("footable-editing-show"), b.column.visible = !0, b.ft.draw() })
        },
        _onHideClick: function(a) {
            a.preventDefault();
            var b = a.data.self;
            b.ft.raise("hide.ft.editing").then(function() { b.ft.$el.removeClass("footable-editing-show"), b.column.visible = !1, b.ft.draw() })
        }
    }), b.components.register("editing", b.Editing, 850)
}(jQuery, FooTable),
function(a, b) {
    b.EditingColumn = b.Column.extend({
        construct: function(a, b, c) { this._super(a, c, "editing"), this.editing = b },
        $create: function() {
            (this.$el = !this.virtual && b.is.jq(this.$el) ? this.$el : a("<th/>", { "class": "footable-editing" })).html(this.title)
        },
        parser: function(c) { if (b.is.string(c) && (c = a(a.trim(c))), b.is.element(c) && (c = a(c)), b.is.jq(c)) { var d = c.prop("tagName").toLowerCase(); return "td" == d || "th" == d ? c.data("value") || c.contents() : c } return null },
        createCell: function(c) {
            var d = this.editing.$rowButtons(),
                e = a("<td/>").append(d);
            return b.is.jq(c.$el) && (0 === this.index ? e.prependTo(c.$el) : e.insertAfter(c.$el.children().eq(this.index - 1))), new b.Cell(this.ft, c, this, e || e.html())
        }
    }), b.columns.register("editing", b.EditingColumn)
}(jQuery, FooTable),
function(a, b) { b.Defaults.prototype.editing = { enabled: !1, pageToNew: !0, position: "right", alwaysShow: !1, addRow: function() {}, editRow: function(a) {}, deleteRow: function(a) {}, viewRow: function(a) {}, showText: '<span class="fooicon fooicon-pencil" aria-hidden="true"></span> Edit rows', hideText: "Cancel", addText: "New row", editText: '<span class="fooicon fooicon-pencil" aria-hidden="true"></span>', deleteText: '<span class="fooicon fooicon-trash" aria-hidden="true"></span>', viewText: '<span class="fooicon fooicon-stats" aria-hidden="true"></span>', allowAdd: !0, allowEdit: !0, allowDelete: !0, allowView: !1, column: { classes: "footable-editing", name: "editing", title: "", filterable: !1, sortable: !1 } } }(jQuery, FooTable),
function(a, b) { b.is.defined(b.Paging) && (b.Paging.prototype.unpaged = [], b.Paging.extend("predraw", function() { this.unpaged = this.ft.rows.array.slice(0), this._super() })) }(jQuery, FooTable),
function(a, b) {
    b.Row.prototype.add = function(c) { c = b.is["boolean"](c) ? c : !0; var d = this; return a.Deferred(function(a) { var b = d.ft.rows.all.push(d) - 1; return c ? d.ft.draw().then(function() { a.resolve(b) }) : void a.resolve(b) }) }, b.Row.prototype["delete"] = function(c) { c = b.is["boolean"](c) ? c : !0; var d = this; return a.Deferred(function(a) { var e = d.ft.rows.all.indexOf(d); return b.is.number(e) && e >= 0 && e < d.ft.rows.all.length && (d.ft.rows.all.splice(e, 1), c) ? d.ft.draw().then(function() { a.resolve(d) }) : void a.resolve(d) }) }, b.is.defined(b.Paging) && b.Row.extend("add", function(a) {
        a = b.is["boolean"](a) ? a : !0;
        var c, d = this,
            e = this._super(a),
            f = d.ft.use(b.Editing);
        return f && f.pageToNew && (c = d.ft.use(b.Paging)) && a ? e.then(function() {
            var a = c.unpaged.indexOf(d),
                b = Math.ceil((a + 1) / c.size);
            return c.current !== b ? c["goto"](b) : void 0
        }) : e
    }), b.is.defined(b.Sorting) && b.Row.extend("val", function(a, c) {
        c = b.is["boolean"](c) ? c : !0;
        var d = this._super(a);
        if (!b.is.hash(a)) return d;
        var e = this;
        return c && e.ft.draw().then(function() {
            var a, c = e.ft.use(b.Editing);
            if (b.is.defined(b.Paging) && c && c.pageToNew && (a = e.ft.use(b.Paging))) {
                var d = a.unpaged.indexOf(e),
                    f = Math.ceil((d + 1) / a.size);
                if (a.current !== f) return a["goto"](f)
            }
        }), d
    })
}(jQuery, FooTable),
function(a) {
    a.Rows.prototype.add = function(b, c) {
        var d = b;
        a.is.hash(b) && (d = new FooTable.Row(this.ft, this.ft.columns.array, b)), d instanceof FooTable.Row && d.add(c)
    }, a.Rows.prototype.update = function(b, c, d) {
        var e = this.ft.rows.all.length,
            f = b;
        a.is.number(b) && b >= 0 && e > b && (f = this.ft.rows.all[b]), f instanceof FooTable.Row && a.is.hash(c) && f.val(c, d)
    }, a.Rows.prototype["delete"] = function(b, c) {
        var d = this.ft.rows.all.length,
            e = b;
        a.is.number(b) && b >= 0 && d > b && (e = this.ft.rows.all[b]), e instanceof FooTable.Row && e["delete"](c)
    }
}(FooTable),
function(a, b) {
    var c = 0,
        d = function(a) { var b, c, d = 2166136261; for (b = 0, c = a.length; c > b; b++) d ^= a.charCodeAt(b), d += (d << 1) + (d << 4) + (d << 7) + (d << 8) + (d << 24); return d >>> 0 }(location.origin + location.pathname);
    b.State = b.Component.extend({
        construct: function(a) { this._super(a, a.o.state.enabled), this.key = b.is.string(a.o.state.key) ? a.o.state.key : this._uid(), this.filtering = b.is["boolean"](a.o.state.filtering) ? a.o.state.filtering : !0, this.paging = b.is["boolean"](a.o.state.paging) ? a.o.state.paging : !0, this.sorting = b.is["boolean"](a.o.state.sorting) ? a.o.state.sorting : !0 },
        preinit: function(a) {
            var c = this;
            this.ft.raise("preinit.ft.state", [a]).then(function() { c.enabled = b.is["boolean"](a.state) ? a.state : c.enabled, c.enabled && (c.key = b.is.string(a.stateKey) ? a.stateKey : c.key, c.filtering = b.is["boolean"](a.stateFiltering) ? a.stateFiltering : c.filtering, c.paging = b.is["boolean"](a.statePaging) ? a.statePaging : c.paging, c.sorting = b.is["boolean"](a.stateSorting) ? a.stateSorting : c.sorting) }, function() { c.enabled = !1 })
        },
        get: function(a) { return JSON.parse(localStorage.getItem(this.key + ":" + a)) },
        set: function(a, b) { localStorage.setItem(this.key + ":" + a, JSON.stringify(b)) },
        remove: function(a) { localStorage.removeItem(this.key + ":" + a) },
        read: function() { this.ft.execute(!1, !0, "readState") },
        write: function() { this.ft.execute(!1, !0, "writeState") },
        clear: function() { this.ft.execute(!1, !0, "clearState") },
        _uid: function() { var a = this.ft.$el.attr("id"); return d + "_" + (b.is.string(a) ? a : ++c) }
    }), b.components.register("state", b.State, 700)
}(jQuery, FooTable),
function(a) { a.Component.prototype.readState = function() {}, a.Component.prototype.writeState = function() {}, a.Component.prototype.clearState = function() {} }(FooTable),
function(a) { a.Defaults.prototype.state = { enabled: !1, filtering: !0, paging: !0, sorting: !0, key: null } }(FooTable),
function(a) {
    a.Filtering && (a.Filtering.prototype.readState = function() {
        if (this.ft.state.filtering) {
            var b = this.ft.state.get("filtering");
            a.is.hash(b) && a.is.array(b.filters) && (this.filters = this.ensure(b.filters))
        }
    }, a.Filtering.prototype.writeState = function() {
        if (this.ft.state.filtering) {
            var b = a.arr.map(this.filters, function(b) { return { name: b.name, query: b.query instanceof a.Query ? b.query.val() : b.query, columns: a.arr.map(b.columns, function(a) { return a.name }) } });
            this.ft.state.set("filtering", { filters: b })
        }
    }, a.Filtering.prototype.clearState = function() { this.ft.state.filtering && this.ft.state.remove("filtering") })
}(FooTable),
function(a) {
    a.Paging && (a.Paging.prototype.readState = function() {
        if (this.ft.state.paging) {
            var b = this.ft.state.get("paging");
            a.is.hash(b) && (this.current = b.current, this.size = b.size)
        }
    }, a.Paging.prototype.writeState = function() { this.ft.state.paging && this.ft.state.set("paging", { current: this.current, size: this.size }) }, a.Paging.prototype.clearState = function() { this.ft.state.paging && this.ft.state.remove("paging") })
}(FooTable),
function(a) {
    a.Sorting && (a.Sorting.prototype.readState = function() {
        if (this.ft.state.sorting) {
            var b = this.ft.state.get("sorting");
            if (a.is.hash(b)) {
                var c = this.ft.columns.get(b.column);
                c instanceof a.Column && (this.column = c, this.column.direction = b.direction)
            }
        }
    }, a.Sorting.prototype.writeState = function() { this.ft.state.sorting && this.column instanceof a.Column && this.ft.state.set("sorting", { column: this.column.name, direction: this.column.direction }) }, a.Sorting.prototype.clearState = function() { this.ft.state.sorting && this.ft.state.remove("sorting") })
}(FooTable),
function(a) { a.Table.extend("_construct", function(a) { this.state = this.use(FooTable.State), this._super(a) }), a.Table.extend("_preinit", function() { var a = this; return a._super().then(function() { a.state.enabled && a.state.read() }) }), a.Table.extend("draw", function() { var a = this; return a._super().then(function() { a.state.enabled && a.state.write() }) }) }(FooTable);

"use strict";

function _typeof(t) { return (_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) { return typeof t } : function(t) { return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t })(t) }! function(i, s) {
    window.console = window.console || { log: function() {}, error: function() {} }, i.fn.footable = function(i, n) { return i = i || {}, this.filter("table").each(function(t, e) { s.init(e, i, n) }) };
    var n = { events: [] };
    s.__debug__ = JSON.parse(localStorage.getItem("footable_debug")) || !1, s.__debug_options__ = JSON.parse(localStorage.getItem("footable_debug_options")) || n, s.debug = function(t, e) { return s.is.boolean(t) ? (s.__debug__ = t, void(s.__debug__ ? (localStorage.setItem("footable_debug", JSON.stringify(s.__debug__)), s.__debug_options__ = i.extend(!0, {}, n, e || {}), s.is.hash(e) && localStorage.setItem("footable_debug_options", JSON.stringify(s.__debug_options__))) : (localStorage.removeItem("footable_debug"), localStorage.removeItem("footable_debug_options")))) : s.__debug__ }, s.get = function(t) { return i(t).first().data("__FooTable__") }, s.init = function(t, e, i) { var n = s.get(t); return n instanceof s.Table && n.destroy(), new s.Table(t, e, i) }, s.getRow = function(t) { var e = i(t).closest("tr"); return e.hasClass("footable-detail-row") && (e = e.prev()), e.data("__FooTableRow__") }
}(jQuery, FooTable = window.FooTable || {}),
function(a) {
    function s() { return !0 } a.arr = {}, a.arr.each = function(t, e) {
        if (a.is.array(t) && a.is.fn(e))
            for (var i = 0, n = t.length; i < n && !1 !== e(t[i], i); i++);
    }, a.arr.get = function(t, e) { var i = []; if (!a.is.array(t)) return i; if (!a.is.fn(e)) return t; for (var n = 0, s = t.length; n < s; n++) e(t[n], n) && i.push(t[n]); return i }, a.arr.any = function(t, e) {
        if (!a.is.array(t)) return !1;
        e = a.is.fn(e) ? e : s;
        for (var i = 0, n = t.length; i < n; i++)
            if (e(t[i], i)) return !0;
        return !1
    }, a.arr.contains = function(t, e) {
        if (!a.is.array(t) || a.is.undef(e)) return !1;
        for (var i = 0, n = t.length; i < n; i++)
            if (t[i] == e) return !0;
        return !1
    }, a.arr.first = function(t, e) {
        if (!a.is.array(t)) return null;
        e = a.is.fn(e) ? e : s;
        for (var i = 0, n = t.length; i < n; i++)
            if (e(t[i], i)) return t[i];
        return null
    }, a.arr.map = function(t, e) { var i, n = []; if (!a.is.array(t) || !a.is.fn(e)) return n; for (var s = 0, o = t.length; s < o; s++) null != (i = e(t[s], s)) && n.push(i); return n }, a.arr.remove = function(t, e) {
        var i = [],
            n = [];
        if (!a.is.array(t) || !a.is.fn(e)) return n;
        for (var s = 0, o = t.length; s < o; s++) e(t[s], s, n) && (i.push(s), n.push(t[s]));
        for (i.sort(function(t, e) { return e - t }), s = 0, o = i.length; s < o; s++) {
            var r = i[s] - s;
            t.splice(r, 1)
        }
        return n
    }, a.arr.delete = function(t, e) {
        var i = -1,
            n = null;
        if (!a.is.array(t) || a.is.undef(e)) return n;
        for (var s = 0, o = t.length; s < o; s++)
            if (t[s] == e) { n = t[i = s]; break } return -1 != i && t.splice(i, 1), n
    }, a.arr.replace = function(t, e, i) { var n = t.indexOf(e); - 1 !== n && (t[n] = i) }
}(FooTable),
function(i) {
    i.is = {}, i.is.type = function(t, e) { return _typeof(t) === e }, i.is.defined = function(t) { return void 0 !== t }, i.is.undef = function(t) { return void 0 === t }, i.is.array = function(t) { return "[object Array]" === Object.prototype.toString.call(t) }, i.is.date = function(t) { return "[object Date]" === Object.prototype.toString.call(t) && !isNaN(t.getTime()) }, i.is.boolean = function(t) { return "[object Boolean]" === Object.prototype.toString.call(t) }, i.is.string = function(t) { return "[object String]" === Object.prototype.toString.call(t) }, i.is.number = function(t) { return "[object Number]" === Object.prototype.toString.call(t) && !isNaN(t) }, i.is.fn = function(t) { return i.is.defined(window) && t === window.alert || "[object Function]" === Object.prototype.toString.call(t) }, i.is.error = function(t) { return "[object Error]" === Object.prototype.toString.call(t) }, i.is.object = function(t) { return "[object Object]" === Object.prototype.toString.call(t) }, i.is.hash = function(t) { return i.is.object(t) && t.constructor === Object && !t.nodeType && !t.setInterval }, i.is.element = function(t) { return "object" == ("undefined" == typeof HTMLElement ? "undefined" : _typeof(HTMLElement)) ? t instanceof HTMLElement : t && "object" == _typeof(t) && null !== t && 1 === t.nodeType && "string" == typeof t.nodeName }, i.is.promise = function(t) { return i.is.object(t) && i.is.fn(t.then) && i.is.fn(t.promise) }, i.is.jq = function(t) { return i.is.defined(window.jQuery) && t instanceof jQuery && 0 < t.length }, i.is.moment = function(t) { return i.is.defined(window.moment) && i.is.object(t) && i.is.boolean(t._isAMomentObject) }, i.is.emptyObject = function(t) {
        if (!i.is.hash(t)) return !1;
        for (var e in t)
            if (t.hasOwnProperty(e)) return !1;
        return !0
    }, i.is.emptyArray = function(t) { return !i.is.array(t) || 0 === t.length }, i.is.emptyString = function(t) { return !i.is.string(t) || 0 === t.length }
}(FooTable),
function(r) {
    r.str = {}, r.str.contains = function(t, e, i) { return !r.is.emptyString(t) && !r.is.emptyString(e) && e.length <= t.length && -1 !== (i ? t.toUpperCase().indexOf(e.toUpperCase()) : t.indexOf(e)) }, r.str.containsWord = function(t, e, i) {
        if (r.is.emptyString(t) || r.is.emptyString(e) || t.length < e.length) return !1;
        for (var n = t.split(/\W/), s = 0, o = n.length; s < o; s++)
            if (i ? n[s].toUpperCase() == e.toUpperCase() : n[s] == e) return !0;
        return !1
    }, r.str.from = function(t, e) { return this.contains(t, e) ? t.substring(t.indexOf(e) + 1) : t }, r.str.startsWith = function(t, e) { return t.slice(0, e.length) == e }, r.str.toCamelCase = function(t) { return t.toUpperCase() === t ? t.toLowerCase() : t.replace(/^([A-Z])|[-\s_](\w)/g, function(t, e, i) { return i ? i.toUpperCase() : e.toLowerCase() }) }, r.str.random = function(t) { return (t = r.is.emptyString(t) ? "" : t) + Math.random().toString(36).substr(2, 9) }, r.str.escapeRegExp = function(t) { return t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") }
}(FooTable),
function(u) {
    function l() {}

    function i() {} Object.create || (Object.create = function(t) {
        if (1 < arguments.length) throw Error("Second argument not supported");
        if (!u.is.object(t)) throw TypeError("Argument must be an object");
        i.prototype = t;
        var e = new i;
        return i.prototype = null, e
    });
    var c = /xyz/.test(function() { xyz }) ? /\b_super\b/ : /.*/;
    l.__extend__ = function(t, e, i, n) {
        var s;
        t[e] = u.is.fn(n) && c.test(i) ? (s = i, function() { var t, e = this._super; return this._super = n, t = s.apply(this, arguments), this._super = e, t }) : i
    }, l.extend = function(t, e) {
        function i(t, e, i, n) {
            var s, o;
            t[e] = u.is.fn(n) && c.test(i) ? (s = i, o = n, function() { var t, e = this._super; return this._super = o, t = s.apply(this, arguments), this._super = e, t }) : i
        }
        var n = Array.prototype.slice.call(arguments);
        if (t = n.shift(), e = n.shift(), u.is.hash(t)) {
            var s = Object.create(this.prototype),
                o = this.prototype;
            for (var r in t) "__ctor__" !== r && i(s, r, t[r], o[r]);
            var a = u.is.fn(s.__ctor__) ? s.__ctor__ : function() {
                if (!u.is.fn(this.construct)) throw new SyntaxError('FooTable class objects must be constructed with the "new" keyword.');
                this.construct.apply(this, arguments)
            };
            return s.construct = u.is.fn(s.construct) ? s.construct : function() {}, ((a.prototype = s).constructor = a).extend = l.extend, a
        }
        u.is.string(t) && u.is.fn(e) && i(this.prototype, t, e, this.prototype[t])
    }, u.Class = l, u.ClassFactory = u.Class.extend({
        construct: function() { this.registered = {} },
        contains: function(t) { return u.is.defined(this.registered[t]) },
        names: function() { var t, e = []; for (t in this.registered) this.registered.hasOwnProperty(t) && e.push(t); return e },
        register: function(t, e, i) {
            var n;
            u.is.string(t) && u.is.fn(e) && (n = this.registered[t], this.registered[t] = { name: t, klass: e, priority: u.is.number(i) ? i : u.is.defined(n) ? n.priority : 0 })
        },
        load: function(t, e, i) {
            var n, s, o, r = this,
                a = Array.prototype.slice.call(arguments),
                l = [],
                c = [];
            for (n in t = a.shift() || {}, r.registered) { r.registered.hasOwnProperty(n) && (o = r.registered[n], t.hasOwnProperty(n) && (s = t[n], u.is.string(s) && (s = u.getFnPointer(t[n])), u.is.fn(s) && (o = { name: n, klass: s, priority: r.registered[n].priority })), l.push(o)) }
            for (n in t) t.hasOwnProperty(n) && !r.registered.hasOwnProperty(n) && (s = t[n], u.is.string(s) && (s = u.getFnPointer(t[n])), u.is.fn(s) && l.push({ name: n, klass: s, priority: 0 }));
            return l.sort(function(t, e) { return e.priority - t.priority }), u.arr.each(l, function(t) { u.is.fn(t.klass) && c.push(r._make(t.klass, a)) }), c
        },
        make: function(t, e, i) { var n, s = Array.prototype.slice.call(arguments); return t = s.shift(), n = this.registered[t], u.is.fn(n.klass) ? this._make(n.klass, s) : null },
        _make: function(t, e) {
            function i() { return t.apply(this, e) }
            return i.prototype = t.prototype, new i
        }
    })
}(FooTable),
function(l, c) {
    c.css2json = function(t) { if (c.is.emptyString(t)) return {}; for (var e, i, n, s = {}, o = t.split(";"), r = 0, a = o.length; r < a; r++) e = o[r].split(":"), i = c.str.toCamelCase(l.trim(e[0])), n = l.trim(e[1]), s[i] = n; return s }, c.getFnPointer = function(t) {
        if (c.is.emptyString(t)) return null;
        var e = window,
            i = t.split(".");
        return c.arr.each(i, function(t) { e[t] && (e = e[t]) }), c.is.fn(e) ? e : null
    }, c.checkFnValue = function(t, e, i) {
        function n(t, e, i) { return c.is.fn(e) ? function() { return e.apply(t, arguments) } : i }
        return i = c.is.fn(i) ? i : null, c.is.fn(e) ? n(t, e, i) : c.is.type(e, "string") ? n(t, c.getFnPointer(e), i) : i
    }
}(jQuery, FooTable),
function(o, r) {
    r.Cell = r.Class.extend({
        construct: function(t, e, i, n) { this.ft = t, this.row = e, this.column = i, this.created = !1, this.define(n) },
        define: function(t) {
            this.$el = r.is.element(t) || r.is.jq(t) ? o(t) : null, this.$detail = null;
            var e = r.is.hash(t) && r.is.hash(t.options) && r.is.defined(t.value);
            this.value = this.column.parser.call(this.column, r.is.jq(this.$el) ? this.$el : e ? t.value : t, this.ft.o), this.o = o.extend(!0, { classes: null, style: null }, e ? t.options : {}), this.classes = r.is.jq(this.$el) && this.$el.attr("class") ? this.$el.attr("class").match(/\S+/g) : r.is.array(this.o.classes) ? this.o.classes : r.is.string(this.o.classes) ? this.o.classes.match(/\S+/g) : [], this.style = r.is.jq(this.$el) && this.$el.attr("style") ? r.css2json(this.$el.attr("style")) : r.is.hash(this.o.style) ? this.o.style : r.is.string(this.o.style) ? r.css2json(this.o.style) : {}
        },
        $create: function() { this.created || ((this.$el = r.is.jq(this.$el) ? this.$el : o("<td/>")).data("value", this.value).contents().detach().end().append(this.format(this.value)), this._setClasses(this.$el), this._setStyle(this.$el), this.$detail = o("<tr/>").addClass(this.row.classes.join(" ")).data("__FooTableCell__", this).append(o("<th/>")).append(o("<td/>")), this.created = !0) },
        collapse: function() { this.created && (this.$detail.children("th").html(this.column.title), this.$detail.children("td").first().attr("class", this.$el.attr("class")).attr("style", this.$el.attr("style")).css("display", "table-cell").append(this.$el.contents().detach()), r.is.jq(this.$detail.parent()) || this.$detail.appendTo(this.row.$details.find(".footable-details > tbody"))) },
        restore: function() {
            var t;
            this.created && (r.is.jq(this.$detail.parent()) && (t = this.$detail.children("td").first(), this.$el.attr("class", t.attr("class")).attr("style", t.attr("style")).css("display", this.column.hidden || !this.column.visible ? "none" : "table-cell").append(t.contents().detach())), this.$detail.detach())
        },
        parse: function() { return this.column.parser.call(this.column, this.$el, this.ft.o) },
        format: function(t) { return this.column.formatter.call(this.column, t, this.ft.o) },
        val: function(t, e) {
            if (r.is.undef(t)) return this.value;
            var i, n, s = r.is.hash(t) && r.is.hash(t.options) && r.is.defined(t.value);
            this.o = o.extend(!0, { classes: this.classes, style: this.style }, s ? t.options : {}), this.value = s ? t.value : t, this.classes = r.is.array(this.o.classes) ? this.o.classes : r.is.string(this.o.classes) ? this.o.classes.match(/\S+/g) : [], this.style = r.is.hash(this.o.style) ? this.o.style : r.is.string(this.o.style) ? r.css2json(this.o.style) : {}, this.created && (this.$el.data("value", this.value).empty(), i = this.$detail.children("td").first().empty(), (n = r.is.jq(this.$detail.parent()) ? i : this.$el).append(this.format(this.value)), this._setClasses(n), this._setStyle(n), r.is.boolean(e) && !e || this.row.draw())
        },
        _setClasses: function(t) {
            var e = !r.is.emptyArray(this.column.classes),
                i = !r.is.emptyArray(this.classes),
                n = null;
            t.removeAttr("class"), (e || i) && (e && i ? n = this.classes.concat(this.column.classes).join(" ") : e ? n = this.column.classes.join(" ") : i && (n = this.classes.join(" ")), r.is.emptyString(n) || t.addClass(n))
        },
        _setStyle: function(t) {
            var e = !r.is.emptyObject(this.column.style),
                i = !r.is.emptyObject(this.style),
                n = null;
            t.removeAttr("style"), (e || i) && (e && i ? n = o.extend({}, this.column.style, this.style) : e ? n = this.column.style : i && (n = this.style), r.is.hash(n) && t.css(n))
        }
    })
}(jQuery, FooTable),
function(e, n) {
    n.Column = n.Class.extend({
        construct: function(t, e, i) { this.ft = t, this.type = n.is.emptyString(i) ? "text" : i, this.virtual = !!n.is.boolean(e.virtual) && e.virtual, this.$el = n.is.jq(e.$el) ? e.$el : null, this.index = n.is.number(e.index) ? e.index : -1, this.define(e), this.$create() },
        define: function(t) { this.hidden = !!n.is.boolean(t.hidden) && t.hidden, this.visible = !n.is.boolean(t.visible) || t.visible, this.name = n.is.string(t.name) ? t.name : null, null == this.name && (this.name = "col" + (t.index + 1)), this.title = n.is.string(t.title) ? t.title : null, !this.virtual && null == this.title && n.is.jq(this.$el) && (this.title = this.$el.html()), null == this.title && (this.title = "Column " + (t.index + 1)), this.style = n.is.hash(t.style) ? t.style : n.is.string(t.style) ? n.css2json(t.style) : {}, this.classes = n.is.array(t.classes) ? t.classes : n.is.string(t.classes) ? t.classes.match(/\S+/g) : [], this.parser = n.checkFnValue(this, t.parser, this.parser), this.formatter = n.checkFnValue(this, t.formatter, this.formatter) },
        $create: function() {
            (this.$el = !this.virtual && n.is.jq(this.$el) ? this.$el : e("<th/>")).html(this.title)
        },
        parser: function(t) { return n.is.element(t) || n.is.jq(t) ? e(t).data("value") || e(t).text() : n.is.defined(t) && null != t ? t + "" : null },
        formatter: function(t) { return null == t ? "" : t },
        createCell: function(t) {
            var e = n.is.jq(t.$el) ? t.$el.children("td,th").get(this.index) : null,
                i = n.is.hash(t.value) ? t.value[this.name] : null;
            return new n.Cell(this.ft, t, this, e || i)
        }
    }), n.columns = new n.ClassFactory, n.columns.register("text", n.Column)
}(jQuery, FooTable),
function(i) {
    i.Component = i.Class.extend({
        construct: function(t, e) {
            if (!(t instanceof i.Table)) throw new TypeError("The instance parameter must be an instance of FooTable.Table.");
            this.ft = t, this.enabled = !!i.is.boolean(e) && e
        },
        preinit: function() {},
        init: function() {},
        destroy: function() {},
        predraw: function() {},
        draw: function() {},
        postdraw: function() {}
    }), i.components = new i.ClassFactory
}((jQuery, FooTable)),
function(t) { t.Defaults = function() { this.stopPropagation = !1, this.on = null }, t.defaults = new t.Defaults }((jQuery, FooTable)),
function(r, a) {
    a.Row = a.Class.extend({
        construct: function(t, e, i) { this.ft = t, this.columns = e, this.created = !1, this.define(i) },
        define: function(t) {
            this.$el = a.is.element(t) || a.is.jq(t) ? r(t) : null, this.$toggle = r("<span/>", { class: "footable-toggle fooicon fooicon-plus" });
            var e = a.is.hash(t),
                i = e && a.is.hash(t.options) && a.is.hash(t.value);
            this.value = e ? i ? t.value : t : null, this.o = r.extend(!0, { expanded: !1, classes: null, style: null }, i ? t.options : {}), this.expanded = a.is.jq(this.$el) && this.$el.data("expanded") || this.o.expanded, this.classes = a.is.jq(this.$el) && this.$el.attr("class") ? this.$el.attr("class").match(/\S+/g) : a.is.array(this.o.classes) ? this.o.classes : a.is.string(this.o.classes) ? this.o.classes.match(/\S+/g) : [], this.style = a.is.jq(this.$el) && this.$el.attr("style") ? a.css2json(this.$el.attr("style")) : a.is.hash(this.o.style) ? this.o.style : a.is.string(this.o.style) ? a.css2json(this.o.style) : {}, this.cells = this.createCells();
            var n = this;
            n.value = {}, a.arr.each(n.cells, function(t) { n.value[t.column.name] = t.val() })
        },
        $create: function() {
            var e;
            this.created || ((this.$el = a.is.jq(this.$el) ? this.$el : r("<tr/>")).data("__FooTableRow__", this), this._setClasses(this.$el), this._setStyle(this.$el), "last" == this.ft.rows.toggleColumn && this.$toggle.addClass("last-column"), this.$details = r("<tr/>", { class: "footable-detail-row" }).append(r("<td/>", { colspan: this.ft.columns.visibleColspan }).append(r("<table/>", { class: "footable-details " + this.ft.classes.join(" ") }).append("<tbody/>"))), e = this, a.arr.each(e.cells, function(t) { t.created || t.$create(), e.$el.append(t.$el) }), e.$el.off("click.ft.row").on("click.ft.row", { self: e }, e._onToggle), this.created = !0)
        },
        createCells: function() { var e = this; return a.arr.map(e.columns, function(t) { return t.createCell(e) }) },
        val: function(t, e) {
            var i = this;
            if (!a.is.hash(t)) return a.is.hash(this.value) && !a.is.emptyObject(this.value) || (this.value = {}, a.arr.each(this.cells, function(t) { i.value[t.column.name] = t.val() })), this.value;
            this.collapse(!1);
            var n = a.is.hash(t),
                s = n && a.is.hash(t.options) && a.is.hash(t.value);
            if (this.o = r.extend(!0, { expanded: i.expanded, classes: i.classes, style: i.style }, s ? t.options : {}), this.expanded = this.o.expanded, this.classes = a.is.array(this.o.classes) ? this.o.classes : a.is.string(this.o.classes) ? this.o.classes.match(/\S+/g) : [], this.style = a.is.hash(this.o.style) ? this.o.style : a.is.string(this.o.style) ? a.css2json(this.o.style) : {}, n)
                if (s && (t = t.value), a.is.hash(this.value))
                    for (var o in t) t.hasOwnProperty(o) && (this.value[o] = t[o]);
                else this.value = t;
            else this.value = null;
            a.arr.each(this.cells, function(t) { a.is.defined(i.value[t.column.name]) && t.val(i.value[t.column.name], !1) }), this.created && (this._setClasses(this.$el), this._setStyle(this.$el), a.is.boolean(e) && !e || this.draw())
        },
        _setClasses: function(t) {
            var e, i = !a.is.emptyArray(this.classes);
            t.removeAttr("class"), i && (e = this.classes.join(" "), a.is.emptyString(e) || t.addClass(e))
        },
        _setStyle: function(t) {
            var e, i = !a.is.emptyObject(this.style);
            t.removeAttr("style"), i && (e = this.style, a.is.hash(e) && t.css(e))
        },
        expand: function() {
            var t;
            this.created && (t = this).ft.raise("expand.ft.row", [t]).then(function() { t.__hidden__ = a.arr.map(t.cells, function(t) { return t.column.hidden && t.column.visible ? t : null }), 0 < t.__hidden__.length && (t.$details.insertAfter(t.$el).children("td").first().attr("colspan", t.ft.columns.visibleColspan), a.arr.each(t.__hidden__, function(t) { t.collapse() })), t.$el.attr("data-expanded", !0), t.$toggle.removeClass("fooicon-plus").addClass("fooicon-minus"), t.expanded = !0 })
        },
        collapse: function(t) {
            var e;
            this.created && (e = this).ft.raise("collapse.ft.row", [e]).then(function() { a.arr.each(e.__hidden__, function(t) { t.restore() }), e.$details.detach(), e.$el.removeAttr("data-expanded"), e.$toggle.removeClass("fooicon-minus").addClass("fooicon-plus"), a.is.boolean(t) && !t || (e.expanded = !1) })
        },
        predraw: function() { this.created && (this.expanded && this.collapse(!1), this.$toggle.detach(), this.$el.detach()) },
        draw: function(t) {
            this.created || this.$create(), a.is.jq(t) && t.append(this.$el);
            var e = this;
            a.arr.each(e.cells, function(t) { t.$el.css("display", t.column.hidden || !t.column.visible ? "none" : "table-cell"), e.ft.rows.showToggle && e.ft.columns.hasHidden && ("first" == e.ft.rows.toggleColumn && t.column.index == e.ft.columns.firstVisibleIndex || "last" == e.ft.rows.toggleColumn && t.column.index == e.ft.columns.lastVisibleIndex) && t.$el.prepend(e.$toggle) }), this.expanded && this.expand()
        },
        toggle: function() { this.created && this.ft.columns.hasHidden && (this.expanded ? this.collapse() : this.expand()) },
        _onToggle: function(t) {
            var e = t.data.self;
            r(t.target).is(e.ft.rows.toggleSelector) && e.toggle()
        }
    })
}(jQuery, FooTable),
function(a, l) {
    l.instances = [], l.Table = l.Class.extend({
        construct: function(t, e, i) { this._resizeTimeout = null, this.id = l.instances.push(this), this.initialized = !1, this.$el = (l.is.jq(t) ? t : a(t)).first(), this.o = a.extend(!0, {}, l.defaults, e), this.data = this.$el.data() || {}, this.classes = [], this.components = l.components.load(l.is.hash(this.data.components) ? this.data.components : this.o.components, this), this.breakpoints = this.use(FooTable.Breakpoints), this.columns = this.use(FooTable.Columns), this.rows = this.use(FooTable.Rows), this._construct(i) },
        _construct: function(e) {
            var i = this;
            this._preinit().then(function() { return i._init() }).always(function(t) { return l.is.error(t) ? void console.error("FooTable: unhandled error thrown during initialization.", t) : i.raise("ready.ft.table").then(function() { l.is.fn(e) && e.call(i, i) }) })
        },
        _preinit: function() {
            var s = this;
            return this.raise("preinit.ft.table", [s.data]).then(function() {
                var t = s.$el.attr("class").match(/\S+/g);
                s.o.ajax = l.checkFnValue(s, s.data.ajax, s.o.ajax), s.o.stopPropagation = l.is.boolean(s.data.stopPropagation) ? s.data.stopPropagation : s.o.stopPropagation;
                for (var e = 0, i = t.length; e < i; e++) l.str.startsWith(t[e], "footable") || s.classes.push(t[e]);
                var n = a("<div/>", { class: "footable-loader" }).append(a("<span/>", { class: "fooicon fooicon-loader" }));
                return s.$el.hide().after(n), s.execute(!1, !1, "preinit", s.data).always(function() { s.$el.show(), n.remove() })
            })
        },
        _init: function() {
            var n = this;
            return n.raise("init.ft.table").then(function() {
                var t = n.$el.children("thead"),
                    e = n.$el.children("tbody"),
                    i = n.$el.children("tfoot");
                return n.$el.addClass("footable footable-" + n.id), l.is.hash(n.o.on) && n.$el.on(n.o.on), 0 == i.length && n.$el.append(i = a("<tfoot/>")), 0 == e.length && n.$el.append("<tbody/>"), 0 == t.length && n.$el.prepend(t = a("<thead/>")), n.execute(!1, !0, "init").then(function() { return n.$el.data("__FooTable__", n), 0 == i.children("tr").length && i.remove(), 0 == t.children("tr").length && t.remove(), n.raise("postinit.ft.table").then(function() { return n.draw() }).always(function() { a(window).off("resize.ft" + n.id, n._onWindowResize).on("resize.ft" + n.id, { self: n }, n._onWindowResize), n.initialized = !0 }) })
            })
        },
        destroy: function() { var t = this; return t.raise("destroy.ft.table").then(function() { return t.execute(!0, !0, "destroy").then(function() { t.$el.removeData("__FooTable__").removeClass("footable-" + t.id), l.is.hash(t.o.on) && t.$el.off(t.o.on), t.initialized = !1 }) }).fail(function(t) { l.is.error(t) && console.error("FooTable: unhandled error thrown while destroying the plugin.", t) }) },
        raise: function(i, n) {
            var s = this,
                o = l.__debug__ && (l.is.emptyArray(l.__debug_options__.events) || l.arr.any(l.__debug_options__.events, function(t) { return l.str.contains(i, t) }));
            return (n = n || []).unshift(this), a.Deferred(function(t) {
                var e = a.Event(i);
                1 == s.o.stopPropagation && s.$el.one(i, function(t) { t.stopPropagation() }), o && console.log("FooTable:" + i + ": ", n), s.$el.trigger(e, n), e.isDefaultPrevented() ? (o && console.log('FooTable: default prevented for the "' + i + '" event.'), t.reject(e)) : t.resolve(e)
            })
        },
        use: function(t) {
            for (var e = 0, i = this.components.length; e < i; e++)
                if (this.components[e] instanceof t) return this.components[e];
            return null
        },
        draw: function() { var t = this; return t.execute(!1, !0, "predraw").then(function() { return t.raise("predraw.ft.table").then(function() { return t.execute(!1, !0, "draw").then(function() { return t.raise("draw.ft.table").then(function() { return t.execute(!1, !0, "postdraw").then(function() { return t.raise("postdraw.ft.table") }) }) }) }) }).fail(function(t) { l.is.error(t) && console.error("FooTable: unhandled error thrown during a draw operation.", t) }) },
        execute: function(t, e, i, n, s) {
            var o = Array.prototype.slice.call(arguments);
            t = o.shift();
            var r = (e = o.shift()) ? l.arr.get(this.components, function(t) { return t.enabled }) : this.components.slice(0);
            return o.unshift(t ? r.reverse() : r), this._execute.apply(this, o)
        },
        _execute: function(t, i, e, n) {
            if (!t || !t.length) return a.when();
            var s, o = this,
                r = Array.prototype.slice.call(arguments);
            return t = r.shift(), i = r.shift(), s = t.shift(), l.is.fn(s[i]) ? a.Deferred(function(e) {
                try {
                    var t = s[i].apply(s, r);
                    if (l.is.promise(t)) return t.then(e.resolve, e.reject);
                    e.resolve(t)
                } catch (t) { e.reject(t) }
            }).then(function() { return o._execute.apply(o, [t, i].concat(r)) }) : o._execute.apply(o, [t, i].concat(r))
        },
        _onWindowResize: function(t) {
            var e = t.data.self;
            null != e._resizeTimeout && clearTimeout(e._resizeTimeout), e._resizeTimeout = setTimeout(function() { e._resizeTimeout = null, e.raise("resize.ft.table").then(function() { e.breakpoints.check() }) }, 300)
        }
    })
}(jQuery, FooTable),
function(e, i) {
    i.is.undef(window.moment) || (i.DateColumn = i.Column.extend({
        construct: function(t, e) { this._super(t, e, "date"), this.formatString = i.is.string(e.formatString) ? e.formatString : "MM-DD-YYYY" },
        parser: function(t) {
            if ((i.is.element(t) || i.is.jq(t)) && (t = e(t).data("value") || e(t).text(), i.is.string(t) && (t = isNaN(t) ? t : +t)), i.is.date(t)) return moment(t);
            if (i.is.object(t) && i.is.boolean(t._isAMomentObject)) return t;
            if (i.is.string(t)) {
                if (isNaN(t)) return moment(t, this.formatString);
                t = +t
            }
            return i.is.number(t) ? moment(t) : null
        },
        formatter: function(t) { return i.is.object(t) && i.is.boolean(t._isAMomentObject) ? t.format(this.formatString) : "" },
        filterValue: function(t) {
            if ((i.is.element(t) || i.is.jq(t)) && (t = e(t).data("filterValue") || e(t).text()), i.is.hash(t) && i.is.hash(t.options) && (i.is.string(t.options.filterValue) && (t = t.options.filterValue), i.is.defined(t.value) && (t = t.value)), i.is.object(t) && i.is.boolean(t._isAMomentObject)) return t.format(this.formatString);
            if (i.is.string(t)) {
                if (isNaN(t)) return t;
                t = +t
            }
            return i.is.number(t) || i.is.date(t) ? moment(t).format(this.formatString) : i.is.defined(t) && null != t ? t + "" : ""
        }
    }), i.columns.register("date", i.DateColumn))
}(jQuery, FooTable),
function(i, n) { n.HTMLColumn = n.Column.extend({ construct: function(t, e) { this._super(t, e, "html") }, parser: function(t) { if (n.is.string(t) && (t = i(i.trim(t))), n.is.element(t) && (t = i(t)), n.is.jq(t)) { var e = t.prop("tagName").toLowerCase(); return "td" == e || "th" == e ? t.data("value") || t.contents() : t } return null } }), n.columns.register("html", n.HTMLColumn) }(jQuery, FooTable),
function(e, i) { i.NumberColumn = i.Column.extend({ construct: function(t, e) { this._super(t, e, "number"), this.decimalSeparator = i.is.string(e.decimalSeparator) ? e.decimalSeparator : ".", this.thousandSeparator = i.is.string(e.thousandSeparator) ? e.thousandSeparator : ",", this.decimalSeparatorRegex = new RegExp(i.str.escapeRegExp(this.decimalSeparator), "g"), this.thousandSeparatorRegex = new RegExp(i.str.escapeRegExp(this.thousandSeparator), "g"), this.cleanRegex = new RegExp("[^0-9" + i.str.escapeRegExp(this.decimalSeparator) + "]", "g") }, parser: function(t) { return (i.is.element(t) || i.is.jq(t)) && (t = e(t).data("value") || e(t).text().replace(this.cleanRegex, "")), i.is.string(t) && (t = t.replace(this.thousandSeparatorRegex, "").replace(this.decimalSeparatorRegex, "."), t = parseFloat(t)), i.is.number(t) ? t : null }, formatter: function(t) { if (null == t) return ""; var e = (t + "").split("."); return 2 == e.length && 3 < e[0].length && (e[0] = e[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, this.thousandSeparator)), e.join(this.decimalSeparator) } }), i.columns.register("number", i.NumberColumn) }(jQuery, FooTable),
function(t) { t.Breakpoint = t.Class.extend({ construct: function(t, e) { this.name = t, this.width = e } }) }((jQuery, FooTable)),
function(a) {
    a.Breakpoints = a.Component.extend({
        construct: function(t) { this._super(t, !0), this.o = t.o, this.current = null, this.array = [], this.cascade = this.o.cascade, this.useParentWidth = this.o.useParentWidth, this.hidden = null, this._classNames = "", this.getWidth = a.checkFnValue(this, this.o.getWidth, this.getWidth) },
        preinit: function(e) {
            var i = this;
            return this.ft.raise("preinit.ft.breakpoints", [e]).then(function() {
                for (var t in i.cascade = a.is.boolean(e.cascade) ? e.cascade : i.cascade, i.o.breakpoints = a.is.hash(e.breakpoints) ? e.breakpoints : i.o.breakpoints, i.getWidth = a.checkFnValue(i, e.getWidth, i.getWidth), null == i.o.breakpoints && (i.o.breakpoints = { xs: 480, sm: 768, md: 992, lg: 1200 }), i.o.breakpoints) i.o.breakpoints.hasOwnProperty(t) && (i.array.push(new a.Breakpoint(t, i.o.breakpoints[t])), i._classNames += "breakpoint-" + t + " ");
                i.array.sort(function(t, e) { return e.width - t.width })
            })
        },
        init: function() { var t = this; return this.ft.raise("init.ft.breakpoints").then(function() { t.current = t.get() }) },
        draw: function() { this.ft.$el.removeClass(this._classNames).addClass("breakpoint-" + this.current.name) },
        calculate: function() { for (var t, e = null, i = [], n = null, s = this.getWidth(), o = 0, r = this.array.length; o < r; o++) t = this.array[o], (!e && o == r - 1 || s >= t.width && (!(n instanceof a.Breakpoint) || s < n.width)) && (e = t), e || i.push(t.name), n = t; return i.push(e.name), this.hidden = i.join(" "), e },
        visible: function(t) {
            if (a.is.emptyString(t)) return !0;
            if ("all" === t) return !1;
            for (var e = t.split(" "), i = 0, n = e.length; i < n; i++)
                if (this.cascade ? a.str.containsWord(this.hidden, e[i]) : e[i] == this.current.name) return !1;
            return !0
        },
        check: function() {
            var e = this,
                i = e.get();
            i instanceof a.Breakpoint && i != e.current && e.ft.raise("before.ft.breakpoints", [e.current, i]).then(function() { var t = e.current; return e.current = i, e.ft.draw().then(function() { e.ft.raise("after.ft.breakpoints", [e.current, t]) }) })
        },
        get: function(e) { return a.is.undef(e) ? this.calculate() : e instanceof a.Breakpoint ? e : a.is.string(e) ? a.arr.first(this.array, function(t) { return t.name == e }) : a.is.number(e) && 0 <= e && e < this.array.length ? this.array[e] : null },
        getWidth: function() { return a.is.fn(this.o.getWidth) ? this.o.getWidth(this.ft) : 1 == this.useParentWidth ? this.getParentWidth() : this.getViewportWidth() },
        getParentWidth: function() { return this.ft.$el.parent().width() },
        getViewportWidth: function() { return Math.max(document.documentElement.clientWidth, window.innerWidth, 0) }
    }), a.components.register("breakpoints", a.Breakpoints, 1e3)
}((jQuery, FooTable)),
function(e) { e.Column.prototype.breakpoints = null, e.Column.prototype.__breakpoints_define__ = function(t) { this.breakpoints = e.is.emptyString(t.breakpoints) ? null : t.breakpoints }, e.Column.extend("define", function(t) { this._super(t), this.__breakpoints_define__(t) }) }(FooTable),
function(t) { t.Defaults.prototype.breakpoints = null, t.Defaults.prototype.cascade = !1, t.Defaults.prototype.useParentWidth = !1, t.Defaults.prototype.getWidth = null }(FooTable),
function(c, u) {
    u.Columns = u.Component.extend({
        construct: function(t) { this._super(t, !0), this.o = t.o, this.array = [], this.$header = null, this.showHeader = t.o.showHeader },
        parse: function() {
            var l = this;
            return c.Deferred(function(e) {
                function i(t, e) {
                    var i = [];
                    if (0 == t.length || 0 == e.length) i = t.concat(e);
                    else {
                        var n = 0;
                        u.arr.each(t.concat(e), function(t) { t.index > n && (n = t.index) }), n++;
                        for (var s, o, r = 0; r < n; r++) s = {}, u.arr.each(t, function(t) { return t.index == r ? (s = t, !1) : void 0 }), o = {}, u.arr.each(e, function(t) { return t.index == r ? (o = t, !1) : void 0 }), i.push(c.extend(!0, {}, s, o))
                    }
                    return i
                }
                var n, s, o, r = [],
                    a = [],
                    t = l.ft.$el.find("tr.footable-header");
                0 == t.length && (t = l.ft.$el.find("thead > tr:last:has([data-breakpoints])")), 0 == t.length && (t = l.ft.$el.find("tbody > tr:first:has([data-breakpoints])")), 0 == t.length && (t = l.ft.$el.find("thead > tr:last")), 0 == t.length && (t = l.ft.$el.find("tbody > tr:first")), 0 < t.length && ((o = t.parent().is("tbody") && t.children().length == t.children("td").length) || (l.$header = t.addClass("footable-header")), t.children("td,th").each(function(t, e) { n = c(e), (s = n.data()).index = t, s.$el = n, s.virtual = o, a.push(s) }), o && (l.showHeader = !1)), u.is.array(l.o.columns) ? (u.arr.each(l.o.columns, function(t, e) { t.index = e, r.push(t) }), l.parseFinalize(e, i(r, a))) : u.is.promise(l.o.columns) ? l.o.columns.then(function(t) { u.arr.each(t, function(t, e) { t.index = e, r.push(t) }), l.parseFinalize(e, i(r, a)) }, function(t) { e.reject(Error("Columns ajax request error: " + t.status + " (" + t.statusText + ")")) }) : l.parseFinalize(e, i(r, a))
            })
        },
        parseFinalize: function(t, e) {
            var i, n = this,
                s = [];
            u.arr.each(e, function(t) {
                (i = u.columns.contains(t.type) ? u.columns.make(t.type, n.ft, t) : new u.Column(n.ft, t)) && s.push(i)
            }), u.is.emptyArray(s) ? t.reject(Error("No columns supplied.")) : (s.sort(function(t, e) { return t.index - e.index }), t.resolve(s))
        },
        preinit: function(e) { var i = this; return i.ft.raise("preinit.ft.columns", [e]).then(function() { return i.parse(e).then(function(t) { i.array = t, i.showHeader = u.is.boolean(e.showHeader) ? e.showHeader : i.showHeader }) }) },
        init: function() { var t = this; return this.ft.raise("init.ft.columns", [t.array]).then(function() { t.$create() }) },
        destroy: function() {
            var t = this;
            this.ft.raise("destroy.ft.columns").then(function() { t.$header.remove() })
        },
        predraw: function() {
            var e = this,
                i = !0;
            e.visibleColspan = 0, e.firstVisibleIndex = 0, e.lastVisibleIndex = 0, e.hasHidden = !1, u.arr.each(e.array, function(t) { t.hidden = !e.ft.breakpoints.visible(t.breakpoints), !t.hidden && t.visible && (i && (e.firstVisibleIndex = t.index, i = !1), e.lastVisibleIndex = t.index, e.visibleColspan++), t.hidden && (e.hasHidden = !0) })
        },
        draw: function() { u.arr.each(this.array, function(t) { t.$el.css("display", t.hidden || !t.visible ? "none" : "table-cell") }), !this.showHeader && u.is.jq(this.$header.parent()) && this.$header.detach() },
        $create: function() {
            var e = this;
            e.$header = u.is.jq(e.$header) ? e.$header : c("<tr/>", { class: "footable-header" }), e.$header.children("th,td").detach(), u.arr.each(e.array, function(t) { e.$header.append(t.$el) }), e.showHeader && !u.is.jq(e.$header.parent()) && e.ft.$el.children("thead").append(e.$header)
        },
        get: function(e) { return e instanceof u.Column ? e : u.is.string(e) ? u.arr.first(this.array, function(t) { return t.name == e }) : u.is.number(e) ? u.arr.first(this.array, function(t) { return t.index == e }) : u.is.fn(e) ? u.arr.get(this.array, e) : null },
        ensure: function(t) {
            var e = this,
                i = [];
            return u.is.array(t) && u.arr.each(t, function(t) { i.push(e.get(t)) }), i
        }
    }), u.components.register("columns", u.Columns, 900)
}(jQuery, FooTable),
function(t) { t.Defaults.prototype.columns = [], t.Defaults.prototype.showHeader = !0 }(FooTable),
function(s, o) {
    o.Rows = o.Component.extend({
        construct: function(t) { this._super(t, !0), this.o = t.o, this.array = [], this.all = [], this.showToggle = t.o.showToggle, this.toggleSelector = t.o.toggleSelector, this.toggleColumn = t.o.toggleColumn, this.emptyString = t.o.empty, this.expandFirst = t.o.expandFirst, this.expandAll = t.o.expandAll, this.$empty = null },
        parse: function() {
            var i = this;
            return s.Deferred(function(e) {
                var t = i.ft.$el.children("tbody").children("tr");
                o.is.jq(t) ? (i.parseFinalize(e, t), t.detach()) : o.is.array(i.o.rows) && 0 < i.o.rows.length ? i.parseFinalize(e, i.o.rows) : o.is.promise(i.o.rows) ? i.o.rows.then(function(t) { i.parseFinalize(e, t) }, function(t) { e.reject(Error("Rows ajax request error: " + t.status + " (" + t.statusText + ")")) }) : i.parseFinalize(e, [])
            })
        },
        parseFinalize: function(t, e) {
            var i = this,
                n = s.map(e, function(t) { return new o.Row(i.ft, i.ft.columns.array, t) });
            t.resolve(n)
        },
        preinit: function(e) { var i = this; return i.ft.raise("preinit.ft.rows", [e]).then(function() { return i.parse().then(function(t) { i.all = t, i.array = i.all.slice(0), i.showToggle = o.is.boolean(e.showToggle) ? e.showToggle : i.showToggle, i.toggleSelector = o.is.string(e.toggleSelector) ? e.toggleSelector : i.toggleSelector, i.toggleColumn = o.is.string(e.toggleColumn) ? e.toggleColumn : i.toggleColumn, "first" != i.toggleColumn && "last" != i.toggleColumn && (i.toggleColumn = "first"), i.emptyString = o.is.string(e.empty) ? e.empty : i.emptyString, i.expandFirst = o.is.boolean(e.expandFirst) ? e.expandFirst : i.expandFirst, i.expandAll = o.is.boolean(e.expandAll) ? e.expandAll : i.expandAll }) }) },
        init: function() { var t = this; return t.ft.raise("init.ft.rows", [t.all]).then(function() { t.$create() }) },
        destroy: function() {
            var t = this;
            this.ft.raise("destroy.ft.rows").then(function() { o.arr.each(t.array, function(t) { t.predraw() }) })
        },
        predraw: function() { o.arr.each(this.array, function(t) { t.predraw() }), this.array = this.all.slice(0) },
        $create: function() { this.$empty = s("<tr/>", { class: "footable-empty" }).append(s("<td/>").text(this.emptyString)) },
        draw: function() {
            var e = this,
                i = e.ft.$el.children("tbody"),
                n = !0;
            0 < e.array.length ? (e.$empty.detach(), o.arr.each(e.array, function(t) {
                (e.expandFirst && n || e.expandAll) && (t.expanded = !0, n = !1), t.draw(i)
            })) : (e.$empty.children("td").attr("colspan", e.ft.columns.visibleColspan), i.append(e.$empty))
        },
        load: function(t, e) {
            var i = this,
                n = s.map(t, function(t) { return new o.Row(i.ft, i.ft.columns.array, t) });
            o.arr.each(this.array, function(t) { t.predraw() }), this.all = o.is.boolean(e) && e ? this.all.concat(n) : n, this.array = this.all.slice(0), this.ft.draw()
        },
        expand: function() { o.arr.each(this.array, function(t) { t.expand() }) },
        collapse: function() { o.arr.each(this.array, function(t) { t.collapse() }) }
    }), o.components.register("rows", o.Rows, 800)
}(jQuery, FooTable),
function(t) { t.Defaults.prototype.rows = [], t.Defaults.prototype.empty = "No results", t.Defaults.prototype.showToggle = !0, t.Defaults.prototype.toggleSelector = "tr,td,.footable-toggle", t.Defaults.prototype.toggleColumn = "first", t.Defaults.prototype.expandFirst = !1, t.Defaults.prototype.expandAll = !1 }(FooTable), FooTable.Table.prototype.loadRows = function(t, e) { this.rows.load(t, e) },
    function(r) {
        r.Filter = r.Class.extend({
            construct: function(t, e, i, n, s, o) { this.name = t, this.space = !r.is.string(n) || "OR" != n && "AND" != n ? "AND" : n, this.connectors = !r.is.boolean(s) || s, this.ignoreCase = !r.is.boolean(o) || o, this.query = new r.Query(e, this.space, this.connectors, this.ignoreCase), this.columns = i },
            match: function(t) { return !!r.is.string(t) && (r.is.string(this.query) && (this.query = new r.Query(this.query, this.space, this.connectors, this.ignoreCase)), this.query instanceof r.Query && this.query.match(t)) },
            matchRow: function(t) {
                var e = this,
                    i = r.arr.map(t.cells, function(t) { return r.arr.contains(e.columns, t.column) ? t.filterValue : null }).join(" ");
                return e.match(i)
            }
        })
    }(FooTable),
    function(r, a) {
        a.Filtering = a.Component.extend({
            construct: function(t) { this._super(t, t.o.filtering.enabled), this.filters = t.o.filtering.filters, this.delay = t.o.filtering.delay, this.min = t.o.filtering.min, this.space = t.o.filtering.space, this.connectors = t.o.filtering.connectors, this.ignoreCase = t.o.filtering.ignoreCase, this.placeholder = t.o.filtering.placeholder, this.position = t.o.filtering.position, this.$row = null, this.$cell = null, this.$dropdown = null, this.$input = null, this.$button = null, this._filterTimeout = null },
            preinit: function(t) {
                var e = this;
                this.ft.raise("preinit.ft.filtering").then(function() { e.ft.$el.hasClass("footable-filtering") && (e.enabled = !0), e.enabled = a.is.boolean(t.filtering) ? t.filtering : e.enabled, e.enabled && (e.space = a.is.string(t.filterSpace) ? t.filterSpace : e.space, e.min = a.is.number(t.filterMin) ? t.filterMin : e.min, e.connectors = a.is.boolean(t.filterConnectors) ? t.filterConnectors : e.connectors, e.ignoreCase = a.is.boolean(t.filterIgnoreCase) ? t.filterIgnoreCase : e.ignoreCase, e.delay = a.is.number(t.filterDelay) ? t.filterDelay : e.delay, e.placeholder = a.is.string(t.filterPlaceholder) ? t.filterPlaceholder : e.placeholder, e.filters = a.is.array(t.filterFilters) ? e.ensure(t.filterFilters) : e.ensure(e.filters), e.ft.$el.hasClass("footable-filtering-left") && (e.position = "left"), e.ft.$el.hasClass("footable-filtering-center") && (e.position = "center"), e.ft.$el.hasClass("footable-filtering-right") && (e.position = "right"), e.position = a.is.string(t.filterPosition) ? t.filterPosition : e.position) }, function() { e.enabled = !1 })
            },
            init: function() {
                var t = this;
                this.ft.raise("init.ft.filtering").then(function() { t.$create() }, function() { t.enabled = !1 })
            },
            destroy: function() {
                var t = this;
                this.ft.raise("destroy.ft.filtering").then(function() { t.ft.$el.removeClass("footable-filtering").find("thead > tr.footable-filtering").remove() })
            },
            $create: function() {
                var t, e = this,
                    i = r("<div/>", { class: "form-group" }).append(r("<label/>", { class: "sr-only", text: "Search" })),
                    n = r("<div/>", { class: "input-group" }).appendTo(i),
                    s = r("<div/>", { class: "input-group-btn" }),
                    o = r("<button/>", { type: "button", class: "btn btn-default dropdown-toggle" }).on("click", { self: e }, e._onDropdownToggleClicked).append(r("<span/>", { class: "caret" }));
                switch (e.position) {
                    case "left":
                        t = "footable-filtering-left";
                        break;
                    case "center":
                        t = "footable-filtering-center";
                        break;
                    default:
                        t = "footable-filtering-right"
                }
                e.ft.$el.addClass("footable-filtering").addClass(t), e.$row = r("<tr/>", { class: "footable-filtering" }).prependTo(e.ft.$el.children("thead")), e.$cell = r("<th/>").attr("colspan", e.ft.columns.visibleColspan).appendTo(e.$row), e.$form = r("<form/>", { class: "form-inline" }).append(i).appendTo(e.$cell), e.$input = r("<input/>", { type: "text", class: "form-control", placeholder: e.placeholder }), e.$button = r("<button/>", { type: "button", class: "btn btn-primary" }).on("click", { self: e }, e._onSearchButtonClicked).append(r("<span/>", { class: "fooicon fooicon-search" })), e.$dropdown = r("<ul/>", { class: "dropdown-menu dropdown-menu-right" }).append(a.arr.map(e.ft.columns.array, function(t) { return t.filterable ? r("<li/>").append(r("<a/>", { class: "checkbox" }).append(r("<label/>", { text: t.title }).prepend(r("<input/>", { type: "checkbox", checked: !0 }).data("__FooTableColumn__", t)))) : null })), 0 < e.delay && (e.$input.on("keypress keyup", { self: e }, e._onSearchInputChanged), e.$dropdown.on("click", 'input[type="checkbox"]', { self: e }, e._onSearchColumnClicked)), s.append(e.$button, o, e.$dropdown), n.append(e.$input, s)
            },
            predraw: function() {
                var e;
                a.is.emptyArray(this.filters) || ((e = this).ft.rows.array = r.grep(e.ft.rows.array, function(t) { return t.filtered(e.filters) }))
            },
            draw: function() {
                this.$cell.attr("colspan", this.ft.columns.visibleColspan);
                var t = this.find("search");
                t instanceof a.Filter ? (this.$input.val(t.query.val()), this.$button.children(".fooicon").removeClass("fooicon-search").addClass("fooicon-remove")) : (this.$input.val(null), this.$button.children(".fooicon").removeClass("fooicon-remove").addClass("fooicon-search"))
            },
            addFilter: function(e, t, i) {
                var n = a.arr.first(this.filters, function(t) { return t.name == e });
                n instanceof a.Filter ? (n.name = e, n.query = t, n.columns = i) : this.filters.push({ name: e, query: t, columns: i })
            },
            removeFilter: function(e) { a.arr.remove(this.filters, function(t) { return t.name == e }) },
            filter: function() { var t = this; return t.filters = t.ensure(t.filters), t.ft.raise("before.ft.filtering", [t.filters]).then(function() { return t.filters = t.ensure(t.filters), t.ft.draw().then(function() { t.ft.raise("after.ft.filtering", [t.filters]) }) }) },
            clear: function() { return this.filters = [], this.filter() },
            find: function(e) { return a.arr.first(this.filters, function(t) { return t.name == e }) },
            columns: function() { return a.is.jq(this.$dropdown) ? this.$dropdown.find("input:checked").map(function() { return r(this).data("__FooTableColumn__") }).get() : this.ft.columns.get(function(t) { return t.filterable }) },
            ensure: function(t) {
                var e = this,
                    i = [],
                    n = e.columns();
                return a.is.emptyArray(t) || a.arr.each(t, function(t) { a.is.object(t) && (!a.is.emptyString(t.query) || t.query instanceof a.Query) && (t.name = a.is.emptyString(t.name) ? "anon" : t.name, t.columns = a.is.emptyArray(t.columns) ? n : e.ft.columns.ensure(t.columns), i.push(t instanceof a.Filter ? t : new a.Filter(t.name, t.query, t.columns, e.space, e.connectors, e.ignoreCase))) }), i
            },
            _onSearchInputChanged: function(t) {
                var e = t.data.self,
                    i = "keypress" == t.type && !a.is.emptyString(String.fromCharCode(t.charCode)),
                    n = "keyup" == t.type && (8 == t.which || 46 == t.which);
                (i || n) && (13 == t.which && t.preventDefault(), null != e._filterTimeout && clearTimeout(e._filterTimeout), e._filterTimeout = setTimeout(function() { e._filterTimeout = null, e.addFilter("search", e.$input.val()), e.filter() }, e.delay))
            },
            _onSearchButtonClicked: function(t) {
                t.preventDefault();
                var e = t.data.self;
                null != e._filterTimeout && clearTimeout(e._filterTimeout), e.$button.children(".fooicon").hasClass("fooicon-remove") ? e.clear() : (e.addFilter("search", e.$input.val()), e.filter())
            },
            _onSearchColumnClicked: function(t) {
                var e = t.data.self;
                null != e._filterTimeout && clearTimeout(e._filterTimeout), e._filterTimeout = setTimeout(function() {
                    e._filterTimeout = null;
                    var t = e.$button.children(".fooicon");
                    t.hasClass("fooicon-remove") && (t.removeClass("fooicon-remove").addClass("fooicon-search"), e.addFilter("search", e.$input.val()), e.filter())
                }, e.delay)
            },
            _onDropdownToggleClicked: function(t) {
                t.preventDefault(), t.stopPropagation();
                var e = t.data.self;
                e.$dropdown.parent().toggleClass("open"), e.$dropdown.parent().hasClass("open") ? r(document).on("click.footable", { self: e }, e._onDocumentClicked) : r(document).off("click.footable", e._onDocumentClicked)
            },
            _onDocumentClicked: function(t) {
                var e;
                0 == r(t.target).closest(".dropdown-menu").length && (t.preventDefault(), (e = t.data.self).$dropdown.parent().removeClass("open"), r(document).off("click.footable", e._onDocumentClicked))
            }
        }), a.components.register("filtering", a.Filtering, 500)
    }(jQuery, FooTable),
    function(r) {
        r.Query = r.Class.extend({
            construct: function(t, e, i, n) { this._original = null, this._value = null, this.space = !r.is.string(e) || "OR" != e && "AND" != e ? "AND" : e, this.connectors = !r.is.boolean(i) || i, this.ignoreCase = !r.is.boolean(n) || n, this.left = null, this.right = null, this.parts = [], this.operator = null, this.val(t) },
            val: function(t) {
                if (r.is.emptyString(t)) return this._value;
                if (r.is.emptyString(this._original)) this._original = t;
                else if (this._original == t) return;
                this._value = t, this._parse()
            },
            match: function(t) { return r.is.emptyString(this.operator) || "OR" === this.operator ? this._left(t, !1) || this._match(t, !1) || this._right(t, !1) : "AND" === this.operator ? this._left(t, !0) && this._match(t, !0) && this._right(t, !0) : void 0 },
            _match: function(i, t) {
                var n = this,
                    s = !1,
                    o = r.is.emptyString(i);
                return r.is.emptyArray(n.parts) && n.left instanceof r.Query ? t : (r.is.emptyArray(n.parts) || ("OR" === n.space ? r.arr.each(n.parts, function(t) { if (t.empty && o) { if (s = !0, t.negate) return s = !1 } else { var e = r.str.contains(i, t.query, n.ignoreCase); if (e && !t.negate && (s = !0), e && t.negate) return s = !1 } }) : (s = !0, r.arr.each(n.parts, function(t) { if (t.empty) return (!o && !t.negate || o && t.negate) && (s = !1), s; var e = r.str.contains(i, t.query, n.ignoreCase); return (!e && !t.negate || e && t.negate) && (s = !1), s }))), s)
            },
            _left: function(t, e) { return this.left instanceof r.Query ? this.left.match(t) : e },
            _right: function(t, e) { return this.right instanceof r.Query ? this.right.match(t) : e },
            _parse: function() {
                var t, e, i;
                r.is.emptyString(this._value) || (/\sOR\s/.test(this._value) ? (this.operator = "OR", t = this._value.split(/(?:\sOR\s)(.*)?/), this.left = new r.Query(t[0], this.space, this.connectors, this.ignoreCase), this.right = new r.Query(t[1], this.space, this.connectors, this.ignoreCase)) : /\sAND\s/.test(this._value) ? (this.operator = "AND", e = this._value.split(/(?:\sAND\s)(.*)?/), this.left = new r.Query(e[0], this.space, this.connectors, this.ignoreCase), this.right = new r.Query(e[1], this.space, this.connectors, this.ignoreCase)) : (i = this).parts = r.arr.map(this._value.match(/(?:[^\s"]+|"[^"]*")+/g), function(t) { return i._part(t) }))
            },
            _part: function(t) { var e = { query: t, negate: !1, phrase: !1, exact: !1, empty: !1 }; return r.str.startsWith(e.query, "-") && (e.query = r.str.from(e.query, "-"), e.negate = !0), /^"(.*?)"$/.test(e.query) ? (e.query = e.query.replace(/^"(.*?)"$/, "$1"), e.phrase = !0, e.exact = !0) : this.connectors && /(?:\w)+?([-_\+\.])(?:\w)+?/.test(e.query) && (e.query = e.query.replace(/(?:\w)+?([-_\+\.])(?:\w)+?/g, function(t, e) { return t.replace(e, " ") }), e.phrase = !0), e.empty = e.phrase && r.is.emptyString(e.query), e }
        })
    }(FooTable),
    function(e) { e.Cell.prototype.filterValue = null, e.Cell.prototype.__filtering_define__ = function(t) { this.filterValue = this.column.filterValue.call(this.column, t) }, e.Cell.prototype.__filtering_val__ = function(t) { e.is.defined(t) && (this.filterValue = this.column.filterValue.call(this.column, t)) }, e.Cell.extend("define", function(t) { this._super(t), this.__filtering_define__(t) }), e.Cell.extend("val", function(t) { var e = this._super(t); return this.__filtering_val__(t), e }) }(FooTable),
    function(e, i) {
        i.Column.prototype.filterable = !0, i.Column.prototype.filterValue = function(t) {
            if (i.is.element(t) || i.is.jq(t)) return e(t).data("filterValue") || e(t).text();
            if (i.is.hash(t) && i.is.hash(t.options)) {
                if (i.is.string(t.options.filterValue)) return t.options.filterValue;
                i.is.defined(t.value) && (t = t.value)
            }
            return i.is.defined(t) && null != t ? t + "" : ""
        }, i.Column.prototype.__filtering_define__ = function(t) { this.filterable = i.is.boolean(t.filterable) ? t.filterable : this.filterable }, i.Column.extend("define", function(t) { this._super(t), this.__filtering_define__(t) })
    }(jQuery, FooTable), FooTable.Defaults.prototype.filtering = { enabled: !1, filters: [], delay: 1200, min: 3, space: "AND", placeholder: "Search", position: "right", connectors: !0, ignoreCase: !0 },
    function(n) {
        n.Row.prototype.filtered = function(t) {
            var e = !0,
                i = this;
            return n.arr.each(t, function(t) { return 0 != (e = t.matchRow(i)) && void 0 }), e
        }
    }(FooTable),
    function(t) { t.Sorter = t.Class.extend({ construct: function(t, e) { this.column = t, this.direction = e } }) }((jQuery, FooTable)),
    function(s, o) {
        o.Sorting = o.Component.extend({
            construct: function(t) { this._super(t, t.o.sorting.enabled), this.o = t.o.sorting, this.column = null, this.allowed = !0, this.initial = null },
            preinit: function(t) {
                var e = this;
                this.ft.raise("preinit.ft.sorting", [t]).then(function() { e.ft.$el.hasClass("footable-sorting") && (e.enabled = !0), e.enabled = o.is.boolean(t.sorting) ? t.sorting : e.enabled, e.enabled && (e.column = o.arr.first(e.ft.columns.array, function(t) { return t.sorted })) }, function() { e.enabled = !1 })
            },
            init: function() {
                var e = this;
                this.ft.raise("init.ft.sorting").then(function() {
                    var t;
                    e.initial || (t = !!e.column, e.initial = { isset: t, rows: e.ft.rows.all.slice(0), column: t ? e.column.name : null, direction: t ? e.column.direction : null }), o.arr.each(e.ft.columns.array, function(t) { t.sortable && t.$el.addClass("footable-sortable").append(s("<span/>", { class: "fooicon fooicon-sort" })) }), e.ft.$el.on("click.footable", ".footable-sortable", { self: e }, e._onSortClicked)
                }, function() { e.enabled = !1 })
            },
            destroy: function() {
                var t = this;
                this.ft.raise("destroy.ft.paging").then(function() { t.ft.$el.off("click.footable", ".footable-sortable", t._onSortClicked), t.ft.$el.children("thead").children("tr.footable-header").children(".footable-sortable").removeClass("footable-sortable footable-asc footable-desc").find("span.fooicon").remove() })
            },
            predraw: function() {
                var i;
                this.column && (i = this.column, this.ft.rows.array.sort(function(t, e) { return "DESC" == i.direction ? i.sorter(e.cells[i.index].sortValue, t.cells[i.index].sortValue) : i.sorter(t.cells[i.index].sortValue, e.cells[i.index].sortValue) }))
            },
            draw: function() {
                var t, e;
                this.column && (t = this.ft.$el.find("thead > tr > .footable-sortable"), e = this.column.$el, t.removeClass("footable-asc footable-desc").children(".fooicon").removeClass("fooicon-sort fooicon-sort-asc fooicon-sort-desc"), t.not(e).children(".fooicon").addClass("fooicon-sort"), e.addClass("ASC" == this.column.direction ? "footable-asc" : "footable-desc").children(".fooicon").addClass("ASC" == this.column.direction ? "fooicon-sort-asc" : "fooicon-sort-desc"))
            },
            sort: function(t, e) { return this._sort(t, e) },
            toggleAllowed: function(t) { t = o.is.boolean(t) ? t : !this.allowed, this.allowed = t, this.ft.$el.toggleClass("footable-sorting-disabled", !this.allowed) },
            hasChanged: function() { return !(!this.initial || !this.column || this.column.name === this.initial.column && (this.column.direction === this.initial.direction || null === this.initial.direction && "ASC" === this.column.direction)) },
            reset: function() { this.initial && (this.initial.isset ? this.sort(this.initial.column, this.initial.direction) : (this.column && (this.column.$el.removeClass("footable-asc footable-desc"), this.column = null), this.ft.rows.all = this.initial.rows, this.ft.draw())) },
            _sort: function(t, e) {
                if (!this.allowed) return s.Deferred().reject("sorting disabled");
                var i = this,
                    n = new o.Sorter(i.ft.columns.get(t), o.Sorting.dir(e));
                return i.ft.raise("before.ft.sorting", [n]).then(function() { return o.arr.each(i.ft.columns.array, function(t) { t != i.column && (t.direction = null) }), i.column = i.ft.columns.get(n.column), i.column && (i.column.direction = o.Sorting.dir(n.direction)), i.ft.draw().then(function() { i.ft.raise("after.ft.sorting", [n]) }) })
            },
            _onSortClicked: function(t) {
                var e = t.data.self,
                    i = s(this).closest("th,td"),
                    n = !i.is(".footable-asc, .footable-desc") || i.hasClass("footable-desc") ? "ASC" : "DESC";
                e._sort(i.index(), n)
            }
        }), o.Sorting.dir = function(t) { return !o.is.string(t) || "ASC" != t && "DESC" != t ? "ASC" : t }, o.components.register("sorting", o.Sorting, 600)
    }(jQuery, FooTable),
    function(e) { e.Cell.prototype.sortValue = null, e.Cell.prototype.__sorting_define__ = function(t) { this.sortValue = this.column.sortValue.call(this.column, t) }, e.Cell.prototype.__sorting_val__ = function(t) { e.is.defined(t) && (this.sortValue = this.column.sortValue.call(this.column, t)) }, e.Cell.extend("define", function(t) { this._super(t), this.__sorting_define__(t) }), e.Cell.extend("val", function(t) { var e = this._super(t); return this.__sorting_val__(t), e }) }(FooTable),
    function(e, i) {
        i.Column.prototype.direction = null, i.Column.prototype.sortable = !0, i.Column.prototype.sorted = !1, i.Column.prototype.sorter = function(t, e) { return "string" == typeof t && (t = t.toLowerCase()), "string" == typeof e && (e = e.toLowerCase()), t === e ? 0 : t < e ? -1 : 1 }, i.Column.prototype.sortValue = function(t) {
            if (i.is.element(t) || i.is.jq(t)) return e(t).data("sortValue") || this.parser(t);
            if (i.is.hash(t) && i.is.hash(t.options)) {
                if (i.is.string(t.options.sortValue)) return t.options.sortValue;
                i.is.defined(t.value) && (t = t.value)
            }
            return i.is.defined(t) && null != t ? t : null
        }, i.Column.prototype.__sorting_define__ = function(t) { this.sorter = i.checkFnValue(this, t.sorter, this.sorter), this.direction = i.is.type(t.direction, "string") ? i.Sorting.dir(t.direction) : null, this.sortable = !i.is.boolean(t.sortable) || t.sortable, this.sorted = !!i.is.boolean(t.sorted) && t.sorted }, i.Column.extend("define", function(t) { this._super(t), this.__sorting_define__(t) })
    }(jQuery, FooTable), FooTable.Defaults.prototype.sorting = { enabled: !1 },
    function(e, i) {
        i.HTMLColumn.extend("__sorting_define__", function(t) { this._super(t), this.sortUse = i.is.string(t.sortUse) && -1 !== e.inArray(t.sortUse, ["html", "text"]) ? t.sortUse : "html" }), i.HTMLColumn.prototype.sortValue = function(t) {
            if (i.is.element(t) || i.is.jq(t)) return e(t).data("sortValue") || e.trim(e(t)[this.sortUse]());
            if (i.is.hash(t) && i.is.hash(t.options)) {
                if (i.is.string(t.options.sortValue)) return t.options.sortValue;
                i.is.defined(t.value) && (t = t.value)
            }
            return i.is.defined(t) && null != t ? t : null
        }
    }(jQuery, FooTable),
    function(i) { i.Table.prototype.sort = function(t, e) { return this.use(i.Sorting).sort(t, e) } }(FooTable),
    function(t) { t.Pager = t.Class.extend({ construct: function(t, e, i, n, s) { this.total = t, this.current = e, this.size = i, this.page = n, this.forward = s } }) }((jQuery, FooTable)),
    function(o, n) {
        n.Paging = n.Component.extend({
            construct: function(t) { this._super(t, t.o.paging.enabled), this.strings = t.o.paging.strings, this.current = t.o.paging.current, this.size = t.o.paging.size, this.limit = t.o.paging.limit, this.position = t.o.paging.position, this.countFormat = t.o.paging.countFormat, this.total = -1, this.$row = null, this.$cell = null, this.$pagination = null, this.$count = null, this.detached = !1, this._previous = 1, this._total = 0 },
            preinit: function(t) {
                var e = this;
                this.ft.raise("preinit.ft.paging", [t]).then(function() { e.ft.$el.hasClass("footable-paging") && (e.enabled = !0), e.enabled = n.is.boolean(t.paging) ? t.paging : e.enabled, e.enabled && (e.size = n.is.number(t.pagingSize) ? t.pagingSize : e.size, e.current = n.is.number(t.pagingCurrent) ? t.pagingCurrent : e.current, e.limit = n.is.number(t.pagingLimit) ? t.pagingLimit : e.limit, e.ft.$el.hasClass("footable-paging-left") && (e.position = "left"), e.ft.$el.hasClass("footable-paging-center") && (e.position = "center"), e.ft.$el.hasClass("footable-paging-right") && (e.position = "right"), e.position = n.is.string(t.pagingPosition) ? t.pagingPosition : e.position, e.countFormat = n.is.string(t.pagingCountFormat) ? t.pagingCountFormat : e.countFormat, e.total = Math.ceil(e.ft.rows.all.length / e.size)) }, function() { e.enabled = !1 })
            },
            init: function() {
                var t = this;
                this.ft.raise("init.ft.paging").then(function() { t.$create() }, function() { t.enabled = !1 })
            },
            destroy: function() {
                var t = this;
                this.ft.raise("destroy.ft.paging").then(function() { t.ft.$el.removeClass("footable-paging").find("tfoot > tr.footable-paging").remove(), t.detached = !1 })
            },
            predraw: function() { this.total = Math.ceil(this.ft.rows.array.length / this.size), this.current = this.current > this.total ? this.total : this.current < 1 ? 1 : this.current, this.ft.rows.array.length > this.size && (this.ft.rows.array = this.ft.rows.array.splice((this.current - 1) * this.size, this.size)) },
            draw: function() {
                var t;
                this.total <= 1 ? this.detached || (this.$row.detach(), this.detached = !0) : (this.detached && (0 == (t = this.ft.$el.children("tfoot")).length && (t = o("<tfoot/>"), this.ft.$el.append(t)), this.$row.appendTo(t), this.detached = !1), this.$cell.attr("colspan", this.ft.columns.visibleColspan), this._createLinks(), this._setVisible(this.current, this.current > this._previous), this._setNavigation(!0))
            },
            $create: function() {
                var t = "footable-paging-center";
                switch (this.position) {
                    case "left":
                        t = "footable-paging-left";
                        break;
                    case "right":
                        t = "footable-paging-right"
                }
                this.ft.$el.addClass("footable-paging").addClass(t), this.$cell = o("<td/>").attr("colspan", this.ft.columns.visibleColspan);
                var e = this.ft.$el.children("tfoot");
                0 == e.length && (e = o("<tfoot/>"), this.ft.$el.append(e)), this.$row = o("<tr/>", { class: "footable-paging" }).append(this.$cell).appendTo(e), this.$pagination = o("<ul/>", { class: "pagination" }).on("click.footable", "a.footable-page-link", { self: this }, this._onPageClicked), this.$count = o("<span/>", { class: "label label-default" }), this.$cell.append(this.$pagination, o("<div/>", { class: "divider" }), this.$count), this.detached = !1, this._createLinks()
            },
            first: function() { return this._set(1) },
            prev: function() { return this._set(0 < this.current - 1 ? this.current - 1 : 1) },
            next: function() { return this._set(this.current + 1 < this.total ? this.current + 1 : this.total) },
            last: function() { return this._set(this.total) },
            goto: function(t) { return this._set(t > this.total ? this.total : t < 1 ? 1 : t) },
            prevPages: function() {
                var t = this.$pagination.children("li.footable-page.visible:first").data("page") - 1;
                this._setVisible(t, !0), this._setNavigation(!1)
            },
            nextPages: function() {
                var t = this.$pagination.children("li.footable-page.visible:last").data("page") + 1;
                this._setVisible(t, !1), this._setNavigation(!1)
            },
            pageSize: function(t) { return n.is.number(t) ? (this.size = t, this.total = Math.ceil(this.ft.rows.all.length / this.size), n.is.jq(this.$row) && this.$row.remove(), this.$create(), void this.ft.draw()) : this.size },
            _set: function(t) {
                var e = this,
                    i = new n.Pager(e.total, e.current, e.size, t, t > e.current);
                return e.ft.raise("before.ft.paging", [i]).then(function() { return i.page = i.page > i.total ? i.total : i.page, i.page = i.page < 1 ? 1 : i.page, e.current == t ? o.when() : (e._previous = e.current, e.current = i.page, e.ft.draw().then(function() { e.ft.raise("after.ft.paging", [i]) })) })
            },
            _createLinks: function() {
                if (this._total !== this.total) {
                    var t = this,
                        e = 1 < t.total,
                        i = function(t, e, i) { return o("<li/>", { class: i }).attr("data-page", t).append(o("<a/>", { class: "footable-page-link", href: "#" }).data("page", t).html(e)) };
                    t.$pagination.empty(), e && (t.$pagination.append(i("first", t.strings.first, "footable-page-nav")), t.$pagination.append(i("prev", t.strings.prev, "footable-page-nav")), 0 < t.limit && t.limit < t.total && t.$pagination.append(i("prev-limit", t.strings.prevPages, "footable-page-nav")));
                    for (var n, s = 0; s < t.total; s++) n = i(s + 1, s + 1, "footable-page"), t.$pagination.append(n);
                    e && (0 < t.limit && t.limit < t.total && t.$pagination.append(i("next-limit", t.strings.nextPages, "footable-page-nav")), t.$pagination.append(i("next", t.strings.next, "footable-page-nav")), t.$pagination.append(i("last", t.strings.last, "footable-page-nav"))), t._total = t.total
                }
            },
            _setNavigation: function(t) { 1 == this.current ? this.$pagination.children('li[data-page="first"],li[data-page="prev"]').addClass("disabled") : this.$pagination.children('li[data-page="first"],li[data-page="prev"]').removeClass("disabled"), this.current == this.total ? this.$pagination.children('li[data-page="next"],li[data-page="last"]').addClass("disabled") : this.$pagination.children('li[data-page="next"],li[data-page="last"]').removeClass("disabled"), 1 == (this.$pagination.children("li.footable-page.visible:first").data("page") || 1) ? this.$pagination.children('li[data-page="prev-limit"]').addClass("disabled") : this.$pagination.children('li[data-page="prev-limit"]').removeClass("disabled"), (this.$pagination.children("li.footable-page.visible:last").data("page") || this.limit) == this.total ? this.$pagination.children('li[data-page="next-limit"]').addClass("disabled") : this.$pagination.children('li[data-page="next-limit"]').removeClass("disabled"), 0 < this.limit && this.total < this.limit ? this.$pagination.children('li[data-page="prev-limit"],li[data-page="next-limit"]').hide() : this.$pagination.children('li[data-page="prev-limit"],li[data-page="next-limit"]').show(), t && this.$pagination.children("li.footable-page").removeClass("active").filter('li[data-page="' + this.current + '"]').addClass("active") },
            _setVisible: function(t, e) {
                var i, n;
                0 < this.limit && this.total > this.limit ? this.$pagination.children('li.footable-page[data-page="' + t + '"]').hasClass("visible") || (n = i = 0, 1 == e ? i = (n = t > this.total ? this.total : t) - this.limit : n = (i = t < 1 ? 0 : t - 1) + this.limit, i < 0 && (i = 0, n = this.limit > this.total ? this.total : this.limit), n > this.total && (n = this.total, i = this.total - this.limit < 0 ? 0 : this.total - this.limit), this.$pagination.children("li.footable-page").removeClass("visible").slice(i, n).addClass("visible")) : this.$pagination.children("li.footable-page").removeClass("visible").slice(0, this.total).addClass("visible");
                var s = this.size * (t - 1) + 1,
                    o = this.size * t,
                    r = this.ft.rows.all.length,
                    o = 0 == this.ft.rows.array.length ? s = 0 : r < o ? r : o;
                this._setCount(t, this.total, s, o, r)
            },
            _setCount: function(t, e, i, n, s) { this.$count.text(this.countFormat.replace(/\{CP}/g, t).replace(/\{TP}/g, e).replace(/\{PF}/g, i).replace(/\{PL}/g, n).replace(/\{TR}/g, s)) },
            _onPageClicked: function(t) {
                if (t.preventDefault(), !o(t.target).closest("li").is(".active,.disabled")) {
                    var e = t.data.self,
                        i = o(this).data("page");
                    switch (i) {
                        case "first":
                            return void e.first();
                        case "prev":
                            return void e.prev();
                        case "next":
                            return void e.next();
                        case "last":
                            return void e.last();
                        case "prev-limit":
                            return void e.prevPages();
                        case "next-limit":
                            return void e.nextPages();
                        default:
                            return void e._set(i)
                    }
                }
            }
        }), n.components.register("paging", n.Paging, 400)
    }(jQuery, FooTable), FooTable.Defaults.prototype.paging = { enabled: !1, countFormat: "{CP} of {TP}", current: 1, limit: 5, position: "center", size: 10, strings: { first: "&laquo;", prev: "&lsaquo;", next: "&rsaquo;", last: "&raquo;", prevPages: "...", nextPages: "..." } },
    function(e) { e.Table.prototype.gotoPage = function(t) { return this.use(e.Paging).goto(t) }, e.Table.prototype.nextPage = function() { return this.use(e.Paging).next() }, e.Table.prototype.prevPage = function() { return this.use(e.Paging).prev() }, e.Table.prototype.firstPage = function() { return this.use(e.Paging).first() }, e.Table.prototype.lastPage = function() { return this.use(e.Paging).last() }, e.Table.prototype.nextPages = function() { return this.use(e.Paging).nextPages() }, e.Table.prototype.prevPages = function() { return this.use(e.Paging).prevPages() }, e.Table.prototype.pageSize = function(t) { return this.use(e.Paging).pageSize(t) } }(FooTable),
    function(s, o) {
        o.Editing = o.Component.extend({
            construct: function(t) { this._super(t, t.o.editing.enabled), this.pageToNew = t.o.editing.pageToNew, this.alwaysShow = t.o.editing.alwaysShow, this.column = s.extend(!0, {}, t.o.editing.column, { visible: this.alwaysShow }), this.position = t.o.editing.position, this.showText = t.o.editing.showText, this.hideText = t.o.editing.hideText, this.addText = t.o.editing.addText, this.editText = t.o.editing.editText, this.deleteText = t.o.editing.deleteText, this.viewText = t.o.editing.viewText, this.allowAdd = t.o.editing.allowAdd, this.allowEdit = t.o.editing.allowEdit, this.allowDelete = t.o.editing.allowDelete, this.allowView = t.o.editing.allowView, this._$buttons = null, this.callbacks = { addRow: o.checkFnValue(this, t.o.editing.addRow), editRow: o.checkFnValue(this, t.o.editing.editRow), deleteRow: o.checkFnValue(this, t.o.editing.deleteRow), viewRow: o.checkFnValue(this, t.o.editing.viewRow) } },
            preinit: function(i) {
                var n = this;
                this.ft.raise("preinit.ft.editing", [i]).then(function() {
                    if (n.ft.$el.hasClass("footable-editing") && (n.enabled = !0), n.enabled = o.is.boolean(i.editing) ? i.editing : n.enabled, n.enabled) {
                        if (n.pageToNew = o.is.boolean(i.editingPageToNew) ? i.editingPageToNew : n.pageToNew, n.alwaysShow = o.is.boolean(i.editingAlwaysShow) ? i.editingAlwaysShow : n.alwaysShow, n.position = o.is.string(i.editingPosition) ? i.editingPosition : n.position, n.showText = o.is.string(i.editingShowText) ? i.editingShowText : n.showText, n.hideText = o.is.string(i.editingHideText) ? i.editingHideText : n.hideText, n.addText = o.is.string(i.editingAddText) ? i.editingAddText : n.addText, n.editText = o.is.string(i.editingEditText) ? i.editingEditText : n.editText, n.deleteText = o.is.string(i.editingDeleteText) ? i.editingDeleteText : n.deleteText, n.viewText = o.is.string(i.editingViewText) ? i.editingViewText : n.viewText, n.allowAdd = o.is.boolean(i.editingAllowAdd) ? i.editingAllowAdd : n.allowAdd, n.allowEdit = o.is.boolean(i.editingAllowEdit) ? i.editingAllowEdit : n.allowEdit, n.allowDelete = o.is.boolean(i.editingAllowDelete) ? i.editingAllowDelete : n.allowDelete, n.allowView = o.is.boolean(i.editingAllowView) ? i.editingAllowView : n.allowView, n.column = new o.EditingColumn(n.ft, n, s.extend(!0, {}, n.column, i.editingColumn, { visible: n.alwaysShow })), n.ft.$el.hasClass("footable-editing-left") && (n.position = "left"), n.ft.$el.hasClass("footable-editing-right") && (n.position = "right"), "right" === n.position) n.column.index = n.ft.columns.array.length;
                        else
                            for (var t = n.column.index = 0, e = n.ft.columns.array.length; t < e; t++) n.ft.columns.array[t].index += 1;
                        n.ft.columns.array.push(n.column), n.ft.columns.array.sort(function(t, e) { return t.index - e.index }), n.callbacks.addRow = o.checkFnValue(n, i.editingAddRow, n.callbacks.addRow), n.callbacks.editRow = o.checkFnValue(n, i.editingEditRow, n.callbacks.editRow), n.callbacks.deleteRow = o.checkFnValue(n, i.editingDeleteRow, n.callbacks.deleteRow), n.callbacks.viewRow = o.checkFnValue(n, i.editingViewRow, n.callbacks.viewRow)
                    }
                }, function() { n.enabled = !1 })
            },
            init: function() {
                var t = this;
                this.ft.raise("init.ft.editing").then(function() { t.$create() }, function() { t.enabled = !1 })
            },
            destroy: function() {
                var t = this;
                this.ft.raise("destroy.ft.editing").then(function() { t.ft.$el.removeClass("footable-editing footable-editing-always-show footable-editing-no-add footable-editing-no-edit footable-editing-no-delete footable-editing-no-view").off("click.ft.editing").find("tfoot > tr.footable-editing").remove() })
            },
            $create: function() {
                var t = this,
                    e = "right" === t.position ? "footable-editing-right" : "footable-editing-left";
                t.ft.$el.addClass("footable-editing").addClass(e).on("click.ft.editing", ".footable-show", { self: t }, t._onShowClick).on("click.ft.editing", ".footable-hide", { self: t }, t._onHideClick).on("click.ft.editing", ".footable-edit", { self: t }, t._onEditClick).on("click.ft.editing", ".footable-delete", { self: t }, t._onDeleteClick).on("click.ft.editing", ".footable-view", { self: t }, t._onViewClick).on("click.ft.editing", ".footable-add", { self: t }, t._onAddClick), t.$cell = s("<td/>").attr("colspan", t.ft.columns.visibleColspan).append(t.$buttonShow()), t.allowAdd && t.$cell.append(t.$buttonAdd()), t.$cell.append(t.$buttonHide()), t.alwaysShow && t.ft.$el.addClass("footable-editing-always-show"), t.allowAdd || t.ft.$el.addClass("footable-editing-no-add"), t.allowEdit || t.ft.$el.addClass("footable-editing-no-edit"), t.allowDelete || t.ft.$el.addClass("footable-editing-no-delete"), t.allowView || t.ft.$el.addClass("footable-editing-no-view");
                var i = t.ft.$el.children("tfoot");
                0 == i.length && (i = s("<tfoot/>"), t.ft.$el.append(i)), t.$row = s("<tr/>", { class: "footable-editing" }).append(t.$cell).appendTo(i)
            },
            $buttonShow: function() { return '<button type="button" class="btn btn-primary footable-show">' + this.showText + "</button>" },
            $buttonHide: function() { return '<button type="button" class="btn btn-default footable-hide">' + this.hideText + "</button>" },
            $buttonAdd: function() { return '<button type="button" class="btn btn-primary footable-add">' + this.addText + "</button> " },
            $buttonEdit: function() { return '<button type="button" class="btn btn-default footable-edit">' + this.editText + "</button> " },
            $buttonDelete: function() { return '<button type="button" class="btn btn-default footable-delete">' + this.deleteText + "</button>" },
            $buttonView: function() { return '<button type="button" class="btn btn-default footable-view">' + this.viewText + "</button> " },
            $rowButtons: function() { return o.is.jq(this._$buttons) ? this._$buttons.clone() : (this._$buttons = s('<div class="btn-group btn-group-xs" role="group"></div>'), this.allowView && this._$buttons.append(this.$buttonView()), this.allowEdit && this._$buttons.append(this.$buttonEdit()), this.allowDelete && this._$buttons.append(this.$buttonDelete()), this._$buttons) },
            draw: function() { this.$cell.attr("colspan", this.ft.columns.visibleColspan) },
            _onEditClick: function(t) {
                t.preventDefault();
                var e = t.data.self,
                    i = s(this).closest("tr").data("__FooTableRow__");
                i instanceof o.Row && e.ft.raise("edit.ft.editing", [i]).then(function() { e.callbacks.editRow.call(e.ft, i) })
            },
            _onDeleteClick: function(t) {
                t.preventDefault();
                var e = t.data.self,
                    i = s(this).closest("tr").data("__FooTableRow__");
                i instanceof o.Row && e.ft.raise("delete.ft.editing", [i]).then(function() { e.callbacks.deleteRow.call(e.ft, i) })
            },
            _onViewClick: function(t) {
                t.preventDefault();
                var e = t.data.self,
                    i = s(this).closest("tr").data("__FooTableRow__");
                i instanceof o.Row && e.ft.raise("view.ft.editing", [i]).then(function() { e.callbacks.viewRow.call(e.ft, i) })
            },
            _onAddClick: function(t) {
                t.preventDefault();
                var e = t.data.self;
                e.ft.raise("add.ft.editing").then(function() { e.callbacks.addRow.call(e.ft) })
            },
            _onShowClick: function(t) {
                t.preventDefault();
                var e = t.data.self;
                e.ft.raise("show.ft.editing").then(function() { e.ft.$el.addClass("footable-editing-show"), e.column.visible = !0, e.ft.draw() })
            },
            _onHideClick: function(t) {
                t.preventDefault();
                var e = t.data.self;
                e.ft.raise("hide.ft.editing").then(function() { e.ft.$el.removeClass("footable-editing-show"), e.column.visible = !1, e.ft.draw() })
            }
        }), o.components.register("editing", o.Editing, 850)
    }(jQuery, FooTable),
    function(n, s) {
        s.EditingColumn = s.Column.extend({
            construct: function(t, e, i) { this._super(t, i, "editing"), this.editing = e },
            $create: function() {
                (this.$el = !this.virtual && s.is.jq(this.$el) ? this.$el : n("<th/>", { class: "footable-editing" })).html(this.title)
            },
            parser: function(t) { if (s.is.string(t) && (t = n(n.trim(t))), s.is.element(t) && (t = n(t)), s.is.jq(t)) { var e = t.prop("tagName").toLowerCase(); return "td" == e || "th" == e ? t.data("value") || t.contents() : t } return null },
            createCell: function(t) {
                var e = this.editing.$rowButtons(),
                    i = n("<td/>").append(e);
                return s.is.jq(t.$el) && (0 === this.index ? i.prependTo(t.$el) : i.insertAfter(t.$el.children().eq(this.index - 1))), new s.Cell(this.ft, t, this, i || i.html())
            }
        }), s.columns.register("editing", s.EditingColumn)
    }(jQuery, FooTable), jQuery, FooTable.Defaults.prototype.editing = { enabled: !1, pageToNew: !0, position: "right", alwaysShow: !1, addRow: function() {}, editRow: function() {}, deleteRow: function() {}, viewRow: function() {}, showText: '<span class="fooicon fooicon-pencil" aria-hidden="true"></span> Edit rows', hideText: "Cancel", addText: "New row", editText: '<span class="fooicon fooicon-pencil" aria-hidden="true"></span>', deleteText: '<span class="fooicon fooicon-trash" aria-hidden="true"></span>', viewText: '<span class="fooicon fooicon-stats" aria-hidden="true"></span>', allowAdd: !0, allowEdit: !0, allowDelete: !0, allowView: !1, column: { classes: "footable-editing", name: "editing", title: "", filterable: !1, sortable: !1 } },
    function(t) { t.is.defined(t.Paging) && (t.Paging.prototype.unpaged = [], t.Paging.extend("predraw", function() { this.unpaged = this.ft.rows.array.slice(0), this._super() })) }((jQuery, FooTable)),
    function(t, o) {
        o.Row.prototype.add = function(i) { i = !o.is.boolean(i) || i; var n = this; return t.Deferred(function(t) { var e = n.ft.rows.all.push(n) - 1; return i ? n.ft.draw().then(function() { t.resolve(e) }) : void t.resolve(e) }) }, o.Row.prototype.delete = function(i) { i = !o.is.boolean(i) || i; var n = this; return t.Deferred(function(t) { var e = n.ft.rows.all.indexOf(n); return o.is.number(e) && 0 <= e && e < n.ft.rows.all.length && (n.ft.rows.all.splice(e, 1), i) ? n.ft.draw().then(function() { t.resolve(n) }) : void t.resolve(n) }) }, o.is.defined(o.Paging) && o.Row.extend("add", function(t) {
            t = !o.is.boolean(t) || t;
            var i, n = this,
                e = this._super(t),
                s = n.ft.use(o.Editing);
            return s && s.pageToNew && (i = n.ft.use(o.Paging)) && t ? e.then(function() {
                var t = i.unpaged.indexOf(n),
                    e = Math.ceil((t + 1) / i.size);
                return i.current !== e ? i.goto(e) : void 0
            }) : e
        }), o.is.defined(o.Sorting) && o.Row.extend("val", function(t, e) {
            e = !o.is.boolean(e) || e;
            var i = this._super(t);
            if (!o.is.hash(t)) return i;
            var s = this;
            return e && s.ft.draw().then(function() {
                var t, e = s.ft.use(o.Editing);
                if (o.is.defined(o.Paging) && e && e.pageToNew && (t = s.ft.use(o.Paging))) {
                    var i = t.unpaged.indexOf(s),
                        n = Math.ceil((i + 1) / t.size);
                    if (t.current !== n) return t.goto(n)
                }
            }), i
        })
    }(jQuery, FooTable),
    function(o) {
        o.Rows.prototype.add = function(t, e) {
            var i = t;
            o.is.hash(t) && (i = new FooTable.Row(this.ft, this.ft.columns.array, t)), i instanceof FooTable.Row && i.add(e)
        }, o.Rows.prototype.update = function(t, e, i) {
            var n = this.ft.rows.all.length,
                s = t;
            o.is.number(t) && 0 <= t && t < n && (s = this.ft.rows.all[t]), s instanceof FooTable.Row && o.is.hash(e) && s.val(e, i)
        }, o.Rows.prototype.delete = function(t, e) {
            var i = this.ft.rows.all.length,
                n = t;
            o.is.number(t) && 0 <= t && t < i && (n = this.ft.rows.all[t]), n instanceof FooTable.Row && n.delete(e)
        }
    }(FooTable),
    function(i) {
        var e = 0,
            n = function(t) { for (var e = 2166136261, i = 0, n = t.length; i < n; i++) e ^= t.charCodeAt(i), e += (e << 1) + (e << 4) + (e << 7) + (e << 8) + (e << 24); return e >>> 0 }(location.origin + location.pathname);
        i.State = i.Component.extend({
            construct: function(t) { this._super(t, t.o.state.enabled), this.key = i.is.string(t.o.state.key) ? t.o.state.key : this._uid(), this.filtering = !i.is.boolean(t.o.state.filtering) || t.o.state.filtering, this.paging = !i.is.boolean(t.o.state.paging) || t.o.state.paging, this.sorting = !i.is.boolean(t.o.state.sorting) || t.o.state.sorting },
            preinit: function(t) {
                var e = this;
                this.ft.raise("preinit.ft.state", [t]).then(function() { e.enabled = i.is.boolean(t.state) ? t.state : e.enabled, e.enabled && (e.key = i.is.string(t.stateKey) ? t.stateKey : e.key, e.filtering = i.is.boolean(t.stateFiltering) ? t.stateFiltering : e.filtering, e.paging = i.is.boolean(t.statePaging) ? t.statePaging : e.paging, e.sorting = i.is.boolean(t.stateSorting) ? t.stateSorting : e.sorting) }, function() { e.enabled = !1 })
            },
            get: function(t) { return JSON.parse(localStorage.getItem(this.key + ":" + t)) },
            set: function(t, e) { localStorage.setItem(this.key + ":" + t, JSON.stringify(e)) },
            remove: function(t) { localStorage.removeItem(this.key + ":" + t) },
            read: function() { this.ft.execute(!1, !0, "readState") },
            write: function() { this.ft.execute(!1, !0, "writeState") },
            clear: function() { this.ft.execute(!1, !0, "clearState") },
            _uid: function() { var t = this.ft.$el.attr("id"); return n + "_" + (i.is.string(t) ? t : ++e) }
        }), i.components.register("state", i.State, 700)
    }((jQuery, FooTable)),
    function(t) { t.Component.prototype.readState = function() {}, t.Component.prototype.writeState = function() {}, t.Component.prototype.clearState = function() {} }(FooTable), FooTable.Defaults.prototype.state = { enabled: !1, filtering: !0, paging: !0, sorting: !0, key: null },
    function(e) {
        e.Filtering && (e.Filtering.prototype.readState = function() {
            var t;
            this.ft.state.filtering && (t = this.ft.state.get("filtering"), e.is.hash(t) && e.is.array(t.filters) && (this.filters = this.ensure(t.filters)))
        }, e.Filtering.prototype.writeState = function() {
            var t;
            this.ft.state.filtering && (t = e.arr.map(this.filters, function(t) { return { name: t.name, query: t.query instanceof e.Query ? t.query.val() : t.query, columns: e.arr.map(t.columns, function(t) { return t.name }) } }), this.ft.state.set("filtering", { filters: t }))
        }, e.Filtering.prototype.clearState = function() { this.ft.state.filtering && this.ft.state.remove("filtering") })
    }(FooTable),
    function(e) {
        e.Paging && (e.Paging.prototype.readState = function() {
            var t;
            this.ft.state.paging && (t = this.ft.state.get("paging"), e.is.hash(t) && (this.current = t.current, this.size = t.size))
        }, e.Paging.prototype.writeState = function() { this.ft.state.paging && this.ft.state.set("paging", { current: this.current, size: this.size }) }, e.Paging.prototype.clearState = function() { this.ft.state.paging && this.ft.state.remove("paging") })
    }(FooTable),
    function(i) {
        i.Sorting && (i.Sorting.prototype.readState = function() {
            var t, e;
            this.ft.state.sorting && (t = this.ft.state.get("sorting"), !i.is.hash(t) || (e = this.ft.columns.get(t.column)) instanceof i.Column && (this.column = e, this.column.direction = t.direction))
        }, i.Sorting.prototype.writeState = function() { this.ft.state.sorting && this.column instanceof i.Column && this.ft.state.set("sorting", { column: this.column.name, direction: this.column.direction }) }, i.Sorting.prototype.clearState = function() { this.ft.state.sorting && this.ft.state.remove("sorting") })
    }(FooTable),
    function(t) { t.Table.extend("_construct", function(t) { this.state = this.use(FooTable.State), this._super(t) }), t.Table.extend("_preinit", function() { var t = this; return t._super().then(function() { t.state.enabled && t.state.read() }) }), t.Table.extend("draw", function() { var t = this; return t._super().then(function() { t.state.enabled && t.state.write() }) }) }(FooTable);
"use strict";

function _typeof(t) { return (_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) { return typeof t } : function(t) { return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t })(t) }

function productTeaserInit() {
    productTeaserHeadlineHandling(), jQuery(".product-teaser").each(function() {
        var e = $(this).find(".product-teaser-details");
        $(this).find(".more").on("click", function() {
            $("div.reveal-overlay").remove();
            var t = $('<section class="reveal product-teaser-details" data-reveal>' + e.html() + '<button class="close-button" data-close type="button"><span aria-hidden="true">&times;</span></button></div>');
            t.appendTo(e), t.length && (t.foundation(), t.foundation("open"), t.find(".link-add-to-cart").on("click", function() {
                var t = $(this).data("product-id"),
                    e = $(this);
                isFilled(e.find("svg")) ? _deleteProduct("basket", t, function(t) { t && (e.addClass("modified"), flashIcon("basket", 300), updateProductIcons()) }) : addProduct("basket", t, function(t) { t && (e.addClass("modified"), flashIcon("basket", 300), updateProductIcons()) })
            }), t.find(".link-add-to-fav").on("click", function() {
                var t = $(this).data("product-id"),
                    e = $(this);
                isFilled(e.find("svg")) ? _deleteProduct("compare", t, function(t) { t && (e.addClass("modified"), flashIcon("compare", 300), updateProductIcons()) }) : addProduct("compare", t, function(t) { t && (e.addClass("modified"), flashIcon("compare", 300), updateProductIcons()) })
            }))
        })
    })
}
window.MSInputMethodContext && document.documentMode && document.write('<script src="https://cdn.jsdelivr.net/gh/nuxodin/ie11CustomProperties@4.1.0/ie11CustomProperties.min.js"><script>');

// @see https://gcp.baslerweb.com/jira/browse/MCAS-103
let autoCloseBasketTimeout;
let autoCloseBasketTimeoutInMilliSeconds = window.AUTO_CLOSE_BASKET_TIMEOUT_IN_MILLI_SECONDS || 6000; // 6 sec. by default
function clearAutoCloseBasketTimeout() {
    if (autoCloseBasketTimeout) {
        window.clearTimeout(autoCloseBasketTimeout);
    }
}
function openBasket() {
    const hideClassName = "hide";
    const basketOverlayElement = document.querySelector("#sn-basket .dynamic.content");
    basketOverlayElement?.classList.remove(hideClassName);

    clearAutoCloseBasketTimeout();

    autoCloseBasketTimeout = window.setTimeout(closeBasket, autoCloseBasketTimeoutInMilliSeconds);
}
function closeBasket() {
    const hideClassName = "hide";
    const basketOverlayElement = document.querySelector("#sn-basket .dynamic.content");

    basketOverlayElement?.classList.add(hideClassName);
}
$(document).ready(() => {
    $("body").on("mouseenter", "#sn-basket .dynamic.content", clearAutoCloseBasketTimeout);
	// can not use propagation on cart as "stopProgation" is called on li#sn-basket somewhere
    $("#sn-basket .sn_close").click((e) => {
		e.stopPropagation();
        e.preventDefault();
        closeBasket();
    });
})
// end https://gcp.baslerweb.com/jira/browse/MCAS-103

var addToCartHandler = function() {
        var icon = $(this);
        var id = icon.data("product-id");
        if(isFilled(icon)) {
            _deleteProduct("basket", id, function(success) {
                if (success) {
                    // callback
                    flashIcon('basket', 300);
                    updateProductIcons();

                    addToCartTimeout();
                }
            });
        } else {
            addProduct("basket", id, function(success) {
                if (success) {
                    // callback
                    flashIcon('basket', 300);
                    updateProductIcons();

                    addToCartTimeout();
                    // @see https://gcp.baslerweb.com/jira/browse/MCAS-103
                    openBasket();
                }
            });
        }

    },
    etailerClickHandler = function() {
        var e = $("#etailer-" + $(this).attr("data-product-id")),
            t = $(this).data("product-id"),
            n = $(this).find("svg"),
            a = e.find("h1").data("product-name");
        isFilled(n) ? _deleteProduct("basket", t, function(t) { t && updateProductIcons() }) : (e.foundation(), e.foundation("open"), e.find(".link-add-to-cart").on("click", function() { addProduct("basket", t, function(t) { t && ($(".sn-basket").addClass("active"), updateProductIcons(), addToCartTimeout()) }), e.foundation("close"), updateProductIcons(), dataLayer.push({ event: "customEvent", eventInfo: { category: "etailer_layer", action: "baslercart", label: a } }) }), e.find(".etailer-external").on("click", function() {
            var t = $(this).parent("div").data("etailer-name");
            dataLayer.push({ event: "customEvent", eventInfo: { category: "etailer_layer", action: t, label: a } }), e.foundation("close")
        }))
    },
    timeoutHandle = null;

function addToCartTimeout() {
    var t = $(".sn-basket");
    $(".sn-basket").hasClass(".active") ? (handleInfoBox(t, !1), clearTimeout(timeoutHandle)) : handleInfoBox(t, !0), closeFlyoutInit(5e3)
}
var closeFlyoutInit = function(t) {
    t = t || 3e3, timeoutHandle && clearTimeout(timeoutHandle), timeoutHandle = setTimeout(function() {
        var t = $("#sticky-nav");
        t.find("li.active").length && (t.find("span").remove(), t.find("li").removeClass("active"), t.removeClass("open"))
    }, t)
};
$("#sticky-nav").on("mouseenter", function() { clearTimeout(timeoutHandle) }).on("mouseleave", function() { closeFlyoutInit(5e3) });
var addToFavHandler = function() {
    var t = $(this).data("product-id");
    isFilled($(this)) ? _deleteProduct("compare", t, function(t) { t && (flashIcon("compare", 300), updateProductIcons()) }) : addProduct("compare", t, function(t) { t && (flashIcon("compare", 300), updateProductIcons()) })
};

function productTeaserHeadlineHandling() { $(".row:has(.product-teaser.disabled)").each(function() { $(this).find(".product-teaser").not(".disabled").length ? ($(this).removeClass("hide-for-small-only"), $(this).removeClass("hide-for-medium-only"), $(this).removeClass("hide-for-large")) : ($(this).addClass("hide-for-small-only"), $(this).addClass("hide-for-medium-only"), $(this).addClass("hide-for-large")) }) }

function initializeFootable(t) { t.each(function() { $(this).find(".more-info").each(function() { $(this).attr("data-tooltip", "").addClass("has-tip") }), $(this).footable() }) }

function addProduct(a, i, o) { var t, e = JSON.stringify({ PRODUCT_ID: i }); "basket" === a && (t = JSConf.javascript.addToCartJSON), "compare" === a && (t = JSConf.javascript.addToFavJSON), $.ajax({ data: e, dataType: "json", url: t, type: "post" }).done(function(t) { "function" == typeof o && (o(!0), "compare" === a && (urlInfos = JSConf.javascript.stickynavCompareJSON, $.ajax({ data: JSON.stringify(""), dataType: "json", url: urlInfos, type: "post" }).done(function(t) { $.each(t, function(t, e) { i == e.ID && dataLayer.push({ event: "customEvent", eventInfo: { category: "watchlist", action: e.PRODUCT_CAT, label: e.PRODUCT_NAME } }) }) }))) }).fail(function(t, e, n) { console.error("ERROR: addProduct()", a, i, e, t.status, n), "function" == typeof o && o(!1) }) }

function addProductList(a, t, i) {
    var n = [];
    t.map(function(t) {
        var e = { PRODUCT_ID: t };
        n.push(e)
    });
    var e, o = JSON.stringify(n);
    "basket" === a && (e = JSConf.javascript.addToCartJSON), "compare" === a && (e = JSConf.javascript.addToFavJSON), $.ajax({ data: o, dataType: "json", url: e, type: "post" }).done(function(t) { "function" == typeof i && i(!0) }).fail(function(t, e, n) { console.error("ERROR: addProduct()", a, id, e, t.status, n), "function" == typeof i && i(!1) })
}

function _deleteProduct(a, i, o) { var t, e = JSON.stringify({ PRODUCT_ID: i }); "basket" === a && (t = JSConf.javascript.deleteFromCartJSON), "compare" === a && (t = JSConf.javascript.deleteFromFavJSON), $.ajax({ data: e, type: "post", dataType: "json", url: t }).done(function(t) { "function" == typeof o && o(!0) }).fail(function(t, e, n) { console.error("ERROR: deleteProduct()", a, i, e, t.status, n), "function" == typeof o && o(!1) }) }

function updateProduct(a, t, i) {
    var e = JSON.stringify({ PRODUCT_ID: a, PRODUCT_NUM: t }),
        n = JSConf.javascript.updateCartJSON;
    $.ajax({ data: e, dataType: "json", url: n, type: "post" }).done(function(t) { "function" == typeof i && i(!0) }).fail(function(t, e, n) { console.error("ERROR: addProduct()", item, a, e, t.status, n), "function" == typeof i && i(!1) })
}

function updateStickyNavCartIcon() {
    var t = getProductCartNum(),
        e = $(".sn-basket > a"),
        n = e.find("use").attr("xlink:href");
    $(".sn-basket .quantity").remove(), 0 < t ? ($(".sn-basket").append('<div class="quantity">' + t + "</div>"), n && (n = n.replace(/-filled/i, ""), n += "-filled", e.find("use").attr("xlink:href", n))) : n && (n = n.replace(/-filled/i, ""), e.find("use").attr("xlink:href", n))
}

function updateStickyNavWatchlistIcon() {
    var t = getProductWatchlistIDsFromCookie(),
        e = $(".sn-compare > a"),
        n = e.find("use").attr("xlink:href");
    $(".sn-compare .quantity").remove(), 0 < t.length ? ($(".sn-compare").append('<div class="quantity">' + t.length + "</div>"), n && (n = n.replace(/-filled/i, ""), n += "-filled", e.find("use").attr("xlink:href", n))) : n && (n = n.replace(/-filled/i, ""), e.find("use").attr("xlink:href", n))
}

function flashIcon(t, e) {
    var n = !1;
    $(window).on("load", function() { n = Foundation.MediaQuery.atLeast("xlarge") });
    var a = !1;
    "basket" === t && (a = $(".sn-basket"), updateStickyNavCartIcon(), a && !n && toogleFlasch(a, e, n)), "compare" === t && (a = $(".sn-compare"), updateStickyNavWatchlistIcon(), a && toogleFlasch(a, e, n))
}

function toogleFlasch(t, e, n) { n || $("#sticky-nav").fadeIn(), t.toggleClass("flash"), window.setTimeout(function() { t.toggleClass("flash"), window.setTimeout(function() { t.toggleClass("flash"), window.setTimeout(function() { t.toggleClass("flash"), window.setTimeout(function() { t.toggleClass("flash"), window.setTimeout(function() { t.toggleClass("flash") }, e) }, e) }, e) }, e) }, e) }

function isFilled(t) { return !!t.find("use").attr("xlink:href").match("-filled$") }

function getProductCartNum() {
    var t = Cookies.getJSON("product_cart"),
        e = 0;
    return !!t && ($.each(t, function() {
        var t = parseInt(this.PRODUCT_AMOUNT);
        e += t
    }), e)
}

function getProductCartIDsFromCookie() {
    var t = Cookies.getJSON("product_cart");
    if (t) {
        var e = [];
        return $.each(t, function() {
            var t = this.ID;
            e.push(t)
        }), e
    }
    return !1
}

function getProductWatchlistIDsFromCookie() {
    var t = Cookies.getJSON("product_watchlist");
    if (t) {
        var e = [];
        return $.each(t, function() {
            var t = this.ID;
            e.push(t)
        }), e
    }
    return !1
}

function updateProductIcons() {
    var t = $(".icn-add-to-cart,.link-add-to-cart, .cart.add-product, .icn-external"),
        e = $(".icn-add-to-fav, .link-add-to-fav"),
        a = getProductCartIDsFromCookie(),
        i = getProductWatchlistIDsFromCookie();
    a && t.each(function() {
        var t, e = $(this),
            n = e.data("product-id");
        n && (t = e.find("use").attr("xlink:href"), -1 !== jQuery.inArray(n, a) ? t && (t = t.replace(/-filled/i, ""), t += "-filled", e.find("use").attr("xlink:href", t)) : t && (t = t.replace(/-filled/i, ""), e.find("use").attr("xlink:href", t)))
    }), i && e.each(function() {
        var t, e = $(this),
            n = e.data("product-id");
        n && (t = e.find("use").attr("xlink:href"), -1 !== jQuery.inArray(n, i) ? t && (t = t.replace(/-filled/i, ""), t += "-filled", e.find("use").attr("xlink:href", t)) : t && (t = t.replace(/-filled/i, ""), e.find("use").attr("xlink:href", t)))
    })
}

function addToCartFRC() {
    var t = $(".add-to-cart").data("product-id");
    isFilled($(".icn-add-to-cart")) ? _deleteProduct("basket", t, function(t) { t && (flashIcon("basket", 300), updateProductIcons(), addToCartTimeout()) }) : addProduct("basket", t, function(t) { t && (flashIcon("basket", 300), updateProductIcons(), addToCartTimeout()) })
}
$(document).on("postdraw.ft.table", function(t) { var e = $(t.target).find(".more-info"); "" === e.attr("data-tooltip") ? e.each(function() { new Foundation.Tooltip($(this)) }) : e.each(function() { $(this).foundation("destroy").unbind(), new Foundation.Tooltip($(this)) }) }), $(document).ready(function() { updateProductIcons(), $(".result-table, .responsive-table, .product-teaser").find(".icn-add-to-cart").on("click", addToCartHandler), $(".result-table, .responsive-table").find(".icn-add-to-fav").on("click", addToFavHandler) });
var paginationHelper = function(e, t) { for (var n = e.slice(), a = t, i = [], o = 0; 0 < n.length;) i[o] = n.splice(0, a), o++; return { getPage: function(t) { return i[t] }, getPages: function() { return i }, itemCount: function() { return e.length }, pageCount: function() { return i.length }, pageItemCount: function(t) { return i[t] ? i[t].length : -1 }, pageIndex: function(t) { return t >= e.length || t < 0 ? -1 : Math.floor(t / a) } } },
    hashParams = function(t, e) {
        var n = 1 < arguments.length && void 0 !== e ? e : {},
            a = n.eq,
            i = void 0 === a ? "=" : a,
            o = n.deli,
            s = void 0 === o ? ";" : o;
        0 === t.indexOf("#") && (t = t.substr(1));
        var r = t.split(s).reduce(function(t, e) { var n; return "string" == typeof e && 0 < e.length && (t[(n = e.split(i))[0]] = n[1]), t }, {});
        return { set: function(t, e) { r[t] = e }, get: function(t) { return r[t] }, getAll: function() { return r }, remove: function(t) { delete r[t] }, toString: function() { return Object.keys(r).reduce(function(t, e) { return "" === r[e] ? ["" + e + r[e]].concat(t) : ["" + e + i + r[e]].concat(t) }, []).reverse().join(s) } }
    },
    scrollToElement = function() {
        -1 === location.hash.indexOf("/") && Object.keys(hashParams(location.hash).getAll()).forEach(function(t) {
            var e = $("span#" + t);
            0 < e.length && $("body, html").animate({ scrollTop: $(e).offset().top })
        })
    };

/**
 * Migrate old "product_cart" cookies as the new cookies are accessible
 * from subdomains.
 *
 * @see https://gcp.baslerweb.com/jira/browse/MCAS-198
 */
function migrateProductCartCookie() {
    const productCartCookieVersion = $.cookie("product_cart_version");
    if (productCartCookieVersion === "2") {
        return;
    }

    $.cookie("product_cart_version", "2", {
        expires: 365,
        path: "/"
    });

    const productCartCookie = $.cookie("product_cart");
    if (!productCartCookie) {
        return;
    }

    // if the product cookie is in the old version, it will simply be deleted for now
    $.cookie("product_cart", null, {
        path: "/"
    });
}

migrateProductCartCookie();

function updateRows(r, a) {
    console.log("call of update rows + ajax request + build table");
    var t, e = $(".sn-basket"),
        n = $(".sn-compare"),
        i = !1;
    "basket" === r && (i = e.find(".content table.basket tbody"), t = JSConf.javascript.stickynavBasketJSON), "compare" === r && (i = n.find(".content table.compare tbody"), t = JSConf.javascript.stickynavCompareJSON), i && $.ajax({ data: JSON.stringify(""), dataType: "json", url: t, type: "post" }).done(function(t) {
        var s = [];
        $.each(t, function(t, n) {
            var a = "";
            a += "<tr>", a += "<td><div class='image-container'><a href='" + n.PRODUCT_URL + "'><img src='" + n.FIGURE_THUMB_URL + "' alt='" + n.PRODUCT_NAME + "'></a></div></td>", "basket" === r && (a += "<td><div class='amount'>" + n.PRODUCT_AMOUNT + " x</div></td>"), a += "<td><a href='" + n.PRODUCT_URL + "'>" + n.PRODUCT_NAME + "</a></td>";
            var e, i, o = "add-product";
            n.ETAILER && (o = "icn-external"), "compare" === r && (i = "addProduct", (e = n.PRODUCT_IS_ON_CART) ? (e = "-filled", i = "deleteProduct") : e = "", n.ETAILER ? (a += "<td><div class='cart " + o + "' data-id='" + n.ID + "' data-product-id='" + n.ID + "' data-item='basket' data-js-modul-action='" + i + "'><svg class='icon grow orange'><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-cart" + e + "'></use></svg></div>", a += "<div class='reveal product-teaser-details-etailer etailer' id='etailer-" + n.ID + "' data-reveal  data-additional-overlay-classes='etailer'>", a += "<div class='type3'><h1 data-product-name='" + n.PRODUCT_NAME + "'>" + n.PRODUCT_NAME + "</h1><p>" + n.ETAILER_BASLER + "</p>", a += "<a class='link-add-to-cart button' data-product-id='" + n.ID + "'><span>" + n.ETAILER_ADDTOCART + "</span><svg><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-cart'></use></svg></a>", a += "<div class='content-divider low'></div><hr /><div class='content-divider low'></div><p>" + n.ETAILER_EXTERNAL + "</p>", $.each(n.ETAILER, function(t, e) { a += "<div class='ext-wrapper' data-etailer-name='" + e.NAME + "'><a href='" + e.URL + "' target='_blank' class='etailer-external'><div class='img-wrapper'><img alt='" + e.NAME + "' src='" + e.LOGO + "' /></div></a>", a += "<a href='" + e.URL + "' target='_blank' class='etailer-external'><svg><use xlink:href='#icon-globus' xmlns:xlink='http://www.w3.org/1999/xlink'></use></svg><span>" + n.ETAILER_LINKTEXT + "&nbsp;" + e.NAME + "</span></a></div>", a += "<div class='content-divider low'></div>" }), a += "</div><div class='type4'><img src='" + n.FIGURE_THUMB_URL + "'/></div><button class='close-button' data-close='' type='button'><span aria-hidden='true'>&times;</span></button>", a += "</div></td>") : a += "<td><div class='cart " + o + "' data-id='" + n.ID + "' data-item='basket' data-js-modul-action='" + i + "'><svg class='icon grow orange'><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-cart" + e + "'></use></svg></div></td>"), a += "<td><div class='delete-icon delete-product' data-id='" + n.ID + "' data-item='" + r + "' data-js-modul-action='deleteProduct'></div></td>", a += "</tr>", s.push(a)
        }), i.empty().append(s), "function" == typeof a && a(!0), "basket" === r && (0 < i.find("tr").length ? ($(".sn-basket .noelements").hide(), $(".sn-basket .button").removeClass("disabled"), $(".sn-basket .button").attr("disabled", !1)) : ($(".sn-basket .noelements").fadeIn(), $(".sn-basket .button").addClass("disabled"), $(".sn-basket .button").attr("disabled", !0), $(".sn-basket a.button").on("click", function(t) { t.preventDefault() }))), "compare" === r && (0 < i.find("tr").length ? ($(".sn-compare .noelements").hide(), $(".sn-compare .button").removeClass("disabled"), $(".sn-compare .button").attr("disabled", !1)) : ($(".sn-compare .noelements").fadeIn(), $(".sn-compare .button").addClass("disabled"), $(".sn-compare .button").attr("disabled", !0), $(".sn-compare a.button").on("click", function(t) { t.preventDefault() }))), updateStickyNavCartIcon(), updateStickyNavWatchlistIcon()
    }).fail(function(t, e, n) { console.error("STICKY NAVIGATION", e, t.status, n), "function" == typeof a && a(!1) })
}

function handleInfoBox(t, e) { var n = !1; "sn-basket" === t.attr("id") && (n = "basket"), "sn-compare" === t.attr("id") && (n = "compare"), n && (console.log("isDynamic check"), updateRows(n, function(t) { t && updateProductIcons() })) }

function setupRows(n) {
    var a, i, o = $("#sticky-nav");
    10 < n.find("tr").length && (n.find("tr:gt(" + parseInt(9) + ")").hide(), $("<div class='more-rows'> </div>").insertAfter(n), $("<div class='less-rows disabled'> </div>").insertAfter(n), (a = $(".less-rows")).click(function() {
        if (n.find("tr:visible:first").is(":first-child")) return !1;
        a.removeClass("disabled"), n.find("tr:visible:last").is(":last-child") || i.removeClass("disabled");
        var t = n.find("tr:visible:first").index(),
            e = t - 10;
        n.find("tr").hide(), n.find("tr").slice(e, t).fadeIn(600), n.find("tr:visible:first").is(":first-child") && a.addClass("disabled"), n.find("tr:visible:last").is(":last-child") ? i.addClass("disabled") : i.removeClass("disabled")
    }), (i = $(".more-rows")).click(function() {
        if (n.find("tr:visible:last").is(":last-child")) return a.removeClass("disabled"), !1;
        a.removeClass("disabled");
        var t = n.find("tr:visible:last").index(),
            e = t + 10 + 1;
        n.find("tr").hide(), n.find("tr").slice(t + 1, e).fadeIn(600), n.find("tr:visible:last").is(":last-child") && i.addClass("disabled")
    })), n && ($(".delete-product").click(function() {
        var n = $(this).data("item"),
            t = $(this).data("id");
        _deleteProduct(n, t, function(t) {
            var e;
            t && (e = "#sn-" + n, handleInfoBox(o.find(e), !0))
        })
    }), $(".add-product").click(function(t) {
        var e = $(this).data("item"),
            n = $(this).data("id");
        isFilled($(this)) ? _deleteProduct(e, n, function(t) { t && handleInfoBox(o.find(".sn-compare"), !0) }) : addProduct(e, n, function(t) { t && (flashIcon(e, 300), handleInfoBox(o.find(".sn-compare"), !0)) })
    }))
}
var requiredCheckboxGroup = function i(t) {
    var o = (t = t || {}).attribute || "required-checkbox-group",
        s = t.successCallback;
    "function" != typeof t.successCallback && (s = function() {});
    var r = t.failCallback;
    "function" != typeof t.failCallback && (r = function() {});
    var e = [].slice.call(document.querySelectorAll("[" + o + "]")),
        l = 0;
    e.forEach(function(t) {
        var e, n, a;
        t.requiredCheckboxGroup && t.requiredCheckboxGroup.setup ? l += 1 : (e = [].slice.call(t.querySelectorAll('input[type="checkbox"]')), n = function() { return [].slice.call(t.querySelectorAll('input[type="checkbox"]:checked')).length }, a = t.getAttribute(o).split(" ").reduce(function(t, e) {
            var n = (e = e.split(":"))[0],
                a = e[1] || !0;
            return t[n] || (t[n] = a), t
        }, {}), a = i.setDefaults(a), e.forEach(function(t) {!t.checked && n() < a.min && t.setAttribute("required", ""), t.addEventListener("change", function() { n() < a.min ? e.forEach(function(t) { t.setAttribute("required", ""), r(t) }) : e.forEach(function(t) { t.removeAttribute("required"), s(t) }) }) }), t.requiredCheckboxGroup = { setup: !0 })
    }), 0 < l && console.warn("Skipped already setup required checkbox group(s): " + l)
};
requiredCheckboxGroup.setDefaults = function(n) {
    var e = { min: 1, max: !1 },
        a = {};
    return Object.keys(n).forEach(function(t) {
        var e = n[t];
        switch (t) {
            case "max":
                !0 === e && (e = 1);
            case "min":
                Number.isNaN(parseInt(e, 10)) || (a[t] = parseInt(e, 10));
                break;
            default:
                a[t] = e
        }
    }), Object.keys(e).forEach(function(t) { void 0 === a[t] && (a[t] = e[t]) }), a
};
var renderTemplate = function(t, e, n, a) {
        if ("undefined" == typeof Handlebars) return !1;
        n = n || {}, a = a || !1;
        var i = Handlebars.compile(e)(n);
        return a ? !0 === a ? t.replaceWith(i) : "insertBefore" === a ? $(i).insertBefore(t) : "insertAfter" === a ? $(i).insertAfter(t) : "append" === a && t.append(i) : t.html(i), !0
    },
    sortArrayByValues = function(t, i) {
        return t.sort(function(t, e) {
            var n = i ? t[i].toLowerCase() : t.toLowerCase(),
                a = i ? e[i].toLowerCase() : e.toLowerCase();
            return n < a ? -1 : a < n ? 1 : 0
        })
    },
    getFirstNEntriesOfArray = function(t, e) { return t.slice(0, e) },
    isValueInArray = function(t, e) { return -1 < t.indexOf(e) },
    removeValueFromArray = function(t, e) { return isValueInArray(t, e) && t.splice(t.indexOf(e), 1), t };
$(document).on("click", "[data-toggler]", function(t) {
    var e = $(t.currentTarget),
        n = $('[data-toggler-target="' + e.attr("data-toggler") + '"]');
    "true" === e.attr("aria-expanded") || "true" === n.attr("aria-expanded") ? (e.attr("aria-expanded", "false"), n.attr("aria-expanded", "false")) : (e.attr("aria-expanded", "true"), n.attr("aria-expanded", "true")), n.slideToggle(300)
});
var resetCurrentHashedUrl = function() { window.history.pushState({}, "", window.location.pathname) },
    addNewValueToUrlHash = function(t) { var e = window.location.hash.replace("#", ""); if (-1 < e.indexOf(t)) return !1; var n = "#" + e + t; return window.history.pushState({}, "", n), !0 },
    removeValueFromUrlHash = function(t) { var e = window.location.hash.replace("#", ""); if (-1 === e.indexOf(t)) return !1; var n = "#" + e.replace(t, ""); return window.history.pushState({}, "", n), !0 },
    Templates = { tagFilter: { category: '<li class="tag-filter__category-entry js-tag-filter-category"><h2 class="category-entry__title" data-toggler="{{fsid}}" {{#if first}}aria-expanded="true"{{else}}aria-expanded="false"{{/if}}>{{name}}</h2><div class="news-filter" data-toggler-target="{{fsid}}" {{#if first}}aria-expanded="true"{{else}}aria-expanded="false" style="display: none;"{{/if}}><form><div class="check-wrapper"><fieldset class="js-tag-filter" data-category="{{fsid}}"></fieldset></div></form></div></li>', filter: '<div class="checkbox-container"><span class="checkbox-wrapper"><input type="checkbox" value="{{name}}" name="{{filterNameAttr}}" id="filter-{{fsid}}" class="js-tag-filter-item" data-filter-id="{{fsid}}" data-event-label="{{eventLabel}}" data-event-action="{{internal}}"><span></span></span><label for="filter-{{fsid}}">{{name}}</label></div>', teaser: '<figure class="img-txt-teaser {{#if highlight}}teaser--highlight{{/if}}">{{#if highlight}}<div class="highlight__badge"><span class="badge__text">NEW</span></div>{{/if}}{{#if image}}<div class="img-container">{{#if link}}<a href="{{link}}">{{/if}}<img src="{{image}}" alt="{{title}}">{{#if link}}</a>{{/if}}</div>{{/if}}<figcaption class="txt-container">{{#if link}}<a href="{{link}}"><h2>{{title}}</h2></a>{{{excerpt}}}{{{link_full}}}<div class="content-divider none"></div>{{else}}<h2>{{title}}</h2>{{{excerpt}}}{{/if}}<ul class="teaser__tags">{{#each displayTags}}<li class="teaser__tag" data-event-label="{{eventLabel}}" data-event-action="{{eventAction}}"">{{name}}{{/each}}</ul></div></div>' } };
! function(u) {
    ! function() {
        var t = u("#infinite-loading-downloads"),
            e = 0,
            n = [],
            a = paginationHelper(n, 15);
        t.css("visibility", "hidden");

        function i() { a.getPage(e) && (a.getPage(e).forEach(function(t) { u(t).fadeIn() }), e++) } window.initInifiniteScrollDownloads = function() { e = 0, n = Array.prototype.slice.call(u(".downloads-table.result tbody tr"), 0), 1 < (a = paginationHelper(n, 15)).pageCount() ? (t.show(), t.css({ visibility: "visible", opacity: 0 }).animate({ opacity: 1 }, 200)) : t.animate({ opacity: 0 }, 200, function() { t.css("visibility", "hidden") }), n.forEach(function(t) { t.style.display = "none" }), i(), t.one("click", function() { u(this).animate({ opacity: 0 }, 200, function() { t.css("visibility", "hidden") }), i() }) }, u(window).on("scroll", function() { "hidden" === t.css("visibility") && t[0].getBoundingClientRect().bottom < u(window).height() && i() })
    }(), u(function() {
        var i = "DOWNLOADS FILTER",
            t = u(".downloads-filter.request"),
            s = t,
            o = u("table.downloads-table"),
            r = !1,
            r = u(".downloads-table.result").hasClass("software"),
            l = u(".button.reset");

        function c(t) {
            var e = t || "";
            console.info("setupFilters() ", e);
            var n = hashParams(location.hash),
                a = JSConf.javascript.downloadsFilterJSON;
            u.ajax({ data: JSON.stringify(e), dataType: "json", url: a, type: "post" }).done(function(t) {
                var i = [];
                u.each(t, function(t, e) {
                    var a, n;
                    "select" === e.TYPE && (n = a = "", e.DISABLED && (n = " disabled='disabled'"), a += "<div class='type5'><label for='" + e.ID + "'>" + e.TEXT + "</label>", a += "<select name='" + e.ID + "' id='" + e.ID + "'" + n + "></div>", u.each(e.OPTIONS, function(t, e) {
                        var n = e.SELECTED ? "selected" : "";
                        e.DATA_URL ? a += "<option data-url='" + e.DATA_URL + "' value='" + e.ID + "' " + n + ">" + e.TEXT + "</option>" : a += "<option value='" + e.ID + "' " + n + ">" + e.TEXT + "</option>"
                    }), a += "</select>", i.push(a))
                }), s.empty().append(i), u("select:not(.noSelectric)").each(function() {
                    u(this).on("change", function() {
                        n.set(u(this).attr("id"), u(this).find("option:selected").val()), "series" === u(this).attr("id") && n.set("model", "all"), "type" === u(this).attr("id") && (n.set("language", "all"), u("#language").val("all")), r && ("type" === u(this).attr("id") && "pylonsoftware" !== u(this).find("option:selected").val() ? (u("#version option:selected").removeAttr("selected"), u("#version").val("all"), n.set("version", "all")) : n.set("version", u("#version option:selected").val())), location.hash = n.toString();
                        var e = [];
                        s.find("select:not(.noSelectric)").each(function() {
                            var t = jQuery.parseJSON('{ "ID": "' + u(this).attr("id") + '", "VALUE": "' + u(this).find("option:selected").val() + '" }');
                            e.push(t)
                        }), c(e), d(e), u("select:not(.noSelectric)").selectric({ disableOnMobile: !1, arrowButtonMarkup: '<b class="slc-button">&#x25be;</b>' })
                    })
                }), s.find("select:not(.noSelectric)").selectric({ disableOnMobile: !1, arrowButtonMarkup: '<b class="slc-button">&#x25be;</b>' })
            }).fail(function(t, e, n) { console.error(i, e, t.status, n) })
        }

        function d(t) {
            var e, n = t || "";
            console.info("getResultData() ", n), e = JSConf.javascript.downloadsResultJSON, u.ajax({ data: JSON.stringify(n), dataType: "json", url: e, type: "post" }).done(function(t) {
                u("#infinite-loading-downloads").css("visibility", "hidden"), u("#infinite-loading-downloads").hide(), 0;
                var a = [],
                    i = !0;
                u.each(t, function(t, e) {
                    Object.keys(e.TABLEROWS).length && (i = !1);
                    var n = "";
                    n += "<thead>", n += "<tr>", n += "<th data-type='html'>" + e.TH_NAME + "</th>", r && (n += "<th data-breakpoints='xs sm'>" + e.TH_VERSION + "</th>"), n += "<th data-breakpoints='xs sm'>" + e.TH_INFO + "</th>", n += "<th data-breakpoints='xs sm'>" + e.TH_CATEGORY + "</th>", r || (n += "<th data-breakpoints='xs sm'>" + e.TH_LANG + "</th>"), n += "</tr>", n += "</thead>", n += "<tbody>", u.each(e.TABLEROWS, function(t, e) { n += "<tr>", n += "<td><a href='" + e.TD_NAME_URL + "' class='download'>" + e.TD_NAME_TEXT + "<svg><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-download'></use></svg></a></td>", r && (e.TD_VERSION ? n += "<td>" + e.TD_VERSION + "</td>" : n += "<td></td>"), n += "<td><span class='metadata'>" + e.TD_INFO_TEXT + "</span></td>", n += "<td>" + e.TD_CATEGORY_TEXT + "</td>", r || (n += "<td>" + e.TD_LANG_TEXT + "</td>"), n += "</tr>" }), n += "</tbody>", a.push(n)
                }), i ? (o.empty(), u(".no-result").show()) : (u(".no-result").hide(), o.empty().append(a)), u(".selector-begin").hide(), u(".selector-results").fadeIn("fast"), u(".selector-results .no-elements").removeClass("pulse"), setTimeout(function() { u(".selector-results .no-elements").text(u(".downloads-table.result tbody tr").length).addClass("pulse") }, 0), u(".onlycontent .downloads-table a").click(function(t) { t.preventDefault(), window.open(this.href) }), o = u("table.downloads-table").footable(), initInifiniteScrollDownloads()
            }).fail(function(t, e, n) { console.error(i, e, t.status, n) })
        }
        o.on({
            "ready.ft.table": function() {
                console.info("ready.ft.table"), o.find(".download").each(function() {
                    var t = u(this).html();
                    u(this).html(t)
                }), console.info("downloads-filter.js- document ready - downloadTable$.on -> updateProductIcons()")
            }
        }).footable(), t.length && function() {
            u("#infinite-loading-downloads").css("visibility", "hidden"), initInifiniteScrollDownloads(), u(".no-elements").text(u(".downloads-table.result tbody tr").length);
            var t, n = hashParams(location.hash),
                e = n.getAll(),
                a = 0;
            for (var i in e) { "undefined" !== e[i] && e[i] ? e.hasOwnProperty(i) && e[i] && (t = "#" + String(i), u(".downloads-filter").find(t).val(e[i]), a++) : n.set(String(i), "") }
            var o = [];
            s.find("select").each(function() {
                var t = jQuery.parseJSON('{ "ID": "' + u(this).attr("id") + '", "VALUE": "' + u(this).find("option:selected").val() + '" }');
                o.push(t)
            }), s.find("#version").attr("disabled", "disabled"), 0 < u(".downloads-table.result tbody tr").length && 0 < a && (u(".selector-results .no-elements").text(u(".downloads-table.result tbody tr").length), u(".selector-begin").hide(), u(".selector-results").fadeIn("fast")), c(o), d(o), initInifiniteScrollDownloads(), u("select:not(.noSelectric)").each(function() {
                u(this).on("change", function() {
                    n.set(u(this).attr("id"), u(this).find("option:selected").val()), "series" === u(this).attr("id") && n.set("model", "all"), "type" === u(this).attr("id") && (n.set("language", "all"), u("#language").val("all")), r && ("type" === u(this).attr("id") && "pylonsoftware" !== u(this).find("option:selected").val() ? (u("#version option:selected").removeAttr("selected"), u("#version").val("all"), n.set("version", "all")) : n.set("version", u("#version option:selected").val())), location.hash = n.toString();
                    var e = [];
                    s.find("select").each(function() {
                        var t = jQuery.parseJSON('{ "ID": "' + u(this).attr("id") + '", "VALUE": "' + u(this).find("option:selected").val() + '" }');
                        e.push(t)
                    }), c(e), d(e)
                })
            }), u(".onlycontent .downloads-table a").click(function(t) { t.preventDefault(), window.open(this.href) }), l.click(function() { window.location = window.location.href.split("#")[0] })
        }()
    })
}(jQuery),
function(e) {
    function t() { o.getPage(a) && (o.getPage(a).forEach(function(t) { e(t).fadeIn() }), a++) }
    var n, a, i, o;
    n = e("#infinite-loading-faq"), a = 0, o = paginationHelper(i = [], 10), window.initInifiniteScrollFaq = function() { a = 0, i = Array.prototype.slice.call(e("#data-source .result"), 0), 1 < (o = paginationHelper(i, 10)).pageCount() ? (n.show(), n.css({ visibility: "visible" })) : n.css({ visibility: "hidden" }), i.forEach(function(t) { t.style.display = "none" }), t(), n.one("click", function() { e(this).css({ visibility: "hidden" }), t() }) }, e(window).on("scroll", function() { "hidden" === n.css("visibility") && n[0].getBoundingClientRect().bottom < e(window).height() && t() }), e(document).on("ready", function() { e(function() { e("#data-source").length && initInifiniteScrollFaq() }) })
}(jQuery), $(function() {
        var t = $(".lightbox-gallery");
        t.each(function() {
            var t = $(this).data("speed"),
                e = $(this).find(".lightbox-gallery__for"),
                n = $(this).find(".lightbox-gallery__nav"),
                i = $(this).find(".lightbox-gallery__count"),
                a = e.find(".item").length,
                o = " / " + a;
            e.on("init", function(t, e) {
                var n = e.currentSlide + 1;
                i.find(".current").html(n), i.find(".length").html(o), $(this).find(".slick-cloned").each(function() { $(this).data("slick-index"), $(this).find(".lightbox").removeClass("lightbox") })
            }), e.slick({ slidesToShow: 1, slidesToScroll: 1, arrows: !1, infinite: !0, dots: !1, draggable: !0, autoplay: !0, pauseOnHover: !0, autoplaySpeed: t, asNavFor: n }), n.slick({ slidesToShow: 3, slidesToScroll: 1, dots: !1, infinite: !0, centerMode: !1, draggable: !0, autoplaySpeed: t, asNavFor: e, variableWidth: !0, focusOnSelect: !0 }), e.on("reInit", function(t, e) {
                var n = (currentSlide || 0) + 1;
                i.find(".current").html(n)
            }), e.on("afterChange", function(t, e, n) {
                var a = (n || 0) + 1;
                i.find(".current").html(a)
            })
        }), t.each(function() {
            $(this).featherlightGallery({
                root: t,
                filter: ".lightbox",
                previousIcon: '<button type="button" class="featherlightgallery-previous" aria-label="Previous" role="button">Previous</button>',
                nextIcon: '<button type="button" class="featherlightgallery-next" aria-label="Next" role="button">Next</button>',
                galleryFadeIn: 100,
                galleryFadeOut: 300,
                afterContent: function() {
                    var t = '<span class="count">' + (parseFloat($.featherlight.current().currentNavigation()) + 1) + " / " + $.featherlight.current().slides().length + "</span>",
                        e = this.$currentTarget.parent().find("figcaption").html();
                    this.$instance.find(".caption").remove(), this.$instance.find(".count").remove(), this.$instance.find(".featherlight-content").append(t), 0 === this.$instance.find(".featherlight-previous").length && this.$instance.find(".featherlight-content").append('<span title="previous" class="featherlight-previous"><span><button type="button" class="featherlightgallery-previous" aria-label="Previous" role="button">Previous</button></span></span><span title="next" class="featherlight-next"><span><button type="button" class="featherlightgallery-next" aria-label="Next" role="button">Next</button></span></span>'), e && $('<div class="caption">').html(e).appendTo(this.$instance.find(".featherlight-content"))
                }
            })
        })
    }),
    function(h) {
        h(document).on("ready", function() {
            h(function() {
                console.info("product-filter.js - document ready");
                var t = h(".products-filter.request"),
                    l = h("table.products-table"),
                    c = h(".button.reset"),
                    d = !1,
                    e = { "icon-check": '<svg xmlns="http://www.w3.org/2000/svg"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-check" /></svg>', "icn-add-to-fav grow": '<svg xmlns="http://www.w3.org/2000/svg"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-fav" /></svg>', "icn-add-to-cart grow": '<svg xmlns="http://www.w3.org/2000/svg"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-cart" /></svg>' };

                function u(t, e, n) { console.dir(arguments); var a = e.replace(/%/g, ""); if (n.set(t, a), d && ("showall" === e ? (d.removeFilter(t), d.clear()) : (d.addFilter(t, e, [t]), d.filter()), "" !== n)) return location.hash = n.toString(), n } l.on({ "ready.ft.table": function() { console.info("ready.ft.table"), l.find(".icon-check").each(function() { h(this).html(e[this.className]) }), l.find(".icn-add-to-fav").each(function() { h(this).html(e[this.className]) }), l.find(".icn-add-to-cart").each(function() { h(this).html(e[this.className]) }), console.info("product-filter.js- document ready - result.on -> updateProductIcons()"), updateProductIcons() } }).footable(), t.length && function() {
                    d = FooTable.get(".products-table").use(FooTable.Filtering);
                    var t, n = hashParams(location.hash),
                        e = n.getAll(),
                        a = [];
                    for (var i in e)
                        if ("undefined" !== e[i] && e[i]) {
                            if ("tab" === String(i) && n.remove(String(i)), e.hasOwnProperty(i) && e[i]) {
                                t = e[i];
                                var o = "#" + String(i);
                                if (~e[i].indexOf(" OR ")) {
                                    if (~e[i].indexOf(" OR "))
                                        for (var s in a = e[i].split(" OR ")) h(o + " option[value='" + a[s] + "']").prop("selected", !0);
                                    else if (~e[i].indexOf(" AND "))
                                        for (var r in a = e[i].split(" AND ")) h(o + " option[value='" + a[r] + "']").prop("selected", !0)
                                } else "sensorname" !== String(i) && "productline" !== String(i) || (t = "" + e[i]), h(".products-filter").find(o).val(t);
                                n = u(i, t, n)
                            }
                        } else n.set(String(i), "");
                    l.find(".footable-empty").length && h(".no-result").show(), h("select[data-filter]").each(function() {
                        h(this).on("change", function() {
                            var t = h(this).data("filter"),
                                e = "",
                                e = "featuresets" !== t ? h(this).map(function(t, e) { return h(e).val() }).toArray().join(" OR ") : h(this).map(function(t, e) { return h(e).val() }).toArray().join(" AND ");
                            n = u(t, e, n), h(".no-result").hide(), l.find(".footable-empty").length && h(".no-result").show()
                        })
                    }), productFilter(d, document.location.href), h(".url-filter").each(function() {
                        h(this).on("click", function() {
                            var t = h(this).data("url-filter");
                            window.history.pushState(document.location.host, "", h(this).data("url-filter")), productFilter(d, t)
                        })
                    }), h("fieldset[data-filter] input").click(function() {
                        var t = h(this).attr("name"),
                            e = h("fieldset[data-filter] input[name=" + t + "]:checked").map(function(t, e) { return h(e).val() }).toArray().join(" OR ");
                        n = u(t, e, n), h(".no-result").hide(), l.find(".footable-empty").length && h(".no-result").show()
                    }), c.click(function(t) { 0 < h("#accessory_overview___lenses").length ? t.preventDefault() : window.location = window.location.href.split("#")[0] })
                }()
            })
        })
    }(jQuery),
    function(e) { var n, a, i; /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? (e("a.wechat").attr("href", "#"), e("a.wechat").attr("data-open", "myModal"), e("a.wechat").removeAttr("target")) : (n = !1, e("a.wechat").mouseenter(function() { n || e("#qr-code-footer").show() }), e("a.wechat").mouseleave(function() { n || e("#qr-code-footer").hide() }), e("a.wechat").click(function(t) { t.preventDefault(), n ? (n = !1, e("#qr-code-footer").hide()) : (n = !0, e("#qr-code-footer").show()) }), a = !1, e("#qr-icon-header").mouseenter(function() { a || e("#qr-code-header").show() }), e("#qr-icon-header").mouseleave(function() { a || e("#qr-code-header").hide() }), e("#qr-icon-header").click(function(t) { t.preventDefault(), a ? (a = !1, e("#qr-code-header").hide()) : (a = !0, e("#qr-code-header").show()) }), i = !1, e("#qr-icon-sidebar").mouseenter(function() { i || e("#qr-code-sidebar").show() }), e("#qr-icon-sidebar").mouseleave(function() { i || e("#qr-code-sidebar").hide() }), e("#qr-icon-sidebar").click(function(t) { t.preventDefault(), i ? (i = !1, e("#qr-code-sidebar").hide()) : (i = !0, e("#qr-code-sidebar").show()) })) }(jQuery),
    function(l) {
        l(document).on("ready", function() {
            l(function() {
                var i = "QUICK CAMERA GUIDE",
                    t = l(".quick-camera-guide"),
                    s = t.find(".select-wrapper"),
                    r = t.find("a.button");
                t.length && (l("select:not(.noSelectric)").each(function() {
                    l(this).on("change", function() {
                        var e = [];
                        s.find("select").each(function() {
                                var t = jQuery.parseJSON('{ "ID": "' + l(this).attr("id") + '", "VALUE": "' + l(this).find("option:selected").val() + '" }');
                                e.push(t)
                            }),
                            function a(t) {
                                var e;
                                e = t || "";
                                console.info("setupFilters() ", e);
                                var n = JSConf.javascript.quicksearchCamerasJSON;
                                l.ajax({ data: JSON.stringify(e), dataType: "json", url: n, type: "post" }).done(function(t) {
                                    var n = [],
                                        o = "#";
                                    l.each(t, function(t, a) {
                                        var i = "",
                                            e = "";
                                        a.DISABLED && (e = " disabled='disabled'"), i += "<select name='" + a.ID + "' id='" + a.ID + "'" + e + "'>", l.each(a.OPTIONS, function(t, e) {
                                            var n;
                                            e.SELECTED ? (n = "selected", "series" === a.ID ? o = e.URL : "interface" === a.ID ? o = o + "#interface=" + e.PARAM : "model" === a.ID && (o = e.URL)) : n = "", i += "<option value='" + e.ID + "' " + n + ">" + e.TEXT + "</option>"
                                        }), i += "</select>", n.push(i)
                                    }), s.empty().append(n), "all" === s.find("#series option:selected").val() ? (s.find("#interface").val("all"), s.find("#interface").attr("disabled", "disabled"), s.find("#model").val("all"), s.find("#model").attr("disabled", "disabled"), r.attr("href", o).addClass("disabled")) : "579" === s.find("#series option:selected").val() ? (r.attr("href", o).removeClass("disabled"), s.find("#interface").val("all"), s.find("#interface").attr("disabled", "disabled")) : r.attr("href", o).removeClass("disabled"), s.find("select:not(.noSelectric)").selectric({ disableOnMobile: !1, arrowButtonMarkup: '<b class="slc-button">&#x25be;</b>' }), l("select:not(.noSelectric)").each(function() {
                                        l(this).on("change", function() {
                                            var e = [],
                                                t = s.find("select:not(.noSelectric)");
                                            t.each(function() {
                                                var t = jQuery.parseJSON('{ "ID": "' + l(this).attr("id") + '", "VALUE": "' + l(this).find("option:selected").val() + '" }');
                                                e.push(t)
                                            }), a(e)
                                        })
                                    })
                                }).fail(function(t, e, n) { console.error(i, e, t.status, n) })
                            }(e)
                    })
                }), r.addClass("disabled"), s.find("#interface").attr("disabled", "disabled"), s.find("#model").attr("disabled", "disabled"))
            })
        })
    }(jQuery),
    function(i) {
        i(document).on("ready", function() {
            i(function() {
                var t = i("#search-form").data("resultpage"),
                    e = i("#search-form").data("linkname");

                function a(t) {
                    return console.log("text __ of autocomplete :::: ", t), Array.isArray(t) ? t.sort(function(t, e) {
                        var n = t.matchLevel,
                            a = e.matchLevel;
                        return "full" === n ? "full" === a ? 0 : -1 : "full" === a ? 1 : "partial" === n ? "partial" === a ? 0 : -1 : "partial" === a ? 1 : void 0
                    })[0].value : t.value
                }
                autocomplete("#search", { hint: !1, debug: !1 }, {
                    source: autocomplete.sources.hits(index, { hitsPerPage: 5 }),
                    displayKey: "title",
                    templates: {
                        footer: '<a class="arrow-link float-right targetlink" href="' + t + '">' + e + "</a>",
                        suggestion: function(t) {
                            console.log("suggestion in search :: ", t);
                            var e = '<a href="' + t.url + '"><h3>' + a(t._highlightResult.title) + "</h3>";
                            t.hasOwnProperty("_highlightResult") && t._highlightResult.hasOwnProperty("text") && (e += '<div class="text">' + a(t._highlightResult.description) + "</div>");
                            var n = e + "</a>";
                            return console.log("Das HTMl Test Item ::: ", n), e + "</a>"
                        }
                    }
                }), i("#search").on("autocomplete:selected", function(t, e, n) { location = t.originalEvent._args[0].url }), i("#search").on("autocomplete:updated", function(t, e, n) {
                    console.log("autocomplet update :::    ________ ");
                    var a = i("#search-form").data("resultpage") + "?q=" + i(this).val();
                    i(".targetlink").attr("href", a), i("#search-icon-resultlink").attr("href", a)
                })
            })
        })
    }(jQuery),
    function(a) {
        a(document).on("ready", function() {
            a(function() {
                var t = a("#sticky-nav");
                a(".sn-basket"), a(".sn-compare");
                t.length && a(window).on("load", function() { Foundation.MediaQuery.atLeast("xxlarge") && t.find("li").each(function() { a(this).on("click", function(t) { t.stopPropagation(), handleInfoBox(a(this)) }) }), a(window).on("changed.zf.mediaquery", function(t, e, n) { return !(0 < a(".applicationAdvisor").length) && void document.location.reload() }), updateStickyNavCartIcon(), updateStickyNavWatchlistIcon() })
            })
        })
    }(jQuery);
var getFilterTagsForCategoryById = function(t, n) { var a = []; return $.each(t, function(t, e) { parseInt(e.category, 10) === parseInt(n, 10) && a.push(e) }), sortArrayByValues(a, "name") },
    appendMatchingItems = function(a, i, t) {
        console.dir(arguments), 0 < t.length ? $.each(t, function(t, e) {
            var n = sortArrayByValues(e.tags.map(function(t) { return { id: t, name: i.tags[t].name, eventAction: i.tags[t].internal, eventLabel: i.categories[i.tags[t].category].internal } }), "name");
            renderTemplate(a, Templates.tagFilter.teaser, $.extend(e, { linkText: i.linkText, displayTags: n }), "append")
        }) : a.html("<p class='selector-results tag-filter-no-results'><strong>" + i.noResultsText + "</strong></p>")
    },
    getItemsByTagId = function(t, a, i) { if (0 === a.length) return t.concat(); var e = a.reduce(function(t, e) { var n = i[e].category; return isValueInArray(t, n) || t.push(n), t }, []); return t.filter(function(n) { return e.every(function(e) { return a.some(function(t) { return e === i[t].category && isValueInArray(n.tags, t) }) }) }) },
    setUrlHashFilterActive = function(t, a) { $.each(t, function(t, e) { var n = a.find('[name="' + t + '"]'); "selected" === e && (n.trigger("click"), n.parentsUntil("js-tag-filter-category").children("[data-toggler]").attr("aria-expanded", "true"), n.parentsUntil("js-tag-filter-category").children("[data-toggler-target]").attr("aria-expanded", "true").show()) }) },
    initTagFilter = function(t, e) {
        if (!(t && e && e.categories && e.tags && e.items)) return !1;

        function r() { v = (p = 1) * h }

        function l(t) { a.empty(), appendMatchingItems(a, { categories: c, tags: d, linkText: s, noResultsText: u }, getFirstNEntriesOfArray(getItemsByTagId(o, f, d), t)) }
        var n = t.find(".js-tag-filter-categories"),
            a = t.find(".js-tag-filter-results"),
            i = t.find(".js-tag-filter-reset"),
            c = e.categories,
            d = e.tags,
            o = e.items,
            s = e.linkText,
            u = e.noResultsText,
            h = e.loadAmount,
            f = [],
            p = 0,
            v = 0,
            g = 10 * Math.round(o.length / 10),
            m = hashParams(window.location.hash).getAll();
        return $.each(c, function(o, s) {
            var t = getFilterTagsForCategoryById(d, o),
                e = 0 === Object.keys(c).indexOf(o);
            renderTemplate(n, Templates.tagFilter.category, $.extend(s, { first: e }), "append"), $.each(t, function(t, e) {
                var n = e.fsid,
                    a = e.name.toLowerCase().replace(/ /g, "_"),
                    i = a + "=selected;";
                renderTemplate($(".js-tag-filter[data-category=" + o + "]"), Templates.tagFilter.filter, $.extend(e, { filterNameAttr: a, eventLabel: s.internal }), "append"), $("[data-filter-id=" + n + "]").on("click", function(t) {
                    var e = $(t.currentTarget);
                    e.prop("checked") && !isValueInArray(f, n) ? (f.push(n), addNewValueToUrlHash(i), dataLayer.push({ event: "customEvent", eventInfo: { category: e.closest("[data-event-category]").data("event-category"), label: e.data("event-label"), action: e.data("event-action") } })) : (removeValueFromArray(f, n), removeValueFromUrlHash(i)), r(), l(h)
                })
            })
        }), e.loadMore && $(document).on("scroll", function t() { a.children().last().offset().top <= $(window).scrollTop() + $(window).height() && v <= g && (l(v), v = ++p * h), window.requestAnimationFrame(t) }), i.on("click", function() { n.find(".js-tag-filter-item").prop("checked", !1), f = [], r(), l(h), resetCurrentHashedUrl() }), r(), l(h), setUrlHashFilterActive(m, n), $(document).on("click", ".teaser__tag", function(t) {
            var e = t.currentTarget,
                n = $(e);
            e.hasAttribute("data-event-label") && e.hasAttribute("data-event-action") && dataLayer.push({ event: "customEvent", eventInfo: { category: n.closest("[data-event-category]").data("event-category") + " Click", label: n.data("event-label"), action: n.data("event-action") } })
        }), !0
    };
! function(y) {
    function k(t, e, n) { return n.indexOf(t) === e } y(document).on("ready", function() {
        y(function() {
            var a = "VIEW CART",
                c = y("table.cart-list"),
                d = y(".hint-message"),
                u = c,
                g = { "icon-check": '<svg xmlns="http://www.w3.org/2000/svg"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-check" /></svg>', "icn-add-to-fav": '<svg xmlns="http://www.w3.org/2000/svg"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-fav" /></svg>', "icn-add-to-cart": '<svg xmlns="http://www.w3.org/2000/svg"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-cart" /></svg>' };

            function m() {
                var t = y(".cart-actions .button").data("cart");
                y(".cart-actions .button").attr("href", t + "&cart-request=" + encodeURIComponent(JSON.stringify(y(".cart-list > tbody > tr").toArray().map(function(t) { return { SAPMaterialID: y(t).data("sapmaterialid"), Model: y(t).data("model"), Quantity: y(t).data("quantity"), Config: y(t).data("config"), Timestamp: y(t).data("timestamp"), Productgroupinterest: y(t).data("productgroupinterest"), Productline: y(t).data("productline"), Interfaceinterest: y(t).data("interfaceinterest") || "" } }))))
            }

            function w(t) {
                var e = t || "";
                console.info("getResultData() ", e);
                var n = JSConf.javascript.viewCartResultJSON;
                y.ajax({ data: JSON.stringify(e), dataType: "json", url: n, type: "post" }).done(function(t) {
                    0;
                    var e, n, a, i, o = [],
                        h = !1,
                        f = [],
                        p = !1,
                        v = [],
                        s = "",
                        r = "",
                        l = "";
                    return y.each(t, function(t, d) {
                        var u = "";
                        if (u += "<thead>", u += "<tr>", u += "<th data-type='html' data-breakpoints='xs'>" + d.TH_IMAGE + "</th>", u += "<th data-type='html'>" + (d.TH_DESCRIPTION && d.TH_DESCRIPTION.length ? d.TH_DESCRIPTION : d.TH_ACCESSORY_TITLE || "") + "</th>", u += "<th data-type='html'>" + d.TH_COUNT + "</th>", u += "<th data-type='html' data-breakpoints='xs'>" + d.TH_AVAILABLE + " <span data-v-offset='15' data-h-offset='15' aria-haspopup='true' class='more-info' data-disable-hover='false' tabindex='1' title='" + d.TH_AVAILABLE_TOOLTIP + "'>i</span></th>", u += "<th data-type='html'><span class='show-for-small-only'>" + d.TH_FUNCTIONS + "</span></th>", u += "</tr>", u += "</thead>", u += "<tbody>", y.each(d.TABLEROWS, function(t, e) {
                                e.hasOwnProperty("TD_PRODUCT_SERIES") && "Basler dart" == e.TD_PRODUCT_SERIES && e.TD_PRODUCT_COUNT < 5 && (h = !0, f.push(e.TD_PRODUCT_TITLE)), "" !== e.TD_AVAILABLE && (p = !0, v.push(e.TD_PRODUCT_TITLE));
                                var n, a, o, i, s, r, l, c = "<tr data-sapmaterialid='" + e.TD_PRODUCT_ORDERNUMBER + "' data-model='" + e.TD_PRODUCT_TITLE + "' data-quantity='" + e.TD_PRODUCT_COUNT + "' data-productgroupinterest='" + (e.TD_PRODUCT_SERIES || e.TD_PRODUCT_TYPE) + "' data-productline='" + e.TD_PRODUCT_LINE + (e.hasOwnProperty("TD_PRODUCT_INTERFACE") ? "' data-interfaceinterest='" + e.TD_PRODUCT_INTERFACE + "'>" : "'>");
                                u += c, u += "<td>", u += "<div class='image-container'>", u += "<a href='" + e.TD_PRODUCT_URL + "'>", u += "<img src='" + e.TD_PRODUCT_IMAGE_URL + "' alt='" + e.TD_PRODUCT_TITLE + "'>", u += "</a>", u += "</div>", u += "</td>", u += "<td>", u += "<h5>" + e.TD_PRODUCT_TITLE + "</h5>", u += e.TD_PRODUCT_TEXT && e.TD_PRODUCT_TEXT.length ? "<p>" + e.TD_PRODUCT_TEXT + "</p>" : "", e.hasOwnProperty("TD_PRODUCT_SIMILER_URL_TEXT") ? (u += "<a href='" + e.TD_PRODUCT_URL + "' class='divider'>" + e.TD_PRODUCT_URL_TEXT + "</a>", u += "<a no-href='' data-product-id='" + e.TD_PRODUCT_ID + "' id='" + e.TD_PRODUCT_ID + "' class='show-similar'><span class='text-show-similar'>" + e.TD_PRODUCT_SIMILER_URL_TEXT + "</span><span class='text-hide-similar'>" + e.TD_PRODUCT_HIDESIMILER_URL_TEXT + "</span></a>") : u += "<a href='" + e.TD_PRODUCT_URL + "'>" + e.TD_PRODUCT_URL_TEXT + "</a>", "Vision Components Bundles" === e.TD_PRODUCT_TYPE && (u += (n = d, a = e, o = y("<ul/>").addClass("vcb_shortOverview"), i = y("<table/>").addClass("vcb_shortOverviewList").append(y("<thead/>").append(y("<tr/>").append(y("<th/>").addClass("title").text(n.TH_VCB_OVERVIEW_HEADLINE))), y("<tbody/>").append(y("<tr/>").append(y("<td/>").append(o)))), s = a.TD_VCB_COMPONENTLIST.filter(function(t) { return t && t.TD_COMPONENT_TYPE && t.TD_COMPONENT_TYPE.length }).map(function(t) { return t.TD_COMPONENT_TYPE }), r = a.TD_VCB_COMPONENTLIST, l = s && s.length ? s.filter(k) : [], y.each(l, function(t, e) {
                                    var n, a = r.filter(function(t) { return t.TD_COMPONENT_TYPE === e }),
                                        i = y("<li/>").append(y("<strong/>").text([e, ":"].join("")));
                                    1 === a.length && i.append(y("<span/>").addClass("vcb_componentName").text(a[0].TD_COMPONENT_NAME)), 2 <= a.length && (n = y("<ul/>").appendTo(i), y.each(a, function(t, e) { n.append(y("<li/>").text(e.TD_COMPONENT_NAME)) })), o.append(i)
                                }), i[0].outerHTML)), u += "</td>", u += "<td>", u += "<div class='increment-input update-cart' data-product-id='" + e.TD_PRODUCT_ID + "'>", u += "<input class='amount' min='1' max='999' type='number' value='" + e.TD_PRODUCT_COUNT + "'>", u += "</div>", u += "</td>", "" !== e.TD_AVAILABLE ? u += "<td>" + e.TD_AVAILABLE + "</td>" : u += "<td><div class='icon-check'><svg><use xlink:href='#icon-check' /></svg></div></td>", u += "<td>", u += "<div class='delete-icon'  data-product-id='" + e.TD_PRODUCT_ID + "'>", u += "</div>", u += "</td>", u += "</tr>", y.cookie("expanded_product") == e.TD_PRODUCT_ID && (u += "<tr class='similar-prod-row'><td height='240'></td><td height='240'><img class='loader' src='https://www.baslerweb.com/baslermedia/china_pardot_forms/spinner.gif' width='180'/></td><td height='240'></td><td height='240'></td><td height='240'></td></tr>")
                            }), u += "</tbody>", o.push(u), s = "<h3>" + d.TH_HINT + "</h3><p>", l = "</p>", h && 0 < f.length) {
                            if (1 < f.length) { r += d.TH_HINT_ORDERCAMERALIST + "&nbsp;"; for (var e = 0; e <= f.length - 1; e++) r += f[e], e < f.length - 1 && (r += ", ") } else r += d.TH_HINT_ORDERCAMERA + "&nbsp;", r += f[0];
                            r += "&nbsp;" + d.TH_HINT_ORDERSIZE
                        }
                        if (p && 0 < v.length) {
                            if ("" !== r && (r += "<br/><br/>"), r += d.TH_HINT_AVAILABLE, 1 < v.length)
                                for (var n = 0; n <= v.length - 1; n++) r += v[n], n < v.length - 1 && (r += ", ");
                            else r += "<br/>" + v[0];
                            r += "<br/>" + d.TH_HINT_AVAILABLE_ADDITIONAL
                        }
                    }), u.empty().append(o), y(".increment-input.update-cart").each(function() {
                        var t = y('<div class="plus"></div>').appendTo(this),
                            e = y('<div class="minus"></div>').appendTo(this),
                            n = y(this).find("input");
                        y(n).wrap("<div class='input-wrapper'></div>"), t.on("click", function() { n.val(parseInt(1 + ~~n.val())), updateProduct(y(this).parent(".update-cart").data("product-id"), y(this).parent().find("input").val(), function(t) { t && (w(), flashIcon("basket", 500), updateStickyNavCartIcon()) }) }), e.on("click", function() { n.val(parseInt(1 < ~~n.val() ? ~~n.val() - 1 : 1)), updateProduct(y(this).parent(".update-cart").data("product-id"), y(this).parent().find("input").val(), function(t) { t && (w(), flashIcon("basket", 500), updateStickyNavCartIcon()) }) })
                    }), y(".cart-list .amount").each(function() {
                        y(this).val() <= 1 && y(this).val("1"), y(this).change(function(t) { y(this).val() <= 1 && y(this).val("1") }), y(this).blur(function(t) {
                            var e = y(this).parents(".update-cart").data("product-id"),
                                n = y(this).val();
                            console.log(e), console.log(n), console.log("ENDE"), updateProduct(e, n, function(t) { t && (w(), flashIcon("basket", 500), updateStickyNavCartIcon()) })
                        })
                    }), 0 < d.length && ("" === r ? d.css("display", "none") : d.empty().append(s + r + l)), y(".show-similar").on("click", function() {
                        var t = y(this).data("product-id"),
                            e = y(this).closest("tr");
                        y(".show-similar").not(this).removeClass("close-similar"), y(this).hasClass("close-similar") ? (c.find(".similar-prod-row").remove(), y(this).removeClass("close-similar")) : (b(t, e), y(this).addClass("close-similar"))
                    }), y(".delete-icon").on("click", function() {
                        var t = y(this).data("product-id");
                        console.log("deleteFromList delete-icon click event"), _deleteProduct("basket", t, function(t) { t && (w(), flashIcon("basket", 500)) })
                    }), c.find(".update-cart").on("change", function() { updateProduct(y(this).data("product-id"), y(this).parent().find("input").val(), function(t) { t && (w(), updateProductIcons()) }) }), c.find(".more-info").each(function() { y(this).attr("data-tooltip", "").addClass("has-tip") }), c.on({ "ready.ft.table": function() { console.info("ready.ft.table"), c.find(".icon-check").each(function() { y(this).html(g[this.className]) }), console.info("view-cart.js - appWrapper.on -> updateProductIcons()"), updateProductIcons() } }).footable(), y(".cart-actions .button").click(function(t) { return t.preventDefault(), !y(this).hasClass("disabled") && void(window.location.href = y(this).attr("href")) }), m(), y(".cart-list tbody tr:first-child").hasClass("footable-empty") ? (y(".no-result.carthint").show(), y(".cart-actions .button").addClass("disabled"), y(".cart-info").hide(), y(".cart-actions .button").attr("disabled", !0).off().on("click", function(t) { t.preventDefault(), t.stopImmediatePropagation() })) : (y(".no-result.carthint").hide(), y(".cart-actions .button").removeClass("disabled"), y(".cart-info").show(), y(".cart-actions .button").attr("disabled", !1)), 15 < y(".cart-list tbody tr").length ? (y(".tomuch").show(), y(".cart-actions .button").addClass("disabled")) : (y(".tomuch").hide(), y(".cart-actions .button").removeClass("disabled")), y.cookie("expanded_product") && (e = "#" + y.cookie("expanded_product"), n = y(".cart-list").find(e), a = n.data("product-id"), i = n.closest("tr"), n.addClass("close-similar"), setTimeout(function() { b(a, i) }, 1e3)), !0
                }).fail(function(t, e, n) { return console.error(a, e, t.status, n), !1 })
            }

            function b(s, r) {
                var t = s || "";
                console.info("getSimilarProducts() ", t);
                var e = JSConf.javascript.viewCartSimilarProductsResultJSON;
                y.ajax({ data: JSON.stringify(t), dataType: "json", url: e, type: "post" }).done(function(t) {
                    var e = r,
                        n = [];
                    y.each(t, function(t, e) {
                        var o = "";
                        o += "<tr class='similar-prod-row' style='display: none'>", o += "<td colspan='5'>", o += "<div class='row' data-equalizer data-equalize-by-row='true'>", o += "<h3>" + e.RESULT_HEADING + "</h3>", y.each(e.ITEMS, function(t, e) {
                            var n = "";
                            e.ITEM_ACTIVE || (n = " disabled"), o += "<div class='product-teaser" + n + "' data-equalizer-watch>", o += "    <div class='inner'>", o += "        <figure class='text-center'>", o += "            <a href='" + e.PRODUCT_URL + "' alt='" + e.PRODUCT_NAME + "'><img src=" + e.FIGURE_THUMB_URL + " alt='" + e.PRODUCT_NAME + "'>", e.OVERLAY && (o += "<div class='overlay'>", o += "    <img src='" + e.OVERLAY + "' alt=''>", o += "</div>"), o += "            </a>", o += "        </figure>", o += "        <div class='top-bar'>", e.PRODUCT_LINERATE && (o += "        <div class='text small'>" + e.PRODUCT_LINERATE + "</div>"), o += "        <div class='text'><a href='" + e.PRODUCT_URL + "'>" + e.PRODUCT_SPECIFICATION + "</span></a></div>", o += "            <div class='top-bar-left'>", o += "            <a class='more'>" + e.PRODUCT_MORETEXT + "</a>", (e.DETAILS_WARNING_1 || e.DETAILS_WARNING_2 || e.DETAILS_WARNING_3) && (o += "<svg class='icon warning'><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-warning'></use></svg>"), o += "            </div>";
                            var a = "";
                            e.PRODUCT_IS_ON_CART && (a = "-filled");
                            var i = "";
                            e.PRODUCT_IS_ON_CART && (i = "-filled"), o += "            <div class='top-bar-right'>", o += "                 <div class='icn-add-to-cart grow' data-product-id='" + e.ITEM_ID + "'>", o += "                    <svg><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-cart" + a + "' /></svg>", o += "                </div>", o += "                <div class='icn-add-to-fav grow'  data-product-id='" + e.ITEM_ID + "'>", o += "                    <svg><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-fav" + i + "' /></svg>", o += "                </div>", o += "            </div>", o += "        </div>", o += "        <section class='product-teaser-details'>", o += "            <figure><a href=" + e.PRODUCT_URL + "><img src=" + e.FIGURE_THUMB_URL + " alt='" + e.PRODUCT_NAME + "'></a></figure>", o += "            <article class='table-wrapper'>", y.each(e.DETAILS_TABLES, function(t, e) { e.hasOwnProperty("HEADLINE") ? o += "<table><thead><tr><th colspan='2'>" + e.HEADLINE + "</th></tr></thead><tbody>" : o += "<table><tbody>", y.each(e.CONTENT, function(t, e) { o += "<tr><td>" + t + "</td><td>" + e + "</td></tr>" }), o += "</tbody></table>" }), e.DETAILS_WARNING_1 && (o += "            <div class='warning res limitedRes'><svg class='icon warning'><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-warning'></use></svg>" + e.DETAILS_WARNING_1 + "</div>"), e.DETAILS_WARNING_2 && (o += "            <div class='warning res poorRes'><svg class='icon warning'><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-warning'></use></svg>" + e.DETAILS_WARNING_2 + "</div>"), e.DETAILS_WARNING_3 && (o += "            <div class='warning res vignetting'><svg class='icon warning'><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-warning'></use></svg>" + e.DETAILS_WARNING_3 + "</div>"), o += "            </article>", o += "            <div class='top-bar'>", o += "                <a href='#'>" + e.PRODUCT_URL_NAME + "</a>", o += "                <a class='link-add-to-fav' data-product-id='" + e.ITEM_ID + "'><svg class='icon grow'><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-fav" + i + "'></use></svg>" + e.PRODUCT_FAVOURITE_NAME + "</a>", o += "                <a class='orange link-add-to-cart' data-product-id='" + e.ITEM_ID + "'><svg class='icon grow orange'><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-cart" + a + "'></use></svg>" + e.PRODUCT_BASKET_NAME + "</a>", o += "            </div>", o += "        </section>", o += "    </div>", o += "</div>"
                        }), o += "</div>", o += "</td></tr>", n.push(o)
                    });
                    var a, i, o = c.find(".similar-prod-row");
                    return y.cookie("expanded_product") == s && o.length ? (a = 1500, o.replaceWith(n)) : (a = 1500, o.remove(), e.after(n)), c.find(".similar-prod-row").show(a).foundation(), updateProductIcons(), e.find(".icn-add-to-cart").on("click", function() {
                        var t = y(this).data("product-id");
                        isFilled(y(this)) ? _deleteProduct("basket", t, function(t) { t && (flashIcon("basket", 500), updateProductIcons()) }) : addProduct("basket", t, function(t) { t && (flashIcon("basket", 500), updateProductIcons()) })
                    }), e.find(".icn-add-to-fav").on("click", function() {
                        var t = y(this).data("product-id");
                        isFilled(y(this)) ? _deleteProduct("compare", t, function(t) { t && (flashIcon("compare", 500), updateProductIcons()) }) : addProduct("compare", t, function(t) { t && (flashIcon("compare", 500), updateProductIcons()) })
                    }), y.cookie("expanded_product", s, { path: "/" }), productTeaserInit(), (i = c).find(".item.disabled").each(function() { y(this).find("a").each(function() { y(this).on("click touchend", function(t) { return t.preventDefault(), !1 }) }) }), i.find(".icn-add-to-cart").on("click", function() {
                        var t = y(this).data("product-id");
                        isFilled(y(this)) ? _deleteProduct("basket", t, function(t) { t && (w(), flashIcon("basket", 500), updateProductIcons()) }) : addProduct("basket", t, function(t) { t && (w(), flashIcon("basket", 500), updateProductIcons()) })
                    }), i.find(".icn-add-to-fav").on("click", function() {
                        var t = y(this).data("product-id");
                        isFilled(y(this)) ? _deleteProduct("compare", t, function(t) { t && (w(), flashIcon("compare", 500), updateProductIcons()) }) : addProduct("compare", t, function(t) { t && (w(), flashIcon("compare", 500), updateProductIcons()) })
                    }), productTeaserInit(), !0
                }).fail(function(t, e, n) { return console.error(a, e, t.status, n), !1 })
            }
            y.cookie("expanded_product", "", { path: "/" }), c.length && (console.info(a), y(".show-similar").on("click", function(t) {
                var e = y(t.currentTarget),
                    n = e.data("product-id"),
                    a = e.closest("tr");
                e.hasClass("close-similar") ? c.find(".similar-prod-row").remove() : b(n, a), e.parents("tbody").find(".show-similar").not(this).removeClass("close-similar"), e.toggleClass("close-similar")
            }), y(".delete-icon").on("click", function() { console.log("delete from list 2!!!!"), _deleteProduct("basket", y(this).data("product-id"), function(t) { t && (w(), flashIcon("basket", 500)) }) }), c.find(".update-cart").on("change", function() { updateProduct(y(this).data("product-id"), y(this).parent().find("input").val(), function(t) { t && (w(), updateProductIcons()) }) }), y(".cart-actions .button").click(function(t) { return t.preventDefault(), !y(this).hasClass("disabled") && void(window.location.href = y(this).attr("href")) }), y(window).on("closed.zf.reveal", function() { w() }), c.find(".more-info").each(function() { y(this).attr("data-tooltip", "").addClass("has-tip") }), c.on({ "ready.ft.table": function() { console.info("ready.ft.table"), c.find(".icon-check").each(function() { y(this).html(g[this.className]) }), console.info("view-cart.js - appWrapper.on -> updateProductIcons()"), updateProductIcons() } }).footable(), m(), y(".increment-input.update-cart").each(function() {
                var t = y('<div class="plus"></div>').appendTo(this),
                    e = y('<div class="minus"></div>').appendTo(this),
                    n = y(this).find("input");
                y(n).wrap("<div class='input-wrapper'></div>"), t.on("click", function() { n.val(parseInt(1 + ~~n.val())), updateProduct(y(this).parent(".update-cart").data("product-id"), y(this).parent().find("input").val(), function(t) { t && (w(), flashIcon("basket", 500), updateStickyNavCartIcon()) }) }), e.on("click", function() { n.val(parseInt(1 < ~~n.val() ? ~~n.val() - 1 : 1)), updateProduct(y(this).parent(".update-cart").data("product-id"), y(this).parent().find("input").val(), function(t) { t && (w(), flashIcon("basket", 500), updateStickyNavCartIcon()) }) })
            }), y(".cart-list .amount").each(function() {
                y(this).val() <= 1 && y(this).val("1"), y(this).change(function(t) { y(this).val() <= 1 && y(this).val("1") }), y(this).blur(function(t) {
                    var e = y(this).parents(".update-cart").data("product-id"),
                        n = y(this).val();
                    console.log(e), console.log(n), console.log("ENDE"), updateProduct(e, n, function(t) { t && (w(), flashIcon("basket", 500), updateStickyNavCartIcon()) })
                })
            }), y(".cart-list tbody tr:first-child").hasClass("footable-empty") ? (y(".no-result.carthint").show(), y(".cart-actions .button").addClass("disabled"), y(".cart-info").hide(), y(".cart-actions .button").attr("disabled", !0).off().on("click", function(t) { t.preventDefault(), t.stopImmediatePropagation() })) : (y(".no-result.carthint").hide(), y(".cart-actions .button").removeClass("disabled"), y(".cart-info").show(), y(".cart-actions .button").attr("disabled", !1)), 15 < y(".cart-list tbody tr").length ? (y(".tomuch").show(), y(".cart-actions .button").addClass("disabled")) : (y(".tomuch").hide(), y(".cart-actions .button").removeClass("disabled"))), y(".cart-list tbody tr:first-child").hasClass("footable-empty") ? (y(".no-result.carthint").show(), y(".cart-info").hide(), y(".cart-actions .button").addClass("disabled")) : (y(".no-result.carthint").hide(), y(".cart-actions .button").removeClass("disabled"), y(".cart-info").show(), y(".cart-actions .button").attr("disabled", !1)), 15 < y(".cart-list tbody tr").length ? (y(".tomuch").show(), y(".cart-actions .button").addClass("disabled")) : (y(".tomuch").hide(), y(".cart-actions .button").removeClass("disabled"))
        })
    })
}(jQuery),
function(c) {
    c(document).on("ready", function() {
        c(function() {
            var s, i = "WATCHLIST",
                t = c("table.watch-list"),
                e = c("div.cart-actions"),
                r = { "icon-check": '<svg xmlns="http://www.w3.org/2000/svg"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-check" /></svg>', "icn-add-to-fav": '<svg xmlns="http://www.w3.org/2000/svg"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-fav" /></svg>', "icn-add-to-cart": '<svg xmlns="http://www.w3.org/2000/svg"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-cart" /></svg>' };

            function l(t, a) {
                var e = t || "",
                    n = JSConf.javascript.compareFavouritesResultJSON;
                c.ajax({ data: JSON.stringify(e), dataType: "json", url: n, type: "post" }).done(function(t) { s = t, "function" == typeof a && a(!0) }).fail(function(t, e, n) { console.error(i, e, t.status, n), "function" == typeof a && a(!1) })
            }
            t.length && (e.each(function() {
                c(this).find(".add-group-to-cart").on("click", function() {
                    var t = c(this).data("table-id");
                    console.info("appButton tableId" + t);
                    var e = jQuery.parseJSON('{ "TABLE_ID": "' + t + '"}'),
                        n = [];
                    l(e, function(t) {
                        var e;
                        t && (c.each(s.TABLEROWS, function(t, e) { n.push(e.TD_PRODUCT_ID) }), addProductList("basket", e = n, function(t) { t && (console.info("addProductList " + e), flashIcon("basket", 500), updateProductIcons()) }))
                    })
                })
            }), t.each(function() {
                var t, e = c(this),
                    n = c(this).data("table-id"),
                    a = jQuery.parseJSON('{ "TABLE_ID": "' + n + '"}');
                c(this).find(".delete-icon").on("click", function() {
                    console.log("delte from list delete-icon click event in appWrapper $('table.watch-list');"), _deleteProduct("compare", c(this).data("product-id"), function(t) {
                        t && (l(a, function(t) {
                            t && ! function e(n) {
                                var t = n.data("table-id");
                                var a = jQuery.parseJSON('{ "TABLE_ID": "' + t + '"}');
                                var i = [];
                                var o = "";
                                o += "<thead>";
                                o += "<tr>";
                                o += "<th data-type='html' data-breakpoints='xs'>" + s.TH_IMAGE + "</th>";
                                o += "<th data-type='html'>" + (rowData.TH_MODEL && rowData.TH_MODEL.length ? rowData.TH_MODEL : rowData.TH_ACCESSORY_TITLE || "") + "</th>";
                                o += "<th data-type='html' data-breakpoints='xs sm'>" + s.TH_1 + "</th>";
                                s.hasOwnProperty("TH_2") && (o += "<th data-type='html' data-breakpoints='xs sm'>" + s.TH_2 + "</th>");
                                s.hasOwnProperty("TH_3") && (o += "<th data-type='html' data-breakpoints='xs sm'>" + s.TH_3 + "</th>");
                                s.hasOwnProperty("TH_4") && (o += "<th data-type='html' data-breakpoints='xs sm'>" + s.TH_4 + "</th>");
                                s.hasOwnProperty("TH_5") && (o += "<th data-type='html' data-breakpoints='xs sm'>" + s.TH_5 + "</th>");
                                s.hasOwnProperty("TH_6") && (o += "<th data-type='html' data-breakpoints='xs'>" + s.TH_6 + "<span data-tooltip data-v-offset='15' data-h-offset='15' aria-haspopup='true' class='more-info has-tip' data-disable-hover='false' tabindex='1' title='" + s.TH_6_HINT + "'>i</span></th>");
                                o += "<th data-type='html'></th>";
                                o += "<th data-type='html'></th>";
                                o += "</tr>";
                                o += "</thead>";
                                o += "<tbody>";
                                c.each(s.TABLEROWS, function(t, e) {
                                    o += "<tr class='product-item'>", o += "<td><div class='image-container'>", o += "<a href='" + e.TD_PRODUCT_URL + "'>", o += "<img src='" + e.TD_PRODUCT_IMAGE_URL + "' alt='" + e.TD_PRODUCT_TITLE + "'>", o += "</a>", o += "</div></td>", o += "<td>", o += "<h5>" + e.TD_PRODUCT_TITLE + "</h5>", o += "<p>" + e.TD_PRODUCT_TEXT + "</p>", o += "<a href='" + e.TD_PRODUCT_URL + "'>" + e.TD_PRODUCT_URL_TEXT + "</a>", o += "</td>", o += "<td>" + e.TD_1 + "</td>", e.hasOwnProperty("TD_2") && (o += "<td>" + e.TD_2 + "</td>"), e.hasOwnProperty("TD_3") && (o += "<td>" + e.TD_3 + "</td>"), e.hasOwnProperty("TD_4") && (o += "<td>" + e.TD_4 + "</td>"), e.hasOwnProperty("TD_5") && (o += "<td>" + e.TD_5 + "</td>"), e.hasOwnProperty("TD_6") && (o += "<td>", e.hasOwnProperty("TD_6_DESIGN_SAMPLE") && (o += e.TD_6_DESIGN_SAMPLE + "<br />"), e.hasOwnProperty("TD_6_SERIES_PRODUCTION") && (o += e.TD_6_SERIES_PRODUCTION), e.hasOwnProperty("TD_6_DISCONTINUATION") && (o += e.TD_6_DISCONTINUATION), e.hasOwnProperty("TD_6_AVAILABLE") && !0 === e.TD_6_AVAILABLE && (o += "<div class='icon-check'><svg><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-check'></use></svg></div>"), o += "</td>"), o += "<td>";
                                    var n = "";
                                    e.TD_IS_ON_CART && (n = "-filled"), o += "<div class='icn-add-to-cart' data-product-id='" + e.TD_PRODUCT_ID + "'>", o += "<svg class='grow'>", o += "<use xlink:href='#icon-cart" + n + "'/>", o += "</svg>", o += "</div></td>", o += "<td><div class='delete-icon' data-product-id='" + e.TD_PRODUCT_ID + "'></div></td>", o += "</tr>"
                                });
                                o += "</tbody>";
                                i.push(o);
                                n.empty().append(i);
                                n.find(".delete-icon").on("click", function() {
                                    console.log("delete from list click event .delete-icon in table selector");
                                    var t = c(this).data("product-id");
                                    _deleteProduct("compare", t, function(t) { t && (l(a, function(t) { t && e(n) }), flashIcon("compare", 500), updateProductIcons()) })
                                });
                                n.find(".icn-add-to-cart").on("click", function() {
                                    var t = c(this).data("product-id");
                                    isFilled(c(this)) ? _deleteProduct("basket", t, function(t) { t && (flashIcon("basket", 500), updateProductIcons()) }) : addProduct("basket", t, function(t) { t && (flashIcon("basket", 500), updateProductIcons()) })
                                });
                                n.find(".more-info").each(function() { c(this).attr("data-tooltip", "").addClass("has-tip") });
                                n.on({ "ready.ft.table": function(t, e) { console.info("ready.ft.table"), n.find(".icon-check").each(function() { c(this).html(r[this.className]) }), n.find(".icn-add-to-cart").each(function() { c(this).html(r[this.className]) }), console.info("view-cart.js - appWrapper.on -> updateProductIcons()"), updateProductIcons() } }).footable();
                                n.find(".footable-empty").length && (t = n.data("table-id"), n.parent().css("display", "none"), n.parent().prev().css("display", "none"), n.parent().next().css("display", "none"));
                                updateProductIcons()
                            }(e)
                        }), flashIcon("compare", 500))
                    })
                }), c(this).find(".icn-add-to-cart").on("click", function() {
                    var t = c(this).data("product-id");
                    isFilled(c(this)) ? _deleteProduct("basket", t, function(t) { t && (flashIcon("basket", 500), updateProductIcons()) }) : addProduct("basket", t, function(t) { t && (flashIcon("basket", 500), updateProductIcons()) })
                }), (t = c(this)).find(".more-info").each(function() { c(this).attr("data-tooltip", "").addClass("has-tip") }), t.on({ "ready.ft.table": function() { console.info("ready.ft.table"), t.find(".icon-check").each(function() { c(this).html(r[this.className]) }), t.find(".icn-add-to-cart").each(function() { c(this).html(r[this.className]) }), console.info("view-cart.js - appWrapper.on -> updateProductIcons()"), updateProductIcons() } }).footable(), c(this).find(".footable-empty").length && (c(this).data("table-id"), c(this).parent().css("display", "none"), c(this).parent().prev().css("display", "none"), c(this).parent().next().css("display", "none"))
            }), c("table.watch-list:visible").length ? c(".no-result.watchlisthint").hide() : c(".no-result.watchlisthint").show()), c("table.watch-list:visible").length ? c(".no-result.watchlisthint").hide() : c(".no-result.watchlisthint").show()
        })
    })
}(jQuery), "function" != typeof Object.assign && Object.defineProperty(Object, "assign", {
    value: function(t, e) {
        if (null == t) throw new TypeError("Cannot convert undefined or null to object");
        for (var n = Object(t), a = 1; a < arguments.length; a++) {
            var i = arguments[a];
            if (null != i)
                for (var o in i) Object.prototype.hasOwnProperty.call(i, o) && (n[o] = i[o])
        }
        return n
    },
    writable: !0,
    configurable: !0
});
var JSCustom = { version: ".:DEPLOYMENTVERSION:." };
$.get(JSConf.javascript.svgPATH, function(t) {
    var e = document.createElement("div");
    e.innerHTML = (new XMLSerializer).serializeToString(t.documentElement), document.body.insertBefore(e, document.body.childNodes[0])
});
var addDownloadLinkClickHandler = function(t) {
        var e = t,
            n = e.data("category"),
            a = (a = e.data("document")).replace(/\+/g, " "),
            n = n.replace(/\+/g, " ");
        dataLayer.push({ event: "customEvent", eventInfo: { category: "Downloads", action: a, label: n } })
    },
    frameOrigin = "https://info.baslerweb.com";

function fn_frameOrigin(t) {
    var e, n, a, i, o, s, r;
    t.origin !== frameOrigin ? (e = $(".plyr__video-wrapper.plyr__video-embed.plyr--setup > iframe"), $(".plyr__video-wrapper.plyr__video-embed.plyr--setup > iframe").parent().parent().prepend(e)) : "string" != typeof t.data || /^\[iFrameSizer\]/g.test(t.data) || ((n = JSON.parse(t.data.toString())).isDownload ? (n.url, a = n.isDownload, i = $("header").attr("id") || "en", a && ($(document).on("click", ".downloadform-list li a, .downloadform-list .linkwrapper", function(t) { addDownloadLinkClickHandler($(t.target)) }), dataLayer.push({ event: "formSent", goalPage: "/downloadform/sent", cgroup2: i }), $(".downloadform-intro").hide(), $(".downloadform-list").fadeIn("slow", function() {
        $(".downloadform-list li a").each(function() {
            var t = $(this).data("src");
            $(this).attr("href", t)
        }), $(".downloadform-list .linkwrapper a").each(function() {
            var t = $(this).data("src");
            $(this).attr("href", t)
        })
    }))) : n.cartsent && (o = JSON.parse(n.cart_items.toString()), s = [], o && (r = 0, $.each(o, function() {
        var t = !1;
        r == o.length - 1 && (t = !0), assembleAndPushCartInfoToDatalayer(this, s, r, t), r++
    })), $.cookie("product_cart", null, { path: "/" }), updateStickyNavCartIcon()))
}

function assembleAndPushCartInfoToDatalayer(i, o, s, r) {
    var l = i.SAPMaterialID,
        c = "",
        c = i.Productline || 0 !== i.Productline.length ? i.Productgroupinterest + " - " + i.Productline : i.Productgroupinterest,
        d = "de",
        t = new XMLHttpRequest;
    t.onreadystatechange = function() {
        var t, a, e, n;
        4 == this.readyState && 200 == this.status && ("OK" == (t = JSON.parse(this.responseText)).state ? (t.data.info.country && (d = t.data.info.country.toLowerCase()), a = 0, e = JSON.stringify({ artNr: l, country_id: d }), n = JSConf.javascript.getPriceJSON, $.ajax({ data: e, dataType: "json", url: n, type: "post" }).done(function(t) {
            var e, n = t.currency;
            t.prices && t.prices[t.pricebook_string] && (e = t.prices[t.pricebook_string], a = e.replace(",", ".")), o[s] = { sku: i.SAPMaterialID, name: i.Model, category: c, quantity: i.Quantity, currency: n, price: a }, r && dataLayer.push({ event: "transactionCompleted", transactionId: (new Date).getTime(), transactionProducts: o })
        }).fail(function(t, e, n) { o[s] = { sku: i.SAPMaterialID, name: i.Model, category: c, quantity: i.Quantity, currency: "-", price: 0 }, r && dataLayer.push({ event: "transactionCompleted", transactionId: (new Date).getTime(), transactionProducts: o }), console.error("ERROR: addProduct()", i, e, t.status, n), "function" == typeof callback && callback(!1) })) : (o[s] = { sku: i.SAPMaterialID, name: i.Model, category: c, quantity: i.Quantity, currency: "-", price: 0 }, r && dataLayer.push({ event: "transactionCompleted", transactionId: (new Date).getTime(), transactionProducts: o })))
    }, t.open("GET", "https://wia.baslerweb.com/", !0), t.timeout = 6e3, t.send()
}

function getAllUrlParams(t) {
    var e = t ? t.split("?")[1] : window.location.search.slice(1),
        n = {};
    if (e)
        for (var a = (e = e.split("#")[0]).split("&"), i = 0; i < a.length; i++) {
            var o, s, r = a[i].split("="),
                l = r[0],
                c = void 0 === r[1] || r[1],
                l = l.toLowerCase();
            "string" == typeof c && (c = c.toLowerCase()), l.match(/\[(\d+)?\]$/) ? (n[o = l.replace(/\[(\d+)?\]/, "")] || (n[o] = []), l.match(/\[\d+\]$/) ? (s = /\[(\d+)\]/.exec(l)[1], n[o][s] = c) : n[o].push(c)) : n[l] ? (n[l] && "string" == typeof n[l] && (n[l] = [n[l]]), n[l].push(c)) : n[l] = c
        }
    return n
}
window.addEventListener ? window.addEventListener("message", function(t) { fn_frameOrigin(t) }, !1) : window.attachEvent && window.attachEvent("onmessage", function(t) { fn_frameOrigin(t) }, !1),
    function(x) {
        x(document).on("ready", function() {
            x("html").removeClass("no-js").addClass("js"), scrollToElement(), removeAccessorieTab(), x(document).foundation(), x("table.related-cameras").each(function() { initializeFootable(x(this), !0) }), x(function() { x(".cookie-message").cookieBar() }), "true" === x.cookie("jobsbar") ? x(".jobsbar").hide() : x(".jobsbar").slideToggle("slow", function() { x(".jobsbar").show(), x.cookie("jobsbar", !1, { path: "/" }) }), x(".jobsbar-close").click(function() { x(".jobsbar").slideToggle("slow", function() { x(".jobsbar").hide(), x.cookie("jobsbar", !0, { path: "/" }) }) }), x(".onlycontent .product-teaser figure > a, .onlycontent .product-teaser .text > a, .onlycontent .product-teaser-details .top-bar > a, .onlycontent .downloads-table a").click(function(t) { t.preventDefault(), window.open(this.href) }), x(".onlycontent .link-add-to-fav, .onlycontent .link-add-to-cart, .onlycontent .icn-add-to-fav, .onlycontent .icn-add-to-cart").hide(), x(".testcamera").click(function(t) {
                var e = x(this).data("src");
                x(this).attr("href", e)
            }), x(function() {
                var e = location.hash;
                x('link[rel="alternate"]').each(function() {
                    var t = x(this).attr("href");
                    t += e, x(this).attr("href", t)
                })
            }), x("[data-rating] .star").on("click", function(t) {
                var e = x(t.currentTarget),
                    n = "selected",
                    a = e.data("rating-index"),
                    i = x(".rating-block"),
                    o = i.find(".rating-block-rating.is-voted").first();
                o.length && e.hasClass("selected") ? (i.find(".star.selected").removeClass("selected"), o.removeClass("is-voted"), x("#rating-index").val(0)) : (e.siblings("." + n).removeClass(n), e.addClass(n).parent().addClass("is-voted"), x("#rating-index").val(a))
            }), x(function() {
                if (x(".webtocase").length) {
                    var t, e = hashParams(location.hash),
                        n = e.getAll();
                    for (var a in n) { "undefined" !== n[a] && n[a] ? n.hasOwnProperty(a) && n[a] && (t = "#" + String(a), x(".webtocase").find(t).val(decodeURIComponent(n[a]))) : e.set(String(a), "") }
                }
            }), x(function() {
                if (x(".pylonfeedback").length) {
                    var t, e = hashParams(location.hash),
                        n = e.getAll();
                    for (var a in n) { "undefined" !== n[a] && n[a] ? n.hasOwnProperty(a) && n[a] && (t = "#" + String(a), x(".pylonfeedback").find(t).val(decodeURIComponent(n[a]))) : e.set(String(a), "") } x("#pylonver").change(function(t) { e.set("pylonver", x(this).val()), location.hash = e.toString() }), x("#os").change(function(t) { e.set("os", x(this).val()), location.hash = e.toString() })
                }
            }), x(function() { x(".productdetail").length && "true" === getAllUrlParams().tabsexpanded && (x(".tabs").hide(), x(".show-on-tabs-expanded").show(), x("#specs").show(), x("#features").show(), x("#dimensions").show()) }), x(".product-addtocart-container .increment-input").each(function() {
                var t = x('<div class="plus"></div>').appendTo(this),
                    e = x('<div class="minus"></div>').appendTo(this),
                    n = x(this).find("input");
                x(n).wrap("<div class='input-wrapper'></div>"), t.on("click", function() { n.val(parseInt(1 + ~~n.val())) }), e.on("click", function() { n.val(parseInt(1 < ~~n.val() ? ~~n.val() - 1 : 1)) })
            }), x(".amount").each(function() { x(this).val() <= 1 && x(this).val("1"), x(this).change(function(t) { x(this).val() <= 1 && x(this).val("1") }) }), x(".shariff").each(function() { this.hasOwnProperty("shariff") || (this.shariff = new Shariff(this)) }), x(function() {
                function t() { var t = navigator.userAgent.toLowerCase(); return -1 != t.indexOf("msie") && parseInt(t.split("msie")[1]) } console.log(navigator.userAgent.toLowerCase()), t() && t() < 10 && x(".ie-message").show(0, function() { x(".iebar").slideToggle("slow") }), x(".iebar-close").click(function() { x(".iebar").slideToggle("slow", function() { x(".ie-message").hide() }) })
            }), x(".industry-solutions li a").click(function() {
                var t;
                x(this).attr("data-campaign") && (t = x(this).data("campaign"), dataLayer.push({ event: "customEvent", eventInfo: { category: "Internal Click", action: t, label: "Homepage" } }))
            }), x(".stage-home li a").click(function() {
                var t;
                x(this).attr("data-campaign") && (t = x(this).data("campaign"), dataLayer.push({ event: "customEvent", eventInfo: { category: "Internal Click", action: t, label: "Homepage" } }))
            }), x("#content-stage li a").click(function() {
                var t;
                x(this).attr("data-campaign") && (t = x(this).data("campaign"), dataLayer.push({ event: "customEvent", eventInfo: { category: "Internal Click", action: t, label: "Contentpage" } }))
            }), x("#sticky-nav #sn-contact a").click(function() {
                x(this).data("campaign");
                dataLayer.push({ event: "customEvent", eventInfo: { category: "Internal Click", action: "phone", label: "Floating Navi" } })
            }), x("#sticky-nav .sn-basket a").click(function() {
                x(this).data("campaign");
                dataLayer.push({ event: "customEvent", eventInfo: { category: "Internal Click", action: "cart", label: "Floating Navi" } })
            }), x("#sticky-nav .sn-compare a").click(function() {
                x(this).data("campaign");
                dataLayer.push({ event: "customEvent", eventInfo: { category: "Internal Click", action: "watchlist", label: "Floating Navi" } })
            }), x("#sticky-nav #sn-tools a").click(function() {
                x(this).data("campaign");
                dataLayer.push({ event: "customEvent", eventInfo: { category: "Internal Click", action: "tools", label: "Floating Navi" } })
            }), x("#sticky-nav #sn-downloads a").click(function() {
                x(this).data("campaign");
                dataLayer.push({ event: "customEvent", eventInfo: { category: "Internal Click", action: "downloads", label: "Floating Navi" } })
            }), x(document).on("click", ".no-form li a", function(t) { addDownloadLinkClickHandler(x(t.target)) }), x(".generate-downloadlinks").click(function() {
                x(".generate-downloadlinks").hide(), x(".downloadform-intro").hide(), x(".downloadform-list").fadeIn("slow", function() {
                    x(".downloadform-list li a").each(function() {
                        var t = x(this).data("src");
                        x(this).attr("href", t), x(this).on("click", function() { addDownloadLinkClickHandler(x(this)) })
                    })
                })
            }), x(function() {
                function a() { 0 !== t.length && (n = "isLarge", x("header.header").hasClass("nav-opened") && x("header.header").removeClass("nav-opened"), "isLarge" == n && ("" !== x("ul.menu").attr("data-accordion-menu") && x("ul.menu").foundation("destroy"), new Foundation.Equalizer(x("ul.menu")))) }
                var t = x(".top-bar > ul"),
                    n = "isLarge";
                x('.firstLevel li:has(".secondLevel")').addClass("hasChildren"), x(".firstLevel a").click(function(t) { t.preventDefault(t), x(this(".secondLevel").addClass("open")) });

                function i() { 0 !== t.length && (n = "isSmall", x("ul.menu").foundation("destroy"), new Foundation.AccordionMenu(t, { slideSpeed: 500, multiOpen: !1 })) }
                var e = Foundation.MediaQuery.current;
                ("small" == e || "medium" == e ? i : a)(), x(window).on("changed.zf.mediaquery", function(t, e, n) { t && ("small" == e || "medium" == e ? i : a)() });
                var o, s = x(".main-navigation .menu > .level1"),
                    r = x(".level2");
                s.mouseover(function() { var t, e; "isLarge" == n && (o && clearTimeout(o), t = x(this).find("> ul"), e = x(this), o = setTimeout(function() { s.removeClass("menu-active"), e.addClass("menu-active"), t.show(), Foundation.reInit("equalizer") }, 350)) }), r.mouseover(function() { "isLarge" == n && o && clearTimeout(o) }), x(s).mouseleave(function() { "isLarge" == n && (o && clearTimeout(o), x(this), o = setTimeout(function() { s.removeClass("menu-active"), r.hide() }, 350)) }), x(r).mouseleave(function() { "isLarge" == n && (o && clearTimeout(o), o = setTimeout(function() { s.removeClass("menu-active"), r.hide() }, 350)) }), x(".mobile-toggler").on("click", function() { x(this).closest(".header").toggleClass("nav-opened"), x(".meta-nav .lang-selector").toggleClass("hideMobile") }), x(".main-navigation .is-accordion-submenu-parent").click(function() { var t; "false" == x(this).attr("aria-expanded") && (t = x(this).find(" > a").attr("href"), window.open(t, "_self")) })
            }), x(function() {
                x(".js-jump").click(function(t) {
                    t.preventDefault();
                    var e = x(this).attr("href");
                    x("html, body").animate({ scrollTop: x(e).offset().top }, 1e3), addLensesResultToButton()
                })
            }), x(function() { x(".has-tip").each(function() { x(this).find("img").length && x(this).css("border-bottom", "none") }) }), x(function() {
                x(document).on("postdraw.ft.table", function(t) { var e = x(t.target).find(".more-info"); "" === e.attr("data-tooltip") ? e.each(function() { new Foundation.Tooltip(x(this)) }) : e.each(function() { x(this).foundation("destroy").unbind(), new Foundation.Tooltip(x(this)) }) }), x("table.responsive-table").each(function() {
                    var t = x(this);
                    t.find(".more-info").each(function() { x(this).attr("data-tooltip", "").addClass("has-tip") });
                    var e = { "icn-add-to-fav": '<svg xmlns="http://www.w3.org/2000/svg"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-fav" /></svg>', "icn-add-to-cart": '<svg xmlns="http://www.w3.org/2000/svg"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-cart" /></svg>', download: '<svg xmlns="http://www.w3.org/2000/svg"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-download" /></svg>', mail: '<svg xmlns="http://www.w3.org/2000/svg"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-mail" /></svg>', phone: '<svg xmlns="http://www.w3.org/2000/svg"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-phone" /></svg>', fax: '<svg xmlns="http://www.w3.org/2000/svg"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-fax" /></svg>', globus: '<svg xmlns="http://www.w3.org/2000/svg"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-globus" /></svg>' };
                    t.on({
                        "ready.ft.table": function() {
                            t.find(".icn-add-to-fav").each(function() { x(this).html(e[this.className]) }), t.find(".icn-add-to-cart").each(function() { x(this).html(e[this.className]) }), t.find(".download").each(function() {
                                var t = x(this).html();
                                x(this).html(t)
                            }), t.find(".mail").each(function() {
                                var t = x(this).html();
                                x(this).html(t)
                            }), t.find(".phone").each(function() {
                                var t = x(this).html();
                                x(this).html(t)
                            }), t.find(".globus").each(function() {
                                var t = x(this).html();
                                x(this).html(t)
                            }), updateProductIcons()
                        }
                    }).footable()
                })
            }), x("select:not(.noSelectric)").not(".lens-selector select, #regionSelect, #countrySelect").selectric({ disableOnMobile: !1, arrowButtonMarkup: '<b class="slc-button">&#x25be;</b>', multiple: { separator: ", ", keepMenuOpen: !0, maxLabelEntries: !1 } }), x(".tabs").on("change.zf.tabs", function() { Foundation.reInit("equalizer") }), x(".accordion-bottom").on("click", function() { x(this).closest("ul").foundation("toggle", x(this).prev()) }), x(function() {
                var t = x(".radio-container input");
                x("form").submit(function() { t.hasClass("is-invalid-input") && x(".radio-legend").addClass("is-invalid"), t.is(":checked") && x(".radio-legend").removeClass("is-invalid") }), x(t.on("change", function() { t.is(":checked") && x(".radio-legend").removeClass("is-invalid") }))
            }), x(function() {
                var t = x("ul.accordion.glossar").find("li.accordion-item[id]");
                x(".glossar__navigation a");
                t.each(function() {
                    var t = "#" + x(this).attr("id");
                    x('.glossar__navigation a[href="' + t + '"]').removeClass("inactive")
                });
                x(".glossar__navigation a").click(function(t) {
                    x(this).hasClass("inactive") ? t.preventDefault() : (t.preventDefault(), function(t, e) {
                        t.preventDefault();
                        var n = e.attr("href");
                        x("html, body").animate({ scrollTop: x(n).offset().top }, 1e3)
                    }(t, x(this)))
                });
                var e = function(t) {
                    for (var e, n = decodeURIComponent(window.location.search.substring(1)).split("&"), a = 0; a < n.length; a++)
                        if ((e = n[a].split("="))[0] === t) return void 0 === e[1] || e[1]
                }("glossaritem"); - 1 < window.location.href.indexOf("?glossaritem=") && (x("html, body").animate({ scrollTop: x("#" + e).offset().top }, 1e3), x(".accordion.glossar .accordion-item[data-title=" + e + "]").addClass("is-active").attr("aria-expanded", !0).attr("aria-selected", !0).children(".accordion-content").attr("aria-hidden", !1).show())
            }), x(".tabs-title").on("click", function() { x(this).closest("ul").toggleClass("open") }), x(".expand-filter-mobile").on("click", function() { x(this).prev().toggle(), x(this).toggleClass("open").next().toggle() }), x(".products-filter .selectric li").on("click", function() { x(".expand-filter-mobile").removeClass("open"), x(".products-filter").hide("open") }), x(function() {
                x("select[data-filter]").each(function() {
                    x(this).on("change", function() {
                        var t, e, n = x(this).data("filter"),
                            a = x(this).val();
                        t = n, "showall" === (e = a) ? x("." + t + " .item[data-type]").show() : (x("." + t + " .item[data-type]").hide(), x("." + t + ' .item[data-type="' + e + '"]').show())
                    })
                })
            }), productTeaserInit()
        }), x(window).bind("load", function() { x("footer.footer") })
    }(jQuery);
var hoveroverCount = 0,
    hoverOverToWrap = $();

function SelectHasValue(t, e) { var n = !1; return $("#" + t + " option").each(function() { this.value == e && (n = !0) }), n }

function escapeXml(t) { return t ? "string" == typeof t || t instanceof String ? t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;") : "boolean" == typeof t || "number" == typeof t ? t : void 0 : "" } 1024 <= document.documentElement.clientWidth && $(".hover-over").each(function() { hoverOverToWrap = hoverOverToWrap.add($(this)), $(this).hasClass("last-in-row") ? ($(this).hasClass("width-full") ? hoverOverToWrap.wrapAll('<div class="type1"/>') : hoverOverToWrap.wrapAll('<div class="type1 no-padding-right"/>'), hoverOverToWrap = $(), hoveroverCount = 0) : hoveroverCount++ });
var feedbackString, camera, lens, datacable, powercable, pccard, getUrlParameter = function(t) {
        for (var e, n = decodeURIComponent(window.location.search.substring(1)).split("&"), a = 0; a < n.length; a++)
            if ((e = n[a].split("="))[0] === t) return void 0 === e[1] || e[1]
    },
    questions = getUrlParameter("questions");
if (void 0 !== questions && (feedbackString = (feedbackString = "") + questions + "\n\n", camera = getUrlParameter("camera"), feedbackString = feedbackString + "Camera: " + camera + "\n\n", lens = getUrlParameter("lens"), feedbackString = feedbackString + "Lens: " + lens + "\n\n", datacable = getUrlParameter("datacable"), feedbackString = feedbackString + "Data cable: " + datacable + "\n\n", powercable = getUrlParameter("powercable"), feedbackString = feedbackString + "Power cable: " + powercable + "\n\n", pccard = getUrlParameter("pccard"), feedbackString = feedbackString + "PC Card: " + pccard + "\n\n", $("#Nochange").text(feedbackString), console.log(feedbackString)), -1 < window.location.href.indexOf("vsc=1")) { for (var modelSplit, link_to_vsc, url = window.location.href.split(";"), modelNr = 0, i = 0; i < url.length; i++) {-1 < url[i].indexOf("camera-model") && (modelNr = (modelNr = (modelSplit = url[i].split("="))[1]).replace("m-", "")) } modelNr && (link_to_vsc = JSConf.javascript.paLink + "#/selection/lenses/select-camera-model=" + modelNr, console.log(JSConf.javascript.paLink), $(".link-back-to-vsc").each(function() { $(this).css("display", "inline-block"), $(this).attr("href", link_to_vsc) })) }

function checkParameterPylonFeedback() {
    $("#pylonver > option").each(function() {
        var t;
        this.text === getUrlParameter("pylonver") && (t = (t = this.value).toLowerCase().replace(/^[^\w\.]*([\.])+|[^\w\.]+|([\.])+[^\w\.]*$/g, "").replace("-", ""), $("#pylonver").val(t).change().selectric("refresh"))
    }), $("#os > option").each(function() {
        var t;
        this.text === getUrlParameter("os") && (t = (t = this.value).toLowerCase().replace(/^[^\w\.]*([\.])+|[^\w\.]+|([\.])+[^\w\.]*$/g, "").replace("-", ""), $("#os").val(t).change().selectric("refresh"))
    })
}

function removeAccessorieTab() { 0 < document.querySelectorAll("section[data-entries]").length || ($(".accessories-tab").remove(), $(".accessories-tab-li").remove()) }

function addLensesResultToButton() {
    $(".js-link-add-lenses-to-vsc").each(function() {
        setTimeout(function() {
            var t = $(".js-link-add-lenses-to-vsc"),
                e = [];
            $("#result").find(".lensTeaserProduct").each(function() { $(this).hasClass("disabled") || e.push("accessory-" + $(this).attr("product-id")) });
            var n = JSConf.javascript.paLink + "#/selection/lenses/prefiltered_product=",
                a = e.join(","),
                i = $("#camera-model").closest(".selectric-wrapper").find(".selectric .label").text();
            if ("Please select" == i) return !1;
            var o = "/select-camera-model=" + $("option").filter(function() { return 0 <= $(this).text().toLowerCase().indexOf(i.toLowerCase()) }).first().val().replace("m-", "");
            t.removeAttr("href"), t.attr("href", n + a + o), t.is(":hidden") && t.removeClass("hide")
        }, 1e3)
    })
}

function inView(t) {
    var e = t.clientHeight,
        n = window.innerHeight,
        a = window.scrollY || window.pageYOffset,
        i = a + n;
    return t.getBoundingClientRect().top + a + e < i
}

function animate() {
    $(".js-animateOnScroll").each(function() {
        var t = $(this)[0];
        inView(t) && t.classList.add("jumping")
    })
}

function browserDetection() {
    var n = $("html"),
        t = this,
        e = {};
    e["is--edge"] = t._checkUserAgent(/edge\//), e["is--opera"] = t._checkUserAgent(/opera/), e["is--chrome"] = !e["is--edge"] && t._checkUserAgent(/\bchrome\b/), e["is--firefox"] = t._checkUserAgent(/firefox/), e["is--webkit"] = !e["is--edge"] && t._checkUserAgent(/webkit/), e["is--safari"] = !e["is--edge"] && !e["is--chrome"] && t._checkUserAgent(/safari/), e["is--ie"] = !e["is--opera"] && (t._checkUserAgent(/msie/) || t._checkUserAgent(/trident\/7/)), e["is--ie-touch"] = e["is--ie"] && t._checkUserAgent(/touch/), e["is--gecko"] = !e["is--webkit"] && t._checkUserAgent(/gecko/), $.each(e, function(t, e) { e && n.addClass(t) })
}

// @see https://gcp.baslerweb.com/jira/browse/MCAS-139
$("li.tabs-title > a").click(function(e) {
    e.preventDefault();
    var url = this.href;
    if (!url) {
        return;
    }
    // update the url without scrolling
    history.replaceState(null, null, url);
});

function _checkUserAgent(t) { return !!navigator.userAgent.toLowerCase().match(t) } $('a[href*="#"]')
.not('[href="#"]')
.not('[href="#0"]')
.click(function(t) {
        // @see https://gcp.baslerweb.com/jira/browse/MCAS-139
        var isInTabsTitle = $(this).parent().hasClass("tabs-title");
        if (isInTabsTitle) {
            return;
        }
		// @see https://gcp.baslerweb.com/jira/browse/MCAS-150
        if (this.classList.contains("js-history-push")) {
			if (!this.href) {
				return;
			}
            history.pushState({}, document.title, this.href);
            try {
                const url = new URL(this.href);
                if (url.hash) {
                    const element = document.getElementById(url.hash.substring(1));
                    element?.scrollIntoView({
                        behavior: "smooth"
                    });
                }
            } catch(e) {
                console.error(e);
            }

            return;
        }

        var e = !0;
        if ($(this).hasClass("thumbnail lightbox") && (e = !1), location.pathname.replace(/^\//, "") == this.pathname.replace(/^\//, "") && location.hostname == this.hostname) {
            var n = $(this).attr("data-url-filter");
            if (void 0 !== n && !1 !== n) {
                var a = $(this).data("url-filter");
                productFilter(FooTable.get(".products-table").use(FooTable.Filtering), a)
            } else {
                var i = $("" + this.hash);
                if ((i = i.length ? i : $("[name=" + this.hash.slice(1) + "]")).length)
                    if (t.preventDefault(), e) $("html, body").animate({ scrollTop: i.offset().top }, 1e3, function() {
                        var t = $(i);
                        if (t.focus(), t.is(":focus")) return !1;
                        t.attr("tabindex", "-1"), t.focus()
                    });
                    else {
                        var o = $(i);
                        if (o.focus(), o.is(":focus")) return !1;
                        o.attr("tabindex", "-1"), o.focus()
                    }
            }
        }
    }), checkParameterPylonFeedback(), $(window).on("load", function() { $('.lens-selector type-0 .user-value input[type="text"]').attr("autocomplete", "off") }), $(function() {
        var t = !1,
            e = $(".theme");

        function n() { t || (t = !0, e.height("auto"), setTimeout(a, 1500), setTimeout(function() { t = !1 }, 200)) }

        function a() {
            var i = [],
                o = 0,
                s = 0;
            e.each(function(t, e) {
                var n = $(e),
                    a = n.offset().top;
                a !== o && (i = [], s = o = 0), i.push(n), o = a, s = Math.max(s, n.height()), $.each(i, function(t, e) { $(e).height(s) })
            })
        }
        $(window).on("resize focus", n), n(), setTimeout(a, 200), setTimeout(n, 500)
    }), $(function() {
        $(function() {
            var t = $("#infinite-loading-accessoiries"),
                e = 0,
                n = [],
                a = paginationHelper(n, 10);
            t.css("visibility", "hidden");

            function i() { a.getPage(e) && (a.getPage(e).forEach(function(t) { $(t).fadeIn() }), e++) } window.initInifiniteScrollAccessoiries = function() { e = 0, n = Array.prototype.slice.call($(".accessoiries-table.result tbody tr"), 0), 1 < (a = paginationHelper(n, 10)).pageCount() ? (t.show(), t.css({ visibility: "visible", opacity: 0 }).animate({ opacity: 1 }, 200)) : t.animate({ opacity: 0 }, 200, function() { t.css("visibility", "hidden") }), n.forEach(function(t) { t.style.display = "none" }), i(), t.one("click", function() { $(this).animate({ opacity: 0 }, 200, function() { t.css("visibility", "hidden") }), i() }) }, $(window).on("scroll", function() { "hidden" === t.css("visibility") && t[0].getBoundingClientRect().bottom < $(window).height() && i() })
        }), $(document).on("ready", function() {
            $(function() {
                var t = $(".accessories-filter.request"),
                    s = $("table.accessoiries-table"),
                    r = $(".button.reset"),
                    l = !1,
                    c = { "icon-check": '<svg xmlns="http://www.w3.org/2000/svg"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-check" /></svg>', "icn-add-to-fav": '<svg xmlns="http://www.w3.org/2000/svg"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-fav" /></svg>', "icn-add-to-cart": '<svg xmlns="http://www.w3.org/2000/svg"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-cart" /></svg>' };

                function d(t, e, n, a) {
                    var i = e.replace(/%/g, "");
                    n.set(t, i);
                    var o = $("#model"),
                        s = "";
                    if ("series" === t && "showall" !== e && (o.find("option").each(function() { $(this).data("series") !== e && "showall" !== $(this).val() ? s += "<option disabled data-series='" + $(this).data("series") + "' value='" + $(this).val() + "'>" + $(this).html() + "</option>" : "showall" === $(this).val() ? s += "<option selected value='" + $(this).val() + "'>" + $(this).html() + "</option>" : (a || (n.remove("model"), l.removeFilter("model")), s += "<option data-series='" + $(this).data("series") + "' value='" + $(this).val() + "'>" + $(this).html() + "</option>") }), o.empty().selectric("refresh").append(s).selectric("destroy").selectric({ disableOnMobile: !1, arrowButtonMarkup: '<b class="slc-button">&#x25be;</b>', multiple: { separator: ", ", keepMenuOpen: !0, maxLabelEntries: !1 } })), l && ("showall" === e ? (l.removeFilter(t), l.clear()) : (l.addFilter(t, e, [t]), l.filter()), "" !== n)) return location.hash = n.toString(), n
                }
                t.length && function() {
                    $("#infinite-loading-accessoiries").css("visibility", "hidden"), s.on({ "ready.ft.table": function() { console.info("ready.ft.table"), s.find(".icon-check").each(function() { $(this).html(c[this.className]) }), s.find(".icn-add-to-fav").each(function() { $(this).html(c[this.className]) }), s.find(".icn-add-to-cart").each(function() { $(this).html(c[this.className]) }), console.info("accessoiries-filter.js- document ready - result.on -> updateProductIcons()"), updateProductIcons() } }).footable(), l = FooTable.get(".accessoiries-table").use(FooTable.Filtering), initInifiniteScrollAccessoiries();
                    var n = hashParams(location.hash),
                        t = n.getAll();
                    for (var e in t)
                        if ("undefined" !== t[e] && t[e]) {
                            if ("tab" === String(e) && n.remove(String(e)), t.hasOwnProperty(e) && t[e]) {
                                var a = "#" + String(e);
                                if (~t[e].indexOf(" OR ")) { var i = t[e].split(" OR "); for (var o in i) $(a + " option[value='" + i[o] + "']").prop("selected", !0) } else "lensmount" === String(e) ? $(".accessories-filter").find(a).val("%" + t[e] + "%") : $(".accessories-filter").find(a).val(t[e]);
                                n = "showall" !== n.get("series") && "showall" !== n.get("model") ? d(e, t[e], n, !0) : d(e, t[e], n)
                            }
                        } else n.set(String(e), "");
                    s.find(".footable-empty").length && $(".no-result").show(), $("#infinite-loading-accessoiries").css("visibility", "hidden"), initInifiniteScrollAccessoiries(), $("select[data-filter]").each(function() {
                        $(this).on("change", function() {
                            var t = $(this).data("filter"),
                                e = $(this).map(function(t, e) { return $(e).val() }).toArray().join(" OR ");
                            n = d(t, e, n), initInifiniteScrollAccessoiries(), $(".no-result").hide(), s.find(".footable-empty").length && $(".no-result").show()
                        })
                    }), productFilter(l, document.location.href), $(".url-filter").each(function() {
                        $(this).on("click", function() {
                            var t = $(this).data("url-filter");
                            window.history.pushState(document.location.host, "", $(this).data("url-filter")), productFilter(l, t)
                        })
                    }), $("fieldset[data-filter] input").click(function() {
                        var t = $(this).attr("name"),
                            e = $("fieldset[data-filter] input[name=" + t + "]:checked").map(function(t, e) { return $(e).val() }).toArray().join(" OR ");
                        n = d(t, e, n), initInifiniteScrollAccessoiries(), $(".no-result").hide(), s.find(".footable-empty").length && $(".no-result").show()
                    }), r.click(function() { window.location = window.location.href.split("#")[0] })
                }()
            })
        })
    }), $(function() {
        var t, e, n;
        $.urlParam("tab") && (t = $.urlParam("tab"), $('a[href="#' + t + '"') && (e = $('a[href="#' + t + '"'), n = $("#" + t), $(document).foundation(), $("[data-tabs]").foundation("selectTab", n), $("body, html").animate({ scrollTop: e.offset().top })))
    }), document.addEventListener("scroll", animate), $(function() { animate() }), $(function() {
        var e, t;
        0 < $(".blueBar").length && (e = $(".blueBar").offset().top, (t = function() {
            var t = $(window).scrollTop();
            e < t ? $(".blueBar").addClass("sticky") : $(".blueBar").removeClass("sticky")
        })(), $(window).scroll(function() { t() }))
    }), browserDetection(),
    function(m) {
        m(document).on("ready", function() {
            m(function() {
                var l, c, d, u, h = "CAMERA SELECTOR",
                    t = m(".camera-selector"),
                    f = m("#request"),
                    e = m("#result"),
                    p = m("#result").data("selectortype");
                t.hasClass("selector-type-1") && (l = !0), t.hasClass("selector-type-2") && (c = !0), t.hasClass("selector-type-3") && (d = !0), t.hasClass("selector-type-4") && (u = !0);
                var s = m(".button.reset");

                function v(e) {
                    var t, n, a, o = hashParams(location.hash),
                        i = o.getAll(),
                        s = 0;
                    for (var r in i) { "undefined" !== i[r] && i[r] ? i.hasOwnProperty(r) && i[r] && (n = "#" + String(r), m(".camera-selector-filter").find(n).val(i[r]), m(".camera-selector-filter").find(n).find("option[value=" + i[r] + "]").attr("selected", !0), s++) : o.set(String(r), "") } e = [], m("#request select").each(function() {
                        var t = jQuery.parseJSON('{ "ID": "' + m(this).attr("id") + '", "VALUE": "' + (m(this).find("option:selected").val() || o.get(m(this).attr("id")) || "all") + '" }');
                        console.log('{ "ID": "' + m(this).attr("id") + '", "VALUE": "' + (m(this).find("option:selected").val() || o.get(m(this).attr("id")) || "all") + '" }'), e.push(t)
                    }), t = e || "", 0 < m(".product-teaser:visible").length && 0 < s && (m(".selector-begin").hide(), m(".selector-results").fadeIn("fast"), m(".selector-results .no-elements").removeClass("pulse"), setTimeout(function() { m(".no-elements").text(m(".product-teaser:visible").length).addClass("pulse") }, 100)), g(e), l && (a = JSConf.javascript.cameraSelector1FilterJSON), c && (a = JSConf.javascript.cameraSelector2FilterJSON), d && (a = JSConf.javascript.cameraSelector3FilterJSON), u && (a = JSConf.javascript.framegrabberSelectorFilterJSON), m.ajax({ data: JSON.stringify(t), dataType: "json", url: a, type: "post" }).done(function(t) {
                        var n = [];
                        m.each(t, function(t, a) {
                            var i = "",
                                e = "";
                            a.DISABLED && (e = " disabled"), i += "<label for='" + a.ID + "'>" + a.TEXT + "</label>", i += "<select name='" + a.ID + "' id='" + a.ID + "'" + e + ">", m.each(a.OPTIONS, function(t, e) {
                                var n = e.SELECTED || o.get(a.ID) == e.VALUE ? "selected" : "";
                                i += "<option value='" + e.ID + "' " + n + ">" + e.TEXT + "</option>"
                            }), i += "</select>", n.push(i)
                        }), f.find("fieldset").empty().append(n), f.find("select:not(.noSelectric)").selectric({ disableOnMobile: !1, arrowButtonMarkup: '<b class="slc-button">&#x25be;</b>' }), m("select:not(.noSelectric)").each(function() {
                            m(this).on("change", function() {
                                o.set(m(this).attr("id"), m(this).find("option:selected").val()), location.hash = o.toString();
                                var e = [];
                                m("#request select").each(function() {
                                    var t = jQuery.parseJSON('{ "ID": "' + m(this).attr("id") + '", "VALUE": "' + (m(this).find("option:selected").val() || o.get(m(this).attr("id")) || "all") + '" }');
                                    e.push(t)
                                }), dataLayer.push({ event: "customEvent", eventInfo: { category: p, action: m(this).find("option:selected").val() || o.get(m(this).attr("id")) || "all", label: m(this).attr("id") } }), v(e), g(e)
                            })
                        })
                    }).fail(function(t, e, n) { console.error(h, e, t.status, n) })
                }

                function g(t) {
                    var e, n = t || "";
                    console.info("getResultData() ", n), l && (e = JSConf.javascript.cameraSelector1ResultJSON), c && (e = JSConf.javascript.cameraSelector2ResultJSON), d && (e = JSConf.javascript.cameraSelector3ResultJSON), u && (e = JSConf.javascript.framegrabberSelectorResultJSON), m.ajax({ data: JSON.stringify(n), dataType: "json", url: e, type: "post" }).done(function(t) {
                        0;
                        var e = m("#result"),
                            n = [];
                        return m.each(t, function(t, e) {
                            var i = "<div class='row'>",
                                o = "",
                                s = "";
                            i += "<h3>" + e.RESULT_HEADING + "</h3>", m.each(e.ITEMS, function(t, n) {
                                var e = "";
                                n.ITEM_ACTIVE || (e = " disabled"), i += "<div class='product-teaser" + e + "' data-equalizer-watch>", i += "    <div class='inner'>", i += "        <figure class='text-center'>", i += "            <a href='" + n.PRODUCT_URL + "'><img src='" + n.FIGURE_SMALL_URL + "' alt='" + n.PRODUCT_NAME + "' /></a>", n.OVERLAY && (i += "<div class='overlay'>", i += "    <img src='" + n.OVERLAY + "' alt='' />", i += "</div>"), i += "        </figure>", i += "        <div class='top-bar'>", n.PRODUCT_LINERATE && (i += "        <div class='text small'>" + n.PRODUCT_LINERATE + "</div>"), i += "        <div class='text'><a href='" + n.PRODUCT_URL + "'>" + n.PRODUCT_NAME + "</a></div>", i += "            <div class='top-bar-left'>", i += "            <a class='more'>" + n.PRODUCT_MORETEXT + "</a>", i += "            </div>", o = n.PRODUCT_IS_ON_CART ? "-filled" : "", s = n.PRODUCT_IS_ON_FAV ? "-filled" : "", i += "            <div class='top-bar-right'>";
                                var a = "icn-add-to-cart";
                                n.ETAILER && (a = "icn-external"), n.ETAILER ? (i += "                 <div class='" + a + " grow' data-product-id='" + n.ITEM_ID + "'>", i += "                    <svg><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-cart" + o + "' /></svg>", i += "                </div>", i += "<div class='reveal product-teaser-details-etailer etailer' id='etailer-" + n.ITEM_ID + "' data-reveal  data-additional-overlay-classes='etailer'>", i += "<div class='type3'><h1 data-product-name='" + n.PRODUCT_NAME + "'>" + n.PRODUCT_NAME + "</h1><p>" + n.ETAILER_BASLER + "</p>", i += "<a class='link-add-to-cart button' data-product-id='" + n.ITEM_ID + "'><span>" + n.PRODUCT_BASKET_NAME + "</span><svg><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-cart'></use></svg></a>", i += "<div class='content-divider low'></div><hr /><div class='content-divider low'></div><p>" + n.ETAILER_EXTERNAL + "</p>", m.each(n.ETAILER, function(t, e) { i += "<div class='ext-wrapper' data-etailer-name='" + e.NAME + "'><a href='" + e.URL + "' target='_blank' class='external'><div class='img-wrapper'><img alt='" + e.NAME + "' src='" + e.LOGO + "' /></div></a>", i += "<a href='" + e.URL + "' target='_blank' class='external'><svg><use xlink:href='#icon-globus' xmlns:xlink='http://www.w3.org/1999/xlink'></use></svg><span>" + n.ETAILER_LINKTEXT + "&nbsp;" + e.NAME + "</span></a></div>", i += "<div class='content-divider low'></div>" }), i += "</div><div class='type4'><img src='" + n.FIGURE_SMALL_URL + "'/></div><button class='close-button' data-close='' type='button'><span aria-hidden='true'>x</span></button></div>") : (i += "                 <div class='icn-add-to-cart grow' data-product-id='" + n.ITEM_ID + "'>", i += "                    <svg><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-cart" + o + "' /></svg>", i += "                </div>"), i += "                <div class='icn-add-to-fav grow'  data-product-id='" + n.ITEM_ID + "'>", i += "                    <svg><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-fav" + s + "' /></svg>", i += "                </div>", i += "            </div>", i += "        </div>", i += "        <section class='product-teaser-details'>", i += "            <figure><a href=" + n.PRODUCT_URL + "><img src='" + n.FIGURE_URL + "' alt='" + n.PRODUCT_NAME + "' /></a></figure>", i += "            <article class='table-wrapper'>", m.each(n.DETAILS_TABLES, function(t, e) { e.hasOwnProperty("HEADLINE") ? i += "<table><thead><tr><th colspan='2'>" + e.HEADLINE + "</th></tr></thead><tbody>" : i += "<table><tbody>", m.each(e.CONTENT, function(t, e) { i += "<tr><td>" + t + "</td><td>" + e + "</td></tr>" }), i += "</tbody></table>" }), i += "            </article>", i += "            <div class='top-bar'>", i += "                <a href='" + n.PRODUCT_URL + "'>" + n.PRODUCT_URL_NAME + "</a>", i += "                <a class='link-add-to-fav' data-product-id='" + n.ITEM_ID + "'><svg class='icon grow'><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-fav" + s + "'></use></svg>" + n.PRODUCT_FAVOURITE_NAME + "</a>", i += "                <a class='orange link-add-to-cart' data-product-id='" + n.ITEM_ID + "'><svg class='icon grow orange'><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-cart" + o + "'></use></svg>" + n.PRODUCT_BASKET_NAME + "</a>", i += "            </div>", i += "        </section>", i += "    </div>", i += "</div>"
                            }), i += "</div>", n.push(i)
                        }), e.empty().append(n), Foundation.reInit("equalizer"), r(), m(".selector-results .no-elements").removeClass("pulse"), setTimeout(function() { m(".no-elements").text(m(".product-teaser:visible").length).addClass("pulse") }, 100), m(".onlycontent .product-teaser figure > a, .onlycontent .product-teaser .text > a, .onlycontent .product-teaser-details .top-bar a").click(function(t) { t.preventDefault(), window.open(this.href) }), m(".onlycontent .link-add-to-fav, .onlycontent .link-add-to-cart, .onlycontent .icn-add-to-fav, .onlycontent .icn-add-to-cart").hide(), m(".onlycontent .product-teaser-details .top-bar a").attr("target", "_blank"), !0
                    }).fail(function(t, e, n) { return console.error(h, e, t.status, n), !1 })
                }

                function r() {
                    e.find(".item.disabled").each(function() { m(this).find("a").each(function() { m(this).on("click touchend", function(t) { return t.preventDefault(), !1 }) }) }), e.find(".icn-add-to-cart").on("click", function() {
                        var t = m(this).data("product-id");
                        isFilled(m(this)) ? _deleteProduct("basket", t, function(t) { t && (flashIcon("basket", 500), updateProductIcons()) }) : addProduct("basket", t, function(t) { t && (flashIcon("basket", 500), updateProductIcons(), addToCartTimeout()) })
                    }), e.find(".icn-add-to-fav").on("click", function() {
                        var t = m(this).data("product-id");
                        isFilled(m(this)) ? _deleteProduct("compare", t, function(t) { t && (flashIcon("compare", 500), updateProductIcons()) }) : addProduct("compare", t, function(t) { t && (flashIcon("compare", 500), updateProductIcons()) })
                    }), productTeaserInit()
                }
                t.length && function() {
                    console.info(h);
                    var t, n = hashParams(location.hash),
                        e = n.getAll(),
                        a = 0;
                    for (var i in e) { "undefined" !== e[i] && e[i] ? e.hasOwnProperty(i) && e[i] && (t = "#" + String(i), m(".camera-selector-filter").find(t).val(e[i]), a++) : n.set(String(i), "") }
                    var o = [];
                    m("#request select").each(function() {
                        var t = jQuery.parseJSON('{ "ID": "' + m(this).attr("id") + '", "VALUE": "' + (m(this).find("option:selected").val() || n.get(m(this).attr("id")) || "all") + '" }');
                        o.push(t)
                    }), 0 < m(".product-teaser").length && 0 < a && (m(".selector-begin").hide(), m(".selector-results").fadeIn("fast"), m(".selector-results .no-elements").removeClass("pulse"), setTimeout(function() { m(".selector-results .no-elements").text(m(".product-teaser").length).addClass("pulse") }, 100)), v(o), m("select:not(.noSelectric)").each(function() {
                        m(this).on("change", function() {
                            n.set(m(this).attr("id"), m(this).find("option:selected").val()), location.hash = n.toString();
                            var e = [];
                            m("#request select").each(function() {
                                var t = jQuery.parseJSON('{ "ID": "' + m(this).attr("id") + '", "VALUE": "' + (m(this).find("option:selected").val() || n.get(m(this).attr("id")) || "all") + '" }');
                                e.push(t)
                            }), dataLayer.push({ event: "customEvent", eventInfo: { category: p, action: m(this).find("option:selected").val() || n.get(m(this).attr("id")) || "all", label: m(this).attr("id") } }), v(e)
                        })
                    }), m(".onlycontent .product-teaser figure > a, .onlycontent .product-teaser .text > a, .onlycontent .product-teaser-details .top-bar a").click(function(t) { t.preventDefault(), window.open(this.href) }), m(".onlycontent .link-add-to-fav, .onlycontent .link-add-to-cart, .onlycontent .icn-add-to-fav, .onlycontent .icn-add-to-cart").hide(), m(".selector-results .no-elements").removeClass("pulse"), setTimeout(function() { m(".no-elements").text(m(".product-teaser:visible").length).addClass("pulse") }, 100), r(), s.click(function() { window.location = window.location.href.split("#")[0] })
                }()
            })
        })
    }(jQuery),
    function(m) {
        ! function() {
            var t = m("#infinite-loading-ccd-cmos"),
                e = 0,
                n = [],
                a = paginationHelper(n, 15);
            t.css("visibility", "hidden");

            function i() { a.getPage(e) && (a.getPage(e).forEach(function(t) { m(t).fadeIn() }), e++) } window.initInifiniteScrollCCDtoCMOS = function() { e = 0, n = Array.prototype.slice.call(m(".ccd-to-cmos-table.result tbody tr"), 0), 1 < (a = paginationHelper(n, 10)).pageCount() ? (t.show(), t.css({ visibility: "visible", opacity: 0 }).animate({ opacity: 1 }, 200)) : t.animate({ opacity: 0 }, 200, function() { t.css("visibility", "hidden") }), n.forEach(function(t) { t.style.display = "none" }), i(), t.one("click", function() { m(this).animate({ opacity: 0 }, 200, function() { t.css("visibility", "hidden") }), i() }) }, m(window).on("scroll", function() { "hidden" === t.css("visibility") && t[0].getBoundingClientRect().bottom < m(window).height() && i() })
        }(), m(document).on("ready", function() {
            m(function() {
                var c, d, u, t = m(".ccd_to_cmos-filter.request"),
                    h = m("table.ccd-to-cmos-table"),
                    f = m(".button.reset"),
                    p = !1,
                    v = { "icon-check": '<svg xmlns="http://www.w3.org/2000/svg"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-check" /></svg>', "icn-add-to-fav": '<svg xmlns="http://www.w3.org/2000/svg"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-fav" /></svg>', "icn-add-to-cart": '<svg xmlns="http://www.w3.org/2000/svg"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-cart" /></svg>' };

                function g(t, e, n, a) { var i = e.replace(/%/g, ""); if (n.set(t, i), p && ("showall" === e ? (p.removeFilter(t), p.clear()) : (p.addFilter(t, a, [t]), p.filter()), "" !== n)) return location.hash = n.toString(), n } t.length && function() {
                    m("#infinite-loading-ccd-cmos").css("visibility", "hidden"), m(".cmos_recommendation").hide(), m(".cmos_recommendation_default").show(), h.on({ "ready.ft.table": function() { console.info("ready.ft.table"), h.find(".icon-check").each(function() { m(this).html(v[this.className]) }), h.find(".icn-add-to-fav").each(function() { m(this).html(v[this.className]) }), h.find(".icn-add-to-cart").each(function() { m(this).html(v[this.className]) }), updateProductIcons() } }).footable(), p = FooTable.get(".ccd-to-cmos-table").use(FooTable.Filtering), initInifiniteScrollCCDtoCMOS(), m(".selector-begin .no-elements").removeClass("pulse"), m(".selector-results .no-elements").text(m(".ccd-to-cmos-table.result tbody tr").length).addClass("pulse");
                    var t, a = hashParams(location.hash),
                        e = a.getAll(),
                        n = 0,
                        i = "";
                    for (var o in e)
                        if ("undefined" !== e[o] && e[o]) {
                            if (e.hasOwnProperty(o) && e[o]) {
                                var s = "#" + String(o);
                                if (~e[o].indexOf(" OR ")) { var r = e[o].split(" OR "); for (var l in r) m(s + " option[value='" + r[l] + "']").prop("selected", !0) } else "sensorname" === String(o) && "showall" !== e[o] ? m(".ccd_to_cmos-filter").find(s).val("%" + e[o] + "%") : m(".ccd_to_cmos-filter").find(s).val(e[o]);
                                i = "sensorname" === String(o) ? m(s).find("[value='%" + e[o] + "%']").data("val") : m(s).find("[value='" + e[o] + "']").data("val"), a = g(o, e[o], a, i), n++
                            }
                        } else a.set(String(o), "");
                    0 < m(".ccd-to-cmos-table.result tbody tr").length && 0 < n && (m(".selector-begin .no-elements").removeClass("pulse"), m(".selector-results .no-elements").text(m(".ccd-to-cmos-table.result tbody tr:not(.footable-empty)").length).addClass("pulse"), m(".selector-begin").hide(), m(".selector-results").fadeIn("fast"), "showall" !== m("#sensorname").val() ? (m(".ccd_to_cmos-result-info").hide(), m(".ccd_to_cmos-result-row").hide(), m(".ccd_to_cmos-results_headline").show(), t = "#" + String(m("#sensorname").val().replace(/%/g, "")), m(t).fadeIn(1e3), c = m("#sensorname").find(":selected").data("val_sort").split(","), m(".ccd-to-cmos-table tbody tr:not(.footable-empty)").each(function(t) { d = parseInt(m(this).find(".counter").text()), u = d - 1e4 / (c.indexOf(m(this).find("b").text()) + 1), FooTable.get(".ccd-to-cmos-table").rows.array[t].cells[0].val(u) })) : (m(".ccd_to_cmos-result-info").show(), m(".ccd_to_cmos-results_headline").hide(), m(".ccd_to_cmos-result-row").hide(), m(".ccd-to-cmos-table tbody tr:not(.footable-empty)").each(function(t) { d = parseInt(m(this).find(".counter").data("orgcounter")), u = d, FooTable.get(".ccd-to-cmos-table").rows.array[t].cells[0].val(u) })), FooTable.get(".ccd-to-cmos-table").sort("sortcol", "ASC")), h.find(".footable-empty").length && (m(".no-result").show(), m(".selector-results .no-elements").text("0").addClass("pulse")), m("#infinite-loading-ccd-cmos").css("visibility", "hidden"), initInifiniteScrollCCDtoCMOS(), m("select[data-filter]").each(function() {
                        m(this).on("change", function() {
                            var t, e = m(this).data("filter"),
                                n = m(this).map(function(t, e) { return m(e).val() }).toArray().join(" OR ");
                            i = m(this).find(":selected").data("val"), a = g(e, n, a, i), initInifiniteScrollCCDtoCMOS(), m(".no-result").hide(), h.find(".footable-empty").length ? (m(".no-result").show(), m(".selector-results .no-elements").text("0").addClass("pulse")) : (m(".selector-begin").hide(), m(".selector-results").fadeIn("fast"), m(".selector-results .no-elements").removeClass("pulse"), setTimeout(function() { m(".selector-results .no-elements").text(m(".ccd-to-cmos-table.result tbody tr:not(.footable-empty)").length).addClass("pulse") }, 0)), "showall" !== m("#sensorname").val() ? (m(".ccd_to_cmos-result-info").hide(), m(".ccd_to_cmos-result-row").hide(), m(".ccd_to_cmos-results_headline").show(), t = "#" + String(m("#sensorname").val().replace(/%/g, "")), m(t).fadeIn(1e3), c = m("#sensorname").find(":selected").data("val_sort").split(","), m(".ccd-to-cmos-table tbody tr:not(.footable-empty)").each(function(t) { d = parseInt(m(this).find(".counter").data("orgcounter")), u = d - 1e4 / (c.indexOf(m(this).find("b").text()) + 1), FooTable.get(".ccd-to-cmos-table").rows.array[t].cells[0].val(u) })) : (m(".ccd_to_cmos-result-info").show(), m(".ccd_to_cmos-results_headline").hide(), m(".ccd_to_cmos-result-row").hide(), m(".ccd-to-cmos-table tbody tr:not(.footable-empty)").each(function(t) { d = parseInt(m(this).find(".counter").data("orgcounter")), u = d, FooTable.get(".ccd-to-cmos-table").rows.array[t].cells[0].val(u) })), FooTable.get(".ccd-to-cmos-table").sort("sortcol", "ASC"), m("#infinite-loading-ccd-cmos").css("visibility", "hidden"), initInifiniteScrollCCDtoCMOS()
                        })
                    }), f.click(function() { window.location = window.location.href.split("#")[0] })
                }()
            })
        })
    }(jQuery), $(document).ready(function() {
        function e(t) {
            var e = $(t).outerWidth();
            $(".comparison-resize-img > img", t).css("width", e)
        }
        $(".comparison-slider").each(function() {
            var t = $(this);
            setTimeout(function() {
                ! function(n) {
                    var a = n.find(".comparison-handle"),
                        i = n.find(".comparison-resize-img"),
                        o = !1,
                        s = a.outerWidth() / 2 + 10,
                        t = n.attr("data-initial-slider-position");
                    $(window).on("resize", e), e(), t && c(t);

                    function e() {
                        var t = n.find(".comparison-slider__label-right");
                        t.css("left", n.outerWidth() - t.outerWidth()), n.find(".comparison-slider__label").each(function(t, e) { e.style.setProperty("--max-container-width", n.width() + "px") })
                    }

                    function r() { o = !1 }

                    function l(t) { return t / n.width() * 100 }

                    function c(t) {
                        var e = Math.min(l(n.width() - s), Math.max(t, l(s)));
                        a.css("left", e + "%"), i.css("width", e + "%")
                    }
                    a.on("mousedown touchstart", function() { o = !0 }).on("mouseup touchend touchcancel", r).parents().on("mouseup touchend touchcancel", r).on("mousemove touchmove", function(t) {
                        var e;
                        o && c(l(((e = t).pageX ? e.pageX : e.originalEvent && e.originalEvent.touches ? e.originalEvent.touches[0].pageX : 0) - n.offset().left))
                    })
                }(t), t.addClass("is-visible"), e(t)
            }, 500)
        }), $(window).resize(function() { $(".comparison-slider").each(function() { e($(this)) }) })
    });
var CookieFunctions = {
    CookieSettings: { GeoLocation: "countryFromGeolocation", GeoLocation_maxTime: "60_minutes" },
    getCookie: function(t) { return $.cookie(t) },
    setCookie: function(t, e, n, a) { $.cookie(t, e.toLowerCase(), { expires: n, path: a }) },
    getTimeByName: function(t) {
        var e = new Date;
        switch (t) {
            case "30_minutes":
                return e.setTime(e.getTime() + 18e5), e.toUTCString(), e;
            case "60_minutes":
                return e.setTime(e.getTime() + 36e5), e.toUTCString(), e;
            default:
                return e.setTime(e.getTime() + 864e5), e.toUTCString(), e
        }
    },
    setByName: function(t, e, n) {
        var a = this.getTimeByName(n);
        CookieFunctions.setCookie(t, e, a, "/")
    },
    callGeoLocationAndSetStandardGeoCookie: function(n, a) {
        $.ajax({ url: "https://wia.baslerweb.com/" }).done(function(t) {
            var e = t.data.info.country;
            a = a || CookieFunctions.CookieSettings.GeoLocation_maxTime, CookieFunctions.setByName(CookieFunctions.CookieSettings.GeoLocation, e, a), n && n(e)
        })
    }
};
$(function() {
    $(document).on("ready", function() {
        var a = "COMPARE CART 2",
            i = $(".cart-list.cart-type-3"),
            o = i;

        function s() {
            i.find(".icn-add-to-cart").on("click", function() {
                var t = $(this).data("product-id");
                isFilled($(this)) ? _deleteProduct("basket", t, function(t) { t && r() }) : addProduct("basket", t, function(t) { t && r() })
            })
        }

        function r(t) {
            var e = t || "",
                n = JSConf.javascript.compareFavouritesResult2JSON;
            $.ajax({ data: JSON.stringify(e), dataType: "json", url: n, type: "post" }).done(function(t) {
                0;
                var n = [];
                return $.each(t, function(t, e) {
                    var a = "";
                    a += "<thead>", a += "<tr>", a += "<th data-type='html' data-breakpoints='xs'>" + e.TH_IMAGE + "</th>", a += "<th data-type='html'>" + e.TH_MODEL + "</th>", a += "<th data-type='html' data-breakpoints='xs'>" + e.TH_MOUNT + "</th>", a += "<th data-type='html'>" + e.TH_FOCAL_LENGTH + "</th>", a += "<th data-type='html'>" + e.TH_MAX_CIRCLE + "</th>", a += "<th data-type='html'>" + e.TH_APERTURE + "</th>", a += "<th data-type='html'>" + e.TH_MIN_DISTANCE + "</th>", a += "<th data-type='html'></th>", a += "<th data-type='html'></th>", a += "</tr>", a += "</thead>", a += "<tbody>", $.each(e.TABLEROWS, function(t, e) {
                        a += "<trproduct-item>", a += "<td><div class='image-container'>", a += "<a href='" + e.TD_PRODUCT_URL + "'>", a += "<img src='" + e.TD_PRODUCT_IMAGE_URL + "' alt='" + e.TD_PRODUCT_TITLE + "'>", a += "</a>", a += "</div></td>", a += "<td>", a += "<h5>" + e.TD_PRODUCT_TITLE + "</h5>", a += "<p>" + e.TD_PRODUCT_TEXT + "</p>", a += "</td>", a += "<td>" + e.TD_MOUNT + "</td>", a += "<td>" + e.TD_FOCAL_LENGTH + "</td>", a += "<td>" + e.TD_MAX_CIRCLE + "</td>", a += "<td>" + e.TD_APERTURE + "</td>", a += "<td>" + e.TD_MIN_DISTANCE + "</td>", a += "<td>";
                        var n = "";
                        e.TD_IS_ON_CART && (n = "-filled"), a += "<div class='icn-add-to-cart' data-product-id='" + e.TD_PRODUCT_ID + "'>", a += "<svg class='grow'>", a += "<use xlink:href='#icon-cart" + n + "'/>", a += "</svg>", a += "</div></td>", a += "<td><div class='delete-icon' data-product-id='" + e.TD_PRODUCT_ID + "'></div></td>", a += "</tr>"
                    }), a += "</tbody>", n.push(a)
                }), o.empty().append(n), i.find(".delete-icon").on("click", function() { _deleteProduct("compare", $(this).data("product-id"), function(t) { t && r() }) }), s(), initializeFootable(i, !0), !0
            }).fail(function(t, e, n) { return console.error(a, e, t.status, n), !1 })
        }
        i.length && (i.find(".delete-icon").on("click", function() { console.log("delete from list 4"), _deleteProduct("compare", $(this).data("product-id"), function(t) { t && (console.log("The Delete Product Function successfuly finished"), r()) }) }), s(), initializeFootable(i, !0))
    })
}), $(function() {
    $(document).on("ready", function() {
        var n = $(".currency-switch"),
            t = Cookies.get("currency"),
            a = n.find(".pricerange"),
            e = n.find("select.regions");

        function i(t) {
            t.selectric({
                disableOnMobile: !1,
                arrowButtonMarkup: '<b class="slc-button">&#x25be;</b>',
                onChange: function() {
                    var e = $(this).find("option:selected").val();
                    e && (a.each(function() {
                        $(this).addClass("not-available");
                        var t = $(this).data("price");
                        t === e && (Cookies.set("currency", t), $(this).removeClass("not-available"))
                    }), n.find(".selectric-regions").toggleClass("not-available"))
                }
            })
        }
        n.length && (t ? n.find("[data-price='" + t + "']").toggleClass("not-available").find("svg").on("click", function() { e.toggleClass("not-available"), i(e) }) : (e.toggleClass("not-available"), i(e)))
    })
});
var CustomSliderEngine = {
    hotWheel: function(l, c) {
        function d(t, e, n, a) {
            var i = t.data("ref-to-white-transparent");
            a.$slider.find(".slideImage").each(function() { $(this).height($(this).height()), $(this).attr("data-src", $(this).attr("src")), $(this).closest("div").data("slick-index") == n ? ($(this).attr("src", i), t.find(".js-loading-svg-for-slider").removeClass("loading")) : $(this).attr("src", i) })
        }
        c.on("init", function(t, e, n) {
            var a = $(e.$slides[e.currentSlide]),
                i = a.next(),
                o = a.next().next(),
                s = a.prev(),
                r = a.prev().prev();
            s.addClass("slick-sprev"), i.addClass("slick-snext"), r.addClass("slick-sprevTwo"), o.addClass("slick-snextTwo"), a.removeClass("slick-snext").removeClass("slick-sprev").removeClass("slick-snextTwo").removeClass("slick-sprevTwo"), e.$prev = s, e.$next = i;
            var l = $(".slick-snext").position().top + $(".slick-snext").outerHeight(!0);
            $(this).find(".slick-prev, .slick-next").css("top", l)
        }).on("beforeChange", function(t, e, n, a) {
            $(".slick-slide").removeClass("currentSliderItem");
            var i = l.data("slidesToShow"),
                o = e.slideCount - 1,
                s = a == n ? "same" : 1 == Math.abs(a - n) ? 0 < a - n ? "right" : "left" : 0 < a - n ? "left" : "right";
            "right" == s && ($('.slick-cloned[data-slick-index="' + (a + o + 1) + '"]', c).addClass("slick-current-clone-animate"), 3 === i ? e.$prev.css("transform", " scale(0.50)") : e.$prev.prev().css("transform", " scale(0.50)")), "left" == s && ($('.slick-cloned[data-slick-index="' + (a - o - 1) + '"]', c).addClass("slick-current-clone-animate"), 3 === i ? e.$next.css("transform", " scale(0.50)") : e.$next.next().css("transform", " scale(0.50)"));
            var r = $(e.$slides[a]);
            e.$prev.removeClass("slick-sprev"), e.$next.removeClass("slick-snext"), e.$prev.prev().removeClass("slick-sprevTwo"), e.$next.next().removeClass("slick-snextTwo"), next = r.next(), prev = r.prev(), prev.addClass("slick-sprev"), next.addClass("slick-snext"), prev.prev().addClass("slick-sprevTwo"), next.next().addClass("slick-snextTwo"), e.$prev = prev, e.$next = next, r.removeClass("slick-next").removeClass("slick-sprev").removeClass("slick-nextTwo").removeClass("slick-sprevTwo"), c.find(".slick-center").css("transform", "scale(1)"), n == o && 0 == a ? d(l, 0, 0, e) : 0 == n && a == o && d(l, 0, o, e)
        }).on("afterChange", function(t, e, n, a) { c.find(".slick-center").addClass("currentSliderItem"), setTimeout(function() { $(".slideImage").each(function() { $(this).height(), $(this).attr("src", $(this).data("src")), $(".js-loading-svg-for-slider").addClass("loading") }) }, 800), c.find('.slide[aria-hidden="true"]').css("transform", " scale(1)") }), this.fullItemClickable(c)
    },
    topicPreview: function(o) {
        o.on("click", ".currentSliderItem span.cta-button", function(t) {
            var e, n;
            t.preventDefault(), 0 < o.find(".slideLink").length && (e = o.find(".slideLink").attr("href"), n = o.find(".slideLink").attr("target"), window.open(e, n, ""))
        }), o.on("click", ".sliderButtons .button", function(t) {
            t.preventDefault();
            var e = $(this).data("slide");
            o.find(".button").removeClass("active"), $(this).addClass("active"), o.find(".slider").slick("slickGoTo", e - 1)
        }).on("afterChange", function(t, e, n, a) {
            var i = n + 1;
            o.find(".sliderButtons a").removeClass("active"), o.find('.sliderButtons a[data-slide="' + i + '"]').addClass("active")
        })
    },
    fullItemClickable: function(t) {
        t.on("click", ".currentSliderItem", function() {
            var t = $(this).data("url"),
                e = $(this).data("target");
            window.open(t, e, "")
        })
    }
};
$(".download").on("selectric-change", function(t, e, n) { $("a.download_button").attr("href", $("a.download_button").attr("href").split("#")[0] + "#type=" + $(this).val()) }), $(".software").on("selectric-change", function(t, e, n) { $("a.software_button").attr("href", $("a.software_button").attr("href").split("#")[0] + "#type=" + $(this).val()) }), $(document).ready(function() {
    var m, w, b, e = !1,
        n = !1,
        a = !1,
        i = [];
    $("[data-embedded-video-type]").map(function(t, e) { i.push($(e).data("embedded-video-type")) }), i.filter(function(t) {
        switch (t) {
            case "polyv":
                e = !0;
                break;
            case "youtube":
                n = !0;
                break;
            case "qq":
                a = !0
        }
    }), n && (m = [], $.getScript("https://www.youtube.com/iframe_api").done(function(t) {
        window.onYouTubeIframeAPIReady = function() {
            $(".js-youtube-video").each(function() {
                var t, e = $(this).attr("id");
                void 0 !== _typeof(e) && !1 !== e && "" !== e && (t = e.replace("player-", ""), m[t] = new window.YT.Player(e, { height: "390", width: "640", startSeconds: 0, videoId: t, rel: 0, events: {} }))
            })
        }
    })), e && (w = [], $.getScript("//player.polyv.net/script/player.js").done(function() {
        $(".js-polyv-video").each(function() {
            var t, e, n = $(this).parent(),
                a = $(this).attr("id"),
                i = $(this).data("video-height"),
                o = $(this).data("video-width");
            i.trim() || (i = n.data("height")), o.trim() || (o = n.data("width")), void 0 !== _typeof(a) && !1 !== a && "" !== a && (t = $(this).data("video-id"), e = "#" + a, w[t] = polyvPlayer({ wrap: e, vid: t, height: i, width: "100%" }))
        })
    })), a && (b = [], $.getScript("//vm.gtimg.cn/tencentvideo/txp/js/iframe/api.js").done(function(t, e) {
        $(".js-qq-video").each(function() {
            var t, e = $(this).attr("id");
            void 0 !== _typeof(e) && !1 !== e && "" !== e && (t = $(this).data("video-id"), b[t] = new Txp.Player({ containerId: e, vid: t }))
        })
    })), $(".contains-video").length && $(".slider").on("init", function(t, e) {
        $(".contains-video .video-container").each(function() {
            var u = $(this).closest(".slider"),
                h = $(this).closest("li"),
                f = h.find(".video-container"),
                p = f.data("width"),
                v = f.data("height"),
                g = u.find(".slick-list");
            g.height();
            $(".startVideo", h).click(function(t) {
                if (t.preventDefault(), $("body").addClass("video-playing"), u.slick("slickPause"), $(this).attr("data-video-id")) {
                    var n = $(this).data("video-id");
                    m[n].cueVideoById(n).playVideo()
                } else {
                    var a = $(this).attr("data-video-type");
                    if ("undefined" !== _typeof(a) && !1 !== a) switch (a) {
                        case "polyv":
                            var i = $(this).data("polyv-id"),
                                o = w[i];
                            o.j2s_resumeVideo();
                            break;
                        case "qq":
                            var i = $(this).data("qq-id"),
                                s = b[i];
                            b[i].play();
                            break;
                        case "myqcloud":
                            var i = "#myqcloud-" + $(this).data("myqcloud-id"),
                                r = $(i).prop("src");
                            r += "&autoplay=true", $(i).prop("src", r);
                            break;
                        case "bilibili":
                            var i = "#bili-" + $(this).data("bilibili-id"),
                                r = $(i).prop("src");
                            r += "&autoplay=1", $(i).prop("src", r);
                            break;
                        case "VIDEOFILE":
                            f.find("video").get(0).play()
                    }
                }
                var e = p / v;
                f.fadeIn(1e3);
                var l, c = Math.ceil(f.width() / e),
                    d = h.height();
                return h.css("height", c + "px"), g.css("height", c + "px"), h.find(".cta-buttons-stage .cta-button") && (l = h.find(".cta-buttons-stage .cta-button")).hide(), $("<button class='close-button' data-close type='button'><span>&times;</span></button>").appendTo(h), h.find(".close-button").on("click", { baseHeight: d }, function(t) {
                    switch (t.preventDefault(), $("body").removeClass("video-playing"), a) {
                        case "polyv":
                            o.j2s_stopVideo();
                            break;
                        case "qq":
                            s.pause();
                            break;
                        case "myqcloud":
                            r = r.replaceAll("&autoplay=true", ""), $(i).prop("src", ""), $(i).prop("src", r);
                            break;
                        case "bilibili":
                            r = r.replaceAll("&autoplay=1", ""), $(i).prop("src", ""), $(i).prop("src", r);
                            break;
                        case "VIDEOFILE":
                            var e = f.find("video");
                            e.get(0).pause(), e.get(0).currentTime = 0;
                            break;
                        default:
                            $(this).closest(".slide").find(".js-youtube-video").data(), m[n].cueVideoById(n).stopVideo()
                    }
                    u.find(".slick-prev, .slick-next, .slick-dots").show(), u.find(".close-button").remove(), l.show(), h.css("height", t.data.baseHeight + "px"), g.css("height", t.data.baseHeight + "px"), h.find(".video-container").fadeOut(1e3), u.slick("slickPlay")
                }), !1
            })
        })
    })
}), $(function() {
    var i = 0,
        a = $.makeArray($(".nws-factsAndFigures [data-js-figure]"));

    function t() {
        var t = $.extend({}, a);
        $.each(t, function(t, e) {
            var n;
            (n = e.getBoundingClientRect()).top >= .1 * window.innerHeight && n.bottom <= .9 * window.innerHeight && (a.splice($.inArray(e, a), 1), function(t) {
                var e = "counter" + (i += 1);
                t.attr("id", e);
                var n = JSON.parse("{" + t.data("js-counter-options") + "}"),
                    a = new countUp.CountUp(e, t.attr("data-js-figure"), n);
                a.error || a.start()
            }($(e)))
        })
    }
    t(), $(window).on("scroll", t)
});
var initTagFilterShowAll = function(e, n) {
    (e = e).data("tag-filter-amount") < e.data("tag-filter-items-count") && e.find(".js-show-all-tag-filter").removeClass("hide"), e.on("click", ".js-show-all-tag-filter", function(t) { t.preventDefault(), n.loadAmount = e.data("tag-filter-items-count"), e.find(".js-tag-filter-categories").empty(), initTagFilter(e, n), $(this).addClass("hide") })
};
$(function() {
    var i = ["firstLevel", "secondLevel", "thirdLevel", "fourthLevel", "fifthLevel"];
    $(".mainNavElement a").hover(function() {
        var t = $(this).closest(".mainNavElement"),
            e = $(this).closest("[data-level-namespace]").data("level-namespace"),
            n = i[($.inArray(e, i) + 1) % i.length];
        "firstLevel" == e ? ($(".flyoutNav").addClass("hide"), $(".secondLevel,.thirdLevel,.fourthLevel").addClass("hide"), $(this).closest(".mainNavElement").find(".flyoutNav").removeClass("hide"), $(this).closest(".mainNavElement").find(".flyoutNav").removeClass("fadeOut"), $(this).closest(".mainNavElement").find(".js-closeFlyout").removeClass("hide"), $(this).closest(".mainNavElement").find(".defaultContent").removeClass("hide")) : $(this).closest(".mainNavElement").find(".defaultContent").addClass("hide"), t.find("[data-level-namespace='" + n + "']").removeClass("hide");
        var a = $(this).closest("div").data("nav-level");
        "undefined" !== n && (console.log("suche nach ::: ", "data-nav-level='" + n + "_" + a + "']"), $(this).closest(".flyoutNav").find("[data-nav-level^='" + n + "_']").addClass("hide"), $(this).closest(".flyoutNav").find("[data-nav-level='" + n + "_" + a + "']").removeClass("hide"))
    }), $(".js-closeFlyout").click(function() { $(this).closest(".flyoutNav").addClass("fadeOut") }), $(".js-fadeOutFlyOutNav").mouseleave(function() { $(this).addClass("fadeOut") })
}), $(function() { $(".js-footerAccordionButton").click(function() { $(this).closest(".listContainer").toggleClass("open") }) }), $(function() {
    $(".js-changeGuidanceQuestionView").each(function() {
        var t = $(this),
            a = $("select:not(.noSelectric)"),
            i = $(".guidanceQuestion-support-wrapper");
        a.selectric({
            disableOnMobile: !1,
            nativeOnMobile: !1,
            optionsItemBuilder: "{text}",
            arrowButtonMarkup: '<b class="slc-button">&#x25be;</b>',
            onChange: function() {
                i.hide(), t.find(".js-informationblock").hide().each(function() {
                    var t = $(this),
                        e = t.data("categories"),
                        n = a.children("option:selected").val();
                    n && 0 <= n.indexOf(e) && (t.show(), i.show())
                })
            }
        })
    })
});
var Template = function() { this.cached = {} },
    HandlebarTemplateHelper = new Template;

function sticky() {
    var t = $(window).scrollTop(),
        e = $("body").offset().top,
        n = $(".headerSticky");
    e < t ? n.addClass("sticky") : n.removeClass("sticky")
}

function showContent(t) { $(t).find(".content").hasClass("hide") ? ($(".headerIcons .content").addClass("hide"), $(t).find(".content").removeClass("hide")) : $(t).find(".content").addClass("hide") }

function openNav(t) { 0 < $(t).next("ul").length && ($(t).toggleClass("active"), $(t).next("ul").toggleClass("navHide navShow")) }

function hideSelects(t) { $(t).removeClass("selectric-navShow"), $(t).addClass("selectric-navHide") }

function followLink(t) { "0" != $(t).find("option:selected").val() && (window.location = $(t).find("option:selected").val()) }

function showSelectedSelect(t, e) {
    var n, a, i = $(t).children("option:selected").data("value"),
        o = $(".navSelect[data-parent=" + i + "]");
    0 < o.length && (void 0 !== (n = o.children("option:selected").data("value")) && ((a = $(".navSelect[data-parent=" + n + "]")).parents("div.selectric-navLevel3").removeClass("selectric-navHide"), a.parents("div.selectric-navLevel3").addClass("selectric-navShow"))), e ? (o.parents(e).removeClass("selectric-navHide"), o.removeClass("navHide"), o.parents(e).addClass("selectric-navShow")) : o.removeClass("navHide"), o.addClass("navShow")
}

function checkwindowWidth() { return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth } $.extend(Template.prototype, {
        render: function(e, n) { HandlebarTemplateHelper.isCached(e) ? n(HandlebarTemplateHelper.cached[e]) : $.get(HandlebarTemplateHelper.urlFor(e), function(t) { HandlebarTemplateHelper.store(e, t), HandlebarTemplateHelper.render(e, n) }) },
        renderSync: function(t, e) { HandlebarTemplateHelper.isCached(t) || HandlebarTemplateHelper.fetch(t), HandlebarTemplateHelper.render(t, e) },
        prefetch: function(e) { $.get(HandlebarTemplateHelper.urlFor(e), function(t) { HandlebarTemplateHelper.store(e, t) }) },
        fetch: function(t) {
            var e;
            HandlebarTemplateHelper.isCached(t) || (e = $.ajax({ url: HandlebarTemplateHelper.urlFor(t), async: !1 }).responseText, HandlebarTemplateHelper.store(t, e))
        },
        isCached: function(t) { return !!HandlebarTemplateHelper.cached[t] },
        store: function(t, e) { HandlebarTemplateHelper.cached[t] = Handlebars.compile(e) },
        urlFor: function(t) { return "../../patterns/" + t + "/" + t + ".hbs" }
    }), $(function() { $.isMobile || $.isTablet || ($(window).scroll(sticky), sticky()) }), $(function() { $(".js-changeNewsboxView").each(function() { $(this).find("select:not(.noSelectric)").selectric({ disableOnMobile: !1, nativeOnMobile: !1, arrowButtonMarkup: '<b class="slc-button">&#x25be;</b>' }) }) }), $(function() {
        var t = $(".js-iconBar");
        t.length && $(window).on("load", function() {
            Foundation.MediaQuery.atLeast("xxlarge") ? (t.find("li").each(function() { $(this).on("click", function(t) { t.stopPropagation(), handleInfoBox($(this)) }) }), $(document).on("click", function() { t.find("li.active").length && (t.find("span.dynamic").remove(), t.find("li").removeClass("active"), t.removeClass("open")) })) : (t.find("li > a").each(function() {
                var t = $(this);
                t.attr("href", t.data("href"))
            }), $(window).on("scroll", function() { 5 < $(this).scrollTop() && t.fadeIn() })), $(window).on("changed.zf.mediaquery", function(t, e, n) { document.location.reload() }), updateStickyNavCartIcon(), updateStickyNavWatchlistIcon()
        }), $(".js-iconBar #sn-basket a").click(function() {
            $(this).data("campaign");
            dataLayer.push({ event: "customEvent", eventInfo: { category: "Internal Click", action: "cart", label: "Floating Navi" } })
        }), $(".js-iconBar #sn-compare a").click(function() {
            $(this).data("campaign");
            dataLayer.push({ event: "customEvent", eventInfo: { category: "Internal Click", action: "watchlist", label: "Floating Navi" } })
        });
        t.on("mouseenter", function() { clearTimeout(timeoutHandle) }).on("mouseleave", function() {
            var t;
            t = (t = 5e3) || 3e3, timeoutHandle && clearTimeout(timeoutHandle), timeoutHandle = setTimeout(function() {
                var t = $(".js-iconBar");
                t.find("li.active").length && (t.find("span").remove(), t.find("li").removeClass("active"), t.removeClass("open"))
            }, t)
        }), 1420 < $(window).width() && $(window).on("scroll", function() { 20 < $(this).scrollTop() ? $(".nws-cn #sticky-nav").show() : $(".nws-cn #sticky-nav").hide() })
    }), $(function() {
        var f, p;

        function i(t, e) {
            var n, a = $(".slick-dots", t),
                i = $(".slick-active", a),
                o = [],
                s = $("li", a),
                r = 2 <= i.index() ? 2 : i.index(),
                l = 2 <= s.length - 1 - i.index() ? 2 : s.length - 1 - i.index(),
                c = i.prevAll(),
                d = i.nextAll(),
                u = p,
                h = f;
            for (r <= 2 && (l += 2 - r), l <= 2 && (r += 2 - l), 1 === Math.abs(u - h) && 2 <= h && 2 <= u && 2 < e - u && 2 <= e - h ? 0 < u - h ? (s.eq(u - 3).addClass("fadeout"), window.setTimeout(function() { s.eq(u - 3).removeClass("fadeout").addClass("hide") }, 250), s.eq(u + 2).addClass("fadein").removeClass("hide"), window.setTimeout(function() { s.eq(u + 2).removeClass("fadein") }, 250)) : (s.eq(u + 3).addClass("fadeout"), window.setTimeout(function() { s.eq(u + 3).removeClass("fadeout").addClass("hide") }, 250), s.eq(u - 2).addClass("fadein").removeClass("hide"), window.setTimeout(function() { s.eq(u - 2).removeClass("fadein") }, 250)) : s.addClass("hide"), n = 0; n < r; n++) o.push(c.eq(n));
            for (o.push(i), n = 0; n < l; n++) o.push(d.eq(n));
            o.forEach(function(t) { return $(t).removeClass("hide") })
        }
        $(".sliderContainer.js-topicPreviewSlider").each(function() {
            var t = $(this),
                e = $(this).data("slider-slides-to-show"),
                n = $(this).data("slider-arrows"),
                a = $(this).find(".slider"),
                i = $(this).data("slider-mode"),
                o = new SliderConfig,
                s = t.outerWidth(),
                r = [{ breakpoint: 1024, settings: { autoplay: !0, autoplaySpeed: 4e3, arrows: !1, dots: !0, centerMode: !0, centerPadding: o.calculateCenterPadding(s, .3) + "px", slidesToShow: 1 } }];
            o.setWrapper(t), o.setSelectorClass(a), o.setSliderMode(i), o.setSlidesToShow(e), o.setSpeed(200), o.setArrows(n), o.setResponsive(r), o.setCenterMode(!0), o.setCenterPadding(o.calculateCenterPadding(s, .3) + "px"), o.customSliderBinding(), o.initSlider()
        }), $(".hotWheelsSLider-v2").each(function() {
            var t = new SliderConfig,
                e = $(this).data("slider-mode"),
                n = $(this).find(".slider"),
                o = $(this).data("slides-to-show");
            t.setWrapper($(this)), t.setSelectorClass(n), $(this).find(".slide").length !== $(this).data("slides-to-show") && (t.setSlidesToShow(o), t.setSliderMode(e)), t.setSpeed(500), $(this).on("init", function(t, e) {
                var n = $(".slick-center", $(this));
                n.addClass("main"), n.prev().addClass("secondRow"), n.next().addClass("secondRow"), 5 === o && (n.prev().addClass("left"), n.next().addClass("right"))
            }), t.initSlider(), $(this).addClass("animating"), 5 < $(".slide", this).length && i($(this)), $(this).on("beforeChange", function(t, e, n, a) {
                $(".main", this).removeClass("main"), $(".secondRow", this).removeClass("secondRow");
                var i = $('.slide[data-unique="' + $(e.$slides[a]).data("unique") + '"]', this);
                i.addClass("main"), i.prev().addClass("secondRow"), i.next().addClass("secondRow"), 5 === o && ($(".left", this).removeClass("left"), $(".right", this).removeClass("right"), i.prev().addClass("left"), i.next().addClass("right")), 5 < e.$slides.length && (f = n, p = a)
            }), $(this).on("afterChange", function(t, e, n, a) { 5 < e.$slides.length && i(this, e.$slides.length) })
        })
    }), $(function() {
        var t = $("body"),
            e = $(window);

        function n() { 0 < e.scrollTop() ? t.addClass("isScrolled") : t.removeClass("isScrolled") } n(), e.on("scroll", function() { n() })
    }), $.urlParam = function(t) { var e = new RegExp("[?&#]" + t + "=([^&#]*)").exec(window.location.href); return null == e ? null : e[1] || 0 }, $.isMobile = function(t) { return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(t) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0, 4)) }(navigator.userAgent || navigator.vendor || window.opera), $.isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i.test(navigator.userAgent || navigator.vendor || window.opera), $.isIOS = function() { return ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(navigator.platform) || navigator.userAgent.includes("Mac") && "ontouchend" in document }, $(function() {
        $(".lang-selector").each(function() {
            $(this).find(".js-languageSwitchUrlSelector").on("click", function(t) {
                t.preventDefault();
                var e = $(this).attr("href"),
                    n = location.href,
                    a = location.origin + location.pathname,
                    i = n.replace(a, "");
                0 < i.length ? window.location.href = e + i : window.location.href = e
            }), $(this).on("mouseover mouseleave", function(t) {
                var e;
                t.preventDefault(t), "mouseover" === t.type ? ((e = $(".js-sticky-nav [id^=sn-]")).find(".content").addClass("hide"), e.find("#search").val(""), $(this).addClass("active")) : $(this).removeClass("active")
            })
        })
    }), $(".js-buttonForLoadSource").each(function() {
        var t = $(this).closest(".js-buttonForLoadContainer"),
            e = t.next($("[data-click-2-show-source]")),
            n = e.attr("width"),
            a = e.attr("height");
        e.attr("width", "0px"), e.attr("height", "0px"), t.css({ width: n, height: a }), $(".js-buttonForLoadSource").on("click", function() { e.attr("src", e.data("src")), e.attr("width", n), e.attr("height", a), e.removeClass("hide"), $(this).parent(".privacyContainer").hide() })
    }), $(function() { showSelectedSelect(".navSelect.navLevel1") }), $(".js-sideNavigation a.navLink").click(function() { openNav(this) }), $(".navSelect.navLevel1").change(function() { hideSelects("div.selectric-navLevel2"), hideSelects("div.selectric-navLevel3"), showSelectedSelect(this, "div.selectric-navLevel2") }), $(".navSelect.navLevel2").change(function() { followLink(this), hideSelects("div.selectric-navLevel3"), showSelectedSelect(this, "div.selectric-navLevel3") }), $(".navSelect.navLevel3").change(function() { followLink(this) }),
    function(k) {
        var n = "";

        function C(t) { var e = k.Deferred(); return t(e.resolve, e.reject), e } k(document).on("ready", function() {
            function w(t) { return decodeURIComponent(n[t]) }

            function b(t, e) {
                var n = k("#result");
                e && n.empty(), k("<div/>").addClass("hint").append(k("<h2/>").text(t)).appendTo(n)
            }

            function y() {
                var t, e, n, a, i, o = (e = t || function() {
                    var t = k("#focallength").first(),
                        e = JSON.parse(sessionStorage.getItem("lensSelector_Filters") || []),
                        n = sessionStorage.getItem("lensSelector_currentFilter_series"),
                        a = t.val(),
                        i = "";
                    e && e.length && k.each(e, function(t, e) { this.ID.toLowerCase() === n && (i = this.TEXT) });
                    return { allAvailableFilters: e, currentFocalVal: a, currentSeriesName: i }
                }(), n = parseFloat(e.currentFocalVal), a = { focalLengthCaseSpecificOne: n <= 2, focalLengthCaseSpecificTwo: n <= 3.9 && ["basler Scout", "basler Pilot", "basler Med Ace", "basler Ace", "basler Ace 2", "basler Aviator"].some(function(t) { return t.toLowerCase() === e.currentSeriesName.toLowerCase() }) }, i = [{ condition: a.focalLengthCaseSpecificOne, hintText: w("lensSelector_hint_general_focalLength") }, { condition: a.focalLengthCaseSpecificTwo, hintText: w("lensSelector_hint_general_focalLength_family") }], Object.assign(a, { hintsToShow: i, dontShowProducts: a.focalLengthCaseSpecificOne || a.focalLengthCaseSpecificTwo, performingOk: !(a.focalLengthCaseSpecificOne || a.focalLengthCaseSpecificTwo) }));
                return sessionStorage.setItem("lensSelector_performing", JSON.stringify(o)), o
            }! function() {
                if (!n) {
                    var t = k("section.lens-selector"),
                        e = t.attr("data-json");
                    if (!t.length || !e) return;
                    n = JSON.parse(e && e.length ? e : "{translations: {}}").translations
                }
            }(), k(function() {
                var i = "",
                    u = "LENS SELECTOR",
                    o = k(".lens-selector"),
                    n = k("#camera-series").on("change", function() { r.set(k(this).attr("id"), k(this).find("option:selected").val()), location.hash = r.toString(), (i = k(this).find("option:selected").val()) && d(i) }),
                    s = k("#camera-model").on("change", function() {
                        r.set(k(this).attr("id"), k(this).find("option:selected").val()), location.hash = r.toString();
                        var t = k(this).find("option:selected").val();
                        sessionStorage.setItem("lensSelector_currentFilter_cameraModel", t), "all" != t && g()
                    }),
                    h = k(".button.reset"),
                    f = k(".showLensesBtn"),
                    t = k("#result"),
                    r = hashParams(location.hash),
                    l = r.getAll(),
                    p = {};

                function v(a) {
                    var i = null,
                        o = sessionStorage.getItem("lensSelector_currentFilter_cameraModel") || s.val();
                    return sessionStorage.setItem("lensSelector_currentFilter_cameraModel", o), k.each(Object.keys(a.items), function(t, e) { var n = a.items[e]; if (o === n.lensselector_camera_model_id) return i = n, !1 }), i
                }

                function c() { k.ajax({ data: JSON.stringify(""), dataType: "json", url: JSConf.javascript.lensSelectorOptionsSerieJSON, type: "post" }).done(function(t) { sessionStorage.setItem("lensSelector_Filters", JSON.stringify(t || [])), n.empty(), k.each(t, function(t, e) { n.append(k("<option></option>").attr("value", e.ID).text(e.TEXT)) }) }).fail(function(t, e, n) { console.error(u, e, t.status, n) }) }

                function d(t) {
                    var e = "all" !== t ? t : "";
                    sessionStorage.setItem("lensSelector_currentFilter_series", e), k.ajax({ data: JSON.stringify(e), dataType: "json", url: JSConf.javascript.lensSelectorOptionsModelJSON, type: "post" }).done(function(t) { for (var e in s.empty(), k.each(t, function(t, e) { s.append(k("<option></option>").attr("value", e.ID).text(e.TEXT)) }), l) { var n; "undefined" !== l[e] && l[e] ? l.hasOwnProperty(e) && l[e] && (n = "#" + String(e), k("#step-1").find(n).val(l[e])) : r.set(String(e), "") } s.selectric({ disableOnMobile: !1, arrowButtonMarkup: '<b class="slc-button">&#x25be;</b>' }) }).fail(function(t, e, n) { console.error(u, e, t.status, n) })
                }

                function g(t) {
                    var e = k("#step-1 #camera-series"),
                        n = k("#step-1 #camera-model"),
                        a = k("#step-2 #val01 input"),
                        i = k("#step-2 #val02 input"),
                        o = k("#step-2 #val03 input"),
                        s = k("#step-2 #val04 input"),
                        r = k("#step-2 #val05 input"),
                        l = k("#step-2 #val06 input"),
                        c = [];
                    c.push(a), c.push(i), c.push(o), c.push(s), c.push(r), c.push(l);
                    var d = t ? new Array({ selectSerie: e.val() }, { selectModel: n.val() }, { input01: a.val() }, { input02: i.val() }, { input03: o.val() }, { input04: s.val() }, { input05: r.val() }, { input06: l.val() }, { RESET: !0 }) : new Array({ selectSerie: e.val() }, { selectModel: n.val() }, { input01: a.val() }, { input02: i.val() }, { input03: o.val() }, { input04: s.val() }, { input05: r.val() }, { input06: l.val() });
                    sessionStorage.setItem("lensSelector_configuredData", JSON.stringify(d)), k.ajax({ data: JSON.stringify(d), dataType: "json", url: JSConf.javascript.lensSelectorUserFieldsJSON, type: "post" }).done(function(t) {
                        return k.each(t, function(t, e) { t < 6 && (e.VAL ? c[t].val(e.VAL) : c[t].val(""), e.DISABLED ? c[t].attr("disabled", !0) : c[t].removeAttr("disabled"), e.CALCULATED ? c[t].closest("div").addClass("calculated") : c[t].closest("div").removeClass("calculated"), e.ERROR ? c[t].closest("div").addClass("error") : c[t].closest("div").removeClass("error")), e.BUTTONRESET && (e.BUTTONRESET ? h.removeClass("disabled") : h.addClass("disabled")), e.COMPLETE && f.removeClass("disabled") }), k("#step-2 input").each(function() {
                            k(this).change(function() { "" !== k(this).val() && dataLayer.push({ event: "customEvent", eventInfo: { category: "Lens Selector", action: k(this).val(), label: k(this).attr("id") } }), g() }), k(this).focus(function() {
                                var t = k(this).attr("id");
                                k("#selector-figure img").attr("src", k("#selector-figure img").data(t))
                            }), k(this).blur(function() { k("#selector-figure img").attr("src", k("#selector-figure img").data("basic")) })
                        }), !0
                    }).fail(function(t, e, n) { return console.error(u, e, t.status, n), !1 })
                }

                function m() {
                    t.find(".icn-add-to-cart").on("click", function() {
                        var t = k(this).data("product-id");
                        isFilled(k(this)) ? _deleteProduct("basket", t, function(t) { t && (flashIcon("basket", 500), updateProductIcons()) }) : addProduct("basket", t, function(t) { t && (flashIcon("basket", 500), updateProductIcons()) })
                    }), t.find(".icn-add-to-fav").on("click", function() {
                        var t = k(this).data("product-id");
                        isFilled(k(this)) ? _deleteProduct("compare", t, function(t) { t && (flashIcon("compare", 500), updateProductIcons()) }) : addProduct("compare", t, function(t) { t && (flashIcon("compare", 500), updateProductIcons()) })
                    }), productTeaserInit()
                }
                o.length && function() {
                    for (var t in l) { var e; "undefined" !== l[t] && l[t] ? l.hasOwnProperty(t) && l[t] && (e = "#" + String(t), k("#step-1").find(e).val(l[t])) : r.set(String(t), "") }
                    var n, a;
                    i = k("#camera-series").find("option:selected").val(), k(".js-lenses-reset").on("click", function(t) { return 0 < k("#accessories").length ? (t.preventDefault(), k("#result").empty(), c(), d(""), g(!0), f.addClass("disabled"), !1) : void location.reload() }), f.on("click", function(t) {
                        k("#result").empty();
                        var e, n, a, r, i = y();
                        if (k.each(i.hintsToShow.filter(function(t) { return t.condition }).map(function(t) { return t.hintText }), function(t, e) { i.dontShowProducts ? b(e) : b(e, !1) }), i.dontShowProducts || !i.performingOk) return !1;
                        e = JSON.parse(sessionStorage.getItem("lensSelector_configuredData")), n = function(t) { t && t.length || (i.hintsToShow = [w("lensSelector_hint_noResults")], b(i.hintsToShow[0])) }, a = e || "", r = [], console.info("getResultData() ", a), k.ajax({ data: JSON.stringify(a), dataType: "json", url: JSConf.javascript.lensSelectorResultJSON, type: "post" }).done(function(t) {
                            var e, n, s, a, i = k("#result"),
                                o = [];
                            return t.error ? (e = "<h3>" + t.error + "</h3>", o.push(e)) : (n = t, s = v(p.cameraObj), a = n, k.each(Object.keys(a), function(t, e) {
                                var n = a[e];
                                n.ITEMS = n.ITEMS.filter(function(t) { return e = s, n = p.lensObj.items, a = t.ITEM_ID, i = e, o = n[a], o.camera_models.some(function(t) { return (t || "").toString() === i.lensselector_camera_model_id.replace(/[^\d]+/g, "") }); var e, n, a, i, o })
                            }), r = a.filter(function(t) { return t.ITEMS && t.ITEMS.length }), k.each(r, function(t, l) {
                                var c = "<div class='row lensSelectorRow'>",
                                    d = "",
                                    u = "",
                                    h = v(p.cameraObj);
                                c += "<h3>" + l.RESULT_HEADING + "</h3>", k.each(l.ITEMS, function(t, e) {
                                    var n, a, i, o, s = "",
                                        r = h ? (n = h, a = e.ITEM_ID, i = p.lensObj.items, o = i[a], function(e, n) { var t = ["Basler dart", "Basler pulse"].some(function(t) { return e.camera_series.toLowerCase() === t.toLowerCase() }); return { hints: [{ condition: t && e.specs.lens_mount && e.specs.lens_mount.value.some(function(e) { return ["CS-mount"].some(function(t) { return e === t }) }) && n.specs.lens_mount.value.some(function(e) { return ["S-mount"].some(function(t) { return e === t }) }), hintText: w("lensSelector_hint_sMountLensWithCSMountCam") }, { condition: t && e.specs.lens_mount && e.specs.lens_mount.value.some(function(e) { return ["CS-mount"].some(function(t) { return e === t }) }) && ["2000034830", "2000034831", "2000034832", "2000034833", "2000034834", "2000034835"].some(function(t) { return n.specs.ordernumber.value === t }), hintText: w("lensSelector_hint_c125Lens") }, { condition: t && ["2000034830"].some(function(t) { return n.specs.ordernumber.value === t }), hintText: w("lensSelector_hint_c125with4MM") }, { condition: t && ["2000034831", "2000034832"].some(function(t) { return n.specs.ordernumber.value === t }), hintText: w("lensSelector_hint_c125with6v8MM") }].filter(function(t) { return t.condition }).map(function(t) { return t.hintText }) } }(n, i && o ? o : null).hints) : [];
                                    e.ITEM_ACTIVE || (s = " disabled"), c += "<div class='product-teaser lensTeaserProduct" + s + "' product-id='" + e.ITEM_ID + "' data-equalizer-watch>", c += "    <div class='inner'>", c += "        <figure class='text-center'>", c += "            <a href='" + e.PRODUCT_URL + "'><img src=" + e.FIGURE_THUMB_URL + " alt='" + e.PRODUCT_SPECIFICATION + "'></a>", e.OVERLAY && (c += "<div class='overlay'>", c += "    <img src='" + e.OVERLAY + "' alt=''>", c += "</div>"), c += "        </figure>", c += "        <div class='top-bar'>", c += "        <div class='text'><a href='" + e.PRODUCT_URL + "'>" + e.PRODUCT_SPECIFICATION + "</a></div>", c += "            <div class='top-bar-left'>", c += "            <a class='more'>" + e.PRODUCT_MORETEXT + "</a>", e.DETAILS_WARNING_1 && (c += "            <svg class='icon warning limitedRes'><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-warning'></use></svg>"), e.DETAILS_WARNING_2 && (c += "            <svg class='icon warning poorRes'><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-warning'></use></svg>"), e.DETAILS_WARNING_3 && (c += "            <svg class='icon warning vignetting'><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-warning'></use></svg>"), e.DETAILS_WARNING_4 && (c += "            <svg class='icon warning smount'><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-warning'></use></svg>"), r.length && (c += "            <svg class='icon warning customHint'><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-warning'></use></svg>"), c += "            </div>", d = e.PRODUCT_IS_ON_CART ? "-filled" : "", u = e.PRODUCT_IS_ON_FAV ? "-filled" : "", c += "            <div class='top-bar-right'>", c += "\t\t\t  <a class='link-go-to-vsc' data-product-id='" + e.ITEM_ID + "' href='" + l.LINK_TO_VSC + "#/selection/camera/cameraCategory=asc/select-camera-model=" + l.CAMERA_MODEL_ID + "/select-camera-lens=" + e.ITEM_ID + "'><img src='" + l.VSC_ICON + "'/></a>", c += "                 <div class='icn-add-to-cart grow' data-product-id='" + e.ITEM_ID + "'>", c += "                    <svg><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-cart" + d + "' /></svg>", c += "                </div>", c += "                <div class='icn-add-to-fav grow'  data-product-id='" + e.ITEM_ID + "'>", c += "                    <svg><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-fav" + u + "' /></svg>", c += "                </div>", c += "            </div>", c += "        </div>", c += "        <section class='product-teaser-details'>", c += "            <figure><a href='" + e.PRODUCT_URL + "'><img src=" + e.FIGURE_URL + " alt='" + e.PRODUCT_SPECIFICATION + "'></a></figure>", c += "            <article class='table-wrapper'>", k.each(e.DETAILS_TABLES, function(t, e) { e.hasOwnProperty("HEADLINE") ? c += "<table><thead><tr><th colspan='2'>" + e.HEADLINE + "</th></tr></thead><tbody>" : c += "<table><tbody>", k.each(e.CONTENT, function(t, e) { c += "<tr><td>" + t + "</td><td>" + e + "</td></tr>" }), c += "</tbody></table>" }), e.DETAILS_WARNING_1 && (c += "            <div class='warning res limitedRes'><svg class='icon warning limitedRes'><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-warning'></use></svg>" + e.DETAILS_WARNING_1 + "</div>"), e.DETAILS_WARNING_2 && (c += "            <div class='warning res poorRes'><svg class='icon warning poorRes'><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-warning'></use></svg>" + e.DETAILS_WARNING_2 + "</div>"), e.DETAILS_WARNING_3 && (c += "            <div class='warning res vignetting'><svg class='icon warning vignetting'><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-warning'></use></svg>" + e.DETAILS_WARNING_3 + "</div>"), e.DETAILS_WARNING_4 && (c += "            <div class='warning res smount'><svg class='icon warning smount'><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-warning'></use></svg>" + e.DETAILS_WARNING_4 + "</div>"), r.length && k.each(r, function(t, e) { c += "            <div class='warning res customHint'><svg class='icon warning customHint'><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-warning'></use></svg>" + e + "</div>" }), c += "            </article>", c += "            <div class='top-bar'>", c += "                <a href='" + e.PRODUCT_URL + "'>" + e.PRODUCT_URL_NAME + "</a>", c += "                <a class='link-add-to-fav' data-product-id='" + e.ITEM_ID + "'><svg class='grow icon'><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-fav" + u + "'></use></svg>" + e.PRODUCT_FAVOURITE_NAME + "</a>", c += "                <a class='orange link-add-to-cart' data-product-id='" + e.ITEM_ID + "'><svg class='grow icon orange'><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-cart" + d + "'></use></svg>" + e.PRODUCT_BASKET_NAME + "</a>", c += "            </div>", c += "        </section>", c += "    </div>", c += "</div>"
                                }), c += "</div>", o.push(c)
                            })), i.append(o), Foundation.reInit("equalizer"), m(), k(".onlycontent .product-teaser figure > a, .onlycontent .product-teaser .text > a, .onlycontent .product-teaser-details .top-bar > a").click(function(t) { t.preventDefault(), window.open(this.href) }), k(".onlycontent .link-add-to-fav, .onlycontent .link-add-to-cart, .onlycontent .icn-add-to-fav, .onlycontent .icn-add-to-cart").hide(), !0
                        }).fail(function(t, e, n) { return console.error(u, e, t.status, n), !1 }).always(function() { "function" == typeof n && n(r) })
                    }), n = function() { m(), c(), d(i), g(!0) }, a = [k.ajax({ method: "GET", dataType: "json", url: JSConf.javascript.lensSelectorLensesPath }).then(function(n) { return C(function(t, e) { t({ lensObj: n }) }) }), k.ajax({ method: "GET", dataType: "json", url: JSConf.javascript.lensSelectorCamerasPath }).then(function(n) { return C(function(t, e) { t({ cameraObj: n }) }) })], k.when.apply(k, a).done(function() { p.lensObj = arguments[0].lensObj, p.cameraObj = arguments[1].cameraObj, "function" == typeof n && n() }), o.find("select:not(.noSelectric)").selectric({ disableOnMobile: !1, arrowButtonMarkup: '<b class="slc-button">&#x25be;</b>' })
                }()
            })
        })
    }(jQuery),
    function(l) {
        l(document).on("ready", function() {
            l(function() {
                var t = l(".location-selector"),
                    o = (l("#request"), l("#result")),
                    n = l("#regionSelect"),
                    s = l("#countrySelect"),
                    r = {};

                function a(t, e) {
                    var n, a, i;
                    "regions" === t && ("all" === (n = e.find("option:selected").val()) ? (s.val("all"), s.attr("disabled", !0).selectric("refresh"), o.find(".row").show(), dataLayer.push({ event: "customEvent", eventInfo: { category: "Region Select", action: n, label: "Sales" } })) : (s.removeAttr("disabled").selectric("refresh"), o.find(".row").hide(), o.find(".row[data-region='" + n + "']").show(), o.find(".location-teaser[data-region='" + n + "']").show(), dataLayer.push({ event: "customEvent", eventInfo: { category: "Region Select", action: n, label: "Sales" } }), r.countries = [], o.find(".row:visible").find(".location-teaser").each(function() {
                        var t = l(this).data("country"),
                            e = l(this).find("h4").text();
                        t && e && r.countries.push([t, e])
                    }), (a = [r.countries.filter(function(t) { return 1 === (this[t[0]] = (this[t[0]] || 0) + 1) }, {})])[0].sort(), i = "", i += "<option value='all'>" + s.find("option").first().text() + "</option>", l.each(a[0], function() { i += "<option value='" + this[0] + "'>" + this[1] + "</option>" }), s.empty().selectric("refresh").append(i).selectric("destroy").selectric({ disableOnMobile: !1, nativeOnMobile: !1, arrowButtonMarkup: '<b class="slc-button">&#x25be;</b>', onChange: function() { var t = s.find("option:selected").val(); "all" === t ? o.find(".row:visible").find(".location-teaser").show() : (o.find(".row:visible").find(".location-teaser").hide(), o.find(".row:visible").find(".location-teaser[data-country='" + t + "']").show()), dataLayer.push({ event: "customEvent", eventInfo: { category: "Country Select", action: t, label: "Sales" } }) } }), s.change(function() { var t = s.find("option:selected").val(); "all" === t ? o.find(".row:visible").find(".location-teaser").show() : (o.find(".row:visible").find(".location-teaser").hide(), o.find(".row:visible").find(".location-teaser[data-country='" + t + "']").show()), dataLayer.push({ event: "customEvent", eventInfo: { category: "Country Select", action: t, label: "Sales" } }) })))
                }
                r.regions = [], r.countries = [], t.length && function() {
                    o.find(".row").each(function() {
                        var t = l(this).data("region"),
                            e = l(this).find("h3").text();
                        t && e && r.regions.push([t, e])
                    });
                    var t = [r.regions.filter(function(t) { return 1 === (this[t[0]] = (this[t[0]] || 0) + 1) }, {})];
                    t[0].sort();
                    var e = "";
                    l.each(t[0], function() { e += "<option value='" + this[0] + "'>" + this[1] + "</option>" }), n.append(e), n.selectric({ disableOnMobile: !1, arrowButtonMarkup: '<b class="slc-button">&#x25be;</b>', onChange: function() { a("regions", l(this)) } }), s.selectric({ disableOnMobile: !1, arrowButtonMarkup: '<b class="slc-button">&#x25be;</b>', onChange: function() { a("countries", l(this)) } }), n.change(function() { a("regions", l(this)) }), s.change(function() { a("countries", l(this)) })
                }()
            })
        })
    }(jQuery), $(document).ready(function() {
        $(".imageBlock").hover(function() {
            $(this).addClass("hover"), $(this).siblings().removeClass("hover"), $(this).siblings().removeClass("newsBocksClickEvent");
            var t = $(this);
            setTimeout(function() { t.addClass("newsBocksClickEvent") }, 200)
        }), $(".imageBlock").on("click", function(t) {
            var e;
            $(this).hasClass("newsBocksClickEvent") && (e = $(this).find("a"), window.open(e.attr("href"), e.attr("target")))
        }), $(".js-tabbing-nav-element").on("click", function() {
            var t = $(this),
                e = t.parents(".js-module-root");

            function n(t, e) { t.removeClass("active").eq(e).addClass("active") } n(e.find(".js-tabbing-content"), t.index()), n(e.find(".js-tabbing-nav-element"), t.index())
        })
    }), $(window).resize(function() {}),
    function(u) {
        ! function() {
            var t = u("#infinite-loading-news"),
                e = 0,
                n = [],
                a = paginationHelper(n, 10);
            t.css("visibility", "hidden");

            function i() { a.getPage(e) && (a.getPage(e).forEach(function(t) { u(t).fadeIn() }), e++) } window.initInifiniteScrollNews = function() { e = 0, n = Array.prototype.slice.call(u(".news-teaser .img-txt-teaser"), 0), 1 < (a = paginationHelper(n, 10)).pageCount() ? (t.show(), t.css({ visibility: "visible", opacity: 0 }).animate({ opacity: 1 }, 200)) : t.animate({ opacity: 0 }, 200, function() { t.css("visibility", "hidden") }), n.forEach(function(t) { t.style.display = "none" }), i(), t.one("click", function() { u(this).animate({ opacity: 0 }, 200, function() { t.css("visibility", "hidden") }), i() }) }, u(window).on("scroll", function() { "hidden" === t.css("visibility") && t[0].getBoundingClientRect().bottom < u(window).height() && i() })
        }(), initInifiniteScrollNews(), u(document).on("ready", function() {
            u(function() {
                var a = "NEWS FILTER",
                    t = u(".news-filter.request"),
                    l = t,
                    o = u(".news-teaser.result"),
                    s = u("#infinite-loading"),
                    c = u(".button.reset");

                function d(t) {
                    var e = t || "";
                    console.info("getResultData() ", e), window.scrollTo(0, 0);
                    var n = JSConf.javascript.newsResultJSON;
                    u.ajax({ data: JSON.stringify(e), dataType: "json", url: n, type: "post" }).done(function(t) {
                        u("#infinite-loading-news").css("visibility", "hidden"), u("#infinite-loading-news").hide(), 0;
                        var a = [],
                            i = !0;
                        u.each(t, function(t, e) {
                            var n = "";
                            e.LOAD_MORE, e.ITEMS.length && (i = !1), u.each(e.ITEMS, function(t, e) { n += "<div class='img-txt-teaser'>", n += " <div class='img-container'><a href='" + e.LINK + "'><img src='" + e.IMAGE + "' alt='" + e.HEADLINE + "'></a></div>", n += " <div class='txt-container'>", n += "   <span class='date'>" + e.DATE + "</span>", n += "     <a href='" + e.LINK + "'>", n += "       <h2>" + e.HEADLINE + "</h2>", n += "     </a>", n += "     <p>" + e.EXCERPT + " <a href='" + e.LINK + "'>" + e.LINKTEXT + "</a></p>", n += " </div>", n += "</div>" }), a.push(n)
                        }), i ? (o.empty(), s.hide(), u(".no-result").show()) : (u(".no-result").hide(), s.show(), o.empty().append(a)), u(".selector-begin").hide(), u(".selector-results").fadeIn("fast"), u(".selector-results .no-elements").removeClass("pulse"), setTimeout(function() { u(".selector-results .no-elements").text(u(".img-txt-teaser").length).addClass("pulse") }, 0), initInifiniteScrollNews()
                    }).fail(function(t, e, n) { return console.error(a, e, t.status, n), !1 })
                }
                t.length && function() {
                    u("#infinite-loading-news").css("visibility", "hidden"), u("#infinite-loading-news").hide(), initInifiniteScrollNews(), u(".selector-begin .no-elements").removeClass("pulse"), setTimeout(function() { u(".selector-begin .no-elements").text(u(".img-txt-teaser").length).addClass("pulse") }, 0), u(".selector-results .no-elements").removeClass("pulse"), setTimeout(function() { u(".selector-results .no-elements").text(u(".img-txt-teaser").length).addClass("pulse") }, 0);
                    var t, e = hashParams(location.hash),
                        n = e.getAll(),
                        a = 0;
                    for (var i in n) { "undefined" !== n[i] && n[i] ? n.hasOwnProperty(i) && n[i] && (t = "#" + String(i), "selected" === n[i] && u(".news-filter").find(t).prop("checked", !0), a++) : e.set(String(i), "") }
                    var o, s = [],
                        r = l.find("input:checkbox:checked");
                    0 < u(".img-txt-teaser").length && 0 < a && (u(".selector-begin").hide(), u(".selector-results").fadeIn("fast"), u(".selector-results .no-elements").removeClass("pulse"), setTimeout(function() { u(".selector-results .no-elements").text(u(".img-txt-teaser").length).addClass("pulse") }, 0)), 0 < a && (r.each(function() {
                        e.set(u(this).attr("id"), "selected"), location.hash = e.toString();
                        var t = jQuery.parseJSON('{ "NAME": "' + u(this).attr("name") + '", "VALUE": "' + u(this).val() + '" }');
                        s.push(t)
                    }), d(s)), u("select.year").each(function() {
                        u(this).on("change", function() {
                            var t = u(this).find("option:selected").data("url");
                            t && (document.location.href = t)
                        })
                    }), l.find("input:checkbox").on("change", function() { s = [], r = l.find("input:checkbox:checked"), e.set(u(this).attr("id"), ""), location.hash = e.toString(), r.each(function() { e.set(u(this).attr("id"), "selected"), location.hash = e.toString(), o = jQuery.parseJSON('{ "NAME": "' + u(this).attr("name") + '", "VALUE": "' + u(this).val() + '" }'), s.push(o) }), d(s) }), c.click(function() { window.location = window.location.href.split("#")[0] })
                }()
            })
        })
    }(jQuery), $(function() {
        $(".js-changeNewsboxView").each(function() {
            var a = $(this),
                s = 4;

            function t() {
                var i, e, o, t = a.find(".js-informationblock"),
                    n = a.find("select.table-filter").val();
                n ? (i = n, e = s, o = 0, t.hide().each(function() {
                    var t, n = $(this),
                        a = !1;
                    o < e && ((t = n.data("categories")) && $.each(t.split(","), function(t, e) {-1 !== $.inArray(e.toLowerCase(), i.map(function(t) { return t.toLowerCase() })) && (n.show(), a = !0) })), a && (o += 1)
                }), r(t)) : t.hide().filter(":lt(" + s + ")").show()
            }

            function r(t) { t.each(function() { $(this).hasClass("hover") && $(this).addClass("newsBocksClickEvent") }) } a.find("select.table-filter").on("selectric-change", t), t(), r(a.find(".js-informationblock"))
        })
    });
var PriceBookService = {
    countryCode: "",
    serviceUrl: JSConf.javascript.getPricebook,
    requestData: "",
    jsonResult: {},
    setCountryCode: function(t) { this.countryCode = t },
    getCountryCode: function() { return this.countryCode },
    getObjectByCountryCode: function() { var e = this; return this.jsonResult.filter(function(t) { return t.identifier.toLowerCase() == e.countryCode.toLowerCase() })[0] },
    setJsonResult: function(t) { this.jsonResult = t },
    getPriceBook: function(n) {
        this.countryCode && (this.requestData.countryCode = this.countryCode);
        var a = this;
        $.ajax({ data: JSON.stringify(this.requestData), dataType: "json", url: this.serviceUrl, type: "post" }).done(function(t) {
            a.setJsonResult(t);
            var e = a.getObjectByCountryCode();
            n && n(e)
        })
    }
};

function productFilter(n, a) {
    setTimeout(function() {
        $(".products-filter , .accessories-filter").each(function() {
            var t, h = n;
            if (-1 !== a.indexOf("%")) return !1;
            if (-1 !== a.indexOf("#") && -1 !== a.indexOf(";") || -1 !== a.indexOf("#") && -1 !== a.indexOf("20OR20")) {
                var e = a.split(/#(.+)/)[1].replaceAll("20OR20", " ").split(";");
                if (e.length) {
                    if (0 < $(".products-table").length) t = $(".products-table");
                    else if (0 < $(".accessories-table").length) t = $(".accessories-table");
                    else {
                        if (!(0 < $(".accessoiries-table").length)) return !1;
                        t = $(".accessoiries-table")
                    }
                    $.each(e, function(t, e) { var i, n, o, s, r, l, c, a, d, u; - 1 !== e.indexOf("=") && (i = e.split("=")[0], n = e.split("=")[1].split(" "), a = !1, 0 < $('select[data-filter="' + i + '"]').length && ((o = $('select[data-filter="' + i + '"]').closest(".selectric-wrapper")).find(".table-filter"), s = 0, r = [], a = !(c = !(l = [])), $('select[data-filter="' + i + '"] option').each(function(t, a) { $.each(n, function(t, e) { var n; "showall" !== e && "all" !== e && -1 !== $(a).val().indexOf(e) && (c = !0, n = $(a).val(), r.push($(a).val()), l.push($(a).text()), $('select[data-filter="' + i + '"] option[value="' + n + '"]').attr("selected", !0), o.find("li").removeClass("selected"), o.find('li[data-index="' + s + '"]').addClass("selected")) }), s++ }), d = l.join(","), o.find(".selectric span").text(d)), a && c && (u = r.join(" OR "), h.addFilter(i, u, [i]))) }), h.filter(), 0 < $("#infinite-loading-accessoiries").length && initInifiniteScrollAccessoiries(), t.find("tbody tr").hasClass("footable-empty") ? $(".no-result").show() : $(".no-result").hide()
                }
            }
        })
    }, 2e3)
}

function cloneToolcenterAndContactBox() {
    var t, e, n = $(".toolCenterBox, .contactBox");
    window.matchMedia("(max-width: 41em)").matches ? (t = [], n.each(function() { t.push($(this).clone()) }), e = $('<div class="type5 cloned" /> ').append(t), $(".col-2-wrapper").append(e), n.hide()) : (n.show(), n.hasClass("cloned") && n.remove())
}
$(function() {
    var l, c, d, n, u, h, f;

    function e() {
        l = $("#delivery-country");
        var t, e = $(".productdetail");
        c = e.attr("data-no-pricing-regions").split(","), d = e.attr("data-no-pricing-languages").split(","), n = e.attr("data-geolocation-url"), h = $(".js-buyNowButton-Wrapper").data("rendered-language"), u = u || "ru", l.change(function() {
                ! function(t) {
                    t = t || (u.length ? u : "DE" === $("#language_select").val() ? "de" : ($("#language_select").val(), "ru"));
                    var e = $("option:selected", l).attr("data-pricebook");
                    "CN" === h && (e = "44");
                    $("option:selected", l).val();
                    var n = $("#price_" + e),
                        a = $(".product-details .price-span"),
                        i = $(".price-span#no-price"),
                        o = $(".specTable"),
                        s = $(".js-buyNowButton-Wrapper").attr("data-show-on-language-codes").split(","); {
                        var r;
                        a.addClass("hide"), 0 < n.length && !d.includes($("#language_select").val()) && !c.includes(t) ? (n.removeClass("hide"), o.removeClass("noPrice"), $(".priceContainer:not(.js-show-price-on-selected-country-id)").removeClass("hide"), r = n.text(), $(".priceContainer .price span, .price-wrapper .price span").text(r), 0 < $.trim(r).length && f && !d.includes(f) && !c.includes(f) && s.includes(f.toLowerCase()) && $(".buyNowButtonContainer .priceContainer,.buyNowButtonContainer .price-wrapper").removeClass("hide")) : (i.removeClass("hide"), o.addClass("noPrice"), $(".priceContainer").addClass("hide"), $(".priceContainer .price span, .price-wrapper .price span").text(""), $(".buyNowButtonContainer .priceContainer,.buyNowButtonContainer .price-wrapper").addClass("hide"), $(".js-buyNowButton-Wrapper").addClass("hide"))
                    }
                }($(this).val())
            }), t = u, l.val(t), l.trigger("change"), l.selectric("refresh"),
            function() {
                var t = $("#tr_country_select");
                $("option:selected", l).attr("data-pricebook");
                $("#language_select").val();
                (d.includes($("#language_select").val()) || c.includes($("#language_select").val())) && t.addClass("hide")
            }()
    }

    function updateProductPrice() {
        $(".priceContainer").show();
        if ($(".price:contains('-1')").length == 1) {
            $(".priceContainer").hide();
            $("#no-price").removeClass("hide");
            $("#price_41").addClass("hide");
            $("#price_42").addClass("hide");
            $("#price_44").addClass("hide");
        }

    }
    updateProductPrice();
    $("#delivery-country").change(function() {
        setTimeout(function() {
            updateProductPrice();
        }, 1000);
    })


    function t() { $.ajax({ url: n }).done(function(t) { u = t.data.info.country.toLowerCase(), f = t.data.info.country, e() }) } $(document).ready(function() { $(".product-details").length && $(".productdetail[data-geolocation-url]").length && (e(), window.setTimeout(t, 1)) }), window.setTimeout(function() { $(".loader-wrapper").each(function() { $(this).hide() }) }, 500)
}), $(function() { $(document).on("click", ".content .icn-external, .content .add-to-cart-external", etailerClickHandler) }), Array.prototype.find || Object.defineProperty(Array.prototype, "find", {
    value: function(t, e) {
        if (null == this) throw new TypeError('"this" is null or not defined');
        var n = Object(this),
            a = n.length >>> 0;
        if ("function" != typeof t) throw new TypeError("predicate must be a function");
        for (var i = e, o = 0; o < a;) {
            var s = n[o];
            if (t.call(i, s, o, n)) return s;
            o++
        }
    },
    configurable: !0,
    writable: !0
}), $(function() {
    function a(e) {
        var t = function(t) {
            for (var e = t + "=", n = document.cookie.split(";"), a = 0; a < n.length; a++) {
                for (var i = n[a];
                    " " == i.charAt(0);) i = i.substring(1, i.length);
                if (0 == i.indexOf(e)) return i.substring(e.length, i.length)
            }
            return null
        }("product_cart");
        return (JSON.parse(decodeURIComponent(t) || "[]") || []).find(function(t) { return t.ID === e })
    }
    $(document).on("ready", function() {
        $(function() {
            var t = $(".product-addtocart-container, .products-module");
            t.length && (console.info("PRODUCT DETAIL"), t.find(".button.add-to-cart").on("click", function() {
                var t = $(this).data("product-id"),
                    e = $(".product-addtocart-container").find("input").val(),
                    n = a(t);
                n && (e = (parseInt(e || "0") + parseInt(n.PRODUCT_AMOUNT || "0")).toString()), console.info("num" + e), updateProduct(t, e, function(t) {
                    if(t) {
                        flashIcon("basket", 500);
                        updateProductIcons();
                        addToCartTimeout();
                        // @see https://gcp.baslerweb.com/jira/browse/MCAS-103
                        openBasket();
                    }
                })
            }), t.find(".icn-add-to-fav").on("click", function() {
                var t = $(this).data("product-id"),
                    e = $(this).find("use"); - 1 === e.attr("xlink:href").search("-filled") ? (addProduct("compare", t, function(t) { t && flashIcon("compare", 500) }), e.attr("xlink:href", e.attr("xlink:href").concat("-filled"))) : (_deleteProduct("compare", t, function(t) { t && flashIcon("compare", 500) }), e.attr("xlink:href", e.attr("xlink:href").replace("-filled", "")))
            }), t.find(".icn-add-to-cart").on("click", function() {
                var t = $(this).data("product-id"),
                    e = $(this).find("use"); - 1 === e.attr("xlink:href").search("-filled") ? (addProduct("basket", t, function(t) { t && flashIcon("basket", 500) }), e.attr("xlink:href", e.attr("xlink:href").concat("-filled"))) : (_deleteProduct("basket", t, function(t) { t && flashIcon("basket", 500) }), e.attr("xlink:href", e.attr("xlink:href").replace("-filled", "")))
            }))
        })
    })
}), $(function() {
    var t = $(".keyVisualContainer"),
        e = $(".keyVisual img", t);
    $(document).ready(function() {
        e.length && $(".productImages img", t).click(function() {
            var t;
            (t = $(this)).length && !e.hasClass("animating") && (e.addClass("animating"), setTimeout(function() { e.attr("src", t.attr("src")).attr("alt", t.attr("alt")) }, 400), setTimeout(function() { e.removeClass("animating") }, 800))
        })
    })
}), $(function() {
    var d = "countryFromGeolocation",
        t = "backToWebshop";
    $(".product-block:not(.js-exclude-product)").each(function() {
        var t = $(this).find(".js-buyNowButton-Wrapper").data("rendered-language"),
            n = PriceBookService;
        n.setCountryCode(t), n.getPriceBook(function(t) { visibilityOfWebshopButtonBySelectedLanguage(n.countryCode, t, a) });
        var a = $(this).find(".js-buyNowButton-Wrapper"),
            e = $(".product-teaser-details-etailer").find(".js-buyNowButton-Wrapper"),
            i = $(".buyNowButtonContainer").find(".js-buyNowButton-Wrapper");
        e.length && !i.length ? a = e : !e.length && i.length ? a = i : e.length && e.length && (a = $(".js-buyNowButton-Wrapper")), 0 < a.length && $(".js-delivery-country").on("change", function() {
            var e = t,
                e = $(this).val();
            "cn" == t.toLowerCase() && (e = t.toLowerCase()), n.setCountryCode(e), n.getPriceBook(function(t) { visibilityOfWebshopButtonBySelectedLanguage(e, t, a) })
        })
    });
    var u = "show-on-language-codes";

    function a(t, e) {
        t.addClass("hide");
        var n, a, i, o, s, r, l, c = t.data(u).split(",").map(function(t) { return t.toLowerCase() }); - 1 !== $.inArray(e.toLowerCase(), c) && (a = n = !(l = !0), $(), i = $(), t.hasClass("shop-button") && (i = $(".shop-button"), n = !0), t.find(".btn-goToShop") && (a = !0, t.find(".btn-goToShop")), (n || a) && (null != (o = t.data("rendered-language")) ? "cn" == o.toLowerCase() && (e = o.toLowerCase()) : console.log("--- INFO-STATE  =>   No data attribute 'rendered-language' set for element [  ", t, " ]  check if it is necessary for PriceBookService in this template as default "), (s = PriceBookService).setCountryCode(e), n && (r = CookieFunctions.getCookie(d), "CN" === o && (r = i.data("rendered-language").toLowerCase()), $.ajax({ data: JSON.stringify(r), dataType: "json", url: JSConf.javascript.getPricebook, type: "post" }).done(function(t) {
            var e, n = t.filter(function(t) { return t.identifier.toLowerCase() == r.toLowerCase() });
            0 < n[0].webshop_url_landingpage.length && (e = new URL(n[0].webshop_url_landingpage), i.attr("href", e.href))
        })), a && s.getPriceBook(function(t) { t.webshop_url_landingpage && ($("#aa_dynamic_webshop_button").attr("data-href", t.webshop_url), new URL(t.webshop_url_landingpage)) })), t.hasClass("js-buyNowButton-Wrapper") && (0 === $(".selectric-js-delivery-country").length && 0 === $(".applicationAdvisor").length && (l = !1, t.closest(".buyNowButtonContainer").find(".js-show-price-on-selected-country-id").addClass("hide")), 0 == $.trim($(".buyNowButtonContainer .priceContainer .price span,.buyNowButtonContainer .price-wrapper .price span").text()).length && (l = !1)), l && t.removeClass("hide"))
    }
    $("[data-show-on-language-codes]").each(function() {
        var e, t, n;
        e = $(this), CookieFunctions.getCookie(d) ? a(e, t || CookieFunctions.getCookie(d)) : CookieFunctions.callGeoLocationAndSetStandardGeoCookie(function(t) { a(e, t), n && n() }, 1)
    }), $(".product-teaser-details-etailer");
    var n, e, i = [],
        o = $(".js-backToShop-on-urls-container"),
        s = !1;
    o.length && (o.data("shop-urls") && (i = o.data("shop-urls").split(",")), (e = $.urlParam("referrer")) && (n = e, $.each(i, function(t, e) {-1 !== n.indexOf(e) && (s = !0) })), s ? CookieFunctions.getCookie(t) ? CookieFunctions.getCookie(t) === n ? o.each(function() { $(this).find("a").attr("href", n), $(this).removeClass("hide") }) : (CookieFunctions.setCookie(t, n, CookieFunctions.getTimeByName("30_minutes"), "/"), o.find("a").attr("href", CookieFunctions.getCookie(t)), o.removeClass("hide")) : (CookieFunctions.setCookie(t, n, CookieFunctions.getTimeByName("30_minutes"), "/"), o.find("a").attr("href", n), o.removeClass("hide")) : CookieFunctions.getCookie(t) ? (o.each(function() { $(this).find("a").attr("href", CookieFunctions.getCookie(t)), $(this).removeClass("hide") }), o.removeClass("hide")) : o.addClass("hide")), visibilityOfWebshopButtonBySelectedLanguage = function(i, t, e) {
        e.each(function() {
            var t, n = $(this),
                e = n.data(u).split(",").map(function(t) { return t.toLowerCase() }),
                a = CookieFunctions.getCookie(d); - 1 !== $.inArray(a, e) && -1 !== $.inArray(i.toLowerCase(), e) ? ((t = PriceBookService).setCountryCode(i), t.getPriceBook(function(t) {
                var e;
                t.webshop_url && (new URL(t.webshop_url), e = n.find(".buyNowButton").data("ordernumber-id"), n.find(".buyNowButton").attr("href", t.webshop_url + e))
            }), 0 < $.trim($(".buyNowButtonContainer .priceContainer .price span,.buyNowButtonContainer .price-wrapper .price span").text()).length && (n.removeClass("hide"), $(".buyNowButtonContainer").find(".increment-input").addClass("hide"), n.closest(".buyNowButtonContainer").find(".increment-input").addClass("hide"))) : 0 < $(".product-details").find("#no-price").length && $(".product-details").find("#no-price").hasClass("hide") || (n.addClass("hide"), $(".buyNowButtonContainer").find(".increment-input").removeClass("hide"), n.closest(".buyNowButtonContainer").find(".increment-input").removeClass("hide"), $(".priceContainer").addClass("hide"))
        })
    }
}), $(function() { cloneToolcenterAndContactBox() });
var uid = $("#api-frame").data("sketchfab-uid");
$(".js-sketchfab-embed-wrapper").each(function(t, e) {
    var n = e.getElementsByClassName("api-frame");
    new Sketchfab(n.item(0)).init(uid, { ui_controls: 0, ui_watermark: 0, success: function(t) { t.start(function() {}), t.addEventListener("viewerready", function() { t.addEventListener("annotationSelect", function(t) { $(".sketchfab-annotation").hide(), $('div[id="sketchfab-annotation-' + t + '"]').show() }) }) }, error: function() { console.log("Viewer error") } })
}), $(".js-annotation-close").on("click", function() { $(this).parent(".sketchfab-annotation").hide() });
var SliderConfig = function() { this.option = { autoplay: !0, slidesToShow: 1, sliderMode: null, speed: 300, arrows: !0, dots: !1, focusOnSelect: !0, infinite: !0, centerMode: !0, slidesPerRow: 1, slidesToScroll: 1, centerPadding: "0", swipe: !1, fade: !1, touchThreshold: 100, easing: "linear", adaptiveHeight: !1, initialSlide: 0, responsive: [{ breakpoint: 1024, settings: { arrows: !1, dots: !0, slidesToShow: 1 } }] }, this.setWrapper = function(t) { this.mainWrapper = t }, this.setSelectorClass = function(t) { this.sliderSelector = t }, this.setSliderMode = function(t) { this.sliderMode = t }, this.setSlidesToShow = function(t) { this.option.slidesToShow = t }, this.setCenterMode = function(t) { this.option.centerMode = t }, this.setSpeed = function(t) { this.option.speed = t }, this.setArrows = function(t) { this.option.arrows = t }, this.setResponsive = function(t) { this.option.responsive = t }, this.calculateCenterPadding = function(t, e) { return t * e / 2 }, this.setCenterPadding = function(t) { this.option.centerPadding = t }, this.setAutoplay = function(t) { this.option.autoplay = t }, this.setDots = function(t) { this.option.dots = t }, this.setEasing = function(t) { this.option.easing = t }, this.setInfinite = function(t) { this.option.infinite = t }, this.setSlidesToScroll = function(t) { this.option.slidesToScroll = t }, this.setAdadaptiveHeight = function(t) { this.option.adaptiveHeight = t }, this.setInitialSlide = function(t) { this.option.initialSlide = t }, this.initSlider = function() { this.sliderSelector.slick({ speed: this.option.speed, arrows: this.option.arrows, dots: this.option.dots, infinite: this.option.infinite, centerMode: !0, slidesPerRow: 1, slidesToShow: this.option.slidesToShow, slidesToScroll: 1, centerPadding: this.option.centerPadding, swipe: !0, responsive: this.option.responsive }) }, this.customSliderBinding = function() { "topicPreview" === this.sliderMode && CustomSliderEngine.topicPreview(this.sliderSelector.parent()) } };
$(document).ready(function() {
    var e, n = { arrows: !1, autoplay: !0, dots: !0, easing: "swing", infinite: !0, slidesToShow: 3, slidesToScroll: 1, speed: 1e3 },
        a = $(".slider-hover-over");

    function t() {
        var t = window.innerWidth < 548;
        e !== t && ((e = t) ? a.hasClass("slick-initialized") && a.slick("unslick") : a.slick(n))
    }
    $(window).on("resize", t), t()
}), $(function() {
    var e, n, a, i, o;
    $.isMobile ? ($("a.wechat").attr("href", "#"), $("a.wechat").attr("data-open", "myModal"), $("a.wechat").removeAttr("target")) : (e = !1, $("footer .social-media"), n = $("#qr-code-footer-wechat"), a = $("#qr-code-footer-tiktok"), $("a.wechat, a.tiktok").mouseenter(function() { e || ($(this).hasClass("wechat") && n.show(), $(this).hasClass("tiktok") && a.show()) }), $("a.wechat, a.tiktok").mouseleave(function() { e || (n.hide(), a.hide()) }), $("a.wechat, a.tiktok").click(function(t) { t.preventDefault(), e ? (e = !1, n.hide(), a.hide()) : (e = !0, $(this).hasClass("wechat") && n.show(), $(this).hasClass("tiktok") && a.show()) }), i = !1, $("#qr-icon-header").mouseenter(function() { i || $("#qr-code-header").show() }), $("#qr-icon-header").mouseleave(function() { i || $("#qr-code-header").hide() }), $("#qr-icon-header").click(function(t) { t.preventDefault(), i ? (i = !1, $("#qr-code-header").hide()) : (i = !0, $("#qr-code-header").show()) }), o = !1, $("#qr-icon-sidebar").mouseenter(function() { o || $("#qr-code-sidebar").show() }), $("#qr-icon-sidebar").mouseleave(function() { o || $("#qr-code-sidebar").hide() }), $("#qr-icon-sidebar").click(function(t) { t.preventDefault(), o ? (o = !1, $("#qr-code-sidebar").hide()) : (o = !0, $("#qr-code-sidebar").show()) }))
}), $(function() {
    $(window).on("replaced.zf.interchange", function(t) { $(".stage-home .slider, #content-stage .slider").each(function(t, e) { $(".stage-home .slider, #content-stage .slider").slick("setPosition", 0), $(e).slick("setPosition") }) }), $(window).on("orientationchange", function(t) {
        ($(".stage-home .slide").length || $("#content-stage .slider")) && window.location.reload()
    });
    var t = $(".stage-home .slider");
    t.on("init", function(t, e, n, a) {
        l(e.$slider), s(0, 0, e.$slides);
        var i = e.$slides.get(0),
            o = $("video.slideImage", i);
    }), t.slick({ slidesToShow: 1, slidesToScroll: 1, arrows: !0, dots: !0, adaptiveHeight: !1, draggable: !1, autoplay: !1, autoplaySpeed: t.attr("data-autoplayspeed") || 4e3 }), t.slick("slickPlay"), t.on("beforeChange", function(t, e, n, a) {
        s(n, a, e.$slides);
        var i = e.$slides.get(a),
            o = $("video.slideImage", i);
    });
    var e = $("#content-stage .slider");

    function s(t, e, n) {
        var a, i = n.get(t),
            o = n.get(e);
        r(i) && ((a = $("video.slideImage", i)).trigger("pause"), a.get(0).currentTime = 0), r(o) && $("video.slideImage", o).trigger("play")
    }

    function r(t) { return 0 < $("video.slideImage", t).length }

    function l(e) {
        $("video.slideImage", e).each(function() {
            $("source", this).remove();
            var t = document.createElement("source");
            t.setAttribute("src", $(this).attr("data-video-" + function(t) { var e = t.width(); if (e <= 666) return "small"; if (e <= 1024) return "medium"; return "large" }(e))), this.appendChild(t)
        })
    }
    e.on("init", function(t, e) {
        l(e.$slider), s(0, 0, e.$slides);
        var n = e.$slides.get(0),
            a = $("video.slideImage", n);
    }), e.slick({ slidesToShow: 1, slidesToScroll: 1, arrows: !0, dots: !0, adaptiveHeight: !0, autoplay: !1, autoplaySpeed: e.attr("data-autoplayspeed") || 4e3 }), e.slick("slickPlay"), e.on("beforeChange", function(t, e, n, a) {
        s(n, a, e.$slides);
        var i = e.$slides.get(a),
            o = $("video.slideImage", i);
    }), $(window).on("resize", function() { t.each(function() { l($(this)) }), e.each(function() { l($(this)) }) }), $(".multiple-items .slider").slick({ infinite: !0, slidesToShow: 4, slidesToScroll: 1, arrows: !0, responsive: [{ breakpoint: 801, settings: { slidesToShow: 3, slidesToScroll: 1, arrows: !0, dots: !1, centerMode: !1, variableWidth: !1 } }, { breakpoint: 670, settings: { slidesToShow: 1, slidesToScroll: 1, arrows: !0, dots: !1, centerMode: !1, variableWidth: !1 } }] })
}), $(function() { $(".js-sticky-nav").each(function() { StickyNavigation.init() }) });
var StickyNavigation = {
    NavigationSettings: { languageScope: "", visible: !0, selector: $(".js-sticky-nav"), languageScopeDataAttribute: "language-scope", eventController: "li" },
    init: function() { this.NavigationSettings.visible || this.NavigationSettings.selector.hide(), this.eventController() },
    eventController: function() {
        var i = this;
        this.NavigationSettings.selector.find(this.NavigationSettings.eventController).on("click", function(t) {
            var e = $(this);
            if ($.isTablet && e.hasClass("sn-basket")) return !0;
            var n, a = e.find(".content");
            if (i.setAndPushDataLayer(e), !a) return !1;
            a.is(":hidden") && ($(this).data("xplicit-module-function") && i[$(this).data("xplicit-module-function")](), i.NavigationSettings.selector.find(".content").addClass("hide"), a.removeClass("hide"), 0 < (n = a.find("#search")).length && n.focus())
        }).on("focusout", function() {
            var t = $(this);
            window.setTimeout(function() { t.hasClass("js-headerSticky-search") ? 0 === $("#search", t).val().length && t.find(".content").addClass("hide") : t.is(":hover") || t.find(".content").addClass("hide") }, 10, t)
        }), this.NavigationSettings.selector.find(this.NavigationSettings.eventController).on("click", ".delete-product, .add-product, .icn-external", function(t) {
            t.preventDefault();
            var e = $(this).data("js-modul-action");
            void 0 === e && (console.log('Warning :: "js-modul-action" was not set'), $(this).hasClass("delete-product") && (e = "deleteProduct")), i[e]($(this))
        })
    },
    deleteProduct: function(t) {
        var e = t.data("item"),
            n = t.data("id"),
            a = t.closest("tr");
        _deleteProduct(e, n, function(t) { t && (updateProductIcons(), updateRows("basket", function(t) { setTimeout(function() { a.html(""), console.log(" catch it", a.html()), console.log("Very Done") }, 400) })) })
    },
    addProduct: function(t) {
        t.data("item");
        var e = t.data("id");
        0 !== $("#etailer-" + e).length && this.etailer($("#etailer-" + e), t)
    },
    etailer: function(t, e) {
        var n = e.data("item"),
            a = e.data("id");
        $(document).foundation(), t.foundation(), t.foundation("open"), t.find(".link-add-to-cart").on("click", function() { addProduct(n, a, function(t) { t && updateProductIcons() }), t.foundation("close") })
    },
    setAndPushDataLayer: function (selectorForEvent){
        var event = this.checkDataLayerValue(selectorForEvent.data('event')) ? selectorForEvent.data('event') : '';
        var category = this.checkDataLayerValue(selectorForEvent.data('event-category')) ? selectorForEvent.data('event-category') : '';
        var label = this.checkDataLayerValue(selectorForEvent.data('event-label')) ? selectorForEvent.data('event-label') : '';
        var action = this.checkDataLayerValue(selectorForEvent.data('event-action')) ? selectorForEvent.data('event-action') : '';

        if (event !== '' || category !== '' || label !== '' || action !== '') {
            console.warn('make sure that the dataLayer configuration is properly maintained')

            return;
        }

        if (typeof dataLayer === 'undefined') {
            console.warn('Tag Manager - dataLayer is not defined"');

            return;
        }

        dataLayer.push({
            event,
            eventInfo: {
                category,
                action,
                label,
            },
        });
    },
    checkDataLayerValue: function(t) { return void 0 !== t && "" !== t }
};
$(document).ready(function() {
    var t, e = $(".headerIconBar");
    1 === e.length ? ($(window).scroll(function() { 0 < $(window).scrollTop() ? (e.removeClass("hideMobile"), window.setTimeout(function() { e.addClass("visible") }, 1)) : (e.removeClass("visible"), window.setTimeout(function() { e.addClass("hideMobile") }, 500)) }), t = $("[id^=sn-]", e), $(t).click(function() { $(".dynamic.content", t).addClass("hide"), $(".dynamic.content", this).removeClass("hide").focus(), 0 < $("#search", this).length && $("#search", this).focus() }), $(".dynamic.content", t).on({ focusout: function() { $(this).data("timer", setTimeout(function() { $(this).addClass("hide") }.bind(this), 0)) }, focusin: function() { clearTimeout($(this).data("timer")) } })) : console.debug("Iconbar missing or there is more than one. Please have a look why this happend.")
}), $(window).load(function() {
    var o = new SliderConfig;
    o.setSelectorClass(".js-timeline"), o.setArrows(!0), o.setAutoplay(!1), o.setDots(!1), o.setEasing("swing"), o.setInfinite(!1), o.setSlidesToShow(5), o.setSlidesToScroll(4), o.setSpeed(1e3), o.setAdadaptiveHeight(!0), o.setCenterMode(!1), o.setResponsive([{ breakpoint: 1170, settings: { slidesToShow: 3, slidesToScroll: 2 } }]);
    $(".js-timeline").each(function() {
        var n, i = $(this);

        function t() {
            var a = 0,
                t = 0;
            i.find(".card__inner:even").each(function() { a = Math.max(a, $(this).outerHeight()) }).each(function() {
                var t = $(this),
                    n = t.height();
                t.parent().each(function(t, e) { e.style.setProperty("--timeline-card-top", a - n + "px"), e.style.setProperty("--timeline-card-height", n + "px") })
            }), i.find(".card__inner:odd").each(function() { t = Math.max(t, $(this).height()) }).each(function() {
                var t = $(this),
                    n = t.height();
                t.parent().each(function(t, e) { e.style.setProperty("--timeline-card-top", a + 100 + "px"), e.style.setProperty("--timeline-card-height", n + "px") })
            }), i.css("height", a + t + "px"), i[0].style.setProperty("--timeline-center", a + 50 + "px");
            var e = window.innerWidth < 785;
            n !== e && ((n = e) ? i.hasClass("slick-initialized") && i.slick("unslick") : i.slick(o.option)), i.find(".slick-track").css("height", a + t + 100 + "px"), i.css("visibility", "visible")
        }
        "rtl" === i.data("sorting") && o.setInitialSlide($(".item", i).length - 1), $(window).on("resize", t), t()
    })
}), $(function() {
    $(".js-watchlist-container").each(function() {
        var u = $(this),
            c = "groupCommon",
            o = null,
            d = u.find(".js-comparisonTablesTarget"),
            h = u.find(".parentContainer"),
            p = new Array,
            t = u.hasClass("product-comparison-table") ? "product_comparison" : "product_watchlist";

        function a(t, e, n) {
            t.data("slideIndex", n);
            var a = -1 * n * e;
            t.find(".spec-value, .product").css("transform", "translateX(" + a + "px)"), i(e)
        }

        function s() {
            var n, a, i, t = h.data("jsconf").split(","),
                e = [];
            t.forEach(function(t) { e.push(JSConf.javascript[t]) }), a = function(t) {
                var e, n = function(t) {
                    var s = [],
                        r = t.items;
                    o = t.translations, void 0 !== t.spec_groups && function(t) {
                        for (var e in t) void 0 !== t[e].groups && Array.isArray(t[e].groups) && $.each(t[e].groups, function(t, e) {
                            -1 === $.inArray(e.key, p) && (void 0 === p[e.sortKey] ? p[e.sortKey] = e.key : function t(e, n, a) {
                                var i = e;
                                var o = !1;
                                for (var s in a) s == i && (o = !0);
                                o ? t(e += 1, n, a) : a[e] = n
                            }(e.sortKey, e.key, p))
                        })
                    }(t.spec_groups);
                    var l = function(l) {
                        var c = {},
                            d = function() {
                                var e = []; {
                                    var t;
                                    $("div").hasClass("product-comparison-table") ? $.cookie("product_comparison") && (t = $.parseJSON($.cookie("product_comparison"))) : $.cookie("product_watchlist") && (t = $.parseJSON($.cookie("product_watchlist")))
                                }
                                if (t)
                                    if (Array.isArray(t)) t.forEach(function(t) { e.push(t.ID) });
                                    else
                                        for (var n in t) e.push(t[n].ID);
                                return e
                            }();
                        return Object.keys(l).forEach(function(t, e) {
                            var n, a, i, o, s, r;
                            d.includes(Number(t)) && (a = (n = l[t]).accessory_type || "Cameras", c.hasOwnProperty(a) || (c[a] = { productIds: [], productCells: [] }), c[a].productIds.push(t), c[a].productCells.push((i = n, o = t, s = u.find(".parentContainer").data("options").addProdutsToCart, r = u.find(".parentContainer").data("options").downloadProducts, { productId: o, cellTitle: g(i.model_name), cellImage: { imgSrc: i.image, alt: g(i.text) }, basketLink: { productId: o, linkClass: "button addToCart js-watchlist-AddToCart", linkUrl: "#", linkTitle: s, svgImg: { svgIcon: "#icon-cart" } }, description: i.description, downloadLink: { linkClass: "download", linkUrl: i.downloadLink, linkName: i.download_name, linkTitle: r + " >" } })))
                        }), c
                    }(r);
                    return Object.keys(l).forEach(function(n, t) {
                        var e = l[n].productCells,
                            a = {};
                        a[c] = { groupIndex: 0, specIds: [] };
                        var i = [];
                        $("div").hasClass("product-comparison-table") || i.push({ accordionGroupTitle: { groupTitle: g(c), groupID: n + "_" + c }, accordionSpecRows: [] }), l[n].productIds.forEach(function(t, e) {
                            ! function(c, d, u, h) {
                                var f = "";
                                f = 0 == p.length ? function(a) {
                                    var i = [],
                                        o = [];
                                    return Object.keys(a).forEach(function(t) {
                                        var e, n;
                                        a[t].group_name && (e = a[t].group_name, void 0 !== (n = a[t].groupSortKey) ? i[n] = e : o.push(e))
                                    }), $.each(o, function(t, e) {-1 === $.inArray(e, i) && i.push(e) }), i
                                }(c) : p;
                                Object.keys(c).forEach(function(t, e) {
                                    var n, a, i, o, s, r, l = c[t].group_name;
                                    l && (n = c[t].display || "", a = c[t].sortKey, d.hasOwnProperty(l) || (-1 !== $.inArray(l, f) ? (o = $.inArray(l, f), u[o] = { accordionGroupTitle: { groupTitle: g(l), groupID: h + "_" + l, groupSortedKey: o }, accordionSpecRows: [] }, d[l] = { groupIndex: o, specIds: [] }) : console.log("This groupKey is not available in Array ::", l, f)), i = d[l].groupIndex, s = void 0 !== a ? !0 : !1, -1 === (r = d[l].specIds.indexOf(t)) && (s ? (u[i].accordionSpecRows[a] = { specName: g(t), groupDescription: m(t), specID: t, specValue: [] }, d[l].specIds.push(t)) : void 0 !== u[i] && (r = d[l].specIds.length, u[i].accordionSpecRows.push({ specName: g(t), groupDescription: m(t), specID: t, specValue: [] }), d[l].specIds.push(t))), void 0 !== u[i] && (s ? u[i].accordionSpecRows[a].specValue.push({ value: g(w(n.toString())) }) : u[i].accordionSpecRows[r].specValue.push({ value: g(w(n.toString())) })))
                                })
                            }(r[t].specs, a, i, n)
                        });
                        var o = function(n, t, e) {
                            var a = h.data("options").camera;
                            $.each(d.data("options"), function(t, e) { n === e.accessory_type && (a = e.name) });
                            var i = h.data("options").highlightdifferences,
                                o = h.data("options").showdifferencesonly,
                                s = h.data("options").watchlistProduts;
                            return { type: n, headline: { tag: "h3", headlineClasses: "headline", text: a }, tableHeader: { highlightdifferences: i, showdifferencesonly: o, watchlistProduts: s, productCells: t }, accordion: { accordionItems: e } }
                        }(n, e, i);
                        s.push(o)
                    }), s
                }(t);
                e = n, d.empty(), e.forEach(function(t, e) {
                        var n = HandlebarTemplateHelper.cached["organisms-watchlist-comparisonTable"];
                        d.append($(n(t)))
                    }),
                    function() {
                        function e(t, i, o) {
                            var e = t.closest(".js-comparisonTable").find(".spec-row");
                            e.removeClass(o), t.prop("checked") && e.each(function(t, e) {
                                var n = $(e),
                                    a = n.find(".spec-value").map(function() { return $(this).text() }).get();
                                a.every(function(t, e, n) { return t === n[0] }) ? "hideEquals" === i && n.addClass(o) : "hightlightDifferences" === i && n.addClass(o)
                            })
                        }
                        u.find(".js-expandAccordionListener").on("click", function(t) {
                            var e = "#" + $(t.currentTarget).attr("aria-controls"),
                                n = $(e);
                            n.hasClass("accordion__body--hidden") ? (n.removeClass("accordion__body--hidden"), $(this).attr("aria-expanded", !0)) : (n.addClass("accordion__body--hidden"), $(this).attr("aria-expanded", !1))
                        }), u.find(".js-watchlist-AddToCart").click(function(t) { addProduct("basket", $(this).attr("product-id"), function(t) { t && (flashIcon("basket", 300), updateProductIcons()) }), productTeaserInit() }), u.find(".js-watchlist-removeProduct").on("click", function(t) { _deleteProduct("compare", $(this).attr("product-id"), function(t) { t && (flashIcon("compare", 500), updateProductIcons(), $(".js-comparisonTable").removeClass("removeEvent"), s()) }) }), u.find(".spec-row").each(function(t, e) {
                            var n = $(e),
                                a = "";
                            n.find(".spec-value").each(function(t, e) { a += $(e).text().trim() }), $("div").hasClass("product-comparison-table") || a.length || n.addClass("row--has-no-values")
                        }), u.find(".js-differencesReduce").on("change", function(t) { e($(t.currentTarget), "hideEquals", "row--hidden") }), u.find(".js-highlightDifferences").on("change", function(t) { e($(t.currentTarget), "hightlightDifferences", "row--highlight") }), u.find(".scroll-right").on("click", l), u.find(".scroll-left").on("click", v)
                    }(), u.find(".js-groupDescriptionButton").on("click", function() {
                        var t = $(this).find(".js-groupDescription");
                        t.hasClass("hide") ? (t.removeClass("hide"), t.addClass("show"), $(this).attr("aria-expanded", !0)) : (t.removeClass("show"), t.addClass("hide"), $(this).attr("aria-expanded", !1))
                    }), u.find(".watchlist").show(), r(), $(".spec-row").each(function() {
                        var t = !0;
                        $(this).find(".spec-value").each(function() {
                            (0 < $(this).find("span").length || $(this).text()) && (t = !1)
                        }), t && $(this).hide()
                    })
            }, i = [], (n = e).forEach(function(t, e) {
                $.getJSON(t).done(function(t) {
                    if (i.push(t), i.length === n.length) {
                        for (var e = {}; 0 < i.length;) $.extend(!0, e, i.pop());
                        a(e)
                    }
                })
            })
        }

        function r() {
            var t = k();
            ! function(t) {
                {
                    var e, n, a, i;
                    i = 0 < h.find(".js-software-comparison-table").length ? (e = 105 == t ? "0 0 150px" : "0 0 250px", h.find(".firstRowCell").css("flex", e), n = h.find(".firstRowCell").outerWidth(), a = y(t) * t + n, u.find(".product-comparison-table").width(a), b() * t + n) : (a = (y(t) + 1) * t, u.find(".product-comparison-table").width(a), (b() + 1) * t), u.find(".product-comparison-table .row").width(i)
                }
            }(t), i(t)
        }

        function f(t) { return t.data("slideIndex") || 0 }

        function l() {
            var t = $(this).closest(".js-comparisonTable"),
                e = t.find(".js-productCellsTarget").find(".product").length,
                n = f(t),
                n = Math.min(n + 1, e);
            a(t, k(), n)
        }

        function v() {
            var t = $(this).closest(".js-comparisonTable"),
                e = f(t),
                e = Math.max(e - 1, 0);
            a(t, k(), e)
        }

        function g(t) { return o && o[t] || t }

        function m(t) { return o && o[t + "_helper"] || null }

        function w(t) { return t.replace("*", '<span class="smallCircle"></span>') }

        function i(l) {
            u.find(".js-comparisonTable").each(function(t, e) {
                var n, a, i = $(e),
                    o = i.find(".product").length,
                    s = i.find(".scroll-left"),
                    r = i.find(".scroll-right");
                o <= y(l) ? (s.attr("disabled", !0), r.attr("disabled", !0)) : (a = (n = f(i)) < o - y(l), 0 < n ? s.removeAttr("disabled") : s.attr("disabled", !0), a ? r.removeAttr("disabled") : r.attr("disabled", !0))
            })
        }

        function b() {
            var t = u.find(".js-comparisonTable"),
                a = 0;
            return t.each(function(t, e) {
                var n = $(e).find(".product").length;
                a = Math.max(n, a)
            }), a
        }

        function y(t) { var e, n, a = u.find(".product-comparison-table-wrap").outerWidth(); return n = 0 < h.find(".js-software-comparison-table").length ? (e = h.find(".firstRowCell").outerWidth(), Math.floor((a - e) / t)) : Math.floor(a / t) - 1, Math.max(n, 1) }

        function k() { return 0 < h.find(".js-software-comparison-table").length ? ($(".js-software-comparison-table .row .cell:first-of-type").addClass("firstRowCell"), $(".js-productCellsTarget .cell").removeClass("firstRowCell"), $(window).outerWidth() < 669 ? 105 : 150) : $(window).outerWidth() < 669 ? 105 : 270 }! function() {
            JSConf.javascript.production || "product_watchlist" === t || $.getJSON(JSConf.javascript.watchlistSample, function(t) { $.cookie("product_comparison", JSON.stringify(t)) });
            (function() {
                function t(t) {
                    var e = u.find("[data-template-name=" + t + "]").text();
                    HandlebarTemplateHelper.store(t, e);
                    var n = HandlebarTemplateHelper.cached[t];
                    Handlebars.registerPartial(t, n)
                }
                t("molecules-accordionItem"), t("atoms-accordionGroupTitle"), t("atoms-accordionSpecRow"), t("molecules-tableHeader-productCell"), t("atoms-img"), t("atoms-link"), t("atoms-svgIcon"), t("atoms-headline"), t("organisms-watchlist-tableHeader"), t("organisms-watchlist-accordion"), t("organisms-watchlist-comparisonTable")
            })(), s()
        }(), $(window).resize(r)
    })
});

// @see https://gcp.baslerweb.com/jira/browse/MCAS-64
$(document).ready(function() {
	const hash = window.location.hash?.replace("#", "");
	if (!hash) {
		return;
	}

	const tabContentElement = document.getElementById(hash);
	if (!tabContentElement) {
		return;
	}
    // see @https://gcp.baslerweb.com/jira/browse/MCAS-193
    if (!tabContentElement.classList.contains("tabs-panel")) {
        console.info(`the provided hash "${hash}" points to no tab-panel - ignoring.`);

        return;
    }
	$(document).foundation();
	$('[data-tabs]').foundation('selectTab', $(tabContentElement))
});

$(document).ready(function() {
    $(".js-add-to-request-basket").click((e) => {
        e.preventDefault();
        const id = e.target.getAttribute("data-product-id");
        if (!id) {
            console.warn("expected product id on .js-add-to-request-basket - got", id);

            return;
        }

         addProduct("basket", id, function(success) {
            if (success) {
                // callback
                flashIcon('basket', 300);
                updateProductIcons();

                addToCartTimeout();
                // @see https://gcp.baslerweb.com/jira/browse/MCAS-103
                openBasket();
            }
        });
    });

    (async function() {
        const buyNowButtons = document.querySelectorAll(".js-buy-now-button-using-detected-country");

        if (buyNowButtons.length > 0) {
            let currentCountry = CookieFunctions.getCookie(CookieFunctions.CookieSettings.GeoLocation);
            if (!currentCountry) {
                currentCountry = await new Promise((resolve) => CookieFunctions.callGeoLocationAndSetStandardGeoCookie(resolve));
            }
            if (!currentCountry) {
                return console.warn("could not detect current country - buy now buttons are not replaced.");
            }

            const priceBook = await fetch(PriceBookService.serviceUrl).then(r => r.json());
            if (!priceBook) {
                return console.warn("could not fetch price book -  buy now buttons are not replaced.");
            }

            const currentPriceBook = priceBook.find(entry => entry.identifier?.toLowerCase() === currentCountry.toLowerCase());
            if (!currentPriceBook) {
                return console.warn(
                    "could find current price book based on country %s and price book: %o -  buy now buttons are not replaced.",
                    currentCountry,
                    priceBook
                );
            }

            replaceBuyNowButtons(buyNowButtons, currentPriceBook.webshop_url);
        }
    })().catch(console.error);

    /**
     * @param {NodeListOf<Element>} buyNowButtons
     * @param {string|undefined} shopUrl 
     */
    function replaceBuyNowButtons(buyNowButtons, shopUrl) {
        buyNowButtons.forEach(el => {
            // assume, that the product id is always at the end of the link
            // Example: https://shop.baslerweb.com/emea_en/website/add/index/items/9901
            const productId = el.href?.match(/\/([0-9]+)/)?.[1];
            if (!productId) {
                console.warn(`could not retrieve product id from link "${e.target.href}" - country based shop url is not used. Element: `, e.target);

                return;
            }

            if (!shopUrl) {
                el.style.display = "none";
            } else {
                el.href = `${shopUrl}${!shopUrl.endsWith("/") ? "/" : ""}${productId}`;
            }
        });
    }
});

//加载弹框
$(".form-control").bind("keypress", function (ev) {
    if(ev.which === 13){modal.close(1);}
});
function loadModal() {
    let modal = new RModal(document.getElementById('modal'), {
        beforeOpen: function(next) {
            next();
        }
        , beforeClose: function(next) {
            next();
        }
    });

    document.addEventListener('keydown', function(ev) {
        if(ev.which === 27 && $("#userImportTable tr").hasClass("changing")){
            cancleOperat($("#changeInp"))
        }else{
            modal.keydown(ev);
        }
    }, false);

    $(".showModal").bind("click", function (ev) {
        let this_operat = this.innerText;
        let this_type = $(this).parent().parent().children().eq(1).text();
        let this_id = $(this).parent().parent().attr("_id");

        if(this_operat !== "入库" && this_operat !== "领料"){
            alert("页面已被篡改,请按F5刷新页面后重新操作!");
            return ;
        }

        idOperat(this_id, this_type, this_operat);
        ev.preventDefault();
        modal.open();
    });

    window.modal = modal;
}

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.RModal = factory());
}(this, (function () { 'use strict';

let is = function (obj, type) { return Object.prototype.toString.call(obj).toLowerCase() === ("[object " + type + "]"); };

let addClass = function (el, cls) {
    let arr = el.className
    .split(/\s+/)
    .filter(function (c) { return !!c && c === cls; });

    if (!arr.length) {
        el.className += " " + cls;
    }
};

let removeClass = function (el, cls) {
    el.className = el.className
    .split(/\s+/)
    .filter(function (c) { return !!c && c !== cls; })
    .join(' ');
};

let RModal = function RModal(el, opts) {
    let this$1 = this;

    this.opened = false;

    this.opts = {
        bodyClass: 'modal-open'
        , dialogClass: 'modal-dialog'
        , dialogOpenClass: 'bounceInDown'
        , dialogCloseClass: 'bounceOutUp'

        , focus: true
        , focusElements: [
            'a[href]', 'area[href]', 'input:not([disabled]):not([type=hidden])'
            , 'button:not([disabled])', 'select:not([disabled])'
            , 'textarea:not([disabled])', 'iframe', 'object', 'embed'
            , '*[tabindex]', '*[contenteditable]'
        ]

        , escapeClose: true
        , content: null
        , closeTimeout: 500
    };

    Object.keys(opts || {})
    .forEach(function (key) {
        /* istanbul ignore else */
        if (opts[key] !== undefined) {
            this$1.opts[key] = opts[key];
        }
    });

    this.overlay = el;
    this.dialog = el.querySelector(("." + (this.opts.dialogClass)));

    if (this.opts.content) {
        this.content(this.opts.content);
    }
};

RModal.prototype.open = function open (content) {
    let this$1 = this;

    this.content(content);

    if (!is(this.opts.beforeOpen, 'function')) {
        return this._doOpen();
    }

    this.opts.beforeOpen(function () {
        this$1._doOpen();
    });
};

RModal.prototype._doOpen = function _doOpen () {
    addClass(document.body, this.opts.bodyClass);

    removeClass(this.dialog, this.opts.dialogCloseClass);
    addClass(this.dialog, this.opts.dialogOpenClass);

    this.overlay.style.display = 'block';

    if (this.opts.focus) {
        this.focusOutElement = document.activeElement;
        this.focus();
    }

    if (is(this.opts.afterOpen, 'function')) {
        this.opts.afterOpen();
    }
    this.opened = true;
};

RModal.prototype.close = function close (status) {
    let this$1 = this;

    //0表示取消,1表示确定
    if(status === 1){
        checkOpDatas();
    }
    if (!is(this.opts.beforeClose, 'function')) {
        return this._doClose();
    }

    this.opts.beforeClose(function () {
        this$1._doClose();
    });
};

RModal.prototype._doClose = function _doClose () {
    let this$1 = this;

    removeClass(this.dialog, this.opts.dialogOpenClass);
    addClass(this.dialog, this.opts.dialogCloseClass);

    removeClass(document.body, this.opts.bodyClass);

    if (this.opts.focus) {
        this.focus(this.focusOutElement);
    }

    if (is(this.opts.afterClose, 'function')) {
        this.opts.afterClose();
    }

    this.opened = false;
    setTimeout(function () {
        this$1.overlay.style.display = 'none';
    }, this.opts.closeTimeout);
};

RModal.prototype.content = function content (html) {
    if (html === undefined) {
        return this.dialog.innerHTML;
    }

    this.dialog.innerHTML = html;
};

RModal.prototype.elements = function elements (selector, fallback) {
    fallback = fallback || window.navigator.appVersion.indexOf('MSIE 9.0') > -1;
    selector = is(selector, 'array') ? selector.join(',') : selector;

    return [].filter.call(
        this.dialog.querySelectorAll(selector)
        , function (element) {
            if (fallback) {
                let style = window.getComputedStyle(element);
                return style.display !== 'none' && style.visibility !== 'hidden';
            }

            return element.offsetParent !== null;
        }
    );
};

RModal.prototype.focus = function focus (el) {
    el = el || this.elements(this.opts.focusElements)[0] || this.dialog.firstChild;

    if (el && is(el.focus, 'function')) {
        el.focus();
    }
};

RModal.prototype.keydown = function keydown (ev) {
    if (this.opts.escapeClose && ev.which === 27) {
        this.close();
    }

    function stopEvent() {
        ev.preventDefault();
        ev.stopPropagation()
    }

    if (this.opened && ev.which === 9 && this.dialog.contains(ev.target)) {
        let elements = this.elements(this.opts.focusElements)
            , first = elements[0]
            , last = elements[elements.length - 1];

        if (first === last) {
            stopEvent();
        }
        else if (ev.target === first && ev.shiftKey) {
            stopEvent();
            last.focus();
        }
        else if (ev.target === last && !ev.shiftKey) {
            stopEvent();
            first.focus();
        }
    }
};

RModal.prototype.version = '1.0.31';
RModal.version = '1.0.31';

return RModal;

})));
//# sourceMappingURL=rmodal.js.map

;var Editable = {
    init: function(options, el) {
        this.options = $.extend({}, this.options, options);

        this.el = el;
        this.$el = $(el);

        this.alertID = null;
        this.isEditing = false;
        this.isSaving = false;
        this.originalValue = $.trim(this.$el.html());

        this.$alert = null;

        this._build();

        return this;
    },
    options: {
        url: null,
        method: null,
        args: {}
    },
    _build: function() {
        
        this.$el.addClass('editable-element');

        if (!this.$alert) {
            this.$alert = $('<div class="editable-alert"><div class="editable-alert-message"></div></div>');
            $('body').append(this.$alert);
        }

        var that = this;

        that.$el.click(function() {

            that.makeEditable();

        }).keydown(function(e) {

            if (e.which == 13) {
                // Enter pressed
                e.preventDefault();
                that.saveData();
            } else if (e.keyCode == 27) {
                // Escape pressed
                that.resetData();
            }
        }).blur(function(e) {
            that.saveData();
        });


    },
    makeEditable: function() {

        if (!this.isEditing) {
            var orig = $.trim(this.$el.html());

            this.$el.prop('contentEditable', true).addClass('editable-active');

            this.originalValue = orig;
            this.isEditing = true;

            this.setTextCursor();
        }
    },
    saveData: function() {
        var words = $.trim(this.$el.html()),
            field = this.$el.attr('data-fieldname'),
            additionalargs = this.$el.attr('data-arguments'),
            that = this;

        if (words !== that.originalValue) {

            var ajaxargs = $.extend({}, that.options.args, {
                method: that.options.method,
                value: words
            });

            if (field) {
                ajaxargs = $.extend({}, ajaxargs, { field: field });
            }

            if (additionalargs) {
                try {
                    var tmp = $.parseJSON(additionalargs);

                    ajaxargs = $.extend({}, ajaxargs, tmp);
                }
                catch(e) {
                    console.log("Invalid JSON in data-arguments for this element:", this.$el);
                }
            }

            $.ajax({
                 url: that.options.url,
                 type: 'post',
                 data: ajaxargs,
                 dataType: 'json',
                 success: function(r) {

                    if (r.success) {
                        that.originalValue = words;
                        that.resetData();
                    } else {
                        that.$el.addClass('editable-error');
                        that.$el.isSaving = false;
                    }
                    if (r.message && r.message.length) {
                        that.showMessage(r.message);
                    }
                 }
            });
        } else {
            this.resetData();
        }
    },
    resetData: function() {
        this.isSaving = true;

        this.$el.removeClass('editable-active').removeClass('editable-error');
        this.$el.prop('contentEditable', false);
        this.isEditing = false;
        this.isSaving = false;

        this.$el.html(this.originalValue);

        if (this.$el.is(':focus')) {
            this.$el.blur();
        }
    },
    setTextCursor: function() {
        this.$el.focus();

        if (typeof window.getSelection !== "undefined" && typeof document.createRange !== "undefined") {
            var range = document.createRange();

            range.selectNodeContents(this.el);
            range.collapse(false);
            
            var sel = window.getSelection();

            sel.removeAllRanges();
            sel.addRange(range);

        } else if (typeof document.body.createTextRange !== "undefined") {
            var textRange = document.body.createTextRange();
            
            textRange.moveToElementText(this.el);
            textRange.collapse(false);
            textRange.select();
        }
    },
    showMessage: function(message) {

        var that = this;

        that.$alert.find('.editable-alert-message').html(message);
        that.$alert.show();

        if (this.alertid) {
            clearTimeout(this.alertid);
        }

        this.alertid = setTimeout(function() { 
            that.$alert.hide(); 
            that.alertid = null; 
        }, 2500);

    }
};

if ( typeof Object.create !== "function" ) {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
};

$.fn.editable = function (url, method, args) {
    return this.each(function () {
        if (!$.data(this, 'editable')) {
            options = {
                url: url,
                method: method,
                args: args
            };
            $.data(this, 'editable', Object.create(Editable).init(options, this));
        }
    });
};

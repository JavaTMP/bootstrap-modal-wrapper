(function (root, factory) {
    "use strict";
    // CommonJS module is defined
    if (typeof module !== "undefined" && module.exports) {
        module.exports = factory(require("jquery"), require("bootstrap"));
    }
// AMD module is defined
    else if (typeof define === "function" && define.amd) {
        define("bootstrap-modal-wrapper-factory", ["jquery", "bootstrap"], function ($) {
            return factory($);
        });
    } else {
// planted over the root!
        root.BootstrapModalWrapperFactory = factory(root.jQuery);
    }

}(this, function ($) {
    "use strict";

    var defaults = {};

// The actual plugin constructor
    function ModalWrapperFactory(options) {
        this.options = $.extend({}, defaults, options);
        this.defaults = defaults;
        this.globalModals = [];
        this.registerGlobalEventsHandler();
    }

    ModalWrapperFactory.prototype.createModal = function (options) {
        var newModalWrapper = new ModalWrapper(this, options);
        this.globalModals.push(newModalWrapper);
        newModalWrapper.init();
        return newModalWrapper;
    };

    ModalWrapperFactory.prototype.createAjaxModal = function (options) {
        var $this = this;
        var ajaxModalContainer = $this.createModal(options);
        var settings = $.extend(true, ajaxModalContainer.options, {
            url: null,
            dataType: "html",
            httpMethod: "GET",
            passData: {},
            sendId: true,
            idParameter: "ajaxModalId",
            updateSizeAfterDataFetchTo: "modal-lg",
            ajaxContainerReadyEventName: "ajax-container-ready"
        }, options);
        if (settings.sendId) {
            settings.passData[settings.idParameter] = ajaxModalContainer.options.id;
        }

        ajaxModalContainer.originalModal.removeClass("fade");
        ajaxModalContainer.originalModal.find(".modal-dialog").css({transition: 'all .3s'});
        ajaxModalContainer.originalModal.find(".modal-body").css({"max-height": "65vh", "overflow-y": "auto", "overflow-x": "hidden"});
        ajaxModalContainer.originalModal.css({"overflow": "hidden"});

        // make sure the dialog is shown before calling AJAX request
        ajaxModalContainer.originalModal.one('shown.bs.modal', function (e) {
            $.ajax({
                type: settings.httpMethod,
                dataType: settings.dataType,
                url: settings.url,
                data: settings.passData,
                success: function (response, textStatus, jqXHR) {
                    ajaxModalContainer.updateSize(settings.updateSizeAfterDataFetchTo);
                    ajaxModalContainer.updateMessage(response);
                    setTimeout(function () {
                        $("#" + ajaxModalContainer.options.id).trigger(settings.ajaxContainerReadyEventName, [ajaxModalContainer]);
                    }, 0);
                }
            });
        });
        ajaxModalContainer.show();

        return ajaxModalContainer;
    };

    var modalTemplateContainer =
            "<div class='modal fade' id='' tabindex='-1' role='dialog' aria-labelledby='' aria-hidden='true'>" +
            "    <div class='modal-dialog' role='document'>" +
            "        <div class='modal-content'>" +
            "        </div>" +
            "    </div>" +
            "</div>";
    var modalHeaderContainer = "<div class='modal-header'></div>";
    var modalTitleContainer = "<h5 class='modal-title'></h5>";
    var modalHeaderClosableContainer =
            "                <button type='button' class='close' data-dismiss='modal' aria-label='Close'>" +
            "                    <span aria-hidden='true'>&times;</span>" +
            "                </button>";
    var modalBodyContainer = "<div class='modal-body'></div>";
    var modalFooterContainer = "<div class='modal-footer d-flex flex-wrap'></div>";
    var modalButtonContainer = "<button id='' type='button' class='my-1'></button>";

    function uuid() {
        var uuid = "", i, random;
        for (i = 0; i < 32; i++) {
            random = Math.random() * 16 | 0;
            if (i === 8 || i === 12 || i === 16 || i === 20) {
                uuid += "-";
            }
            uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
        }
        return uuid;
    }
    var getUniqueID = function (prefix) {
        return prefix + "-" + Math.floor((Math.random() * 100000000) + 1) + "-" + new Date().getTime() + "-" + uuid();
    };
    function ModalWrapper(factory, options) {
        this.factory = factory;
        this.options = $.extend({}, {
            id: getUniqueID("b-m-w"),
            title: null,
            message: null,
            closable: false,
            closeByBackdrop: true,
            closeByKeyboard: true,
            size: null,
            onDestroy: null,
            buttons: [],
            headerClass: null,
            localData: {},
            centered: false
        }, options);

        $.extend(true, this.options.localData, options.localData);

        this.originalModal = null;
        this.isDestroy = false;
        this.isOpen = false;
    }

    ModalWrapper.prototype.generateTemplate = function () {

        this.originalModal = $(modalTemplateContainer);

        this.originalModal.attr("id", this.options.id);
        var $dialog = this.originalModal.find(".modal-dialog");
        if (this.options.size && (this.options.size === "modal-sm" || this.options.size === "modal-lg")) {
            $dialog.addClass(this.options.size);
        }
        if (this.options.centered === true) {
            $dialog.addClass('modal-dialog-centered');
        }

        if (this.options.title || this.options.closable) {
            this.originalModal.find(".modal-content").append(modalHeaderContainer);
        }
        if (this.options.title) {
            this.originalModal.find(".modal-header").append(modalTitleContainer).find(".modal-title").append(this.options.title);
        }
        if (this.options.closable) {
            this.originalModal.find(".modal-header").append(modalHeaderClosableContainer);
        }

        if (this.options.headerClass) {
            this.originalModal.find(".modal-header").addClass(this.options.headerClass);
        }

        if (this.options.message) {
            this.originalModal.find(".modal-content").append(modalBodyContainer);
            this.originalModal.find(".modal-body").html('').append(this.options.message);
        }
        if (this.options.buttons && this.options.buttons.length > 0) {
            this.originalModal.find(".modal-content").append(modalFooterContainer);
            for (var i = 0; i < this.options.buttons.length; i++) {
                var buttonData = this.options.buttons[i];
                this.addButton(buttonData, false);
            }
        }
    };
    ModalWrapper.prototype.init = function () {
        this.generateTemplate();
        var $this = this;
        this.originalModal.on("show.bs.modal", function (event) {
            // YOU SHOULD STOP PROPAGATION because we register too for global modals.
            event.stopPropagation();
            var currentOpenDialog = 0;

//            for (var i = 0; i < $this.factory.globalModals.length; i++) {
//                if ($this.factory.globalModals[i].isOpen && $this.factory.globalModals[i].originalModal.hasClass("show")) {
//                    currentOpenDialog++;
//                }
//            }

            currentOpenDialog = $(".modal.show").length;
//            alert(currentOpenDialog);
            var zIndex = 100000 + (10 * currentOpenDialog);
            $(this).css("z-index", zIndex);
            setTimeout(function () {
                $(".modal-backdrop").not(".modal-stack").first().css("z-index", zIndex - 1).addClass("modal-stack");
            }, 0);
        }).on("shown.bs.modal", function (event) {
            // YOU SHOULD STOP PROPAGATION because we register too for global modals.
            event.stopPropagation();
            $this.isOpen = true;
        }).on("hide.bs.modal", function (event) {
            // YOU SHOULD STOP PROPAGATION because we register too for global modals.
            event.stopPropagation();
            if ($this.options.onDestroy && (typeof $this.options.onDestroy === "function")) {
                if (!$this.options.onDestroy.call($this, $this)) {
                    event.preventDefault();
                }
            }
        }).on("hidden.bs.modal", function (event) {
            // YOU SHOULD STOP PROPAGATION because we register too for global modals.
            event.stopPropagation();
            $this.destroy();
            $(".modal.show").length && $("body").addClass("modal-open");
        });
    };
    ModalWrapper.prototype.destroy = function () {
        var $this = this;
        this.originalModal.modal("hide").promise().done(function () {
            $this.isOpen = false;
            $("#" + $this.options.id).off("show.bs.modal");
            $("#" + $this.options.id).off("hidden.bs.modal");
            $("#" + $this.options.id).modal("dispose");
            for (var i = 0; i < $this.options.buttons.length; i++) {
                var button = $this.options.buttons[i];
                button.buttonObject.off();
            }

            $this.isDestroy = true;
            var i = $this.factory.globalModals.length;
            while (i--) {
                if ($this.factory.globalModals[i].options.id === $this.options.id) {
                    $this.factory.globalModals.splice(i, 1);
                    break;
                }
            }
            $("#" + $this.options.id).find(".modal-dialog").off();
            $("#" + $this.options.id).off();
            $("#" + $this.options.id).remove();
        });
    };

    ModalWrapper.prototype.show = function () {
        var currentOptions = {
            show: true,
            backdrop: this.options.closeByBackdrop ? true : "static",
            keyboard: this.options.closeByKeyboard,
            focus: true
        };
        this.originalModal.modal(currentOptions);
        return this;
    };
    ModalWrapper.prototype.hide = function () {
        this.originalModal.modal("hide");
    };

    ModalWrapper.prototype.updateTitle = function (newTitle) {
        this.options.title = newTitle;
        var titleElement = this.originalModal.find(".modal-title");
        if (titleElement.length === 0) {
            var headerElement = this.originalModal.find(".modal-header");
            if (headerElement.length === 0) {
                this.originalModal.find(".modal-content").prepend(modalHeaderContainer);
                headerElement = this.originalModal.find(".modal-header");
            }
            headerElement.prepend(modalTitleContainer);
            titleElement = this.originalModal.find(".modal-title");
        }
        titleElement.html(newTitle);
        this.originalModal.modal("handleUpdate");
        return this;
    };
    ModalWrapper.prototype.updateClosable = function (newClosable) {
        if (this.options.closable !== newClosable) {
            this.options.closable = newClosable;
            // if closable is true , we should show the x button on top right.
            // else we should remove button and check if title exist or not if exist
            // then we do nothing but if not exist we remove header to.
            if (this.options.closable === true) {
                var headerElement = this.originalModal.find(".modal-header");
                if (headerElement.length === 0) {
                    this.originalModal.find(".modal-content").prepend(modalHeaderContainer);
                    headerElement = this.originalModal.find(".modal-header");
                }
                headerElement.append(modalHeaderClosableContainer);
            } else if (this.options.closable === false) {
                var closableElement = this.originalModal.find(".modal-header").find("button.close");
                closableElement.off();
                closableElement.remove();
                var modalTitleElement = this.originalModal.find(".modal-header").find(".modal-title");
                if (modalTitleElement.length === 0) {
                    this.originalModal.find(".modal-header").remove();
                }

            }
            this.originalModal.modal("handleUpdate");
        }
        return this;
    };
    ModalWrapper.prototype.updateClosableByBackdrop = function (newClosableByBackdropValue) {
        if (this.options.closeByBackdrop !== newClosableByBackdropValue) {
            this.options.closeByBackdrop = newClosableByBackdropValue;
            $("#" + this.options.id).data('bs.modal')._config.backdrop = this.options.closeByBackdrop ? true : "static";
            this.originalModal.modal("handleUpdate");
        }
        return this;
    };
    ModalWrapper.prototype.removeHeader = function () {
        var headerElement = this.originalModal.find(".modal-header");
        if (headerElement.length > 0) {
            var closeButton = headerElement.find("button.close");
            if (closeButton.length > 0) {
                closeButton.off();
                closeButton.remove();
                this.options.closable = false;
            }
            headerElement.remove();
            this.options.title = null;
        }
        this.originalModal.modal("handleUpdate");
        return this;
    };
    ModalWrapper.prototype.updateMessage = function (newMessage) {
        this.options.message = newMessage;
        var bodyElement = this.originalModal.find(".modal-body");
        bodyElement.html("").html(newMessage);
        this.originalModal.modal("handleUpdate");
        return this;
    };
    ModalWrapper.prototype.updateSize = function (newSize) {
        if (this.options.size !== newSize) {
            this.options.size = newSize;
            if (!this.options.size || (typeof this.options.size === "undefined") || this.options.size === null) {
                this.originalModal.find(".modal-dialog").removeClass("modal-xl modal-lg modal-sm");
            } else if (this.options.size === "modal-sm" || this.options.size === "modal-lg" || this.options.size === "modal-xl") {
                this.originalModal.find(".modal-dialog").removeClass("modal-xl modal-lg modal-sm");
                this.originalModal.find(".modal-dialog").addClass(this.options.size);
            }
            this.originalModal.modal("handleUpdate");
        }
        return this;
    };
    ModalWrapper.prototype.addButton = function (buttonData, updateOptions) {
        var modalWrapperInstance = this;
        var footerElement = this.originalModal.find(".modal-footer");
        if (footerElement.length === 0) {
            this.originalModal.find(".modal-content").append(modalFooterContainer);
            footerElement = this.originalModal.find(".modal-footer");
        }
        buttonData.id = buttonData.id ? buttonData.id : getUniqueID("modal-button");
        var button = $(modalButtonContainer);
        button.attr("id", buttonData.id);
        button.addClass(buttonData.cssClass ? buttonData.cssClass : "");
        button.append(buttonData.label);
        buttonData.buttonObject = button;
        button.on("click", {modalWrapper: modalWrapperInstance, button: button, buttonData: buttonData}, function (event) {
            var modalWrapper = event.data.modalWrapper;
            var button = event.data.button;
            var buttonData = event.data.buttonData;
            if (buttonData.action && (typeof buttonData.action === "function")) {
                return buttonData.action.call(button, modalWrapper, button, buttonData, event);
            }
        });
        if (updateOptions !== false) {
            this.options.buttons.push(buttonData);
        }

        return button.appendTo(footerElement);
    };

    ModalWrapper.prototype.setOnDestroy = function (onDestroyFunc) {
//        if (onDestroyFunc && (typeof onDestroyFunc === "function")) {
//            this.options.onDestroy = onDestroyFunc;
//        }
        this.options.onDestroy = onDestroyFunc;
    };
    ModalWrapper.prototype.removeButton = function (buttonId) {
//        var modalWrapperInstance = this;
        // check if the button id exist
        var requestedButton = null;
        var i = this.options.buttons.length;
        while (i--) {
            if (this.options.buttons[i].id === buttonId) {
                var requestedButton = this.options.buttons[i];
                requestedButton.buttonObject.off();
                requestedButton.buttonObject.remove();
                this.options.buttons.splice(i, 1);
            }
        }
        return this;
    };

    ModalWrapperFactory.prototype.showMessage = function (options) {
        var showOptions = null;
        if (typeof options === "object" && options.constructor === {}.constructor) {
            showOptions = $.extend(true, defaults, options);
        } else {
            showOptions = $.extend(true, defaults, {message: options});
        }

        return this.createModal(showOptions).show();
    };
    ModalWrapperFactory.prototype.alert = function (options) {
        var defaults = {
            title: "Alert",
            message: "",
            closable: true,
            closeByBackdrop: true,
            closeByKeyboard: true,
            buttons: [
                {
                    label: "OK",
                    cssClass: "btn btn-primary",
                    action: function (modalWrapper, button, buttonData, originalEvent) {
                        modalWrapper.hide();
                    }
                }
            ]
        };
        var alertOptions = null;
        if (typeof options === "object" && options.constructor === {}.constructor) {
            alertOptions = $.extend(true, defaults, options);
        } else {
            alertOptions = $.extend(true, defaults, {message: options});
        }
        return this.createModal(alertOptions).show();
    };
    ModalWrapperFactory.prototype.confirm = function (options) {
        var defaults = {
            title: "Confirm",
            message: "Are You Sure ?",
            closable: false,
            closeByBackdrop: false,
            closeByKeyboard: false,
            buttons: [
                {
                    label: "No",
                    cssClass: "btn btn-secondary",
                    action: function (modalWrapper, button, buttonData, originalEvent) {
                        modalWrapper.hide();
                        if (options.onConfirmCancel && (typeof options.onConfirmCancel === "function")) {
                            options.onConfirmCancel();
                        }
                    }
                },
                {
                    label: "Yes",
                    cssClass: "btn btn-primary",
                    action: function (modalWrapper, button, buttonData, originalEvent) {
                        modalWrapper.hide();
                        if (options.onConfirmAccept && (typeof options.onConfirmAccept === "function")) {
                            options.onConfirmAccept();
                        }
                    }
                }
            ]
        };
        var confirmOptions = $.extend({}, defaults, options);
        return this.createModal(confirmOptions).show();
    };

    ModalWrapperFactory.prototype.registerGlobalEventsHandler = function () {
        // some bootstrap plugins like summernote have problem when run inside a bootstrap modals
        // as native bootstrap modal does support nested modal so we should handle the z-index of those plugins' modals
        // too in the same way we handle the modal wrapper instaces

        $(document).on("show.bs.modal", '.modal', function (event) {
            var zIndex = 100000 + (10 * $(".modal.show").length);
            $(this).css("z-index", zIndex);
            setTimeout(function () {
                $(".modal-backdrop").not(".modal-stack").first().css("z-index", zIndex - 1).addClass("modal-stack");
            }, 0);
        }).on("hidden.bs.modal", '.modal', function (event) {
            $(".modal.show").length && $("body").addClass("modal-open");
        });
        $(document).on('inserted.bs.tooltip', function (event) {
            var zIndex = 100000 + (10 * $(".modal.show").length);
            var tooltipId = $(event.target).attr("aria-describedby");
            $("#" + tooltipId).css("z-index", zIndex);
        });
        $(document).on('inserted.bs.popover', function (event) {
            var zIndex = 100000 + (10 * $(".modal.show").length);
            var popoverId = $(event.target).attr("aria-describedby");
            $("#" + popoverId).css("z-index", zIndex);
        });

    };

    return new ModalWrapperFactory();
}));

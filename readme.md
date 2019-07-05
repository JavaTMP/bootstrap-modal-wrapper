# Bootstrap Modal Wrapper
Bootstrap modal wrapper factory for creating dynamic and nested stacked dialog instances.

[![](https://data.jsdelivr.com/v1/package/npm/bootstrap-modal-wrapper/badge)](https://www.jsdelivr.com/package/npm/bootstrap-modal-wrapper)

## Installation Using NPM
```
npm install bootstrap-modal-wrapper
```

## Building from The source
Make sure node.js and git client are locally installed on your machine and then run the following commands:
```
cd bootstrap-modal-wrapper
npm install
gulp
```
## Demo And Examples
Online demo of all below examples can be found in the following JavaTMP demo pages:
- [Bootstrap Modal Online Demo](http://demo.javatmp.com/JavaTMP-Static-Ajax/#pages/plugins/bootstrap-modal-wrapper.html).
- [Bootstrap Modal RTL Online Demo](http://demo.javatmp.com/JavaTMP-Static-Ajax-RTL/#pages/plugins/bootstrap-modal-wrapper.html).

### BOOTSTRAP MESSAGE MODAL
The simplest scenario of modal wrapper is to show a simple message when use press a button:
```html
<button id="simple-message" type="button" class="btn btn-primary">
    Basic Message
</button>
<script type="text/javascript">
    jQuery(function ($) {
        $("#simple-message").on("click", function (event) {
            BootstrapModalWrapperFactory.showMessage("Delfault Message to show to user");
        });
    });
</script>
```

### BOOTSTRAP ALERT MODAL
The simple scenario of modal wrapper is to show a simple alert when use press a button:
```html
<button id="simple-alert" type="button" class="btn btn-primary">
    Basic Alert
</button>
<script type="text/javascript">
    jQuery(function ($) {
        $("#simple-alert").on("click", function (event) {
            BootstrapModalWrapperFactory.alert("Delfault alert <b>with only message Text</b>");
        });
    });
</script>
```

### BOOTSTRAP CONFIRMATION MODAL
JavaTMP Bootstrap modal wrapper factory provides a confirmation dialog too with ability to run different code.
See the following example:
```html
<button id="simple-confirm" type="button" class="btn btn-primary">
    Basic Confirm
</button>
<script type="text/javascript">
    jQuery(function ($) {
        $("#simple-confirm").on("click", function (event) {
            BootstrapModalWrapperFactory.confirm({
                title: "Confirm",
                message: "Are You Sure ?",
                onConfirmAccept: function () {
                    BootstrapModalWrapperFactory.alert("Thank you for ACCEPTING the previous confiramtion dialog");
                },
                onConfirmCancel: function () {
                    BootstrapModalWrapperFactory.alert("Thank you for CANCELING the previous confiramtion dialog");
                }
            });
        });
    });
</script>
```
### JAVATMP BOOTSTRAP MODAL WRAPPER `CREATEMODAL` METHOD
The JavaTMP Bootstrap Modal wrapper object provides a general method `createModal` which creates modals dynamically.
the implementation of `BootstrapModalWrapperFactory.alert` and `BootstrapModalWrapperFactory.confirm` methods use `createModal`
to provide desired behaviors.
The following examples show you how to use `createModal` method in action:
#### Create simple Bootstrap Modal wrapper instance dynamically
```JS
var onlyBody = BootstrapModalWrapperFactory.createModal({
    message: "Simple Message body",
    closable: false,
    closeByBackdrop: true
});
onlyBody.show();
```
#### Create a simple bootstrap modal wrapper with body and title only:
```JS
var modalWrapper = BootstrapModalWrapperFactory.createModal({
    message: "Simple Message body",
    title: "Header Title",
    closable: true,
    closeByBackdrop: true
});
modalWrapper.show();
```
#### Create a simple bootstrap modal wrapper with a button to close and destroy it
```JS
var modalWrapper = BootstrapModalWrapperFactory.createModal({
    message: "Simple Message body",
    title: "Header Title",
    closable: false,
    closeByBackdrop: false,
    buttons: [
        {
            label: "Close Me",
            cssClass: "btn btn-primary",
            action: function (button, buttonData, originalEvent) {
                return this.hide();
            }
        }
    ]
});
modalWrapper.show();
```
#### Create nested bootstrap modal wrapper instances dynamically:
```JS
var modalWrapper = BootstrapModalWrapperFactory.createModal({
    message: "Simple Message body",
    title: "Header Title",
    closable: false,
    closeByBackdrop: false,
    buttons: [
        {
            label: "Close",
            cssClass: "btn btn-secondary",
            action: function (button, buttonData, originalEvent) {
                return this.hide();
            }
        },
        {
            label: "Create alert",
            cssClass: "btn btn-primary",
            action: function (button, buttonData, originalEvent) {
                BootstrapModalWrapperFactory.alert("Alert Modal Created");
            }
        }
    ]
}).show();
```
#### Update title and body of bootstrap modal wrapper dynamically after showing:
```JS
BootstrapModalWrapperFactory.createModal({
    message: "Simple Message body",
    title: "Header Title",
    closable: false,
    closeByBackdrop: false,
    buttons: [
        {
            label: "Close",
            cssClass: "btn btn-secondary",
            action: function (button, buttonData, originalEvent) {
                return this.hide();
            }
        },
        {
            label: "Update Title & Message",
            cssClass: "btn btn-primary",
            action: function (button, buttonData, originalEvent) {
                this.updateTitle("New Title");
                this.updateMessage("Updated message content");
            }
        }
    ]
}).show();
```
#### Update the size of shown bootstrap modal dynamically:
```JS
BootstrapModalWrapperFactory.createModal({
    message: "Simple Message body",
    title: "Header Title",
    closable: false,
    closeByBackdrop: false,
    buttons: [
        {
            label: "Close",
            cssClass: "btn btn-secondary",
            action: function (button, buttonData, originalEvent) {
                return this.hide();
            }
        },
        {
            label: "Make Me Large",
            cssClass: "btn btn-primary",
            action: function (button, buttonData, originalEvent) {
                this.originalModal.find(".modal-dialog").css({transition: 'all 0.4s'});
                this.updateSize("modal-lg");
            }
        },
        {
            label: "Make Me Small",
            cssClass: "btn btn-primary",
            action: function (button, buttonData, originalEvent) {
                this.originalModal.find(".modal-dialog").css({transition: 'all 0.4s'});
                this.updateSize("modal-sm");
            }
        },
        {
            label: "Make Me Default",
            cssClass: "btn btn-primary",
            action: function (button, buttonData, originalEvent) {
                this.originalModal.find(".modal-dialog").css({transition: 'all 0.4s'});
                this.updateSize(null);
            }
        }
    ]
}).show();
```
#### Create Bootstrap Modal wrapper buttons dynamically and remove them:
```JS
var buttonsCount = 0;
BootstrapModalWrapperFactory.createModal({
    message: "Simple Message body",
    title: "Header Title",
    closable: false,
    closeByBackdrop: false,
    buttons: [
        {
            label: "Close",
            cssClass: "btn btn-secondary",
            action: function (button, buttonData, originalEvent) {
                return this.hide();
            }
        },
        {
            label: "Add Button",
            cssClass: "btn btn-primary",
            action: function (button, buttonData, originalEvent) {
                this.addButton({
                    id: "id-" + (++buttonsCount),
                    label: "New " + buttonsCount,
                    cssClass: "btn btn-secondary",
                    action: function (button, buttonData, originalEvent) {
                        BootstrapModalWrapperFactory.showMessage("nothing only to show attached event to button id [" + buttonData.id + "]");
                        return true;
                    }
                }, true);
            }
        },
        {
            label: "Delete Button",
            cssClass: "btn btn-primary",
            action: function (button, buttonData, originalEvent) {
                this.removeButton("id-" + (buttonsCount--));
            }
        }
    ]
}).show();
```
#### Simulate Updating Bootstrap Modal wrapper instace dynamically with AJAX response content:
```JS
var m = BootstrapModalWrapperFactory.createModal({
    message: '<div class="text-center"><i class="fa fa-refresh fa-spin fa-3x fa-fw text-primary"></i></div>',
    closable: false,
    closeByBackdrop: false
});
m.originalModal.find(".modal-dialog").css({transition: 'all 0.5s'});
m.show();
setTimeout(function () {
    m.updateSize("modal-lg");
    m.updateTitle("Message Received");
    m.updateMessage("Message Content");
    m.addButton({
        label: "Close",
        cssClass: "btn btn-secondary",
        action: function (button, buttonData, originalEvent) {
            return this.hide();
        }
    }, true);
}, 3000);
```
#### Advanced AJAX Bootstrap Modal Wrapper Contents
You can simply adapt and use the bootstrap modal wrapper to provide a dynamic Bootstrap modal with remote AJAX contents using `createAjaxModal` method,
For example:
```JS
BootstrapModalWrapperFactory.createAjaxModal({
    message: '<div class="text-center">Loading</div>',
    closable: true,
    title: "AJAX Content",
    closeByBackdrop: false,
    url: "blank-ajax-response.html"
});
```

And the following are the response HTML code from the above URL:
```HTML
<div class="dynamic-ajax-content">
    <div class="row">
        <div class="col-lg-12">
            <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diem nonummy nibh euismod tincidunt ut lacreet dolore magna aliguam erat volutpat. Ut wisis enim ad minim veniam, quis nostrud exerci tution ullam corper suscipit lobortis nisi ut aliquip ex ea commodo consequat. Duis te feugi facilisi. Duis autem dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit au gue duis dolore te feugat nulla facilisi.</p>
        </div>
    </div>
    <script type="text/javascript">
        jQuery(function ($) {
            // here we can reference the container bootstrap modal by its id
            // passed as parameter to request by name "ajaxModalId"
            // or for demo purposese ONLY we can get a reference top modal
            // in current open managed instances in BootstrapModalWrapperFactory
            var currentParentModal = BootstrapModalWrapperFactory.globalModals[BootstrapModalWrapperFactory.globalModals.length - 1];
            $("#" + currentParentModal.options.id).on(currentParentModal.options.ajaxContainerReadyEventName, function (event, modal) {
                modal.addButton({
                    label: "Update closable by backdrop click",
                    cssClass: "btn btn-info",
                    action: function (button, buttonData, originalEvent) {
                        this.updateClosableByBackdrop(true);
                    }
                });
                modal.addButton({
                    label: "Show Ajax Parameters",
                    cssClass: "btn btn-info",
                    action: function (button, buttonData, originalEvent) {
                        alert("modal.options.url [" + modal.options.url + "]");
                    }
                });
                modal.addButton({
                    label: "Show localData Object",
                    cssClass: "btn btn-info",
                    action: function (button, buttonData, originalEvent) {
                        alert("You can Use the following data came from initiator sender code : " + JSON.stringify(modal.options.localData));
                    }
                });
                modal.addButton({
                    label: "Run Function from Sender",
                    cssClass: "btn btn-info",
                    action: function (button, buttonData, originalEvent) {
                        modal.options.localData.funRef();
                    }
                });
                modal.addButton({
                    label: "Close",
                    cssClass: "btn btn-primary",
                    action: function (button, buttonData, originalEvent) {
                        return this.hide();
                    }
                });
                modal.addButton({
                    label: "Show Alert Dialog",
                    cssClass: "btn btn-success",
                    action: function (button, buttonData, originalEvent) {
                        BootstrapModalWrapperFactory.alert("Alert Modal Created From within Ajax Content");
                    }
                });
            });
        });
    </script>
</div>
```

## Copyright and License
Bootstrap-modal-wrapper is copyrighted by [JavaTMP](http://www.javatmp.com) and licensed under [MIT license](https://github.com/JavaTMP/bootstrap-modal-wrapper/blob/master/LICENSE).

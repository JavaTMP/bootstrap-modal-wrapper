# Bootstrap Modal Wrapper
Bootstrap modal factory that supports dynamic modal creations and stacked modal features.

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
Online demo of all below examples can be found in the following JavaTMP demo page [Bootstrap Modal Online Demo](http://demo.javatmp.com/JavaTMP-Static-Ajax/#pages/bootstrap/modal.html).

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
JavaTMP Bootstrap modal wrapper factory provides a confirmation dialog too with ability to run different code. See the following example:
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
####
```
```
####
```
```
####
```
```
####
```
```
####
```
```
####
```
```
####
```
```

## Copyright and License
Bootstrap-modal-wrapper is copyrighted by [JavaTMP](http://www.javatmp.com) and licensed under [MIT license](https://github.com/JavaTMP/bootstrap-modal-wrapper/blob/master/LICENSE).

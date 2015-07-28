
/**
 * Sets up an instance of MutationObserver, a DOM API that allows you to react to changes in the DOM.
 */

(function() {
 
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

  if (MutationObserver) {

    var observer = new MutationObserver(callback);

    // The nodes on which to observe DOM mutations
    var targets = [
      document.body.querySelector('.sqs-block-form'),
      document.body.querySelector('.sqs-block-tourdates'),
      document.body.querySelector('.sqs-block-code')
    ];

    // Specifies which DOM mutations should be reported
    var options = {
      childList: true,
      subtree: true
    };

    for (var i = 0; i < targets.length; i++) {
      if (targets[i]) {
        observer.observe(targets[i], options);
      }
    }

  } else {

    // Fallback, only for io events though ( < IE10 )
    callback(null, null);
  }

  /**
   * A MutationObserver callback that allows us to make any necessary adjustments if nodes are dynamically loaded/removed into/from the DOM.
   *
   * @method mutationCallback
   * @param  {Array}              mutations   An array of MutationRecord objects
   * @param  {MutationObserver}   observer    Our instance of the observer
   */
  function callback(mutations, observer) {

    if (Static.SQUARESPACE_CONTEXT.authenticatedAccount) {
      return;
    }

    if (mutations) {

      for (var i = 0; i < mutations.length; i++) {

        if (mutations[i].type === 'childList') {

          if(document.readyState === "complete") {
            var timer = setTimeout(function(){
              window.Site.syncUI();
            }, 150);
          }
          else {
            document.addEventListener("DOMContentLoaded", function () {
              var timer = setTimeout(function(){
                window.Site.syncUI();
              }, 150);
            }, false);
          }
          break;
        }
      }

    } else {
      
      // Fallback, only for io events though ( < IE10 )
      Y.on('io:end', function(e){
        var timer = Y.later(1200, this, function(){
          window.Site.syncUI();
          timer.cancel();
        });
      });

    }
  }

}());
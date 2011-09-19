(function(window, document, $, undefined) {
    $.fn.autosaveable = function(settings) {
        if (settings !== undefined) {
            if (settings.uid === undefined) {
                return;
            }
        }
        var uid = settings.uid;
        this.each(function(i) {
            var delay = (function(){
                    var timer = 0;
                    return function(){
                        clearTimeout(timer);
                        timer = setTimeout.apply(window, arguments);
                    };
                })();
                $this = $(this),
                uid = uid + i,
                state = {
                    uid: uid,
                    text: getState(uid)
                };

            if (state.text !== '') {
                $this.val(state.text);
            }

            $this.bind(
                'keyup.autosaveable',
                {
                    autosaveState: state
                },
                function(e){
                    delay(handleChanged, 2000, e);
                }
            );
        });
    }

    function genKey(uid) {
        var href = window.location.href.replace(/[^a-zA-Z]/g,'');

        return href + '.' + uid;
    }

    function handleChanged(e) {
        var $target = $(e.target),
            state = e.data.autosaveState,
            text = $target.val();

        if (text !== state.text) {
            state.text = text;
            saveState(state.uid, state.text);
        }
    }

    function getState(uid) {
        var key = genKey(uid),
            text = window.localStorage.getItem(key);

        return text ? text : '';
    }

    function removeState(uid) {
        return window.localStorage.removeItem(genKey(uid));
    }

    function saveState(uid, text) {
        var key = genKey(uid);

        return window.localStorage.setItem(key, text);
    }
})(this, document, jQuery);

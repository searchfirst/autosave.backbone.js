(function(window, $, undefined) {
    $.fn.autosaveable = function(settings) {
        if (settings !== undefined) {
            if (settings.uid === undefined) {
                return;
            }
            if (settings.bind !== undefined) {
                var bindings = settings.bind;
            }
        } else {
            return;
        }
        var uid = settings.uid,
            bindings = settings.bind || [];
        this.each(function(i) {
            var delay = (function(){
                    var timer = 0;
                    return function(){
                        clearTimeout(timer);
                        timer = setTimeout.apply(window, arguments);
                    };
                })(),
                $this = $(this),
                thisUid = uid + i,
                state = {
                    uid: thisUid,
                    text: getState(uid)
                };

            if (state.text !== '') {
                $this.val(state.text);
            }

            setBindings(bindings, state.uid);

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

    function setBindings(bindings, uid) {
        for (i in bindings) {
            var watchObject = bindings[i][0],
                event = bindings[i][1],
                action = bindings[i][2];

            watchObject.bind(event, function () {
                if (action === 'removeState') {
                    removeState(uid);
                }
            });
        }
    }

    function saveState(uid, text) {
        var key = genKey(uid);

        if (text !== '') {
            return window.localStorage.setItem(key, text);
        } else {
            return removeState(uid);
        }
    }
})(this, jQuery);

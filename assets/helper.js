function setSpin(boolval, element) {
    if (boolval) {
        document.querySelector('#' + element + '> span').className = 'spinner-border spinner-border-sm';
    } else {
        document.querySelector('#' + element + '> span').className = '';
    }
};

function setModal(url) {
    var modal = document.getElementById("modal");
    document.getElementById("threeD").src = url;
    var myModal = new bootstrap.Modal(modal, { keyboard: false, backdrop: false });
    myModal.show();
    modal.addEventListener('hidden.bs.modal', function (event) {
        document.getElementById("cof").contentWindow.postMessage(session.get());
    })

};

var session = (
    function session(sessionId) {
        var _session = sessionId;
        return {
            get: function () {
                return _session;
            },
            set: function (id) {
                _session = id;
            }
        };
    }
)();
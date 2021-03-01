function setSpin (boolval,element){
    if(boolval){
        document.querySelector('#'+element+ '> span').className = 'spinner-border spinner-border-sm';
    }else
    {
        document.querySelector('#' +element+ '> span').className = '';
    }
};

function setModal (url) {
    var modal = document.getElementById("modal");
    document.getElementById("threeD").src = url;
    var myModal = new bootstrap.Modal(modal, {  keyboard: false });
    myModal.show();

}
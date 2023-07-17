//  creo una variable para eliminar el compflicto de libreria con el simbolo dolar y Jquery
var $ = jQuery.noConflict();
function message_error(obj) {
    var html = '';
    if (typeof (obj) === 'object') {
        html = '<ul style="text-align: left;">';
        $.each(obj, function (key, value) {
            html += '<li>' + key + ': ' + value + '</li>';
        });
        html += '</ul>';
    } else {
        html = '<p>' + obj + '</p>';
    }
    Swal.fire({
        title: 'Error!',
        html: html,
        icon: 'error'
    });
}
function abrir_modal(url, idmodal)
 {
     alert('todo va bien')
     $(idmodal).load(url, function()
     {
       $(idmodal).modal('show');
     });
     return false;
 }
function cerrar_modal(vetanamodal)
 {
   $(vetanamodal).modal('hide');
 }

 //funcion para inhabilitar un boton guando sea pulsado, solo en el caso de los formularios de guardar,
 //para q el usuario no le de dos veces y se pueda guardar la informacion 2 doces
function activa_inactiva_boton(idboton){
   if($(idboton).prop('disabled')){
       $(idboton).prop('disabled', false);
   }else{
       $(idboton).prop('disabled', true);
   }
}

function mostrar_errores(errores, diverrores){
// erroreseditpro
   $(diverrores).html("");
   let errorr = "";
   for (let item in errores.response.errorr){
       errorr += '<div class="alert alert-danger" <strong>' + errores.responseJSON.errorr[item] + '</strong></div>';
   }
   $("#errorescrearpro").append(errorr);
}

function notificacionError(mensaje){
   Swal.fire({
       title: 'Error!',
       text: mensaje,
       icon: 'error',
     //  confirmButtonText: 'Ok'
     })
}
function notificacionSucces(mensaje){
   Swal.fire({
       title: 'Procedimiento Exitoso!',
       text: mensaje,
       icon: 'success',
       confirmButtonText: 'Ok'
     })
}


function message_error(obj) {
    var html = '';
    if (typeof (obj) === 'object') {
        html = '<ul style="text-align: left;">';
        $.each(obj, function (key, value) {
            html += '<li>' + key + ': ' + value + '</li>';
        });
        html += '</ul>';
    } else {
        html = '<p>' + obj + '</p>';
    }
    Swal.fire({
        title: 'Error!',
        html: html,
        icon: 'error'
    });
}

function submit_with_ajax(url, title, content, parameters, callback) {
    $.confirm({
        theme: 'material',
        title: title,
        icon: 'fa fa-info',
        content: content,
        columnClass: 'small',
        typeAnimated: true,
        cancelButtonClass: 'btn-primary',
        draggable: true,
        dragWindowBorder: false,
        buttons: {
            info: {
                text: "Si",
                btnClass: 'btn-primary',
                action: function () {
                    $.ajax({
                        url: url, 
                        type: 'POST',
                        data: parameters,
                        dataType: 'json',
                        processData: false,
                        contentType: false,
                    }).done(function (data) {
                       // console.log(data);
                        if (!data.hasOwnProperty('error')) {
                           
                            callback(data);
                            return false;
                        }
                        message_error(data.error);
                    }).fail(function (jqXHR, textStatus, errorThrown) {
                      
                        alert(textStatus + ': ' + errorThrown);
                    }).always(function (data) {

                    });
                }
            },
            danger: {
                text: "No",
                btnClass: 'btn-red',
                action: function () {

                }
            },
        }
    })
}

function alert_action(title, content, callback, cancel) {
    $.confirm({
        theme: 'material',
        title: title,
        icon: 'fa fa-info',
        content: content,
        columnClass: 'small',
        typeAnimated: true,
        cancelButtonClass: 'btn-primary',
        draggable: true,
        dragWindowBorder: false,
        buttons: {
            info: {
                text: "Si",
                btnClass: 'btn-primary',
                action: function () {
                    callback();
                }
            },
            danger: {
                text: "No",
                btnClass: 'btn-red',
                action: function () {
                    cancel();
                }
            },
        }
    })
}
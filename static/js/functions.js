//  creo una variable para eliminar el compflicto de libreria con el simbolo dolar y Jquery
var $ = jQuery.noConflict();
function message_error(obj) {
    let html = '';
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

function sweet_info(title){
    const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        iconColor: '#a5dc86',
        customClass: {
          popup: 'colored-toast'
        },
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: false,        
      })
      Toast.fire({
        icon: 'success',
        title: title
      })
}

function submit_with_ajax(url, title, content, parameters, callback) {

    $.confirm({
        theme: 'modern',
        title: title,
        icon: 'fa fa-info-circle',
        content: content,
        type: 'blue',
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
                        url: url,//window.location.pathname 
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
        theme: 'modern',
        title: title,
        icon: 'fa fa-info-circle',
        type: 'blue',
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

$(function () {
    $('[data-toggle="tooltip"]').tooltip({
      trigger: 'hover'
    });
  })
  

//Solo texto
function Solo_Texto(e) {
    var code;
    if (!e) var e = window.event;
    if (e.keyCode) code = e.keyCode;
    else if (e.which) code = e.which;
    var character = String.fromCharCode(code);
    var AllowRegex  = /^[\ba-zA-Z\s]$/;
    if (AllowRegex.test(character)) return true;     
    return false; 
  }

//Solo numeros
function Solo_Numero(e){
    var keynum = window.event ? window.event.keyCode : e.which;
    if ((keynum == 8) || (keynum == 46))
    return true;
    return /\d/.test(String.fromCharCode(keynum));
}


//Solo numeros sin puntos 
function Solo_Numero_ci(e){
    var keynum = window.event ? window.event.keyCode : e.which;
    if ((keynum == 8))
    return true;
    return /\d/.test(String.fromCharCode(keynum));
}

// solo numeros y letras sin caracteres especiales
function Texto_Numeros(e) {
    var code;
    if (!e) var e = window.event;
    if (e.keyCode) code = e.keyCode;
    else if (e.which) code = e.which;
    var character = String.fromCharCode(code);
    var AllowRegex  = /^[A-Za-z0-9\s\.,-]+$/g;
    if (AllowRegex.test(character)) return true;     
    return false; 
}

//Para que las opciones del menú se activen al darle click
$(function () {
    var url = window.location;
    // for single sidebar menu
    $('ul.nav-sidebar a').filter(function () {
        return this.href == url;
    }).addClass('active');

    // for sidebar menu and treeview
    $('ul.nav-treeview a').filter(function () {
        return this.href == url;
    }).parentsUntil(".nav-sidebar > .nav-treeview")
        .css({'display': 'block'})
        .addClass('menu-open').prev('a')
        .addClass('active');
});

const dropdown= document.getElementById('dropdownID');
  let dropdownActive = false;

  $('#btn-dropdown').click(() => {
      if (dropdownActive == false) {
          dropdown.classList.add("active");
          dropdownActive = true;
      } else if (dropdownActive == true) {
          dropdown.classList.remove("active");
          dropdownActive = false;
      }
  });
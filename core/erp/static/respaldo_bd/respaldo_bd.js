// BOTONES DE ABRIR Y CERRAR EL MODAL

function abrir_modal_verificacion() {
	$("#ModalConfirmacion").modal("show");
	$("#password1").focus();
	$("#password1").val('');
	$("#password2").val('');
}

function cerrar_modal_verificacion() {
	$("#ModalConfirmacion").modal("hide");
	$("#password1").val('');
	$("#password2").val('');
}

// BOTONES PARA ABRIR EL MODAL DEL FORMULARIO DE RESTABLECIMIENTO
function abrir_modal_upload() {
	$("#ModalConfirmacion_upload").modal("show");
	$("#password1").focus();
	$("#password1").val('');
	$("#password2").val('');
	$("#upload_file").val('');
}

function cerrar_modal_upload() {
	$("#ModalConfirmacion_upload").modal("hide");
	$("#password1").val('');
	$("#password2").val('');
	$("#upload_file").val('');
}
//MODAL DE RESPALDO DE LA BD
$("#ModalConfirmacion").on('shown.bs.modal', function(){
	const inputs = document.querySelectorAll('#ModalConfirmacion .txt_field input');
	inputs.forEach(input => { if (input.value.trim() !== '') { input.classList.add('input-has-text'); }
		input.addEventListener('input', () => { if (input.value.trim() !== '') { input.classList.add('input-has-text');
		} else { input.classList.remove('input-has-text'); }
		});
	});
});
$('#ModalConfirmacion').on('hidden.bs.modal', function (e) {
	//$('#frmDepart').trigger('reset');
	const inputs = document.querySelectorAll('#ModalConfirmacion .txt_field input');
	 inputs.forEach(input => input.classList.remove('input-has-text'));
})
//MODAL DE RESTAURACIÓN DE LA BD
$("#ModalConfirmacion_upload").on('shown.bs.modal', function(){
	const inputs = document.querySelectorAll('#ModalConfirmacion_upload .txt_field input');
	inputs.forEach(input => { if (input.value.trim() !== '') { input.classList.add('input-has-text'); }
		input.addEventListener('input', () => { if (input.value.trim() !== '') { input.classList.add('input-has-text');
		} else { input.classList.remove('input-has-text'); }
		});
	});
});
$('#ModalConfirmacion_upload').on('hidden.bs.modal', function (e) {
	('#form_verificacion_upload').trigger('reset');
	const inputs = document.querySelectorAll('#ModalConfirmacion_upload .txt_field input');
	 inputs.forEach(input => input.classList.remove('input-has-text'));
})

// ENVIO DEL FORMULARIO CON AJAX
$('#form_verificacion').on('submit', function(e) {
	e.preventDefault();
	if ($("#password1").val() !== $("#password2").val()) {
		message_error('Las contraseñas no coinciden, intenta nuevamente');
		$("#password1").val('');
		$("#password2").val('');
		$("#password1").focus();
	} else {
		var parameters = new FormData(this);
		submit_with_ajax(window.location.pathname, 'Notificación', '¿Estas seguro de realizar esta accion?', parameters, function() {
			$("#ModalConfirmacion").modal('hide');
			sweet_info( 'AUTENTICACIÓN EXITOSA, DESCARGANDO BASE DE DATOS');
			setTimeout(() => {
				window.open('/erp/respaldar_bd/');
			}, 1400);
			
		});
	}

});

// SUBIR LA BASE DE DATOS
$('#form_verificacion_upload').on('submit', async function(e) {
	e.preventDefault();
	if ($("#upload_file").val() == null || $("#upload_file").val() == '') {
		message_error('Se debe seleccionar el archivo de la base de datos');
	}else{
		var parameters = new FormData(this);
		parameters.append('action', 'restaurar_db');
		submit_with_ajax(window.location.pathname, 'Notificación', '¿Estas seguro de realizar esta accion?', parameters, function() {
			$("#ModalConfirmacion").modal('hide');
			sweet_info( 'LA BASE DE DATOS HA SIDO RESTAURADA');
			setTimeout(() => {
				window.location.replace('/inicio/');
			}, 1400);		
		
		});
	}

});
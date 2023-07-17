var dttModelo;
$(function () {
    dttModelo = $('#data_list').DataTable({
        responsive: false,
        autoWidth: false,
        destroy: true,
        deferRender: true,
        ajax: {
            url: window.location.pathname,
            type: 'POST',
            data: {
                'action': 'searchdata'
            },
            dataSrc: ""
        },
        language: {
            decimal: "",
            sLengthMenu: "Mostrar _MENU_ registros",
            emptyTable: "No hay información",
            info: "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
            infoEmpty: "Mostrando 0 a 0 de 0 Entradas",
            infoFiltered: "(Filtrado de _MAX_ total entradas)",
            infoPostFix: "",
            thousands: ",",
            lengthMenu: "Mostrar _MENU_ Entradas",
            loadingRecords: "Cargando...",
            processing: "Procesando...",
            searchPlaceholder: "Buscar",
            search: "<button type='button' class='btn ml-5 btn-sm'><i class='fa fa-search'></i></button>",
            zeroRecords: "Sin resultados encontrados",
            paginate: {
            first: "Primero",
            last: "Ultimo",
            next: "<span class='fa fa-angle-double-right'></span>",
            previous: "<span class='fa fa-angle-double-left'></span>",
            },
            buttons: {
            copy: "Copiar", 
            print: "Imprimir",
            },
        },
        columns: [
            {"data": "id"},
            {"data": "modelo"},
            {"data": "marcas.marca"},
            {"data": "id"},
        ],
        columnDefs: [
            {
                targets: [-1],
                class: 'text-center',
                orderable: false,
                render: function (data, type, row) {
                    var buttons = '<a rel="edit" class="btn btn-warning btn-xs btnEdit"><i class="fas fa-edit"></i></a> ';
                    buttons += '<a rel="delete" class="btn btn-danger btn-xs"><i class="fas fa-trash-alt"></i></a>';
                    return buttons;
                }
            },
        ],
        initComplete: function (settings, json) {

        }
    });
    $('.btnAdd').on('click', function () {
        $('input[name="action"]').val('add');
        $('#titlemodelo').find('span').html('Creación de un Modelo');
        $('#titlemodelo').find('i').removeClass().addClass('fas fa-plus');
        $('#idmodelo').focus();
        $('#myModalModelos').modal('show');
    });

    $("#myModalModelos").on('shown.bs.modal', function(){
        const inputs = document.querySelectorAll('#myModalModelos .txt_field input, #myModalModelos .txt_field select');
        inputs.forEach(input => { if (input.value.trim() !== '') { input.classList.add('input-has-text'); }
            input.addEventListener('input', () => { if (input.value.trim() !== '') { input.classList.add('input-has-text');
            } else { input.classList.remove('input-has-text'); }
            });
        });
    });
    
    $('#myModalModelos').on('hidden.bs.modal', function (e) {
        //$('#idmarcas').val("").trigger('change.select2');
        $('#frmModelos').trigger('reset');
        const inputs = document.querySelectorAll('#myModalModelos .txt_field input,  #myModalModelos .txt_field select');
         inputs.forEach(input => input.classList.remove('input-has-text'));
    })
   
});
$('#frmModelos').on('submit', function (e) {
    e.preventDefault();
    let myForm = document.getElementById('frmModelos');
    let parameters = new FormData(myForm);
    let param_id= $('input[name="id"]').val()
    let url="";
    let titulo="";
    if  ($('input[name="action"]').val() == 'add'){
        url =  '/erp/modelo/add/';
        titulo="¿Estas seguro de crear el modelo?";
    }else{
        url = "/erp/modelo/update/"+param_id+"/";
        titulo="¿Estas seguro de actualizar el modelo?";
    }
    submit_with_ajax(url, 'Estimado usuario(a)', titulo, parameters, function (response) {
            $('#myModalModelos').modal('hide'); 
            sweet_info( 'El Registro Se Ha Creado Con Éxito'); 
            dttModelo.ajax.reload();
        });

});
$('#data_list tbody').on('click', 'a[rel="edit"]', function () {
    //$('#productos tbody').on('click', '.nombreclase', function () {
        var tr = $("#data_list").DataTable().cell($(this).parents('td, li')).index();
        var data = $("#data_list").DataTable().row(tr.row).data();
        $('.modal-title').find('i').removeClass().addClass('fas fa-edit');
      $('.modal-title').find('span').html('Edición de un Modelo');
      param_id=data.id;
      $('input[name="action"]').val('edit');
      $('input[name="id"]').val(data.id);
      $('input[name="modelo"]').val(data.modelo);
      $('#idmarcas').val(data.marcas.id).trigger('change.select2');
      $('#myModalModelos').modal('show');
  });
  $('#data_list tbody').on('click', 'a[rel="delete"]', function () {
    $('.modal-title').find('i').removeClass().addClass('fas fa-edit');
    var tr = $("#data_list").DataTable().cell($(this).parents('td, li')).index();
    var data = $("#data_list").DataTable().row(tr.row).data();
    var parameters = new FormData();
    parameters.append('action', 'delete');
    parameters.append('id', data.id);
   
    url = "/erp/modelo/delete/"+data.id+"/";
    submit_with_ajax(url, 'Notificación', '¿Estas seguro de eliminar el modelo?  ' + '<b style="color: #304ffe;">' + data.modelo + '</b>', parameters, function () {
        sweet_info( 'El Registro Se Ha Eliminado Con Éxito'); 
        dttModelo.ajax.reload();
    });
  });

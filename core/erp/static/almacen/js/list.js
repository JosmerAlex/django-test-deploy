var dttAlmacen;
$(function () {
    dttAlmacen = $('#data_list').DataTable({
        responsive: true,
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
            search: "<button class='btn ml-5 btn-sm'><i class='fa fa-search'></i></button>",
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
            {"data": "codigo"},
            {"data": "nombre"},
            {"data": "responsable"},
            {"data": "ced"},
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
        $('#title_almacen').find('span').html('Creación de un Almacen');
        $('#title_almacen').find('i').removeClass().addClass('fas fa-plus');
        $('#idAlmacen').focus();
        $('#myModalAlmacen').modal('show');
    });
    
    $('#myModalAlmacen').on('hidden.bs.modal', function (e) {
        $('#frmAlmacen').trigger('reset');
        const inputs = document.querySelectorAll('#myModalAlmacen .txt_field input, #myModalAlmacen .txt_field select');
         inputs.forEach(input => input.classList.remove('input-has-text'));
    });
    $("#myModalAlmacen").on('shown.bs.modal', function(){
        const inputs = document.querySelectorAll('#myModalAlmacen .txt_field input, #myModalAlmacen .txt_field select');
         inputs.forEach(input => { if (input.value.trim() !== '') { input.classList.add('input-has-text'); }
            input.addEventListener('input', () => { if (input.value.trim() !== '') { input.classList.add('input-has-text');
            } else { input.classList.remove('input-has-text');  }
            });
        });
    });
});
$('#frmAlmacen').on('submit', function (e) {
    e.preventDefault();
    
    let myForm = document.getElementById('frmAlmacen');
    let parameters = new FormData(myForm);
    let param_id= $('input[name="id"]').val()
    let url="";
    let titulo="";
    if  ($('input[name="action"]').val() == 'add'){
        url =  '/erp/almacen/add/';
        titulo="¿Estas seguro de crear el Almacen?";
    }else{
        url = "/erp/almacen/update/"+param_id+"/";
        titulo="¿Estas seguro de actualizar el Almacen?";
    }
    submit_with_ajax(url, 'Estimado usuario(a)', titulo, parameters, function (response) {
            $('#myModalAlmacen').modal('hide'); 
            dttAlmacen.ajax.reload();
        });

});
$('#data_list tbody').on('click', 'a[rel="edit"]', function () {
    //$('#productos tbody').on('click', '.nombreclase', function () {
        var tr = $("#data_list").DataTable().cell($(this).parents('td, li')).index();
        var data = $("#data_list").DataTable().row(tr.row).data();
        $('.modal-title').find('i').removeClass().addClass('fas fa-edit');
      $('.modal-title').find('span').html('Edición del Almacen:  ' + '<b style="color: #ffffff;">' + data.codigo + '</b>');
      param_id=data.id;
      console.log(data)
      $('input[name="action"]').val('edit');
      $('input[name="id"]').val(data.id);
      $('input[name="codigo"]').val(data.codigo);
      $('input[name="nombre"]').val(data.nombre);
      $('#idunidad').val(data.unidad).trigger('change.select2');
      $('input[name="ced"]').val(data.ced);
      $('input[name="responsable"]').val(data.responsable);


      $('#myModalAlmacen').modal('show');      
  });
  $('#data_list tbody').on('click', 'a[rel="delete"]', function () {
    $('.modal-title').find('i').removeClass().addClass('fas fa-edit');
    var tr = $("#data_list").DataTable().cell($(this).parents('td, li')).index();
    var data = $("#data_list").DataTable().row(tr.row).data();
    var parameters = new FormData();
    parameters.append('action', 'delete');
    parameters.append('id', data.id);
   
    url = "/erp/almacen/delete/"+data.id+"/";
    submit_with_ajax(url, 'Notificación', '¿Estas seguro de eliminar el Almacen?  ' + '<b style="color: #304ffe;">' + data.nombre + '</b>', parameters, function () {
        dttAlmacen.ajax.reload();
    });
  });

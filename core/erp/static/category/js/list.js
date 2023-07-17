var dttCateg;
$(function () {
    dttCateg = $('#data_list').DataTable({
        responsive: false,
        autoWidth: false,        
        destroy: true,
        deferRender: true,
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
        ajax: {
            url: window.location.pathname,
            type: 'POST',
            data: {
                'action': 'searchdata'
            },
            dataSrc: ""
        },
        columns: [
            {"data": "id"},
            {"data": "nombre"},
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
    $('.btnPrueba').on('click', function () {        
        $('#prueba').modal('show');
    });
    $('.btnAdd').on('click', function () {
        $('input[name="action"]').val('add');
        $('#modaltitle3').find('span').html('Creando Nueva Categoría');
        $('#modaltitle3').find('i').removeClass().addClass('fas fa-plus');
        $('#idnombrecateg').focus();
        $('#modalCategory').modal('show');
    });
    
    $('#modalCategory').on('hidden.bs.modal', function (e) {
        $('#frmCatgorias').trigger('reset');
        const inputs = document.querySelectorAll('#modalCategory .txt_field input');
         inputs.forEach(input => input.classList.remove('input-has-text'));
    })
   
});
$('#frmCatgorias').on('submit', function (e) {
    e.preventDefault();
    
    let myForm = document.getElementById('frmCatgorias');
    let parameters = new FormData(myForm);
    let param_id= $('input[name="id"]').val()
    let url="";
    let titulo="";
    let text="";
    if  ($('input[name="action"]').val() == 'add'){
        url =  '/erp/category/add/';
        titulo= "¿Estas seguro de crear la categoria?";
        text = "Creado";
    }else{
        url = "/erp/category/update/"+param_id+"/";
        titulo="¿Estas seguro de actualizar la categoria?";
        text = "Modificado";
    }
    submit_with_ajax(url, 'Estimado usuario(a)', titulo, parameters, function (response) {
            $('#modalCategory').modal('hide');
            sweet_info( 'El Registro Ha Sido '+text+' Con Exito');
            dttCateg.ajax.reload();
        });

});
$('#data_list tbody').on('click', 'a[rel="edit"]', function () {
    //$('#productos tbody').on('click', '.nombreclase', function () {
        var tr = $("#data_list").DataTable().cell($(this).parents('td, li')).index();
        var data = $("#data_list").DataTable().row(tr.row).data();
        $('.modal-title').find('i').removeClass().addClass('fas fa-edit');
      $('.modal-title').find('span').html('Edición de una categoría');
      param_id=data.id;
      $('input[name="action"]').val('edit');
      $('input[name="id"]').val(data.id);
      $('input[name="nombre"]').val(data.nombre);
      $('#modalCategory').modal('show');
  });
  $("#modalCategory").on('shown.bs.modal', function(){
    const inputs = document.querySelectorAll('#modalCategory .txt_field input');
    inputs.forEach(input => { if (input.value.trim() !== '') { input.classList.add('input-has-text'); }
        input.addEventListener('input', () => { if (input.value.trim() !== '') { input.classList.add('input-has-text');
        } else { input.classList.remove('input-has-text'); }
        });
    });
});
  $('#data_list tbody').on('click', 'a[rel="delete"]', function () {
    var tr = $("#data_list").DataTable().cell($(this).parents('td, li')).index();
    var data = $("#data_list").DataTable().row(tr.row).data();
    var parameters = new FormData();
    parameters.append('action', 'delete');
    parameters.append('id', data.id);
   
    url = "/erp/category/delete/"+data.id+"/";
    submit_with_ajax(url, 'Notificación', '¿Estas seguro de eliminar la categoria?  ' + '<b style="color: #304ffe;">' + data.nombre + '</b>', parameters, function () {
        sweet_info( 'El Registro Ha Sido Eliminado Con Exito');
        dttCateg.ajax.reload();
    });
  });

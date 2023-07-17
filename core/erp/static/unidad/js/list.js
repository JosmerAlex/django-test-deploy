var $ = jQuery.noConflict();
var param_id = "";  
   
  $(function () {
   

    getData();
  
    //boton agregar nueva salida
    $('.btnAdd').on('click', function () {
        $('input[name="action"]').val('add');
        $('.modal-title').find('span').html('Creación de una Unidad');
        $('.modal-title').find('i').removeClass().addClass('fas fa-plus');
        $("#idcodigo").focus();
        $('#myModalUnidad').modal('show');

    });
   

    // para limpiar los campos del  modal cuando se cierre
   
    $('#myModalUnidad').on('hidden.bs.modal', function (e) {
        $('#frmUnidad').trigger('reset');
        const inputs = document.querySelectorAll('#myModalUnidad .txt_field input, #myModalUnidad .txt_field select, #myModalUnidad .txt_field textarea');
         inputs.forEach(input => input.classList.remove('input-has-text'));
        
    })

    // para capturar el clik del boton actualizar, el cual tiene una variable de referencia rel="edit"
    $('#data_list tbody').on('click', 'a[rel="edit"]', function () {        
            $('.modal-title').find('i').removeClass().addClass('fas fa-edit');
          var tr = $("#data_list").DataTable().cell($(this).parents('td, li')).index();
          var datos = $("#data_list").DataTable().row(tr.row).data();
          $('.modal-title').find('span').html('Edición de una Unidad');
          param_id=datos.id;
          $('input[name="nombre"]').val(datos.nombre);
           $('textarea[name="direccion"]').val(datos.direccion);
          $('input[name="action"]').val('edit');
          $('input[name="id"]').val(datos.id);
          $('input[name="rif"]').val(datos.rif);
          $('input[name="ced_resp"]').val(datos.ced_resp);
          $('input[name="nombrejefe"]').val(datos.nombrejefe);
          $('input[name="email"]').val(datos.email);
          $('input[name="tlf"]').val(datos.tlf);
          $('select[name="tipo_unidad"]').val(datos.tipo_unidad.id);                  
          $('#myModalUnidad').modal('show');
    });

    $("#myModalUnidad").on('shown.bs.modal', function(){
        const inputs = document.querySelectorAll('#myModalUnidad .txt_field input, #myModalUnidad .txt_field select, #myModalUnidad .txt_field textarea');
         inputs.forEach(input => { if (input.value.trim() !== '') { input.classList.add('input-has-text'); }
            input.addEventListener('input', () => { if (input.value.trim() !== '') { input.classList.add('input-has-text');
            } else { input.classList.remove('input-has-text');  }
            });
        });
    });
      //  para capturar el clik del boton eliminar, el cual tiene una variable de referencia rel="delete"
      $('#data_list tbody').on('click', 'a[rel="delete"]', function () {
        $('.modal-title').find('i').removeClass().addClass('fas fa-edit');
        var tr = $("#data_list").DataTable().cell($(this).parents('td, li')).index();
        var data = $("#data_list").DataTable().row(tr.row).data();
        var parameters = new FormData();
        parameters.append('action', 'delete');
        parameters.append('id', data.id);
       
        url = "/erp/unidad/delete/"+data.id+"/";
        submit_with_ajax(url, 'Notificación', '¿Estas seguro de eliminar la unidad?  ' + '<b style="color: #304ffe;">' + data.nombre + '</b>', parameters, function () {
        getData();
        });
      });

      // para capturar el submit del formulario modal"
      $('#frmUnidad').on('submit', function (e) {
        e.preventDefault();
        let myForm = document.getElementById('frmUnidad');
        let parameters = new FormData(myForm);
        let url="";
        let titulo="";
        if  ($('input[name="action"]').val() == 'add'){
            url =  '/erp/unidad/add/';
            titulo="¿Estas seguro de crear la unidad?";
        }else{
            url = "/erp/unidad/update/"+param_id+"/";
            titulo="¿Estas seguro de actualizar la unidad?";
        }
        submit_with_ajax(url, 'Estimado(a) Usuario  ', titulo, parameters, function () {
           $('#myModalUnidad').modal('hide');
           getData();        
        });
      });
});

function getData() {

  $('#data_list').DataTable({
    responsive: false,
    autoWidth: false,
    destroy: true,
    deferRender: true,
    ajax: {
        url: '/erp/unidad/list/',
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
    order: false,
    ordering: false,
    columns: [
        {"data": "id"},
        {"data": "full_name"},
        {"data": "nombrejefe"},
        {"data": "email"},
        {"data": "tlf"},
        {"data": "tipo_unidad.name"},
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
   
}


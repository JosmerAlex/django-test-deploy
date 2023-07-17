
var $ = jQuery.noConflict();
var param_id = "";  
   
  $(function () {
   
    getData();
  
    $('.btnAdd').on('click', function () {
        $('input[name="action"]').val('add');
        $('.modal-title').find('span').html('Creación de un Producto');
        $('.modal-title').find('i').removeClass().addClass('fas fa-plus');
        $("#idcodigo").focus();
        $('#myModalProduc').modal('show');

    });

    // para limpiar los campos del  modal cuando se cierre
    $('#myModalProduc').on('hidden.bs.modal', function() {
        
        $("#myModalProduc input").val("");
        $("#idstock_actual").val(0);
        $("#idprecio").val(0.0);
        $("#myModalProduc textarea").val("");
        $("#myModalProduc select").val("");
        $('#idcategoria').val("").trigger('change.select2');
        $('#idmarca').val("").trigger('change.select2');
        $("#imagenPrevisualizacion").attr("src","/media/producto/unnamed.png");
        $("#idactivo").prop('checked', 0).change();
       // $("#myModalProduc input[type='checkbox']").prop('checked', false).change();
       
    });

    // para capturar el clik del boton actualizar, el cual tiene una variable de referencia rel="edit"
    $('#data_list tbody').on('click', 'a[rel="edit"]', function () {
      //$('#productos tbody').on('click', '.nombreclase', function () {
          $('.modal-title').find('i').removeClass().addClass('fas fa-edit');
        var tr = $("#data_list").DataTable().cell($(this).parents('td, li')).index();
        var datos = $("#data_list").DataTable().row(tr.row).data();
        $('.modal-title').find('span').html('Edición del Producto:  ' + '<b style="color: #b3e5fc;">' + datos.nombre + ' Codigo: ' + datos.stock_actual + '</b>');
        console.log(datos);
        param_id=datos.id;
        $('input[name="action"]').val('edit');
        $('input[name="id"]').val(datos.id);
        $('input[name="codigo"]').val(datos.codigo);
        $('input[name="nombre"]').val(datos.nombre);
        $('textarea[name="descripcion"]').val(datos.descripcion);
        //$('select[name="condicion"]').val(datos.condicion.id);
        $('select[name="tipo_produc"]').val(datos.tipo_produc.id);
        $('select[name="unida_medida"]').val(datos.unida_medida.id);
        $('#idcategoria').val(datos.categorias.id).trigger('change.select2');
        $('#idmarca').val(datos.marca.id).trigger('change.select2');
        $('input[name="stock_actual"]').val(datos.stock_actual);
        $('input[name="precio"]').val(datos.precio);
        $('input[name="stock_min"]').val(datos.stock_min);
        $('input[name="stock_max"]').val(datos.stock_max);
        $("#idactivo").val(datos.activo);

      //   if (datos.activo == 1){
      //     //$("#idactivo").val(1).change();
      //     $("#idactivo").prop('checked', 1);
      //   }else{
      //     //$("#idactivo").val(0).change();
      //     $("#idactivo").prop('checked', 0);
      //   }

      
       // $("#idactivo").prop("checked", datos.activo);
        $('select[name="usuario"]').val(datos.usuario.id);
        $('select[name="almacenes"]').val(datos.almacenes.id);
        $("#imagenPrevisualizacion").attr("src",datos.imagen);
        $('#myModalProduc').modal('show');
    });


    $("#myModalProduc").on('shown.bs.modal', function(){
        $("#idnombre").focus();
    });
      //  para capturar el clik del boton eliminar, el cual tiene una variable de referencia rel="delete"
      $('#productos tbody').on('click', 'a[rel="delete"]', function () {
        $('.modal-title').find('i').removeClass().addClass('fas fa-edit');
        var tr = $("#productos").DataTable().cell($(this).parents('td, li')).index();
        var data = $("#productos").DataTable().row(tr.row).data();
        var parameters = new FormData();
        parameters.append('action', 'delete');
        parameters.append('id', data.id);
        console.log(parameters);
       
        url = "/erp/product/delete/"+data.id+"/";
        submit_with_ajax(url, 'Notificación', '¿Estas seguro de eliminar el producto?  ' + '<b style="color: #304ffe;">' + data.nombre + ' ' + data.categorias.nombre  + '</b>', parameters, function () {
        getData();
        });
      });

      // para capturar el submit del formulario modal"
      $('form').on('submit', function (e) {
        e.preventDefault();
        //var parameters = new FormData();
        //url: '{% url 'erp:product_create' %}',
        //url = "product/update/"+datos.id+"",
        //let myForm = document.querySelector('formproduc');
        let myForm = document.getElementById('formproduc');
        let parameters = new FormData(myForm);
        //let parameters = new FormData(myForm);
        //var parameters = new FormData(form);
        let url="";
        let titulo="";
        if  ($('input[name="action"]').val() == 'add'){
            url =  '/erp/product/add/';
            titulo="¿Estas seguro de crear el producto?";
        }else{
            url = "/erp/product/update/"+param_id+"/";
            titulo="¿Estas seguro de actualizar los datos del producto?";
        }
    
       // var url = "/product/add/";
        submit_with_ajax(url, 'Estimado(a) Usuario  ', titulo, parameters, function () {
           $('#myModalProduc').modal('hide');
           getData();
          // $('#productos').data.reload();
         //  tblClient.ajax.reload();
        
        });
      });

});


function getData() {

  $('#productos').DataTable({
    responsive: true,
    autoWidth: false,
    destroy: true,
    deferRender: true,
    ajax: {
        url: '/erp/product/list/',
        //url: window.location.pathname,
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
        search: "Buscar:",
        zeroRecords: "Sin resultados encontrados",
        paginate: {
          first: "Primero",
          last: "Ultimo",
          next: "Siguiente",
          previous: "Anterior",
        },
        buttons: {
        copy: "Copiar", 
        print: "Imprimir",
        },
    }, 
    columns: [
        {"data": "imagen"},
        {"data": "nombre"},
        {"data": "codigo"}, 
        {"data": "categorias.nombre"},
        {"data": "stock_actual"},
        {"data": "precio"},
        {"data": "activo"},
        {"data": "id"},
    ],
    
    columnDefs: [
          {
            targets: [-8],
            class: 'text-center',
            orderable: false,
            render: function (data, type, row) {
                return '<img src="'+data+'" class="img-fluid d-block mx-auto" style="width: 24px; height: 24px;">';
            }
          },
          {
              targets: [-3],
              class: 'text-center',
              orderable: false,
              render: function (data, type, row) {
                  return parseFloat(data).toFixed(2);
              }
          },
          {
            targets: [-2],
            class: 'text-center',
            orderable: false,
            render: function (data, type, row) {
                if(row.activo){
                    return '<i class="fa fa-check" style="color:green"></i>'
                }
                return '<i class="fa fa-ban" style="color:red"></i>'
            }
        },
        {
            targets: [-1],
            class: 'text-center',
            orderable: false,
            render: function (data, type, row) {
                var buttons = '<a href="#" rel="edit" class="btn btn-warning btn-xs btn-flat btnEdit"><i class="fas fa-edit"></i></a> ';
                buttons += '<a href="#" rel="delete" class="btn btn-danger btn-xs btn-flat"><i class="fas fa-trash-alt"></i></a>';
                return buttons;
                }
            },
        ],
       
        initComplete: function (settings, json) {
          
        }
    }).buttons().container().appendTo('#productos_wrapper .col-md-6:eq(0)');
    // aqui termina el  tblClient= $('#productos').DataTable({
}
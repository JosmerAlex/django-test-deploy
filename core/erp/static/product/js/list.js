var param_id = "";  
var dttProd = "";  

$(function () {
  dttProd = $('#data_list').DataTable({
    responsive: false,
    autoWidth: false,
    destroy: true,
    deferRender: true,
    ajax: {
        url: '/erp/product/list/',
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
    //paging: false,
    ordering: false,
    //info: false,
    //searching: false,    
   
    columns: [
        {"data": "codigo"},
        {"data": "nombre"},
        {"data": "imagen"},
        {"data": "categorias.nombre"},
        {"data": "marca.marca"},
        {"data": "modelo.modelo"},
        {"data": "activo"},
        {"data": "id"},
    ],
    
    columnDefs: [
        {
            targets: [-8],
            class: 'text-center',
            orderable: false,
            render: function (data, type, row) {
                return '<span class="badge badge-secondary badge-pill" style="font-size: 9px;">'+data+'</span>';
            }
          },
          {
            targets: [-6],
            class: 'text-center',
            orderable: false,
            render: function (data, type, row) {
                return '<img src="'+data+'" class="img-fluid d-block mx-auto elevation-1 img-border" style="width: 28px; height: 27px; border-radius:  0.15rem;">';
            }
          },        
          
          {
            targets: [-2],
            class: 'text-center',
            orderable: false,
            render: function (data, type, row) {
                if(row.activo == true)return '<a><i class="fa fa-check" style="color:green"><span style="display:none;">'+'activo'+'</span></i></a>'
                if(row.activo == false)return '<a><i class="fa fa-times" style="color:red"><span style="display:none;">'+'inactivo'+'</span></i></a>'
            }
        },
        {
            targets: [-1],
            class: 'text-center',
            orderable: false,
            render: function (data, type, row) {
                var buttons = '<a href="/erp/product/update/'+ row.id +'/" class="btn btn-warning btn-xs btnEdit elevation-1"><i class="fas fa-edit"></i></a> ';
                if(row.activo){ buttons += '<a rel="inactivar" class="btn btn-orange btn-xs elevation-1"><i class="fas fa-times-circle"></i></a> ';                        
                }else{ buttons += '<a rel="activar" class="btn btn-info btn-xs elevation-1"><i class="fas fa-check-circle"></i></a> ';};   
                buttons += '<a rel="detail" class="btn btn-success btn-xs elevation-1"><i class="fas fa-search"></i></a> ';
                buttons += '<a rel="delete" class="btn btn-danger btn-xs elevation-1"><i class="fas fa-trash-alt"></i></a> ';
                return buttons;
                }
            },
        ],
       
        initComplete: function (settings, json) {
          $('.paginate_button').addClass('pagination-button');
          
        }
    });    
    //  para capturar el clik del boton eliminar, el cual tiene una variable de referencia rel="delete"
    $('#data_list tbody').on('click', 'a[rel="delete"]', function () {
      $('.modal-title').find('i').removeClass().addClass('fas fa-edit');
      var tr = $("#data_list").DataTable().cell($(this).parents('td, li')).index();
      var data = $("#data_list").DataTable().row(tr.row).data();
      var parameters = new FormData();
      parameters.append('action', 'delete');
      parameters.append('id', data.id);
      url = "/erp/product/delete/"+data.id+"/";
      submit_with_ajax(url, 'Notificación', '¿Estas seguro de eliminar el producto?  ' + '<b style="color: #304ffe;">' + data.nombre + ' ' + data.categorias.nombre  + '</b>', parameters, function () {
        sweet_info( 'El Registro Ha Sido Eliminado Con Exito');
        dttProd.ajax.reload();
      });
    });
    $('#data_list tbody').on('click', 'a[rel="detail"]', function() {
      var tr = $("#data_list").DataTable().cell($(this).closest('td, li')).index();
      var data = $("#data_list").DataTable().row(tr.row).data();
      $("#detalle_prod").modal('show');
          $('#detail_prod').find('span').html('Información del Producto: ' + '<span class="title-custom">' + data.codigo + '</span>');
          $('#detail_prod').find('i').removeClass().addClass('fas fa-info-circle');
      $('#image').html('<img src="'+ data.imagen +'" style="width: 120px; height: 110px;" class="img-fluid" alt="User Image">');
      
      $('#first_name').text(data.nombre);
      $('#last_name').text(data.categorias.nombre);	
      $('#dni').text(data.marca.marca);	
      $('#email').text(data.modelo.modelo);
      $('#fecha').text(data.grupobien.nombre);
      $('#sesion').text(data.subgrupobien.denominacion);
      $('#medida').text(data.unida_medida.name);
      $('#moneda').text(data.moneda.full_name);
      $('#desc').text(data.descripcion);     
      if(data.activo){
          $('#active').html('<i class="fas fa-check"></i>');
      }else{
          $('#active').html('<i class="fas fa-times"></i>');
      }
      if(data.pagaimpuesto){
        $('#imp').html('<i class="fas fa-check"></i>');
      }else{
          $('#imp').html('<i class="fas fa-times"></i>');
      }
      if(data.inventariable){
        $('#inv').html('<i class="fas fa-check"></i>');
      }else{
          $('#inv').html('<i class="fas fa-times"></i>');
      } 
      if(data.lote){
        $('#lote').html('<i class="fas fa-check"></i>');
      }else{
          $('#lote').html('<i class="fas fa-times"></i>');
      } 
      if(data.serie){
        $('#serie').html('<i class="fas fa-check"></i>');
      }else{
          $('#serie').html('<i class="fas fa-times"></i>');
      }  
  
    });
    $('#data_list tbody').on('click', 'a[rel="activar"]', function () {
      $('.modal-title').find('i').removeClass().addClass('fas fa-check-circle');
      var tr = $("#data_list").DataTable().cell($(this).parents('td, li')).index();
      var data = $("#data_list").DataTable().row(tr.row).data();
      var parameters = new FormData();
      parameters.append('action', 'activar');
      parameters.append('id', data.id);       
      url = window.location.pathname;
      submit_with_ajax(url, 'Activar Producto', '¿Estas seguro de activar el producto ' + '<b style="color: #304ffe;">' + data.nombre + '</b>?', parameters, function () {
        sweet_info( 'El Registro Ha Sido Activado Con Exito');
        dttProd.ajax.reload();
      });
    });
    $('#data_list tbody').on('click', 'a[rel="inactivar"]', function () {
      $('.modal-title').find('i').removeClass().addClass('fas fa-check-circle');
      var tr = $("#data_list").DataTable().cell($(this).parents('td, li')).index();
      var data = $("#data_list").DataTable().row(tr.row).data();
      var parameters = new FormData();
      parameters.append('action', 'inactivar');
      parameters.append('id', data.id);       
      url = window.location.pathname;
      submit_with_ajax(url, 'Inactivar Producto', '¿Estas seguro de inactivar el producto ' + '<b style="color: #304ffe;">' + data.nombre + '</b>?', parameters, function () {
        sweet_info( 'El Registro Ha Sido Inactivado Con Exito');
        dttProd.ajax.reload();
      });
             
      });
});
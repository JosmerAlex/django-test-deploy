
var $ = jQuery.noConflict();
var param_id = "";  
   
  $(function () {
   
    getDataIng();
  
    $('.btnAdd').on('click', function () {
        $('input[name="action"]').val('add');
        $('.modal-title').find('span').html('Creación de un Producto');
        $('.modal-title').find('i').removeClass().addClass('fas fa-plus');
        $("#idcodigo").focus();
        $('#myModalIngreProd').modal('show');

    });

    // para limpiar los campos del  modal cuando se cierre
    $('#myModalIngreProd').on('hidden.bs.modal', function() {
        
        $("#myModalIngreProd input").val("");
        $("#idstock_actual").val(0);
        $("#idprecio").val(0.0);
        $("#myModalIngreProd textarea").val("");
        $("#myModalIngreProd select").val("");
        $('#idcategoria').val("").trigger('change.select2');
        $('#idmarca').val("").trigger('change.select2');
        $("#imagenPrevisualizacion").attr("src","/media/producto/unnamed.png");
        $("#idactivo").prop('checked', 0).change();
       // $("#myModalProduc input[type='checkbox']").prop('checked', false).change();
       
    });

    // para capturar el clik del boton actualizar, el cual tiene una variable de referencia rel="edit"
    $('#tablaingre_prod tbody').on('click', 'a[rel="edit"]', function () {
        //$('#productos tbody').on('click', '.nombreclase', function () {
            $('.modal-title').find('i').removeClass().addClass('fas fa-edit');
          var tr = $("#tablaingre_prod").DataTable().cell($(this).parents('td, li')).index();
          var datos = $("#tablaingre_prod").DataTable().row(tr.row).data();
          $('.modal-title').find('span').html('Edición del Producto:  ' + '<b style="color: #b3e5fc;">' + datos.nombre + ' Codigo: ' + datos.stock_actual + '</b>');
          console.log(datos);
          param_id=datos.id;
          $('input[name="action"]').val('edit');
          $('input[name="id"]').val(datos.id);
          $('input[name="codigo"]').val(datos.codigo);
          $('input[name="nombre"]').val(datos.nombre);
          $('textarea[name="descripcion"]').val(datos.descripcion);
          $('select[name="condicion"]').val(datos.condicion.id);
          $('select[name="tipo_produc"]').val(datos.tipo_produc.id);
          $('select[name="unida_medida"]').val(datos.unida_medida.id);
          $('#idcategoria').val(datos.categorias.id).trigger('change.select2');
          $('#idmarca').val(datos.marca.id).trigger('change.select2');
          $('input[name="stock_actual"]').val(datos.stock_actual);
          $('input[name="precio"]').val(datos.precio);
          $('input[name="stock_min"]').val(datos.stock_min);
          $('input[name="stock_max"]').val(datos.stock_max);

          if (datos.activo == 1){
            //$("#idactivo").val(1).change();
            $("#idactivo").prop('checked', 1);
          }else{
            //$("#idactivo").val(0).change();
            $("#idactivo").prop('checked', 0);
          }

        
         // $("#idactivo").prop("checked", datos.activo);
          $('select[name="usuario"]').val(datos.usuario.id);
          $('select[name="almacenes"]').val(datos.almacenes.id);
          $("#imagenPrevisualizacion").attr("src",datos.imagen);
          $('#myModalIngreProd').modal('show');
      });

    $("#myModalIngreProd").on('shown.bs.modal', function(){
        $("#idnombre").focus();
    });
      //  para capturar el clik del boton eliminar, el cual tiene una variable de referencia rel="delete"
      $('#tablaingre_prod tbody').on('click', 'a[rel="delete"]', function () {
        $('.modal-title').find('i').removeClass().addClass('fas fa-edit');
        var tr = $("#tablaingre_prod").DataTable().cell($(this).parents('td, li')).index();
        var data = $("#tablaingre_prod").DataTable().row(tr.row).data();
        var parameters = new FormData();
        parameters.append('action', 'delete');
        parameters.append('id', data.id);
        console.log(parameters);
       
        url = "/erp/product/delete/"+data.id+"/";
        submit_with_ajax(url, 'Notificación', '¿Estas seguro de eliminar el producto?  ' + '<b style="color: #304ffe;">' + data.nombre + ' ' + data.categorias.nombre  + '</b>', parameters, function () {
          getDataIng();
        });
      });

      // para capturar el submit del formulario modal"
      $('#frmIngreso').on('submit', function (e) {
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
           $('#myModalIngreProd').modal('hide');
           getDataIng();
          // $('#productos').data.reload();
         //  tblClient.ajax.reload();
        
        });
      });

});


function getDataIng() {
  $('#tablaingre_prod').DataTable({
    //responsive: true,
    scrollX: true,
    autoWidth: false,
    destroy: true,
    deferRender: true,
    ajax: {
        url: '/erp/ingreso/list/',
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
        {
            "className": 'details-control',
            "orderable": false,
            "data": null,
            "defaultContent": ''
        },
        {"data": "cod_ingreso"},
        {"data": "proveedor.empresa"},
        {"data": "num_comprob"}, 
        {"data": "fecha_ingreso"},
        {"data": "subtotal"},
        {"data": "iva"},
        {"data": "total"},
        {"data": "estado"},
        {"data": "id"},
    ],
    
    columnDefs: [
          {
            targets: [-3, -4, -5],
            class: 'text-center',
            render: function (data, type, row) {
                return parseFloat(data).toFixed(2);
            }
          },
          {
            targets: [-2],
            class: 'text-center',
            orderable: false,
            render: function (data, type, row) {
              if(row.estado == 'A') return '<i class="fa fa-ban" style="color:red"></i>';
              if(row.estado == 'C') return '<i class="fa fa-check" style="color:green"></i>';
              if(row.estado == 'E') return '<i class="fa fa-hand-paper" style="color:#ffc107"></i>';
              
            }
            
        },
        {
            targets: [-1],
            class: 'text-center',
            orderable: false,
            render: function (data, type, row) {
                var buttons = '<a href="/erp/ingreso/update/' + row.id + '/" class="btn btn-warning btn-xs btn-flat"><i class="fas fa-edit"></i></a> ';
                buttons += '<a href="#" rel="delete" class="btn btn-danger btn-xs btn-flat"><i class="fas fa-trash-alt"></i></a> ';
                buttons += '<a rel="VerDetIngre" class="btn btn-success btn-xs btn-flat"><i class="fas fa-search"></i></a> ';
                buttons += '<a href="" target="_blank" class="btn btn-info btn-xs btn-flat"><i class="fas fa-file-pdf"></i></a> ';
                return buttons;
                }
            },
        ],
       
        initComplete: function (settings, json) {
          
        }
    }).buttons().container().appendTo('#tablaingre_prod_wrapper .col-md-6:eq(0)');
    
    function format(d) {
        console.log(d);
        var html = '<table class="table">';
        html += '<thead class="thead-dark">';
        html += '<tr><th scope="col">Producto</th>';
        html += '<th scope="col">Categoría</th>';
        html += '<th scope="col">Precio</th>';
        html += '<th scope="col">Cantidad</th>';
        html += '<th scope="col">Subtotal</th></tr>';
        html += '</thead>';
        html += '<tbody>';
        $.each(d.det, function (key, value) {
            html+='<tr>'
            html+='<td>'+value.prod.nombre+'</td>'
            html+='<td>'+value.prod.categorias.nombre+'</td>'
            html+='<td>'+value.precio+'</td>'
            html+='<td>'+value.cant+'</td>'
            html+='<td>'+value.subtotal+'</td>'
            html+='</tr>';
        });
        html += '</tbody>';
        return html;
    }

    
    $('#tablaingre_prod tbody')
        .on('click', 'a[rel="VerDetIngre"]', function () {
            var tr =  $("#tablaingre_prod").DataTable().cell($(this).closest('td, li')).index();
            var data =  $("#tablaingre_prod").DataTable().row(tr.row).data();
           //  console.log(data);
            $('#tblDetalleProd').DataTable({
                responsive: true,
                autoWidth: false,
                destroy: true,
                deferRender: true,

                //data: data.det, es otra forma de cargar el datatable, ya que tambien puede recibir un array o diccionario
                //y en este caso pues en el modelo en el metodo toJAISON() incorporo un diccionario llamado (det) con los registros o productos del ingreso  
                ajax: {
                    url: window.location.pathname,
                    type: 'POST',
                    data: {
                        'action': 'search_detalle_prod',
                        'id': data.id
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
                   
                    {"data": "prod.nombre"},
                    {"data": "prod.categorias.nombre"},
                    {"data": "precio"},
                    {"data": "cant"},
                    {"data": "subtotal"},
                ],
                columnDefs: [
                    {
                        targets: [-1, -3],
                        class: 'text-center',
                        render: function (data, type, row) {
                            return parseFloat(data).toFixed(2) + ' Bs.';
                        }
                    },
                    {
                        targets: [-2],
                        class: 'text-center',
                        render: function (data, type, row) {
                            return data;
                        }
                    },
                ],
                initComplete: function (settings, json) {

                }
            });
            console.log(data);

            $('#myModalDetProd').modal('show');
        })
        .on('click', 'td.details-control', function () {
            var tr = $(this).closest('tr');
            var row =  $("#tablaingre_prod").DataTable().row(tr);
            if (row.child.isShown()) {
                row.child.hide();
                tr.removeClass('shown');
            } else {
                row.child(format(row.data())).show();
                tr.addClass('shown');
            }
        });

}
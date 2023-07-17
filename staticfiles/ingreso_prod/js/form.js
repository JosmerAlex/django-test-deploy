var tblProducts;
var tblSearchProducts;
//creamos una variable ingresos la cual contendra un diccionario llamado items el cual contendra en encabezado de la factura,
// y este a su ven contendra un array llamado productos el cual almacenara los productos seleccionado 
var ingresos = 
{
    items: 
    {
        cod_ingreso: '',
        almacen: '',
        tipo_ingreso: '',
        proveedor: '',
        tipo_comprob: '',
        num_comprob: '',
        subtotal: 0.00,
        iva: 0.00,
        total: 0.00,
        fecha_ingreso: '',
        usuario: '',
        observ: '',
        estado: '',
        productos: []
    },

    get_ids: function () 
    {
        var ids = [];
       //el this me permite hacer saber al codigo que estoy haciendo referencia al objeto actual en este caso a ingresos, 
       //porq estoy dentro de su estructura
        $.each(this.items.productos, function (key, value) {
            ids.push(value.id);
        });
        return ids;
    },

    //calcular factura, recorremos el diccionario items y su array de productos, al cual nois moveremos mediante una funcion anonima 
    //mediante pos = posicion y dist = lo que contiene el diccionario. 
    calcular_factura: function () {
       
        var subtotal = 0.00;
        var iva = $('input[name="iva"]').val();
        //var iva = $('#iva').val();
       
        $.each(this.items.productos, function (pos, dict) {
            dict.pos = pos;
            dict.subtotal = dict.cant * parseFloat(dict.precio);
            subtotal += dict.subtotal;
           // alert(subtotal)
        });
        this.items.subtotal = subtotal;
        this.items.iva = this.items.subtotal * iva;
        this.items.total = this.items.subtotal + this.items.iva;
       
        $('input[name="subtotal"]').val(this.items.subtotal.toFixed(2));
        $('input[name="ivacalc"]').val(this.items.iva.toFixed(2));
        $('input[name="total"]').val(this.items.total.toFixed(2));
    },

    //cuando llamamos a este metodo agrega cada items del producto seleccionado a mi array productos y luego listarlos en mi datatable
    add: function (item) {
        this.items.productos.push(item);
        this.list();
    },

    //este metodo lo utilizo para poder listar los productos al datatable
    list: function () 
    {
        this.calcular_factura();
        tblProducts = $('#tblProducts').DataTable({
            responsive: true,
            autoWidth: false,
            destroy: true,
            deferRender: true,
            //aqui es la variable interna de datatable le paso mi diccionario de items el cual contiene el encabezado y el array de productos
            //el cual se encuentra en el mismo diccionario, ojo tambien pude crear un ajax pero no es necesario ya que esta variable o propiedad data
            //del datatable permite tambien recibir un array, el cual ya lo tengo con datos y todo
            data: this.items.productos,
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
                {"data": "id"},
                {"data": "codigo"},
                {"data": "full_name", className: "text-left"},
                {"data": "stock_actual"},
                {"data": "precio"},
                {"data": "cant"},
                {"data": "subtotal"},
            ],
            columnDefs: [
                {
                    targets: [0],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<a rel="deleteprod" class="btn btn-danger btn-xs btn-flat" style="color: white;"><i class="fas fa-trash-alt"></i></a>';
                    }
                },
                {
                    targets: [-1],
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
                        return '<input type="text" class="form-control form-control-sm" name="cant" style="font-size: 12px;" autocomplete="off" value="' + row.cant + '">';
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
                    targets: [-4],
                    class: 'text-center',
                    render: function (data, type, row) {
                        return '<span class="badge badge-secondary">' + data + '</span>';
                    }
                },               
                {
                    targets: [-6],
                    class: 'text-center',
                    render: function (data, type, row) {
                        return '<span>' + data + '</span>';
                    }
                },
               
                
               
            ],
            rowCallback(row, data, displayNum, displayIndex, dataIndex) {

                // $(row).find('input[name="cant"]').TouchSpin({
                //     min: 1,
                //     max: data.stock_actual,
                //     step: 1
                // });

            },
            initComplete: function (settings, json) {

            }
        });
       // console.clear();
      //  console.log(this.items);
       // console.log(this.get_ids());
    },
};

function formatRepo(repo) {
    if (repo.loading) {
        return repo.text;
    }

    if (!Number.isInteger(repo.id)) {
        return repo.text;
    }

    var option = $(
        '<div class="wrapper container">' +
        '<div class="row">' +
        '<div class="col-lg-1">' +
        '<img src="' + repo.imagen + '" class="img-fluid img-thumbnail d-block mx-auto rounded">' +
        '</div>' +
        '<div class="col-lg-11 text-left shadow-sm">' +
        //'<br>' +
        '<p style="margin-bottom: 0;">' +
        '<b>Nombre:</b> ' + repo.full_name + '<br>' +
        '<b>Stock:</b> ' + repo.stock_actual + '<br>' +
        '<b>PVP:</b> <span class="badge badge-warning">$' + repo.precio + '</span>' +
        '</p>' +
        '</div>' +
        '</div>' +
        '</div>');

    return option;
}

$(function () {
      
    $('.select2').select2({
        theme: "bootstrap4",
        language: 'es'
    });
    
    $('select[name="proveedor"]').select2({
        theme: "bootstrap4",
        language: 'es',
        allowClear: true,
        ajax: {
            delay: 250,
            type: 'POST',
            url: window.location.pathname,
            data: function (params) {
                var queryParameters = {
                    term: params.term,
                    action: 'search_proveedor'
                }
                return queryParameters;
            },
            processResults: function (data) {
                return {
                    results: data
                };
            },
        },
        placeholder: 'Ingrese una descripción',
        minimumInputLength: 1,
    });

    $('.btnAddProvee').on('click', function () {
        $('input[name="action"]').val('add');
        $('.modal-title').find('span').html('Creación de un Proveedor');
        $('.modal-title').find('i').removeClass().addClass('fas fa-plus');
        $('#empresa').focus();
        $('#myModalProveedor').modal('show');
    });

    $('#myModalProveedor').on('hidden.bs.modal', function (e) {
        $('#frmProveedor').trigger('reset');
    })

    $('#frmProveedor').on('submit', function (e) {
        e.preventDefault();
        var parameters = new FormData(this);
        parameters.append('action', 'create_proveedor');
        submit_with_ajax(window.location.pathname, 'Notificación',
            '¿Estas seguro de crear al siguiente Proveedor?', parameters, function (response) {
                //console.log(response);
                var newOption = new Option(response.full_name, response.id, false, true);
                
                $('#proveedor').append('<option value="' + response.id + '" selected="selected">' + response.full_name + '</option>');
               // $('#proveedor').append(newOption).trigger('change');
                $('#proveedor').selectmenu("refresh", true);
                $('#myModalProveedor').modal('hide');
            });
    });

    $('#fecha_ingreso').datetimepicker({
        format: 'YYYY-MM-DD',
        date: moment().format("YYYY-MM-DD"),
        locale: 'es',
        //minDate: moment().format("YYYY-MM-DD")
    });


    // search products
    $('input[name="search"]').autocomplete({
       
        source: function (request, response) {
       
            $.ajax({
                url: window.location.pathname,
                type: 'POST',
                data: {
                    'action': 'search_products',
                    'term': request.term
                },
                dataType: 'json',
            }).done(function (data) {
               
                response(data);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                //alert(textStatus + ': ' + errorThrown);
            }).always(function (data) {

            });
        },
        delay: 500,
        minLength: 1,
        //aqui esta funcion se renderisa cuando se selecciona una opcion, es decir la que recibe la respuesta o los datos
        //la variable ui es la que contiene los datos
        select: function (event, ui) {
            event.preventDefault();
           // console.clear();
            //NOTA: el datatable contiene 2 columnas (cant) y (subtotal) q no estoy recibiendo, por eso tengo que hagregarla manualmente en el diccionario de respuesta
            //y luego adicionarlo a mi variable de estructura de datos llamada ingresos
            ui.item.cant = 1;
            ui.item.subtotal = 0.00;
           // console.log(ingresos.items);

            //llamo  al metodo add creado dentro de la estructura de la variable llamada ingresos
            ingresos.add(ui.item);
            $(this).val('');
        }
    });

    $('.btnRemoveAll').on('click', function () {
        if (ingresos.items.productos.length === 0) return false;
        alert_action('Notificación', '¿Estas seguro de eliminar todos los items de tu detalle?', function () {
            ingresos.items.productos = [];
            ingresos.list();
        });
    });

    // event cant
    $('#tblProducts tbody').on('click', 'a[rel="deleteprod"]', function () {
            var tr = tblProducts.cell($(this).closest('td, li')).index();
            alert_action('Notificación', '¿Estas seguro de eliminar el producto de tu detalle?',
                function () {
                    //el splice permite borrar el o los elementos de un array, le pasamos la posicion y la cantidad de elementos
                    ingresos.items.productos.splice(tr.row, 1);
                    ingresos.list();

                });
        }).on('change', 'input[name="cant"]', function () {
            console.clear();
            var cant = parseInt($(this).val());
            var tr = tblProducts.cell($(this).closest('td, li')).index();
            ingresos.items.productos[tr.row].cant = cant;
            ingresos.calcular_factura();
            $('td:eq(6)', tblProducts.row(tr.row).node()).html(ingresos.items.productos[tr.row].subtotal.toFixed(2));
        });

   
    $('.btnlimpiabusqueda').on('click', function () {
        $('input[name="search"]').val('').focus();
    });

    // event submit
    $('#frmIngresoprod').on('submit', function (e) {
        e.preventDefault();
       
        if (ingresos.items.productos.length === 0) {
            message_error('Debe al menos tener un item en su detalle de Ingreso');
            return false;
        }

        ingresos.items.cod_ingreso = $('input[name="cod_ingreso"]').val();
        ingresos.items.almacen = $('select[name="almacen"]').val();
        ingresos.items.tipo_ingreso = $('select[name="tipo_ingreso"]').val();
        ingresos.items.proveedor =  $('select[name="proveedor"]').val();
        ingresos.items.tipo_comprob = $('select[name="tipo_comprob"]').val();
        ingresos.items.num_comprob = $('input[name="num_comprob"]').val();
        ingresos.items.fecha_ingreso = $('input[name="fecha_ingreso"]').val();
        ingresos.items.observ = $('textarea[name="observ"]').val();
        ingresos.items.estado = $('select[name="estado"]').val();       
      
        var parameters = new FormData();
        parameters.append('action', $('input[name="action"]').val());
        parameters.append('ingresos', JSON.stringify(ingresos.items));
        
        submit_with_ajax(window.location.pathname, 'Notificación', '¿Estas seguro de realizar la siguiente acción?', parameters, function () {
                alert_action('Notificación', '¿Desea imprimir la boleta de ingreso?', function () {
                    window.open('/erp/ingreso/invoice/pdf/' + response.id + '/', '_blank');
                    location.href = '/erp/ingreso/list/';
                }, function () {
                   
                location.href = '/erp/ingreso/list/';
           
            });
        });
            
    });


    // Esto se puso aqui para que funcione bien el editar y calcule bien los valores del iva. // sino tomaría el valor del iva de la base debe
    // coger el que pusimos al inicializarlo.
     ingresos.list();
});
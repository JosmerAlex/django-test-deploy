var tblDesincAlmacen;
var tblSearchProducts;
//creamos una variable ingresos la cual contendra un diccionario llamado items el cual contendra en encabezado de la factura,
// y este a su ven contendra un array llamado productos el cual almacenara los productos seleccionado 
var desincorp =
{
    items:
    {
        cod_desinc: '',
        almacen: '',
        respon_almac: '',
        tipo_desinc: '',
        fecha_desinc: '',
        subtotal: 0.00,
        iva: 0.00,
        total: 0.00,
        observ: '',
        estado: '',
        soportedocum: '',
        desinc_almacen: []
    },

    //la utiliso para guardar en un array ids, los id de los productos que ya tengo agregador en mi guia de ingreso
    // para luego utilizarlos para no mostrarlos en el catalago de productos ò en el select de productos
    get_ids: function () 
    {
        var ids = [];
       //el this me permite hacer saber al codigo que estoy haciendo referencia al objeto actual en este caso a ingresos, 
       //porq estoy dentro de su estructura
        $.each(this.items.desinc_almacen, function (key, value) {
            ids.push(value.id);
        });
        return ids;
    },

    //calcular factura, recorremos el diccionario items y su array de productos, al cual nois moveremos mediante una funcion anonima 
    //mediante pos = posicion y dist = lo que contiene el diccionario. 
    calcular_guia_desinc: function () {

        var subtotal = 0.00;
        var iva = $('input[name="iva"]').val();
        //var iva = $('#iva').val();

        $.each(this.items.desinc_almacen, function (pos, dict) {
            dict.pos = pos;
            dict.subtotal = parseFloat(dict.precio);
            subtotal += dict.subtotal;

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
        this.items.desinc_almacen.push(item);
        this.list();
    },

    //este metodo lo utilizo para poder listar los productos al datatable
    list: function () 
    {
        this.calcular_guia_desinc();
        tblDesincAlmacen = $('#tblDesincAlmacen').DataTable({
            responsive: true,
            autoWidth: false,
            destroy: true,
            deferRender: true,
            //aqui es la variable interna de datatable le paso mi diccionario de items el cual contiene el encabezado y el array de productos
            //el cual se encuentra en el mismo diccionario, ojo tambien pude crear un ajax pero no es necesario ya que esta variable o propiedad data
            //del datatable permite tambien recibir un array, el cual ya lo tengo con datos y todo
            data: this.items.desinc_almacen,
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
            order: false,
            paging: false,
            ordering: false,
            info: false,
            searching: false,
            columns: [
                {"data": "id"},
                {"data": "productos.codigo"},
                {"data": "productos.nombre", className: "text-left"},
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
                        return '<a rel="deleteprod" class="btn btn-danger btn-xs btn-rounded" style="color: white;"><i class="fas fa-trash-alt"></i></a>';
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
                        
                        return '<input type="text" class="form-control form-control-sm" style="font-size: 12px; height: 24px;" name="cant" autocomplete="off" value="' + row.cant + '">';
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
                        return '<span class="badge badge-secondary" style="font-size: 9px;">' + (data) + '</span>';
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
                $(row).find('input[name="cant"]').TouchSpin({
                    max: data.stock_actual,                               
                    min: 1,
                    buttonup_class: 'btn btn-secondary btn-xs btn-flat',
                    buttondown_class: 'btn btn-secondary btn-xs btn-flat'                               
                });

            },
            initComplete: function (settings, json) {

            }
        });
       // console.clear();
      //  console.log(this.items);
       // console.log(this.get_ids());
    },
};

//esta funcion me permite dar un mejor formato a los select2
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
        '<img src="' + repo.productos.imagen + '" class="img-fluid img-thumbnail d-block mx-auto rounded">' +
        '</div>' +
        '<div class="col-lg-11 text-left shadow-sm">' +
        //'<br>' +
        '<p style="margin-bottom: 0;">' +
        '<b>Nombre:</b> ' + repo.productos.nombre + '<br>' +
        '<b>Stock:</b> ' + repo.stock_actual + '<br>' +
        '<b>PVP:</b> <span class="badge badge-warning">' + repo.precio + ' Bs.</span>' +
        '</p>' +
        '</div>' +
        '</div>' +
        '</div>');


    return option;
}

$(function () {
      

     //llamo al catalago de productos
    //  $('.btnSearchProducts').on('click', function () {
    //     $('#myModalSearchProducts').modal('show');
    // }); 
    
    $('.select2').select2({
        theme: "bootstrap4",
        language: 'es'
    });
    
    $('#fecha_desinc').datetimepicker({
        format: 'YYYY-MM-DD',
        date: moment().format("YYYY-MM-DD"),
        locale: 'es',
        //minDate: moment().format("YYYY-MM-DD")
    });

    $('select[name="almacen"]').on('change', function () {
        var id = $(this).val();
        if (id != '') {
            desincorp.items.desinc_almacen = [];
            desincorp.list();
        }
        if (id == ''){
            desincorp.items.desinc_almacen = [];
            desincorp.list();
        }
        //alert(id)
        var options = '<option value="">-----------</option>';
        if (id === '') {
            $('input[name="respon_almac"]').val('');
            return false;
        }
        $.ajax({
            url: window.location.pathname,
            type: 'POST',
            data: {
                'action': 'search_responalmac',
                'id': id
            },
            dataType: 'json',
        }).done(function (data) {
            if (!data.hasOwnProperty('error')) {
               
                $('input[name="respon_almac"]').val(data[0].responsable);
                
                return true;
            }
            message_error(data.error);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert(textStatus + ': ' + errorThrown);
        }).always(function (data) {
            //select_products.html(options);

        });
    });

    $('.btnAddConcep').on('click', function () {
        $('input[name="action"]').val('add');
        $('.modal-title').find('span').html('Creación de un Concepto');
        $('.modal-title').find('i').removeClass().addClass('fas fa-plus');
        $('#codigo').focus();
        $('#myModalConcepMov').modal('show');
    });

    $('#myModalConcepMov').on('hidden.bs.modal', function (e) {
        $('#frmConcepMov').trigger('reset');
    })

    $('#frmConcepMov').on('submit', function (e) {
        e.preventDefault();
        var parameters = new FormData(this);
        parameters.append('action', 'create_concepto');
        submit_with_ajax(window.location.pathname, 'Notificación',
            '¿Estas seguro de crear el siguiente Concepto?', parameters, function (response) {
                //console.log(response);
                var newOption = new Option(response.full_name, response.id, false, true);
                
               // $('#proveedor').append('<option value="' + response.id + '" selected="selected">' + response.full_name + '</option>');
              //  $('#proveedor').append(newOption).trigger('change');
               // $('#proveedor').selectmenu("refresh", true);
               $('select[name="tipo_desinc"]').append(newOption).trigger('change');
               $('#myModalConcepMov').modal('hide');               
            });
    });

    $('.btnRemoveAll').on('click', function () {
        if (desincorp.items.desinc_almacen.length === 0) return false;
        alert_action('Notificación', '¿Estas seguro de eliminar todos los items de tu detalle?', function () {
            desincorp.items.desinc_almacen = [];
            desincorp.list();
        }, function () {

        });
    });
    // event cant
    $('#tblDesincAlmacen tbody').on('click', 'a[rel="deleteprod"]', function () {
            var tr = tblDesincAlmacen.cell($(this).closest('td, li')).index();
            alert_action('Notificación', '¿Estas seguro de eliminar el producto de tu detalle?',
                function () {
                    //el splice permite borrar el o los elementos de un array, le pasamos la posicion y la cantidad de elementos
                    desincorp.items.desinc_almacen.splice(tr.row, 1);
                    desincorp.list();
                }, function () {

                });
        }).on('change', 'input[name="cant"]', function () {
            if ($(this).val() < 1)
            {
                message_error('La cantidad debe ser mayor a 0');
                return false; 
            } 
            if ($(this).val() == '') 
            {
                message_error('La cantidad no puede quedar vacia'); 
                return false; 
            }
            var cant = parseInt($(this).val());
            var tr = tblDesincAlmacen.cell($(this).closest('td, li')).index();
            desincorp.items.desinc_almacen[tr.row].cant = cant;
            desincorp.calcular_guia_desinc();
            $('td:eq(6)', tblDesincAlmacen.row(tr.row).node()).html(desincorp.items.desinc_almacen[tr.row].subtotal.toFixed(2));
        });
    $('.btnClearSearch').on('click', function () {
        $('input[name="search"]').val('').focus();
    });
  
    $('input[name="search"]').on('click', function () {
        $('input[name="search"]').val('').focus();
    });

    $('.btnSearchProducDesinc').on('click', function () {
        tblSearchProducts = $('#tblSearchProducts').DataTable({
            responsive: true,
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
            ajax: {
                url: window.location.pathname,
                type: 'POST',
                data: {
                    'action': 'search_products',
                    'ids': JSON.stringify(desincorp.get_ids()), //lo convierto a string para mandarlo a mi vista
                    'term': $('select[name="search"]').val(),
                    'idalmacen': $('#idalmacen').val()
                },
                dataSrc: ""
            },
            columns: [
                {"data": "productos.nombre"},
                {"data": "productos.imagen"},
                {"data": "stock_actual"},
                {"data": "precio"},
                {"data": "id"},
            ],
            columnDefs: [
                {
                    targets: [-4],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<img src="' + data + '" class="img-fluid d-block mx-auto" style="width: 20px; height: 20px;">';
                    }
                },
                {
                    targets: [-3],
                    class: 'text-center',
                    render: function (data, type, row) {
                        return '<span class="badge badge-secondary">'+data+'</span>';
                    }
                },
                {
                    targets: [-2],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return parseFloat(data).toFixed(2) + ' Bs.';
                    }
                },
                {
                    targets: [-1],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        var buttons = '<a rel="add" class="btn btn-success btn-xs btn-rounded"><i class="fas fa-plus"></i></a> ';
                        return buttons;
                    }
                },
            ],
            initComplete: function (settings, json) {

            }
        });
        $('#myModalSearchProducts').modal('show');
    });

    $('#tblSearchProducts tbody')
        .on('click', 'a[rel="add"]', function () {
            var tr = tblSearchProducts.cell($(this).closest('td, li')).index();
            var product = tblSearchProducts.row(tr.row).data();
            product.cant = 1;
            product.precio = product.precio;
            product.subtotal = product.subtotal;                    
            

            desincorp.add(product);
            tblSearchProducts.row($(this).parents('tr')).remove().draw();
        });


    // event submit
    $('#frmDesincalmacen').on('submit', function (e) {
        e.preventDefault();
       
        if (desincorp.items.desinc_almacen.length === 0) {
            message_error('Debe al menos tener un item en su detalle');
            return false;
        }        
        desincorp.items.cod_desinc = $('input[name="cod_desinc"]').val();
        desincorp.items.almacen = $('select[name="almacen"]').val();
        desincorp.items.respon_almac = $('input[name="respon_almac"]').val();
        desincorp.items.tipo_desinc = $('select[name="tipo_desinc"]').val();
        desincorp.items.fecha_desinc = $('input[name="fecha_desinc"]').val();
        desincorp.items.subtotal = $('input[name="subtotal"]').val();
        desincorp.items.total = $('input[name="total"]').val();
        desincorp.items.observ = $('textarea[name="observ"]').val();
        desincorp.items.estado = $('select[name="estado"]').val();       
        
        var filename
        if  ($('input[name="soportedocum"]').val() == ''){
            // produc_catalago.items.imagen= $imagenPrevisualizacion.src;
           //  filename = $idsoportetraslado.src.replace(/.*(\/|\\)/, '');
            desincorp.items.soportedocum= "documsoporte/desincorpEquipo/" + filename;
        }else{
            filename = $('input[name="soportedocum"]').val().replace(/.*(\/|\\)/, '');
            desincorp.items.soportedocum= "documsoporte/desincorpEquipo/" + filename;
        }

        var parameters = new FormData();
        parameters.append('action', $('input[name="action"]').val());
        parameters.append('desincorp', JSON.stringify(desincorp.items)); //los convierto a string para enviarlos a mi vista
        submit_with_ajax(window.location.pathname, 'Notificación', '¿Estas seguro de realizar la siguiente acción?', parameters, function (response) {
                $(function () {
                   
                location.href = '/erp/desincorp/list/';
           
            });
        });

      
            
    });

    //busqueda del select2 de procuctos

    $('select[name="search"]').select2({
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
                    action: 'search_autocomplete',
                    ids: JSON.stringify(desincorp.get_ids()),
                    idalmacen: $('#idalmacen').val()
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
        templateResult: formatRepo,
    }).on('select2:select', function (e) {
        var data = e.params.data;
        if(!Number.isInteger(data.id)){
            return false;
        }
        data.cant = 1;
        data.precio = data.precio;
        data.subtotal = data.subtotal;


        desincorp.add(data);
        $(this).val('').trigger('change.select2');
    });
    // Esto se puso aqui para que funcione bien el editar y calcule bien los valores del iva. // sino tomaría el valor del iva de la base debe
    // coger el que pusimos al inicializarlo.
     desincorp.list();
});
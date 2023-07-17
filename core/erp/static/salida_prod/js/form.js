//Bienes Muebles
var tblSalProducts;
var tblSearchProducts;
//Materiales de Consumo
var tblSalSuminist;
var tblSearchSuminist;

//creamos una variable la cual contendra un diccionario llamado items el cual contendra en encabezado de la factura,
// y este a su ven contendra un array llamado productos el cual almacenara los productos seleccionado
var salidas = 
{
    items: 
    {
        cod_salida: '',
        origen: '',
        respon_origen: '',
        destino: '',
        respon_destino: '',
        tipo_salida: '',
        tipo_comprob: '',
        num_comprob: '',
        subtotal: 0.00,
        iva: 0.00,
        total: 0.00,
        fecha_salida: '',
        observ: '',
        estado: '',
        produc_sal: [],
        produc_sal2: []
    },    
    get_ids: function ()
    {
        var ids = [];       
        $.each(this.items.produc_sal2, function (key, value) {
            ids.push(value.id);
        });
        return ids;
    },
    get_idsCodbien: function () 
    {
        var idcodbien = [];
        $.each(this.items.produc_sal, function (key, value) {
            idcodbien.push(value.codbien.id);
        });
        return idcodbien;
    },      
    calcular_guia_sal: function () {
        var subtotal = 0.00;
        var iva = $('input[name="iva"]').val();
        $.each(this.items.produc_sal, function (pos, dict) {
            dict.pos = pos;
            dict.subtotal = 1 * parseFloat(dict.precio);
            subtotal += dict.subtotal;
        });
        this.items.subtotal = subtotal;
        this.items.iva = this.items.subtotal * iva;
        this.items.total = this.items.subtotal + this.items.iva;
        $('input[name="subtotal"]').val(this.items.subtotal.toFixed(2));
        $('input[name="ivacalc"]').val(this.items.iva.toFixed(2));
        $('input[name="total"]').val(this.items.total.toFixed(2));
    },
    calcular_guia_sal2: function () {
        var subtotal = 0.00;
        var iva = $('input[name="iva"]').val();
        //var iva = $('#iva').val();
        $.each(this.items.produc_sal2, function (pos, dict) {
            dict.pos = pos;
            dict.subtotal = dict.cant * parseFloat(dict.precio);
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
        this.items.produc_sal.push(item);
        this.list();
    },
    add2: function (item) {
        this.items.produc_sal2.push(item);
        this.list();
    },
    //este metodo lo utilizo para poder listar los productos al datatable
    list: function () 
    {
        this.calcular_guia_sal();
        tblSalProducts = $('#tblSalProducts').DataTable({
            responsive: false,
            autoWidth: false,
            destroy: true,
            deferRender: true,            
            data: this.items.produc_sal,
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
                {"data": "full_name"},
                {"data": "stock_actual"},
                {"data": "precio"},
                {"data": "subtotal"},
                {"data": "codbien.id"},
                {"data": "codubica.id"},
                {"data": "fila"}
             
            ],
            columnDefs: [
                {
                    targets: [0],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<a rel="deletprodsal" class="btn btn-danger btn-xs btn-rounded" style="color: white;"><i class="fas fa-trash-alt"></i></a>';
                    }
                },
                {
                    targets: [-7],
                    orderable: false,
                    render: function (data, type, row) {
                        return '<span>' + data + '</span>';;
                    }
                },
                {
                    targets: [-5],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return parseFloat(data).toFixed(2);
                    }
                },                
                {
                    targets: [-4],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return parseFloat(data).toFixed(2);
                    }
                },
                {
                    targets: [-6],
                    class: 'text-center',
                    render: function (data, type, row) {
                        // return parseFloat(data).toFixed(2);
                        return '<span class="badge badge-primary badge-pill" style="font-size: 10px;">' + data + '</span>';
                    }
                },              
                {
                    targets: [-3],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<input type="text" class="form-control input-flat" name="codbien" id="' + row.codbien.id + '" style="font-size: 11px; height: 22px;" autocomplete="off" placeholder="Buscar..." value="' + row.codbien.codbien + '">';
                    }
                },                
                {
                    targets: [-2],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<input type="text" class="form-control input-flat" style="font-size: 11px; height: 22px;" placeholder="Ingrese la Ubicación" maxlength="50" name="codubica" id="' + row.codubica.id + '" value="' + row.codubica.nombre + '">';
                        // return '<select class="form-control select2" name="searchCodubica"></select>';
                    }
                },
                {
                    targets: [-1],
                    class: 'text-center hidden-xs',
                    orderable: false,
                    visible: false,
                    render: function (data, type, row) {
                        return parseFloat(data);
                        // return '<select class="form-control select2" name="searchCodubica"></select>';
                    }
                },                              
            ],
            rowCallback(row, data, displayNum, displayIndex, dataIndex) {            
            },
            initComplete: function (settings, json) {

            }
        });
        tblSalSuminist = $('#tblSalSuministros').DataTable({
            responsive: false,
            autoWidth: false,
            destroy: true,
            deferRender: true,            
            data: this.items.produc_sal2,
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
                {"data": "productos.codigo", className: "text-center"},
                {"data": "productos.full_name", className: "text-left"},
                {"data": "stock_actual"},
                {"data": "precio", className: "text-center"},
                {"data": "cant"},
                {"data": "subtotal"},
                {"data": "nro_lote"},
                {"data": "fecha_venc"},
            ],
            columnDefs: [
                {
                    targets: [0],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<a rel="deletprod2" class="btn btn-danger btn-xs btn-rounded" style="color: white;"><i class="fas fa-trash-alt"></i></a>';
                    }
                },
                {
                    targets: [-6],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<span class="badge badge-primary badge-pill" style="font-size: 10px;">' + data + '</span>';
                    }
                },
                {
                    targets: [-4],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<input type="text" class="form-control input-flat" name="cant2" style="font-size: 11px; height: 24px;" autocomplete="off" value="' + row.cant2 + '">';
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
                        if(row.productos.lote){
                            return '<input type="text" class="form-control form-control-sm input-flat" name="nro_lote" style="text-align: center; font-size: 11px; padding-left:4px; padding-right:4px; height: 24px;" autocomplete="off" placeholder="Ingrese lote" value="' + row.nro_lote + '">';
                        }else {
                            return '<input type="text" disabled=true class="form-control form-control-sm input-flat" name="nro_lote" style="text-align: center; font-size: 11px; padding-left:4px; padding-right:4px; height: 24px;" autocomplete="off" value="' + row.nro_lote + '">';
                        } 
                    }
                },
                {
                    targets: [-1],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        if(row.productos.lote == true) return '<input type="date"  name="fecha_venc" id="fecha_venc" style="font-size: 11px; height: 24px;" class="form-control form-control-sm input-flat f_venc" format="YYYY-MM-DD" autocomplete="off" value="' + row.fecha_venc + '">';
                        if(row.productos.lote == false) return '<input type="date" disabled=true  name="fecha_venc" style="font-size: 11px; height: 24px;" class="form-control form-control-sm input-flat" format="YYYY-MM-DD" autocomplete="off" value="' + row.fecha_venc + '">';
                    }
                },                
            ],
            rowCallback(row, data, displayNum, displayIndex, dataIndex) {                
                $(row).find('input[name="cant2"]').TouchSpin({                                                  
                    min: 1,
                    max: data.stock_actual,
                    buttonup_class: 'btn btn-secondary btn-xs btn-flat',
                    buttondown_class: 'btn btn-secondary btn-xs btn-flat'                               
                });
            },
            initComplete: function (settings, json) {

            }
        });
    },
};
//Para los Bienes Muebles
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
//Para los bienes de consumo
function formatRepo2(repo2) {
    if (repo2.loading) {
        return repo2.text;
    }
    if (!Number.isInteger(repo2.id)) {
        return repo2.text;
    }
    var option2 = $(
        '<div class="wrapper container">' +
        '<div class="row">' +
        '<div class="col-lg-1">' +
        '<img src="' + repo2.productos.imagen + '" class="img-fluid img-thumbnail d-block mx-auto rounded">' +
        '</div>' +
        '<div class="col-lg-11 text-left shadow-sm">' +
        //'<br>' +
        '<p style="margin-bottom: 0;">' +
        '<b>Nombre:</b> ' + repo2.productos.nombre + '<br>' +
        '<b>Stock:</b> ' + repo2.stock_actual + '<br>' +
        '<b>PVP:</b> <span class="badge badge-warning">' + repo2.precio + ' Bs.</span>' +
        '</p>' +
        '</div>' +
        '</div>' +
        '</div>');
    return option2;
}

$(function () {
    $('.btnAddUbicaF').on('click', function () {
        $('input[name="action"]').val('add');
        $('.modal-title').find('span').html('Creación de un Departamento');
        $('.modal-title').find('i').removeClass().addClass('fas fa-plus');
        $("#iddepartamento").focus();
        $('#myModalDepart').modal('show');
    });
    $('#myModalDepart').on('hidden.bs.modal', function (e) {
        $('#frmDepart').trigger('reset');
    })

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
               $('select[name="tipo_salida"]').append(newOption).trigger('change');
               $('#myModalConcepMov').modal('hide');               
            });
            salidas.list();
    });   
    $('select[name="tipo_salida"]').on('change', function () {
        var codigo = $(this).val();
        //alert(codigo);
        if (codigo === '7') {
            $("#dist_bienes_muebles").collapse('show');
            setTimeout(()=>{                
                salidas.items.produc_sal2 = [];
                salidas.list();
            }, 1000);
        }else{
            $("#dist_bienes_muebles").collapse('hide');
        }
        if (codigo === '9'){           
            $("#dist_suministros").collapse('show');
            setTimeout(()=>{
                $.each(datos_cantprod, function (key, value) {
                    value.cantprod = value.cantprod - value.cantprod;
                });
                salidas.items.produc_sal = [];
                salidas.list();
            }, 1000);
        }else{
            $("#dist_suministros").collapse('hide');
        }
    });
    $('.btnRemoveAll').on('click', function () {
        if (salidas.items.produc_sal.length === 0) return false;
        var fila = $(this).parent();
        var productos = tblSalProducts.row(tr.row).data();
        alert_action('Notificación', '¿Estas seguro de eliminar todos los items de tu detalle?', function () { 
            $.each(datos_cantprod, function (key, value) {   
                value.cantprod = value.cantprod - value.cantprod;
            });            
            salidas.items.produc_sal = [];
            salidas.list();
        }, function () {
        });
    });
    $('.btnRemoveAll2').on('click', function () {
        if (salidas.items.produc_sal2.length === 0) return false;
        alert_action('Notificación', '¿Estas seguro de eliminar todos los items de tu detalle?', function () {
            salidas.items.produc_sal2 = [];
            salidas.list();
        }, function () {
        });
    });

    
    $('.select2').select2({
        theme: "bootstrap4",
        language: 'es'
    });
    $('#fecha_salida').datetimepicker({
        format: 'YYYY-MM-DD',
        date: moment().format("YYYY-MM-DD"),
        locale: 'es',
       // minDate: moment().format("YYYY-MM-DD")
    });

    $('select[name="origen"]').on('change', function () {
        var id = $(this).val();
        if (id != '') {
            salidas.items.produc_sal = [];
            salidas.list();
        }
        if (id == ''){
            salidas.items.produc_sal = [];
            salidas.list();
        }
        //alert(id)
        var options = '<option value="">-----------</option>';
        if (id === '') {
            $('input[name="respon_origen"]').val('');
            return false;
        }
        $.ajax({
            url: window.location.pathname,
            type: 'POST',
            data: {
                'action': 'search_responorigen',
                'id': id
            },
            dataType: 'json',
        }).done(function (data) {
            if (!data.hasOwnProperty('error')) {               
                $('input[name="respon_origen"]').val(data[0].nombrejefe);                
                return true;
            }
            message_error(data.error);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert(textStatus + ': ' + errorThrown);
        }).always(function (data) {
            //select_products.html(options);
        });
    });
    $('select[name="destino"]').on('change', function () {
        var id = $(this).val();
        var options = '<option value="">-----------</option>';
        if (id === '') {
            $('input[name="respon_destino"]').val('');
            return false;
        }
        $.ajax({
            url: window.location.pathname,
            type: 'POST',
            data: {
                'action': 'search_responorigen',
                'id': id
            },
            dataType: 'json',
        }).done(function (data) {
            if (!data.hasOwnProperty('error')) {
               
                $('input[name="respon_destino"]').val(data[0].nombrejefe);
                
                return true;
            }
            message_error(data.error);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert(textStatus + ': ' + errorThrown);
        }).always(function (data) {
            //select_products.html(options);
        });
    });

    $('select[name="destino"]').select2({
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
                    action: 'search_destino'
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

    $('.btnAddDestino').on('click', function () {
        $('input[name="action"]').val('add');
        $('.modal-title').find('span').html('Creación de una Unidad');
        $('.modal-title').find('i').removeClass().addClass('fas fa-plus');
        $('#empresa').focus();
        $('#myModalUnidad').modal('show');
    });

    $('#myModalUnidad').on('hidden.bs.modal', function (e) {
        $('#frmUnidad').trigger('reset');
    })

    $('#frmUnidad').on('submit', function (e) {
        e.preventDefault();
        var parameters = new FormData(this);
        parameters.append('action', 'create_unidad');
        submit_with_ajax(window.location.pathname, 'Notificación',
            '¿Estas seguro de crear la siguiente Unidad?', parameters, function (response) {
                var newOption = new Option(response.full_name, response.id, false, true);                
               $('select[name="destino"]').append(newOption).trigger('change');
               $('#myModalUnidad').modal('hide');
            });
    });

    $('#frmDepart').on('submit', function (e) {
        e.preventDefault();
        var parameters = new FormData(this);
        parameters.append('action', 'create_departamento');
        submit_with_ajax(window.location.pathname, 'Notificación',
            '¿Estas seguro de crear el Departamento?', parameters, function (response) {
                //console.log(response);
            //     var newOption = new Option(response.full_name, response.id, false, true);
            //    $('select[name="ubicafisica"]').append(newOption).trigger('change');
               $('#myModalDepart').modal('hide');
            });
    });



  
    // event cant
    $('#tblSalProducts tbody').on('click', 'a[rel="deletprodsal"]', function () {
        var tr = tblSalProducts.cell($(this).closest('td, li')).index();
        var fila = $(this).parent();
        var productos = tblSalProducts.row(tr.row).data();
        alert_action('Notificación', '¿Estas seguro de eliminar el producto de tu detalle?',
            function () {
                $.each(datos_cantprod, function (key, value) {
                    if (value.id == productos.id) {
                       value.cantprod = value.cantprod - 1;
                    }
                });
                //el splice permite borrar el o los elementos de un array, le pasamos la posicion y la cantidad de elementos
                salidas.items.produc_sal.splice(tr.row, 1);
                salidas.list();
                console.log(productos)
            }, function () {

        });
        }).on('change', 'input[name="cant"]', function () {
            var cant = parseInt($(this).val());
            var tr = tblSalProducts.cell($(this).closest('td, li')).index();
            salidas.items.produc_sal[tr.row].cant = cant;
            salidas.calcular_guia_sal();
            $('td:eq(4)', tblSalProducts.row(tr.row).node()).html(salidas.items.produc_sal[tr.row].subtotal.toFixed(2));
                       
        }).on('keydown.autocomplete', 'input[name="codubica"]', function () {            
           $(this).autocomplete({       
                source: function (request, response) {            
                    $.ajax({
                        url: window.location.pathname,
                        type: 'POST',
                        data: {
                            'action': 'busca_ubicacionfisica',
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
                select: function (event, ui) {
                    var tr = tblSalProducts.cell($(this).closest('td, li')).index();
                    salidas.items.produc_sal[tr.row].codubica.id = ui.item.id;
                    salidas.items.produc_sal[tr.row].codubica.nombre = ui.item.nombre;                    
                    salidas.list();
                }
            });        
        });

        $('#tblSalProducts tbody').on('keydown.autocomplete', 'input[name="codbien"]', function () {
        if($(this).attr('id') != 0){
            var tr = tblSalProducts.cell($(this).closest('td, li')).index();           
            salidas.items.produc_sal[tr.row].codbien.id = 0;
            salidas.items.produc_sal[tr.row].codbien.codbien = '';
            salidas.list();
        }else{            
           $(this).autocomplete({           
                source: function (request, response) {
                    $.ajax({
                        url: window.location.pathname,
                        type: 'POST',
                        data: {
                            'action': 'busca_codbien',
                            'term': request.term,
                            'idsCodbien': JSON.stringify(salidas.get_idsCodbien())
                        },
                        dataType: 'json',
                    }).done(function (data) {
                    
                        response(data);
                    }).fail(function (jqXHR, textStatus, errorThrown) {
                    
                    }).always(function (data) {
                    
                    });
                },
                delay: 500,
                minLength: 1,                
                select: function (event, ui) {
                    var tr = tblSalProducts.cell($(this).closest('td, li')).index();
                    salidas.items.produc_sal[tr.row].codbien.id = ui.item.id;
                    salidas.items.produc_sal[tr.row].codbien.codbien = ui.item.codbien;                    
                    salidas.list();                    
                }
            });
        }        
        });
        //Bienes de Consumo
        $('#tblSalSuministros tbody').on('click', 'a[rel="deletprodsal"]', function () {
            var tr = tblSalSuministros.cell($(this).closest('td, li')).index();            
            alert_action('Notificación', '¿Estas seguro de remover el producto de tu detalle?',
                function () {              
                    salidas.items.produc_sal2.splice(tr.row, 1);
                    salidas.list();                
                }, function () {
    
                });
            }).on('change keyup', 'input[name="cant2"]', function () {
                var cant = parseInt($(this).val());
                var tr = tblSalSuminist.cell($(this).closest('td, li')).index();
                if ($(this).val() < 1) {
                    message_error('La cantidad debe ser mayor a 0');
                    return false; 
                } 
                if ($(this).val() == "") {                    
                    message_error('La cantidad del producto no puede quedar vacia'); 
                    return false;
                }
                
                salidas.items.produc_sal2[tr.row].cant = cant;
                salidas.calcular_guia_sal2();
                $('td:eq(6)', tblSalSuminist.row(tr.row).node()).html(salidas.items.produc_sal2[tr.row].subtotal.toFixed(2));
            
            }).on('change keyup', 'input[name="fecha_venc"]', function () {
                var fecha_venc = $(this).val();
                console.log(fecha_venc);
                var tr = tblSalSuminist.cell($(this).closest('td, li')).index();
                salidas.items.produc_sal2[tr.row].fecha_venc = fecha_venc; 
            
            }).on('change keyup', 'input[name="nro_lote"]', function () {
                var nro_lote = $(this).val();
                console.log(nro_lote);
                var tr = tblSalSuminist.cell($(this).closest('td, li')).index();
                salidas.items.produc_sal2[tr.row].nro_lote = nro_lote;
            })

   
    $('.btnClearSearch').on('click', function () {
        $('input[name="search"]').val('').focus();
    });
  
    $('input[name="search"]').on('click', function () {
        $('input[name="search"]').val('').focus();
    });

    $('.btnSearchProducSal').on('click', function () {
        tblSearchProducts = $('#tblSearchProducts').DataTable({
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
            order: false,
            ordering: false,
            ajax: {
                url: window.location.pathname,
                type: 'POST',
                data: {
                    'action': 'search_products',
                    'datos_cantprod': JSON.stringify(datos_cantprod),
                    'term': $('select[name="search"]').val(),
                    'idorigen': $('#idorigen').val()
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
                        return '<span class="badge badge-primary badge-pill">' + parseInt(data) + '</span>';
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
                        var buttons = '<a rel="add" class="btn btn-primary btn-xs btn-rounded"><i class="fas fa-plus"></i></a> ';
                        return buttons;
                    }
                },
            ],
            initComplete: function (settings, json) {

            }
        });
        
        $('#myModalSearchProducts').modal('show');
    });
    
    $('.btnSearchSuminist').on('click', function () {
        tblSearchSuminist = $('#tblSearchSuminist').DataTable({
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
            order: false,
            ordering: false,
            ajax: {
                url: window.location.pathname,
                type: 'POST',
                data: {
                    'action': 'search_suministros',
                    'term': $('select[name="search"]').val(),
                    'ids': JSON.stringify(salidas.get_ids()),
                    'idorigen2': $('#idorigen').val()
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
                        return '<span class="badge badge-primary">' + data + '</span>';
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
                        var buttons = '<a rel="add2" class="btn btn-info btn-xs btn-rounded"><i class="fas fa-plus"></i></a> ';
                        return buttons;
                    }
                },
            ],
            initComplete: function (settings, json) {

            }
        });
        
        $('#myModalSearchSuminist').modal('show');
    });

    let conta=0;
    let datos_cantprod = []
    let tr = ""
    let productos = ""
    let cantprod = 0.00
    
    $('#tblSearchProducts tbody').on('click', 'a[rel="add"]', function () {        
            tr = new tblSearchProducts.cell($(this).closest('td, li')).index();
            let fila = $(this).parent();
            stockcelda = fila.siblings("td:eq(2)").text();           
            productos = new tblSearchProducts.row(tr.row).data();
            let product = {};
            let item = {}
           
            product['id']= productos.productos.id;
            product['full_name']= productos.productos.nombre + ' / ' + productos.productos.descripcion;
            product['precio']= productos.precio;
            product['subtotal'] = 0.00;
            product['codbien'] ={'id': 0, 'codbien': ''};
            product['codubica'] = {'id': 0, 'nombre': ''};
            product['stock_actual'] = stockcelda - 1;
            product['fila'] = conta;
            // $.each(datos_cantprod, function (key, value) {
            //     if (value.id == productos.id) {
            //         product['stock_actual'] = product['stock_actual'] - 1;
            //      }
            // });                
            conta++;
            $('td:eq(2)', tblSearchProducts.row(tr.row).node()).find('span').html(product['stock_actual']).addClass('badge badge-success');           
            let siigual=false;
            $.each(datos_cantprod, function (key, value) {
                if (value.id == productos.id) {
                    value.cantprod = value.cantprod + 1;
                    siigual=true;
                 }
            });
            if (siigual==false){
                item['id'] = productos.id;
                item['cantprod'] = 1.00;
                item['fila'] = conta;
                datos_cantprod.push(item)
            }                       
            salidas.add(product);
            console.log(salidas.items.produc_sal);

            if (product.stock_actual == 0) {
                tblSearchProducts.row(tr.row).remove().draw();
            }
           
        });
    
    $('#tblSearchSuminist tbody').on('click', 'a[rel="add2"]', function () {
        let tr = tblSearchSuminist.cell($(this).closest('td, li')).index();
        let product2 = tblSearchSuminist.row(tr.row).data();
        product2.cant = 1;
        product2.id = product2.productos.id;;
        product2.productos.precio = 0.00;
        product2.codigo = product2.productos.codigo;
        product2.full_name = product2.productos.full_name;
        product2.subtotal = 0.00;
        
        if(product2.productos.lote)          
        {                 
            product2.nro_lote = "";                 
            product2.fecha_venc = "";                                 
        }else{                 
            product2.nro_lote = "Sin lote";
            product2.fecha_venc = null;                            
        }      
            salidas.add2(product2);
            console.log(product2);
            tblSearchSuminist.row($(this).parents('tr')).remove().draw();
    });

    // event submit
    $('#frmSalidaprod').on('submit', function (e) {
        e.preventDefault();       
        // if (salidas.items.produc_sal.length === 0 || salidas.items.produc_sal2.length === 0) {
        //     message_error('Debe al menos tener un item en su detalle');
        //     return false;        // }
        let text = "";
        if  ($('input[name="action"]').val() == 'add'){
            text = "Creado";
        }else{
            text = "Modificado";
        }   

        salidas.items.cod_salida = $('input[name="cod_salida"]').val();
        salidas.items.origen = $('select[name="origen"]').val();
        salidas.items.respon_origen = $('input[name="respon_origen"]').val();
        salidas.items.destino = $('select[name="destino"]').val();
        salidas.items.respon_destino = $('input[name="respon_origen"]').val();
        salidas.items.tipo_salida = $('select[name="tipo_salida"]').val();
        salidas.items.tipo_comprob =  $('select[name="tipo_comprob"]').val();
        salidas.items.num_comprob = $('input[name="num_comprob"]').val();
        salidas.items.iva = $('#idiva').val();
        salidas.items.fecha_salida = $('input[name="fecha_salida"]').val();
        salidas.items.observ = $('textarea[name="observ"]').val();
        salidas.items.estado = $('select[name="estado"]').val();       
      
        var parameters = new FormData();
        parameters.append('action', $('input[name="action"]').val());
        parameters.append('salidas', JSON.stringify(salidas.items)); //los convierto a string para enviarlos a mi vista
        
        submit_with_ajax(window.location.pathname, 'Notificación', '¿Estas seguro de realizar la siguiente acción?', parameters, function (response) {
            sweet_info( 'El Registro Ha Sido '+text+' Con Exito'); 
            setTimeout(() => {
               location.href = '/erp/salida/list/';
            }, 1200);             
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
                    ids: JSON.stringify(salidas.get_ids()),
                    datos_cantprod:  JSON.stringify(datos_cantprod),
                    idorigen: $('#idorigen').val()

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
        data.id = data.productos.id;
        data.codigo = data.productos.codigo;
        data.full_name = data.productos.nombre;
        data.cant = 1.00;
        data.subtotal = 0.00;
        data.codbien ={'id': 0, 'codbien': ''};
        data.codubica = {'id': 0, 'nombre': ''};
        // data.codbienn = {'id': 0, 'codbien': ''};
        // data.codubican = {'id': 0, 'nombredepar': ''};
        data.stock_actual = data.stock_actual - 1
        data.fila = conta
        conta++; 
        salidas.add(data);
        console.log(data);
            $(this).val('').trigger('change.select2');
    });
    $('select[name="search2"]').select2({
        theme: "bootstrap4",
        language: 'es',
        allowClear: true,
        ajax: {
            delay: 250,
            type: 'POST',
            url: window.location.pathname,
            data: function (params) {
                var queryParameters2 = {
                    term: params.term,
                    action: 'search_autocomplete_suminist',
                    ids: JSON.stringify(salidas.get_ids()),
                    idorigen2: $('#idorigen').val()

                }
                return queryParameters2;
            },
            processResults: function (data2) {
                return {
                    results: data2
                };
            },
        },
        placeholder: 'Ingrese una descripción',
        minimumInputLength: 1,
        templateResult: formatRepo2,
    }).on('select2:select', function (e) {
        var data2 = e.params.data2;        
        if(!Number.isInteger(data2.id)){
            return false;
        }
        data2.id = data2.productos.id;
        data2.codigo = data2.productos.codigo;
        data2.full_name = data2.productos.nombre;
        data2.cant = 1.00;
        data2.subtotal = 0.00;  
        
        if(data2.productos.lote){                 
            data2.nro_lote = "";               
            data2.fecha_venc = "";               
        }else {
            data2.nro_lote = "Sin lote";
            data2.fecha_venc = null;
        }
        // data.codbienn = {'id': 0, 'codbien': ''};
        // data.codubican = {'id': 0, 'nombredepar': ''};
        salidas.add(data2);
        console.log(data2);
            $(this).val('').trigger('change.select2');
    });
    // Esto se puso aqui para que funcione bien el editar y calcule bien los valores del iva. // sino tomaría el valor del iva de la base debe
    // coger el que pusimos al inicializarlo.
     salidas.list();
     

});
var tblTrasProducts;
var tblSearchProducts;
//creamos una variable ingresos la cual contendra un diccionario llamado items el cual contendra en encabezado de la factura,
// y este a su ven contendra un array llamado productos el cual almacenara los productos seleccionado
var traslados =
{
    items:
    {
        cod_traslado: '',
        origen: '',
        respon_origen:'',
        destino: '',
        respon_destino:'',
        tipo_traslado: '',
        fecha_traslado: '',
        observ: '',
        estado: '',
        soportedocum: '',
        salida: '',
        produc_tras: []
    },   
    get_ids: function ()
    {
        var ids = [];       
        $.each(this.items.produc_tras, function (key, value) {
            ids.push(value.id);
        });
        return ids;
    },
    get_idsCodbien: function ()
    {
        var idcodbien = [];       
        $.each(this.items.produc_tras, function (key, value) {
            idcodbien.push(value.codbien.id);
        });
        return idcodbien;
    },    
    calcular_guia_tras: function () {
        var subtotal = 0.00;
        var iva = $('input[name="iva"]').val();
        $.each(this.items.produc_tras, function (pos, dict) {
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

    add: function (item) {
        this.items.produc_tras.push(item);
        this.list();
    },

    list: function ()
    {
        this.calcular_guia_tras();
        tblTrasProducts = $('#tblTrasProducts').DataTable({
            responsive: false,
            autoWidth: false,
            destroy: true,
            deferRender: true,            
            data: this.items.produc_tras,
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
                {"data": "full_name", className: "text-left"},
                {"data": "categ"},
                {"data": "codbien.id"},
                {"data": "codubica.id"},               
                {"data": "ubica_destino.id"},

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
                    targets: [-3],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<input type="text" class="form-control form-control-sm input-flat" readonly=true name="codbien" id="' + row.codbien.id + '" style="font-size: 11px; height: 22px;" autocomplete="off" value="' + row.codbien.codbien + '">';                        
                    }
                },
                {
                    targets: [-2],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<input type="text" class="form-control form-control-sm input-flat" readonly=true style="font-size: 11px; height: 22px;" placeholder="Ingrese la Ubicación" maxlength="50" name="codubica" id="' + row.codubica.id + '" value="' + row.codubica.nombre + '">';
                    }
                },                
               
                {
                    targets: [-1],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<input type="text" class="form-control form-control-sm input-flat" style="font-size: 11px; height: 22px;" placeholder="Ingrese la Ubicación" maxlength="50" name="ubica_destino" id="' + row.ubica_destino.id + '" value="' + row.ubica_destino.nombre + '">';
                    }
                },
            ],
            rowCallback(row, data, displayNum, displayIndex, dataIndex) {

            },
            initComplete: function (settings, json) {

            }
        });
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
                    '<img src="' + repo.imagen + '" class="img-fluid img-thumbnail d-block mx-auto rounded">' +
                '</div>' +
                '<div class="col-lg-11 text-left shadow-sm">' +
                    '<div class="row">' +
                        '<div class="col-lg-6">' +
                            '<p style="margin-bottom: 0;">' +'<b>Nombre:</b> ' + repo.full_name + '</p>' +                            
                        '</div>' +
                        '<div class="col-lg-6">' +
                            '<div class="row">' +
                                 '<div class="col-lg-6">' +
                                      '<b>Ubicación Origen: </b> ' + '<input type="text" class="form-control form-control-sm" readonly=true name="codubica" id="' + repo.codubica.id + '" style="font-size: 10px; height: 20px;" autocomplete="off" value="' + repo.codubica.nombre + '">' + 
                                 '</div>' +
                                  '<div class="col-lg-6">' +
                                     '<b>Código Bien: </b> ' + '<input type="text" class="form-control form-control-sm" readonly=true name="codbien" id="' + repo.codbien.id + '" style="font-size: 10px; height: 20px;" autocomplete="off" value="' + repo.codbien.codbien + '">' + 
                                 '</div>' +

                             '</div>' +                                                 
                        '</div>' +
                     '</div>' +
                '</div>' +
            '</div>' +
        '</div>');

    return option;
}

//esta funcion me permite dar un mejor formato al select 2 de cod bien y ubicafisica
function formatcodbien(repo) {
    // if (repo.loading) {
    //     return repo.text;
    // }

    // if (!Number.isInteger(repo.id)) {
    //     return repo.text;
    // }

      var option = $(
        '<div class="wrapper container">' +
        '<div class="row">' +
        '<div class="col-sm-2 text-lef">' +
        '<p style="margin-bottom: 0;">' +
        '<i class="far fa-hand-point-right">  </i>' + repo.codbien + '<br>' +
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
      $('select[name="origen"]').on('change', function () {
        var id = $(this).val();
        if (id != '') {
            traslados.items.produc_tras = [];
            traslados.list();
        }
        if (id == ''){
            traslados.items.produc_tras = [];
            traslados.list();
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

     //Para extraer datos del responsable del Destino del traslado
     $('select[name="destino"]').on('change', function () {
        var id = $(this).val();
        //alert(id)
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
                
                return false;
            }
            message_error(data.error);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert(textStatus + ': ' + errorThrown);
        }).always(function (data) {
            //select_products.html(options);
        });
    });
      $('.btnAddUbicaF').on('click', function () {
        $('input[name="action"]').val('add');
        $('.modal-title').find('span').html('Creación de un Departamento');
        $('.modal-title').find('i').removeClass().addClass('fas fa-plus');
        $("#idnombre").focus();
        $('#myModalDepartamento').modal('show');

    });

    $('#myModalDepartamento').on('hidden.bs.modal', function (e) {
        $('#frmDepartamento').trigger('reset');
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
                var newOption = new Option(response.full_name, response.id, false, true);
               $('select[name="tipo_traslado"]').append(newOption).trigger('change');
               $('#myModalConcepMov').modal('hide');               
            });
            traslados.list();
    });

    $('.btnRemoveAll').on('click', function () {
        if (traslados.items.produc_tras.length === 0) return false;
        alert_action('Notificación', '¿Estas seguro de eliminar todos los items de tu detalle?', function () {
            traslados.items.produc_tras = [];
            traslados.list();
        }, function () {

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
        $('.modal-title').find('span').html('Creación de Unidad');
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

    $('#frmDepartamento').on('submit', function (e) {
        e.preventDefault();
        var parameters = new FormData(this);
        parameters.append('action', 'create_departamento');
        submit_with_ajax(window.location.pathname, 'Notificación',
            '¿Estas seguro de crear el Departamento?', parameters, function (response) {               
               $('#myModalDepartamento').modal('hide');
            });
    });

    // event cant
    $('#tblTrasProducts tbody').on('click', 'a[rel="deletprodsal"]', function () {
            var tr = tblTrasProducts.cell($(this).closest('td, li')).index();
            alert_action('Notificación', '¿Estas seguro de eliminar el producto de tu detalle?',
                function () {                   
                    traslados.items.produc_tras.splice(tr.row, 1);
                    traslados.list();
                }, function () {

                });
        }).on('keydown.autocomplete', 'input[name="ubica_destino"]', function () {            
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
                    var tr = tblTrasProducts.cell($(this).closest('td, li')).index();

                    traslados.items.produc_tras[tr.row].ubica_destino.id = ui.item.id;
                    traslados.items.produc_tras[tr.row].ubica_destino.nombre = ui.item.nombre;
                    
                    traslados.list();
                }
            });
        });        

    $('.btnClearSearch').on('click', function () {
        $('input[name="search"]').val('').focus();
    });

    $('input[name="search"]').on('click', function () {
        $('input[name="search"]').val('').focus();
    });
    $('.btnSearchProducTras').on('click', function () {
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
                search: "<button class='btn ml-5 btn-sm'><i class='fa fa-search'></i></button>",
                searchPlaceholder: "Buscar",
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
                    'idsCodbien': JSON.stringify(traslados.get_idsCodbien()),
                    'term': $('select[name="search"]').val(),
                    'idorigen': $('#idorigen').val()
                },                
                dataSrc: ""
            },
            columns: [
                {"data": "full_name"},
                {"data": "imagen"},
                {"data": "codbien.id"},
                {"data": "codubica.id", className: "text-left"},
                {"data": "id"},
            ],
            columnDefs: [
                {
                    targets: [-4],
                    class: 'text-center',
                    render: function (data, type, row) {
                        return '<img src="' + data + '" class="img-fluid d-block mx-auto" style="width: 20px; height: 20px;">';
                    }
                },                
                {
                    targets: [-3],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<span>' + row.codbien.codbien + '</span>';                    
                    }
                },
                {
                    targets: [-2],
                    class: 'text-center',
                    render: function (data, type, row) {
                        return '<span>' + row.codubica.nombre + '</span>';
                    }
                },
                {
                    targets: [-1],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        var buttons = '<a rel="add" class="btn btn-primary btn-rounded btn-xs btn-flat"><i class="fas fa-plus"></i></a> ';
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
            product.id = product.prod;
            product.full_name = product.full_name;
            product.categ = product.categ;
            product.codbien = {'id': product.codbien.id, 'codbien': product.codbien.codbien};
            product.codubica = {'id': product.codubica.id, 'nombre': product.codubica.nombre};
            product.ubica_destino = {'id': 0, 'nombre': ''};
            traslados.items.salida= product.salida;
            console.log(product);
            traslados.add(product);
            tblSearchProducts.row($(this).parents('tr')).remove().draw();
        });

    $('#frmTrasladoprod').on('submit', function (e) {
        e.preventDefault();
        let text = "";
        if (traslados.items.produc_tras.length === 0) {
            message_error('Debe al menos tener un item en su detalle');
            return false;
        }
        traslados.items.cod_traslado = $('input[name="cod_traslado"]').val();
        traslados.items.origen = $('select[name="origen"]').val();
        traslados.items.respon_origen = $('input[name="respon_origen"]').val();
        traslados.items.destino = $('select[name="destino"]').val();
        traslados.items.respon_destino = $('input[name="respon_destino"]').val();
        traslados.items.tipo_traslado = $('select[name="tipo_traslado"]').val();
        traslados.items.fecha_traslado = $('input[name="fecha_traslado"]').val();
        traslados.items.observ = $('textarea[name="observ"]').val();
        traslados.items.estado = $('select[name="estado"]').val();

        var filename
       if  ($('input[name="soportedocum"]').val() == ''){
           // produc_catalago.items.imagen= $imagenPrevisualizacion.src;
          //  filename = $idsoportetraslado.src.replace(/.*(\/|\\)/, '');
            traslados.items.soportedocum= "documsoporte/trasladoEquipo/" + filename;
        }else{
            filename = $('input[name="soportedocum"]').val().replace(/.*(\/|\\)/, '');
            traslados.items.soportedocum= "documsoporte/trasladoEquipo/" + filename;
        }
        if  ($('input[name="action"]').val() == 'add'){
            text = "Creado";
        }else{
            text = "Modificado";
        }   

        var parameters = new FormData();
        parameters.append('action', $('input[name="action"]').val());
        parameters.append('traslados', JSON.stringify(traslados.items)); //los convierto a string para enviarlos a mi vista
        console.log(traslados);
        submit_with_ajax(window.location.pathname, 'Notificación', '¿Estas seguro de realizar la siguiente acción?', parameters, function (response) {                $(function () {
            sweet_info( 'El Registro Ha Sido '+text+' Con Exito'); 
            setTimeout(() => {
                location.href = '/erp/traslado/list/';
             }, 1200);          

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
                    idsCodbien: JSON.stringify(traslados.get_idsCodbien()),
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
        data.id = data.prod;
        data.full_name = data.full_name;
        data.precio = data.precio;
        data.subtotal =  0.00;
        data.codbien ={'id': data.codbien.id, 'codbien': data.codbien.codbien};
        data.codubica = {'id': data.codubica.id, 'nombre': data.codubica.nombre};
        data.ubica_destino =  {'id': 0, 'nombre': ''};
        traslados.add(data);
            $(this).val('').trigger('change.select2');
    });
    // Esto se puso aqui para que funcione bien el editar y calcule bien los valores del iva. // sino tomaría el valor del iva de la base debe
    // coger el que pusimos al inicializarlo.
     traslados.list();

});
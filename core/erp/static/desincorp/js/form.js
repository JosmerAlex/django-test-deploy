var tblDesincProducts;
var tblSearchProducts;
//creamos una variable ingresos la cual contendra un diccionario llamado items el cual contendra en encabezado de la factura,
// y este a su ven contendra un array llamado productos el cual almacenara los productos seleccionado
var desincorp =
{
    items:
    {
        cod_desinc: '',
        origen: '',
        respon_origen:'',
        tipo_desinc: '',
        fecha_desinc: '',
        subtotal: 0.00,
        iva: 0.00,
        total: 0.00,
        observ: '',
        estado: '',
        soportedocum: '',
        produc_desinc: []
    },

    //la utiliso para guardar en un array ids, los id de los productos que ya tengo agregador en mi guia de traslado
    // para luego utilizarlos para no mostrarlos en el catalago de productos ò en el select de productos
    get_ids: function ()
    {
        var ids = [];
       //el this me permite hacer saber al codigo que estoy haciendo referencia al objeto actual en este caso a traslados,
       //porq estoy dentro de su estructura
        $.each(this.items.produc_desinc, function (key, value) {
            ids.push(value.id);

        });
        return ids;
    },

    // aqui guardo los id de los codigos de bien para no traerlos en la consulta de bumero de bienes a asignar
    get_idsCodbien: function ()
    {
        var idcodbien = [];
       //el this me permite hacer saber al codigo que estoy haciendo referencia al objeto actual en este caso a ingresos,
       //porq estoy dentro de su estructura
        $.each(this.items.produc_desinc, function (key, value) {
            idcodbien.push(value.codbien.id);
        });
        return idcodbien;
    },

    //calcular factura, recorremos el diccionario items y su array de productos, al cual nois moveremos mediante una funcion anonima
    //mediante pos = posicion y dist = lo que contiene el diccionario.
    calcular_guia_desinc: function () {

        var subtotal = 0.00;
        var iva = $('input[name="iva"]').val();
        //var iva = $('#iva').val();

        $.each(this.items.produc_desinc, function (pos, dict) {
            dict.pos = pos;
            dict.subtotal = parseFloat(dict.precio);
            subtotal += dict.subtotal;

        });

        this.items.subtotal = parseFloat(subtotal);
        this.items.iva = this.items.subtotal * parseFloat(iva);
        this.items.total = this.items.subtotal + this.items.iva;

        $('input[name="subtotal"]').val(this.items.subtotal.toFixed(2));
        $('input[name="ivacalc"]').val(this.items.iva.toFixed(2));
        $('input[name="total"]').val(this.items.total.toFixed(2));
    },

    //cuando llamamos a este metodo agrega cada items del producto seleccionado a mi array productos y luego listarlos en mi datatable
    add: function (item) {
        this.items.produc_desinc.push(item);
        this.list();
    },

    //este metodo lo utilizo para poder listar los productos al datatable
    list: function ()
    {
        this.calcular_guia_desinc();
        tblDesincProducts = $('#tblDesincProducts').DataTable({
            responsive: true,
            autoWidth: false,
            destroy: true,
            deferRender: true,
            //aqui es la variable interna de datatable le paso mi diccionario de items el cual contiene el encabezado y el array de productos
            //el cual se encuentra en el mismo diccionario, ojo tambien pude crear un ajax pero no es necesario ya que esta variable o propiedad data
            //del datatable permite tambien recibir un array, el cual ya lo tengo con datos y todo
            data: this.items.produc_desinc,
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
            paging: false,
            ordering: false,
            info: false,
            searching: false,
            columns: [
                {"data": "id"},
                {"data": "full_name", className: "text-left"},
                {"data": "precio"},
                {"data": "subtotal"},
                {"data": "codbien.id"},
                {"data": "codubica.id"},

            ],
            columnDefs: [
                {
                    targets: [0],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<a rel="deletproddesinc" class="btn btn-danger btn-rounded btn-xs" style="color: white;"><i class="fas fa-trash-alt"></i></a>';
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
                        //return parseFloat(data).toFixed(2);
                        return '<input type="text" class="form-control form-control-sm input-flat" readonly=true name="codbien" id="' + row.codbien.id + '" style="font-size: 11px; height: 22px;" autocomplete="off" value="' + row.codbien.codbien + '">';
                        //return '<input type="text" class="form-control" name="cant" style="font-size: 10px; padding-left:4px; padding-right:4px" autocomplete="off" value="' + row.cant + '">';
                    }
                },
                {
                    targets: [-1],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<input type="text" class="form-control form-control-sm input-flat" readonly=true style="font-size: 11px; height: 22px;" placeholder="Ingrese la Ubicación" maxlength="50" name="codubica" id="' + row.codubica.id + '" value="' + row.codubica.nombre + '">';
                    }
                },

                {
                    targets: [-4],
                    class: 'text-center',
                    render: function (data, type, row) {
                        return parseFloat(data).toFixed(2);
                        // return '<span class="badge badge-secondary">' + data + '</span>';
                    }
                },
                {
                    targets: [-5],
                    class: 'text-center',
                    render: function (data, type, row) {
                        return '<span>' + data + '</span>';
                    }
                },
            ],
            rowCallback(row, data, displayNum, displayIndex, dataIndex) {
               // return '<input type="text" class="form-control form-control-sm" name="cant" style="font-size: 12px;" autocomplete="off" value="' + row.cant + '">';
                // $(row).find('input[name="cant"]').val ({
                //     // min: 1,
                //     // max: data.stock_actual,
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
                            '<b>PVP:</b> <span class="badge badge-warning">' + repo.precio + ' Bs.</span>' +
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

    $('#id_tipo').on('change', function() {
        // if (this.value === '257') {
        //   $("#idfecharetorno").prop("disabled", false);
        //     $("#idfecharetorno").show();

        // }else{
        //     $("#idfecharetorno").hide();
        // }

    });
    $('select[name="origen"]').on('change', function () {
        var id = $(this).val();
        if (id != '') {
            desincorp.items.produc_desinc = [];
            desincorp.list();
        }
        if (id == ''){
            desincorp.items.produc_desinc = [];
            desincorp.list();
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

    // $('#reservationdate').datetimepicker({
    //     format: 'YYYY-MM-DD',
    //     date: moment().format("YYYY-MM-DD"),
    //     locale: 'es',
    //     minDate: moment().format("YYYY-MM-DD")
    // });
      // boton agregar ubicacion fisica
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
                //console.log(response);
                var newOption = new Option(response.full_name, response.id, false, true);
                
               // $('#proveedor').append('<option value="' + response.id + '" selected="selected">' + response.full_name + '</option>');
              //  $('#proveedor').append(newOption).trigger('change');
               // $('#proveedor').selectmenu("refresh", true);
               $('select[name="tipo_desinc"]').append(newOption).trigger('change');
               $('#myModalConcepMov').modal('hide');               
            });
            desincorp.list();
    });




    $('.btnRemoveAll').on('click', function () {
        if (desincorp.items.produc_desinc.length === 0) return false;
        alert_action('Notificación', '¿Estas seguro de eliminar todos los items de tu detalle?', function () {
            desincorp.items.produc_desinc = [];
            desincorp.list();
        }, function () {

        });
    });


    $('select[name="ubicafisica"]').select2({
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
                    action: 'search_ubicafisica'
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
                //console.log(response);
                var newOption = new Option(response.full_name, response.id, false, true);
               // $('#proveedor').append('<option value="' + response.id + '" selected="selected">' + response.full_name + '</option>');
              //  $('#proveedor').append(newOption).trigger('change');
               // $('#proveedor').selectmenu("refresh", true);
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
                //console.log(response);
            //     var newOption = new Option(response.full_name, response.id, false, true);
            //    $('select[name="ubicafisica"]').append(newOption).trigger('change');
               $('#myModalDepartamento').modal('hide');
            });
    });

    $('#tblDesincProducts tbody').on('click', 'a[rel="deletproddesinc"]', function () {
            var tr = tblDesincProducts.cell($(this).closest('td, li')).index();
            alert_action('Notificación', '¿Estas seguro de eliminar el producto de tu detalle?',
                function () {
                    //el splice permite borrar el o los elementos de un array, le pasamos la posicion y la cantidad de elementos
                    desincorp.items.produc_desinc.splice(tr.row, 1);
                    desincorp.list();
                }, function () {

                });
    
        });        

       
    $('.btnClearSearch').on('click', function () {
        $('input[name="search"]').val('').focus();
    });

    $('input[name="search"]').on('click', function () {
        $('input[name="search"]').val('').focus();
    });
    // esta tabla es la del modal catalago de producto donse se escojen los productos
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
            //paging: false,
            ordering: false,
            //info: false,
            //searching: false,
            ajax: {
                url: window.location.pathname,
                type: 'POST',
                data: {
                    'action': 'search_products',
                    'idsCodbien': JSON.stringify(desincorp.get_idsCodbien()), //lo convierto a string para mandarlo a mi vista
                    'term': $('select[name="search"]').val(),
                    'idorigen': $('#idorigen').val()
                },
                dataSrc: ""
            },
            columns: [
                {"data": "full_name"},
                {"data": "imagen"},
                {"data": "precio"},
                {"data": "codbien.id"},
                {"data": "codubica.id", className: "text-left"},
                {"data": "id"},
            ],
            columnDefs: [
                {
                    targets: [-5],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<img src="' + data + '" class="img-fluid d-block mx-auto" style="width: 20px; height: 20px;">';
                    }
                },
                {
                    targets: [-4],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return parseFloat(data).toFixed(2) + ' Bs.';
                    }
                },
                {
                    targets: [-3],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<span>' + row.codbien.codbien + '<span>' ;
                    }
                },
                {
                    targets: [-2],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<span>' + row.codubica.nombre + '<span>' ;
                    }
                },
                {
                    targets: [-1],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        var buttons = '<a rel="add" class="btn btn-success btn-rounded btn-xs"><i class="fas fa-plus"></i></a> ';
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
            product.precio = product.precio;
            product.subtotal =  0.00;
            product.codbien = {'id': product.codbien.id, 'codbien': product.codbien.codbien};
            product.codubica = {'id': product.codubica.id, 'nombre': product.codubica.nombre};
            
            desincorp.add(product);
            tblSearchProducts.row($(this).parents('tr')).remove().draw();
            
        });





    // event submit
    $('#frmDesincprod').on('submit', function (e) {
        e.preventDefault();
        if (desincorp.items.produc_desinc.length === 0) {
            message_error('Debe al menos tener un item en su detalle');
            return false;
        }

        desincorp.items.cod_desinc = $('input[name="cod_desinc"]').val();
        desincorp.items.origen = $('select[name="origen"]').val();
        desincorp.items.respon_origen = $('input[name="respon_origen"]').val();
        desincorp.items.tipo_desinc = $('select[name="tipo_desinc"]').val();
        desincorp.items.fecha_desinc = $('input[name="fecha_desinc"]').val();
        desincorp.items.observ = $('textarea[name="observ"]').val();
        desincorp.items.estado = $('select[name="estado"]').val();
        desincorp.items.iva = $('input[name="iva"]').val();
    //     var filename
    //    if  ($('input[name="soportedocum"]').val() == ''){
    //        // produc_catalago.items.imagen= $imagenPrevisualizacion.src;
    //       //  filename = $idsoportetraslado.src.replace(/.*(\/|\\)/, '');
    //         desincorp.items.soportedocum= "documsoporte/desincorporacionEquipo/" + filename;
    //     }else{
    //         filename = $('input[name="soportedocum"]').val().replace(/.*(\/|\\)/, '');
    //         desincorp.items.soportedocum= "documsoporte/desincorporacionEquipo/" + filename;
    //     }

        var parameters = new FormData();
        parameters.append('action', $('input[name="action"]').val());
        parameters.append('desincorp', JSON.stringify(desincorp.items)); //los convierto a string para enviarlos a mi vista
        console.log(desincorp);
        submit_with_ajax(window.location.pathname, 'Notificación', '¿Estas seguro de realizar la siguiente acción?', parameters, function (response) {
                $(function () {
                location.href = '/erp/desinc/list/';

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
                    idsCodbien: JSON.stringify(desincorp.get_idsCodbien()),
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
        desincorp.add(data);
            $(this).val('').trigger('change.select2');
    });
    // Esto se puso aqui para que funcione bien el editar y calcule bien los valores del iva. // sino tomaría el valor del iva de la base debe
    // coger el que pusimos al inicializarlo.
     desincorp.list();

});
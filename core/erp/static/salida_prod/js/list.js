var tblSal;
var param_id = "";
var input_daterange;  

var salida = {
    list: function (all) {
        var parameters = {
            'action': 'searchdata',
            'start_date': input_daterange.data('daterangepicker').startDate.format('YYYY-MM-DD'),
            'end_date': input_daterange.data('daterangepicker').endDate.format('YYYY-MM-DD'),
        };
        if (all) {
            parameters['start_date'] = '';
            parameters['end_date'] = '';
        }
        tblSal = $('#data_list').DataTable({
            responsive: false,
            autoWidth: false,
            destroy: true,
            deferRender: true,
            ajax: {
                url: '/erp/salida/list/',
                //url: window.location.pathname,
                type: 'POST',
                data: parameters,
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
            columns: [
                {
                    "className": 'details-control',
                    "orderable": false,
                    "data": null,
                    "defaultContent": ''
                },
                {"data": "cod_salida"},
                {"data": "tipo_salida.denominacion"},
                {"data": "origen.nombre"},
                {"data": "destino.nombre"}, 
                {"data": "fecha_salida"},
                {"data": "total"},
                {"data": "estado.id"},
                {"data": "id"},
            ],
            
            columnDefs: [
                  {
                    targets: [-3],
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
                       // return row.estado.name
                       if(row.estado.id == 'REC') return '<i class="fa fa-times c-red" style="font-size: 13px;"><tool-tip role="tooltip"> Rechazado</tool-tip><span style="display:none;">'+row.estado.name+'</span></i>';
                       if(row.estado.id == 'APR') return '<i class="fa fa-check c-blue" style="font-size: 13px;"><tool-tip role="tooltip"> Aprobado</tool-tip><span style="display:none;">'+row.estado.name+'</span></i>';
                       if(row.estado.id == 'DIS') return '<i class="fa fa-pen c-yellow" style="font-size: 13px;"><tool-tip role="tooltip"> En Creación</tool-tip><span style="display:none;">'+row.estado.name+'</span></i>';
                   
                      
                    }
                    
                },
                {
                    targets: [-1],
                    class: 'text-center',
                    // width: "14%",
                    orderable: false,
                    render: function (data, type, row) {
                        if(row.estado.id == 'APR'){                            
                            var buttons = '<a rel="VerDetSalida" class="btn btn-success btn-xs" data-toggle="tooltip" title="Consultar Detalle"><i class="fas fa-search"></i></a> ';
                            buttons += '<a href="/erp/salida/factura/pdf/' + row.id + '/" target="_blank" class="btn btn-info btn-xs" data-toggle="tooltip" title="PDF"><i class="fas fa-file-pdf"></i></a> ';
                            return buttons;
                        }else{
                            var buttons = '<a href="/erp/salida/update/' + row.id + '/" class="btn btn-warning btn-xs" data-toggle="tooltip" title="Editar"><i class="fas fa-edit" style="color: #ffffff;"></i></a> ';
                            buttons += '<a href="#" rel="delete" class="btn btn-danger btn-xs" data-toggle="tooltip" title="Eliminar"><i class="fas fa-trash-alt"></i></a> ';
                            buttons += '<a rel="VerDetSalida" class="btn btn-success btn-xs" data-toggle="tooltip" title="Consultar Detalle"><i class="fas fa-search"></i></a> ';
                            return buttons;
        
                        }
                        
                        }
                    },
                ],
               
                initComplete: function (settings, json) {
                 
            }
                
        });              
            
    },
    //Bienes Muebles
    formatRowHtml: function (d) {
        console.log(d);
        var html = '<table class="table">';
        html += '<thead class="thead-dark">';
        html += '<tr><th scope="col">Producto</th>';
        html += '<th scope="col">Categoría</th>';
        html += '<th scope="col">Precio</th>';
        html += '<th scope="col">Ubicación Fisica</th>';
        html += '<th scope="col">Codigo de Bien</th></tr>';
        html += '</thead>';
        html += '<tbody>';
        $.each(d.det, function (key, value) {
            html+='<tr>'
            html+='<td>'+value.prod.nombre+'</td>'
            html+='<td>'+value.prod.categorias.nombre+'</td>'
            html+='<td>'+value.precio+' Bs</td>'
            html+='<td>'+value.codubica.nombre+'</td>'
            html+='<td>'+value.codbien.codbien+'</td>'
            html+='</tr>';
        });
        html += '</tbody>';
        return html;
    },
    //Materiales de Consumo
    formatRowHtml2: function (d) {
        console.log(d);
        var html = '<table class="table">';
        html += '<thead class="thead-dark">';
        html += '<tr><th scope="col">Producto</th>';
        html += '<th scope="col">Categoría</th>';
        html += '<th scope="col">Precio</th>';
        html += '<th scope="col">Número de lote</th>';
        html += '<th scope="col">Fecha de Vencimiento</th></tr>';
        html += '</thead>';
        html += '<tbody>';
        $.each(d.det_insumos, function (key, value) {
            html+='<tr>'
            html+='<td>'+value.prod.nombre+'</td>'
            html+='<td>'+value.prod.categorias.nombre+'</td>'
            html+='<td>'+value.precio+' Bs</td>'
            html+='<td>'+value.nro_lote+'</td>'
            html+='<td>'+value.fecha_venc+'</td>'
            html+='</tr>';
        });
        html += '</tbody>';
        return html;
    }
};

  
$(function () {
    input_daterange = $('input[name="date_range"]');

    input_daterange
        .daterangepicker({
            language: 'auto',
            startDate: new Date(),
            locale: {
                format: 'YYYY-MM-DD',
            }
        });

    $('.drp-buttons').hide();

    $('.btnSearch').on('click', function () {
        salida.list(false);
    });

    $('.btnSearchAll').on('click', function () {
        salida.list(true);
    });
    $('#data_list tbody').on('click', 'a[rel="delete"]', function () {
        $('.modal-title').find('i').removeClass().addClass('fas fa-edit');
        var tr = tblSal.cell($(this).parents('td, li')).index();
        var data = tblSal.row(tr.row).data();
        var parameters = new FormData();
        parameters.append('action', 'delete');
        parameters.append('id', data.id);       
        url = "/erp/salida/delete/"+data.id+"/";
        submit_with_ajax(url, 'Notificación', '¿Estas seguro de eliminar la Distribución?  ' + '<b style="color: #304ffe;">' + data.cod_salida + '</b>', parameters, function () {
            tblSal.ajax.reload();
        });
      });


    $('#data_list tbody')
    .on('click', 'a[rel="VerDetSalida"]', function () {
        var tr =  $("#data_list").DataTable().cell($(this).closest('td, li')).index();
        var data =  $("#data_list").DataTable().row(tr.row).data();
        console.log(data);
        //Bienes Muebles
        $('#tipo_distrib').text(data.tipo_salida.denominacion);
        $('#t_comprob').text(data.tipo_comprob.name);
        $('#nro_comprob').text(data.num_comprob);
        $('#origen').text(data.origen.nombre);
        $('#destino').text(data.destino.nombre);
        $('#usuario').text(data.usuario.username);
        $('#obs').text(data.observ);
        $('#fecha').text(data.fecha_salida);
        //Materiales de Consumo
        $('#tipo_distrib2').text(data.tipo_salida.denominacion);
        $('#t_comprob2').text(data.tipo_comprob.name);
        $('#nro_comprob2').text(data.num_comprob);
        $('#origen2').text(data.origen.nombre);
        $('#destino2').text(data.destino.nombre);
        $('#usuario2').text(data.usuario.username);
        $('#obs2').text(data.observ);
        $('#fecha2').text(data.fecha_salida);

       if (data.tipo_salida.codigo == '53'){
            $('#tblDetalleProd').DataTable({
                responsive: false,
                autoWidth: false,
                destroy: true,
                deferRender: true,
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
                columns: [
                
                    {"data": "prodnombre"},
                    {"data": "proddesc"},
                    {"data": "prodcateg"},
                    {"data": "precio"},
                    {"data": "nombre", className: "text-left"},
                    {"data": "codbien"},
                ],
                columnDefs: [
                    {
                        targets: [-3],
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
            $('#modaltitledetalleproduc').find('span').html('Consulta Detalle de la Distribución:  ' + '<b style="color: #80deea;">' + data.cod_salida + '</b>');
            $('#myModalDetProd').modal('show');
       }else{
        $('#tblDetalleMc').DataTable({
            responsive: false,
            autoWidth: false,
            destroy: true,
            deferRender: true,
            ajax: {
                url: window.location.pathname,
                type: 'POST',
                data: {
                    'action': 'search_detalle_mc',
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
            columns: [
               
                {"data": "prod"},
                {"data": "categoria"},
                {"data": "precio", className: "text-center"},
                {"data": "cantidad", className: "text-center"},
                {"data": "lote", className: "text-center"},
                {"data": "fecha_venc", className: "text-center"},
            ],
            // columnDefs: [
            //     {
            //         targets: [-3],
            //         class: 'text-center',
            //         render: function (data, type, row) {
            //             return parseFloat(data).toFixed(2) + ' Bs.';
            //         }
            //     },
            //     {
            //         targets: [-2],
            //         class: 'text-center',
            //         render: function (data, type, row) {
            //             return data;
            //         }
            //     },
            // ],
            initComplete: function (settings, json) {
            }
        });
        $('#titleDeatilMc').find('span').html('Consulta Detalle de la Distribución:  ' + '<b style="color: #80deea;">' + data.cod_salida + '</b>');
        $('#myModalDetailMc').modal('show');
       }        
    })
    
    .on('click', 'td.details-control', function () {
        var tr2 =  $("#data_list").DataTable().cell($(this).closest('td, li')).index();
        var data =  $("#data_list").DataTable().row(tr2.row).data();
        var tr = $(this).closest('tr');
        var row =  tblSal.row(tr);
        if (row.child.isShown()) {
            row.child.hide();
            tr.removeClass('shown');
        } else if (data.tipo_salida.codigo == '53') {
            row.child(salida.formatRowHtml(row.data())).show();
            tr.addClass('shown');
        } else {
            row.child(salida.formatRowHtml2(row.data())).show();
            tr.addClass('shown');
        }
    });
    salida.list(false);
});
    
    


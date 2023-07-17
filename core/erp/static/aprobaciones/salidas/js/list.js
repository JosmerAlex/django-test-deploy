var dttestado;
var input_daterange;

var salida_aprob = {
    list: function(all){
        var parameters = {
            'action': 'searchdata',
            'start_date': input_daterange.data('daterangepicker').startDate.format('YYYY-MM-DD'),
            'end_date': input_daterange.data('daterangepicker').endDate.format('YYYY-MM-DD'),
        };
        if (all) {
            parameters['start_date'] = '';
            parameters['end_date'] = '';
        }
        dttestado = $('#data_list').DataTable({
            responsive: false,
            autoWidth: false,
            destroy: true,
            deferRender: true,
            ajax: {
                url: window.location.pathname,
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
                searchPlaceholder: "Buscar",
                search: "<button type='button' class='btn btn-sm'><i class='fa fa-search'></i></button>",
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
                {"data": "usuario.username"},
                {"data": "cod_salida", className: "text-center"},
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
                       if(row.estado.id == 'REC') return '<i class="fa fa-times-circle" data-toggle="tooltip" title="Rechazado" style="color:red; font-size: 12px;"><span style="display:none;">'+row.estado.name+'</span></i>';
                       if(row.estado.id == 'APR') return '<i class="fa fa-check-circle" data-toggle="tooltip" title="Aprobado" style="color:green; font-size: 12px;"><span style="display:none;">'+row.estado.name+'</span></i>';
                       if(row.estado.id == 'DIS') return '<i class="fa fa-pen" data-toggle="tooltip" title="En Creación" style="color:#ffc107; font-size: 12px;"><span style="display:none;">'+row.estado.name+'</span></i>';                      
                    }
                },
                {
                    targets: [-1],
                    class: 'text-center',
                    // width: "14%",
                    orderable: false,
                    render: function (data, type, row) {
                        var buttons = '<a rel="VerDetSal" class="btn btn-success btn-xs"><i class="fas fa-search"></i></a> ';
                        buttons += '<a href="/erp/salida/factura/pdf/' + row.id + '/" target="_blank" class="btn btn-info btn-xs"><i class="fas fa-file-pdf"></i></a> ';
                        buttons += '<a rel="estadoSal" class="btn btn-primary btn-xs"><i class="fas fa-check-square"></i></a>';
                        return buttons;
                        }
                    },
                ],
                initComplete: function (settings, json) {
                }
            });
    },
}
$(function () { 
    input_daterange = $('input[name="date_range"]');
    input_daterange.daterangepicker({
            language: 'auto',
            startDate: new Date(),
            locale: {
                format: 'YYYY-MM-DD',
            }
        });
    $('.drp-buttons').hide();

    $('.btnSearch').on('click', function () {
        salida_aprob.list(false);
    });

    $('#data_list tbody').on('click', 'a[rel="estadoSal"]', function () {
        //$('#productos tbody').on('click', '.nombreclase', function () {
            var tr = $("#data_list").DataTable().cell($(this).parents('td, li')).index();
            var data = $("#data_list").DataTable().row(tr.row).data();
            $('.modal-title').find('i').removeClass().addClass('fas fa-clipboard-check');
          $('.modal-title').find('span').html('Cambio de Estado del Registro:  ' + '<b style="color: #b3e5fc;">' + data.cod_salida + '</b>');
          param_id=data.id;
          console.log(param_id);
          $('input[name="action"]').val('edit');
          $('input[name="id"]').val(data.id);
          $('select[name="estado"]').val(data.estado.id);
          $('#myModalStatus').modal('show');
      });
      $('#frmStatus').on('submit', function (e) {
        e.preventDefault();        
        let myForm = document.getElementById('frmStatus');
        let parameters = new FormData(myForm);
        let url="";
        let titulo="";
        let text = "";
        if  ($('select[name="estado"]').val() == 'APR'){
            text = "Aprobado";
        }else{
            text = "Rechazado";
        }
            url = window.location.pathname;
            titulo="¿Estas seguro de actualizar el Estado?";
            parameters.append('action', $('input[name="action"]').val());
            parameters.append('param_id', $('input[name="id"]').val());
            parameters.append('new_estado', $('select[name="estado"]').val());
            submit_with_ajax(url, 'Estimado usuario(a)', titulo, parameters, function (response) {
                $('#myModalStatus').modal('hide');
                sweet_info( 'El Registro Ha Sido '+text+' Con Exito');  
                dttestado.ajax.reload();
            });
    
    });  
    
        
    $('#data_list tbody').on('click', 'a[rel="VerDetSal"]', function () {
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
                    searchPlaceholder: "Buscar",
                    search: "<button type='button' class='btn btn-sm'><i class='fa fa-search'></i></button>",
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
                responsive: true,
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
                    search: "<button type='button' class='btn ml-5 btn-sm'><i class='fa fa-search'></i></button>",
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
    salida_aprob.list(false);
});
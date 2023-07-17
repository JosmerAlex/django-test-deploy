var tblDesinc;
var param_id = "";
var input_daterange;

var desincorp = {
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
        tblDesinc = $('#data_list').DataTable({
            responsive: false,
            autoWidth: false,
            destroy: true,
            deferRender: true,
            ajax: {
                url: '/erp/desincorp/list/',
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
                {"data": "cod_desinc"},
                {"data": "tipo_desinc"},
                {"data": "almacen"},            
                {"data": "fecha_desinc"},
                {"data": "estado"},
                {"data": "id"},
            ],
            columnDefs: [
                {
                    targets: [-2],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                       // return row.estado.name
                        if(row.estado == 'REC') return '<i class="fas fa-window-close" style="color:red"></i>';
                        if(row.estado == 'APR') return '<i class="fa fa-check" style="color:green"></i>';
                        if(row.estado == 'DIS') return '<i class="fa fa-pencil-alt" style="color:#ffc107"></i>';
                   
                      
                    }
                    
                },
                {            
                    targets: [-1],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        if(row.estado == 'APR'){                           
                            var buttons = '<a rel="VerDetDesincorp" class="btn btn-success btn-xs"><i class="fas fa-search"></i></a> ';
                            buttons += '<a href="/erp/desincorp/factura/pdf/' + row.id + '/" target="_blank"class="btn btn-info btn-xs"><i class="fas fa-file-pdf"></i></a> ';
                            return buttons;
                        }else{
                            var buttons = '<a href="/erp/desincorp/update/' + row.id + '/" class="btn btn-warning btn-xs"><i class="fas fa-edit" style="color: #ffffff;"></i></a> ';
                            buttons += '<a href="#" rel="delete" class="btn btn-danger btn-xs"><i class="fas fa-trash-alt"></i></a> ';
                            buttons += '<a rel="VerDetDesincorp" class="btn btn-success btn-xs"><i class="fas fa-search"></i></a> ';
                            return buttons;
                        }
                        
                        }
                    },
            ],
            initComplete: function (settings, json) {
            }
        });
    },
    formatRowHtml: function(data) {
        var html = '<table class="table">';
        html += '<thead class="thead-dark">';
        html += '<tr><th scope="col">Producto</th>';
        html += '<th scope="col">Precio</th>';
        html += '<th scope="col">Cantidad</th>';
        html += '<th scope="col">Subtotal</th></tr>';
        html += '</thead>';
        html += '<tbody>';
        $.each(data, function (key, value) {
            html+='<tr>'
            html+='<td>'+value.prodnombre+'</td>'
            html+='<td>'+value.precio+' Bs</td>'
            html+='<td>'+value.cant+'</td>'
            html+='<td>'+value.subtotal+' Bs</td>'
            html+='</tr>';
    
        });
        html += '</tbody>';
        return html;
    }
}
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
        desincorp.list(false);
    });

    $('.btnSearchAll').on('click', function () {
        desincorp.list(true);
    });    


      //  para capturar el clik del boton eliminar, el cual tiene una variable de referencia rel="delete"
      $('#data_list tbody').on('click', 'a[rel="delete"]', function () {
        $('.modal-title').find('i').removeClass().addClass('fas fa-edit');
        var tr = tblDesinc.cell($(this).parents('td, li')).index();
        var data = tblDesinc.row(tr.row).data();
        var parameters = new FormData();
        parameters.append('action', 'delete');
        parameters.append('id', data.id);
        url = "/erp/desincorp/delete/"+data.id+"/";
        submit_with_ajax(url, 'Notificación', '¿Estas seguro de eliminar la desincorporación?  ' + '<b style="color: #304ffe;">' + data.cod_desinc + '</b>', parameters, function () {
            tblDesinc.ajax.reload();
            //getDataSalida();
        });
      });

      $('#data_list tbody')
        .on('click', 'a[rel="VerDetDesincorp"]', function () {
            var tr =  $("#data_list").DataTable().cell($(this).closest('td, li')).index();
            var data =  $("#data_list").DataTable().row(tr.row).data();
            $('#tblDetalleProdDesincorp').DataTable({
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
                    {"data": "prodnombre"},
                    {"data": "prodcateg"},
                    {"data": "precio"},
                    {"data": "cant"},
                    {"data": "subtotal"},
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
            $('#modaltitledetalledesincorp').find('span').html('Consulta Detalle de la Desincorporación:  ' + '<b>' + data.cod_desinc + '</b>');
            $('#myModalDetProdDesincorp').modal('show');
        })
        .on('click', 'td.details-control', function () {
            var tr = $(this).closest('tr');
            var row =  tblDesinc.row(tr);
            var id=row.data().id;
            if (row.child.isShown()) {
                row.child.hide();
                tr.removeClass('shown');
            } else {
                var parameters = new FormData();
                 parameters.append('action', 'search_detalle_prod');
                 parameters.append('id', id);
                 $.ajax({
                     url: window.location.pathname,
                     type: 'POST',
                     data: parameters,
                     dataType: 'json',
                     processData: false,
                     contentType: false,
                 }).done(function (data) {
                    // console.log(data);
                     if (!data.hasOwnProperty('error')) {
                         row.child(desincorp.formatRowHtml(data)).show();
                         tr.addClass('shown');
                         //callback(data);
                         return false;
                     }
                     message_error(data.error);
                 }).fail(function (jqXHR, textStatus, errorThrown) {
                     alert(textStatus + ': ' + errorThrown);
                 }).always(function (data) {
                 });
             }        
         });
         desincorp.list(false);

});

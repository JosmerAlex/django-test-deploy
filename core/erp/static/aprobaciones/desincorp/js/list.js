var tblDesinc;
var input_daterange;

var desinc_aprob = {
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
                {"data": "usuario"},
                {"data": "cod_desinc"},
                {"data": "tipo_desinc"},
                {"data": "origen"},            
                {"data": "fecha_desinc", className: "text-center"},
                {"data": "estado"},
                {"data": "id"},
            ],
            columnDefs: [
                {
                    targets: [-2],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        if(row.estado == 'REC') return '<i class="fas fa-times" style="color:red"></i>';
                        if(row.estado == 'APR') return '<i class="fas fa-check" style="color:green"></i>';
                        if(row.estado == 'DIS') return '<i class="fa fa-pencil-alt" style="color:#ffc107"></i>';                  
                    }                    
                },
                {            
                    targets: [-1],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        var buttons = '<a rel="VerDetDesinc" class="btn btn-success btn-xs"><i class="fas fa-search"></i></a> ';
                        buttons += '<a href="/erp/desinc/factura/pdf/' + row.id + '/" target="_blank"class="btn btn-info btn-xs"><i class="fas fa-file-pdf"></i></a> ';
                        buttons += '<a rel="estadoDes" class="btn btn-primary btn-xs"><i class="fas fa-check-square"></i></a>';
                        return buttons;
                        }
                    },
            ],
            initComplete: function (settings, json) {
            }
        });
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
        desinc_aprob.list(false);
    });   
    $('#data_list tbody').on('click', 'a[rel="estadoDes"]', function (){
        var tr = $("#data_list").DataTable().cell($(this).parents('td, li')).index();
        var data = $("#data_list").DataTable().row(tr.row).data();
        $('.modal-title').find('i').removeClass().addClass('fas fa-clipboard-check');
      $('.modal-title').find('span').html('Cambio de Estado del Registro:  ' + '<b style="color: #b3e5fc;">' + data.cod_desinc + '</b>');
      param_id=data.id;
      $('input[name="action"]').val('edit');
      $('input[name="id"]').val(data.id);
      $('select[name="estado"]').val(data.estado);
      $('#myModalStatusDes').modal('show');
    });
    $('#frmStatusDes').on('submit', function (e) {
        e.preventDefault();        
        let myForm = document.getElementById('frmStatusDes');
        let parameters = new FormData(myForm);
        let url="";
        let titulo="";
            url = window.location.pathname;
            titulo="¿Estas seguro de actualizar el Estado?";
            // parameters.append('action', $('input[name="action"]').val());
            parameters.append('param_id', $('input[name="id"]').val());
            parameters.append('new_estado', $('select[name="estado"]').val());
            submit_with_ajax(url, 'Estimado usuario(a)', titulo, parameters, function (response) {
                $('#myModalStatusDes').modal('hide'); 
                tblDesinc.ajax.reload();
            });    
    });
      $('#data_list tbody')
        .on('click', 'a[rel="VerDetDesinc"]', function () {
            var tr =  $("#data_list").DataTable().cell($(this).closest('td, li')).index();
            var data =  $("#data_list").DataTable().row(tr.row).data();
            $('#tblDetalleDesinc').DataTable({
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
                order: false,
                ordering: false,                
                columns: [
                    {"data": "prodnombre"},
                    {"data": "proddesc"},
                    {"data": "precio"},
                    {"data": "codbien"},
                    {"data": "nombredepar"},
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
            $('#modaltitledetalleproducdesinc').find('span').html('Detalle de la Desincorporación:  ' + '<b style="color: #80deea;">' + data.cod_desinc + '</b>');
            $('#myModalDetDesinc').modal('show');
        })
    desinc_aprob.list(false);

});

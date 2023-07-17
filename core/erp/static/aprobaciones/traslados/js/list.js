var tblTraslado;
var input_daterange;


var tras_aprob = {
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
        tblTraslado = $('#data_list').DataTable({
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
            ordering: false,           
            columns: [
                {"data": "usuario"},
                {"data": "cod_traslado"},
                {"data": "tipo_traslado"},
                {"data": "origen"},
                {"data": "destino"},            
                {"data": "fecha_traslado"},
                {"data": "estado"},
                {"data": "id"},
            ],
            columnDefs: [
                {
                    targets: [-2],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<i class="fa fa-pencil-alt" style="color:#ffc107"></i>';                 
                    }                    
                },
                {            
                    targets: [-1],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        var buttons = '<a rel="VerDetTras" class="btn btn-success btn-xs"><i class="fas fa-search"></i></a> ';
                        buttons += '<a href="/erp/traslado/factura/pdf/' + row.id + '/" target="_blank"class="btn btn-info btn-xs"><i class="fas fa-file-pdf"></i></a> ';
                        buttons += '<a rel="estadoTras" class="btn btn-primary btn-xs"><i class="fas fa-check-square"></i></a>'; 
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
        tras_aprob.list(false);
    });
    $('#data_list tbody').on('click', 'a[rel="estadoTras"]', function (){
            var tr = $("#data_list").DataTable().cell($(this).parents('td, li')).index();
            var data = $("#data_list").DataTable().row(tr.row).data();
            $('.modal-title').find('i').removeClass().addClass('fas fa-clipboard-check');
          $('.modal-title').find('span').html('Cambio de Estado del Registro:  ' + '<b style="color: #b3e5fc;">' + data.cod_traslado + '</b>');
          param_id=data.id;
          $('input[name="action"]').val('edit');
          $('input[name="id"]').val(data.id);
          $('select[name="estado"]').val(data.estado);    
          $('#myModalStatusTras').modal('show');
    });
    $('#frmStatusTras').on('submit', function (e) {
        e.preventDefault();
        
        let myForm = document.getElementById('frmStatusTras');
        let parameters = new FormData(myForm);
        let url="";
        let titulo="";
            url = window.location.pathname;
            titulo="¿Estas seguro de actualizar el Estado?";
            // parameters.append('action', $('input[name="action"]').val());
            parameters.append('param_id', $('input[name="id"]').val());
            parameters.append('new_estado', $('select[name="estado"]').val());
        submit_with_ajax(url, 'Estimado usuario(a)', titulo, parameters, function (response) {
                $('#myModalStatusTras').modal('hide'); 
                tblTraslado.ajax.reload();
            });    
    });
      $('#data_list tbody')
        .on('click', 'a[rel="VerDetTras"]', function () {
            var tr =  $("#data_list").DataTable().cell($(this).closest('td, li')).index();
            var data =  $("#data_list").DataTable().row(tr.row).data();
            $('#tblDetalleTras').DataTable({
                responsive: true,
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
                //paging: false,
                ordering: false,
                //searching: false,
                
                
                columns: [
                    {"data": "prodnombre"},
                    {"data": "proddesc"},
                    {"data": "codbien"},
                    {"data": "nombredepar"},
                    {"data": "nombredepar_dest"},
                ],                
                initComplete: function (settings, json) {
                }
            });
            $('#modaltitledetalleproductras').find('span').html('Consulta Detalle del Traslado #:' + '<b style="color: #80deea;">' + data.cod_traslado + '</b>');
            $('#myModalDetTras').modal('show');
        })
    tras_aprob.list(false);
});

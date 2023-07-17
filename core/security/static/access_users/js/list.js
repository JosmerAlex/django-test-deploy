var input_daterange;
var access;

var access_users = {
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
        access = $('#data_list').DataTable({
            //responsive: true,
            //scrollX: true,
            // autoWidth: false,
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
            columns: [
                {"data": "id", className: "text-center"},
                {"data": "user.username"},
                {"data": "date_joined"},
                {"data": "time_joined"},
                {"data": "ip_address"},
                {"data": "browser"},
                {"data": "device"},
                {"data": "type.name", className: "text-center"},
                {"data": "id"},
            ],
            order: [[2, "desc"], [3, "desc"]],
            columnDefs: [                
                {
                    targets: [-2],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        if (row.type.id == 'success'){
                            return '<span class="badge badge-success badge-pill" style="font-size: 11px;">'+ data +'</span> ';
                        }
                        return '<span class="badge badge-danger badge-pill" style="font-size: 11px;">'+ data +'</span> ';
                    }
                },
                {
                    targets: [-1],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<a rel="delete" class="btn btn-danger btn-xs"><i class="fas fa-trash-alt"></i></a> ';
                    }
                },
            ],
            initComplete: function (settings, json) {

            }
        });
    },
    
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
        access_users.list(false);
    });

    $('.btnSearchAll').on('click', function () {
        access_users.list(true);
    });
    $('#data_list tbody').on('click', 'a[rel="delete"]', function () {
        $('.modal-title').find('i').removeClass().addClass('fas fa-edit');
        var tr = $("#data_list").DataTable().cell($(this).parents('td, li')).index();
        var data = $("#data_list").DataTable().row(tr.row).data();
        var parameters = new FormData();
        parameters.append('action', 'delete');
        parameters.append('id', data.id);
       
        url = "/security/access/users/delete/"+data.id+"/";
        submit_with_ajax(url, 'Notificación', '¿Estas seguro de eliminar el registro Nº ' + '<b style="color: #304ffe;">' + data.id + '</b>?', parameters, function () {
            access.ajax.reload();
        });
      });

    access_users.list(false);
});
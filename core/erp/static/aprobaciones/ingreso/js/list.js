var tblIngreso;
var input_daterange;

var incorp_aprob = {
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
        tblIngreso = $('#data_list').DataTable({
            responsive: true,
            scrollX: false,
            autoWidth: false,
            destroy: true,
            deferRender: true,
            ajax: {
                url: window.location.pathname,
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
            
            columns: [
                {"data": "usuario.username"},
                {"data": "cod_ingreso"},
                {"data": "tipo_ingreso.denominacion"},
                {"data": "proveedor.empresa"},
                {"data": "num_comprob"}, 
                {"data": "fecha_ingreso"},
                {"data": "subtotal"},
                {"data": "total"},
                {"data": "estado"},
                {"data": "id"},
            ],
            columnDefs: [
                  {
                    targets: [-3, -4],
                    class: 'text-center',
                    render: function (data, type, row) {
                        return parseFloat(data).toFixed(2)+ ' Bs.';
                    }
                  },
                  {
                    targets: [-2],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        if(row.estado.id == 'REC') return '<i class="fa fa-times-circle" data-toggle="tooltip" title="Rechazado" style="color:red; font-size: 12px;"><span style="display:none;">'+row.estado.name+'</span></i>';
                        if(row.estado.id == 'APR') return '<i class="fa fa-check-circle" data-toggle="tooltip" title="Aprobado" style="color:green; font-size: 12px;"><span style="display:none;">'+row.estado.name+'</span></i>';
                        if(row.estado.id == 'DIS') return '<i class="fa fa-pen" data-toggle="tooltip" title="En Creación" style="color:#ffc107; font-size: 12px;"><span style="display:none;">'+row.estado.name+'</span></i>';  
                    }
                    
                },
                {
                    targets: [-1],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        var buttons = '<a rel="VerDetIngre" class="btn btn-success btn-xs"><i class="fas fa-search"></i></a> ';
                        buttons += '<a href="/erp/ingreso/factura/pdf/' + row.id + '/" target="_blank" class="btn btn-info btn-xs"><i class="fas fa-file-pdf"></i></a> ';
                        buttons += '<a rel="estadoIngre" class="btn btn-primary btn-xs"><i class="fas fa-check-square"></i></a>';
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
        incorp_aprob.list(false);
    });

    $('#data_list tbody').on('click', 'a[rel="estadoIngre"]', function () {
        //$('#productos tbody').on('click', '.nombreclase', function () {
            var tr = $("#data_list").DataTable().cell($(this).parents('td, li')).index();
            var data = $("#data_list").DataTable().row(tr.row).data();
            $('.modal-title').find('i').removeClass().addClass('fas fa-clipboard-check');
          $('.modal-title').find('span').html('Cambio de Estado del Registro:  ' + '<span style="color: #b3e5fc;">' + data.cod_ingreso + '</span>');
          param_id=data.id;
          console.log(data);
          $('input[name="action"]').val('edit');
          $('input[name="id"]').val(data.id);
          $('select[name="estado"]').val(data.estado.id);
          $('select[name="almacen"]').val(data.almacen.id);
          $('#myModalStatusIng').modal('show');
      });
      $('#frmStatusIng').on('submit', function (e) {
        e.preventDefault();
        
        let myForm = document.getElementById('frmStatusIng');
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
            parameters.append('almacen', $('select[name="almacen"]').val());
        submit_with_ajax(url, 'Estimado usuario(a)', titulo, parameters, function (response) {
            console.log(parameters)
                $('#myModalStatusIng').modal('hide');
                sweet_info( 'El Registro Ha Sido '+text+' Con Exito');  
                tblIngreso.ajax.reload();
            });
    
    });    
    $('#data_list tbody')
        .on('click', 'a[rel="VerDetIngre"]', function () {
            var tr =  $("#data_list").DataTable().cell($(this).closest('td, li')).index();
            var data =  $("#data_list").DataTable().row(tr.row).data();            
            $('#tipo_incorp').text(data.tipo_ingreso.denominacion);
            $('#t_comprob').text(data.tipo_comprob.name);
            $('#nro_comprob').text(data.num_comprob);
            $('#almacen').text(data.almacen.nombre);
            $('#jefe').text(data.respon_almac);
            $('#prov').text(data.proveedor.empresa);
            $('#usuario').text(data.usuario.username);
            $('#obs').text(data.observacion);
            $('#fecha').text(data.fecha_ingreso);
            //Datatable
            $('#tblDetalleProd').DataTable({
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
                    search: "<button type='button' class='btn btn-sm'><i class='fa fa-search'></i></button>",
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
                   
                    {"data": "prod.nombre"},
                    {"data": "prod.descripcion"},
                    {"data": "precio"},
                    {"data": "cant"},
                    {"data": "subtotal"},
                ],
                columnDefs: [
                    {
                        targets: [-1, -3],
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
            $('#modaltitleproduc').find('span').html('Consulta Detalle de la Incorporación:  ' + data.cod_ingreso);
            $('#myModalDetProd').modal('show');
        })  
    incorp_aprob.list(false);
});
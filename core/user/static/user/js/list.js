var dttUser;
$(function () {
    dttUser = $('#data_list').DataTable({
        responsive: false,
        autoWidth: false,
        destroy: true,
        deferRender: true,
        ajax: {
            url: window.location.pathname,
            type: 'POST',
            data: {
                'action': 'searchdata'
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
            search: "<button class='btn ml-5 btn-sm'><i class='fa fa-search'></i></button>",
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
            {"data": "image"},
            {"data": "full_name"},
            {"data": "username"},
            {"data": "is_active"},
            {"data": "date_joined", className: "text-center"},
            {"data": "groups"},
            {"data": "id"},
        ],
        columnDefs: [
            {
                targets: [-7],
                class: 'text-center',
                orderable: false,
                render: function (data, type, row) {
                    return '<img src="' + row.image + '" class="img-fluid mx-auto d-block elevation-1 img-border" style="width: 27px; height: 27px; border-radius:  0.45rem;">';
                }
            },
            {
                targets: [-4],
                class: 'text-center',
                orderable: true,
                render: function (data, type, row) {
                    if(row.is_active)return '<span class="badge badge-success badge-pill" style="font-size: 11px;">'+'Activo'+'</span>'                
                    if(row.is_active == false)return '<span class="badge  badge-danger badge-pill" style="font-size: 11px;">'+'Inactivo'+'</span>'                    
                }
            },
            {
                targets: [-2],
                class: 'text-center',
                orderable: true,
                render: function (data, type, row) {
                    var html = '';
                    if (row.is_superuser){
                        return '<span class="badge badge-primary badge-pill f-11">'+ 'SuperUsuario' +'</span>'
                    }
                    $.each(row.groups, function (key, value) {
                        html += '<span class="badge badge-success badge-pill f-11">' + value.name + '</span> ';
                    });
                    return html;
                }
            },
            {
                targets: [-1],
                class: 'text-center',
                orderable: false,
                render: function (data, type, row) {   
                    var buttons = '<a href="/user/update/' + row.id + '/" class="btn btn-warning btn-xs"><i class="fas fa-edit"></i></a> ';
                    if (row.is_active) { buttons += '<a rel="inactivar" class="btn btn-orange btn-xs"><i class="fas fa-times-circle"></i></a> ';                        
                    }else { buttons += '<a rel="activar" class="btn btn-info btn-xs"><i class="fas fa-check-circle"></i></a> ';};   
                    buttons += '<a rel="detail" class="btn btn-success btn-xs"><i class="fas fa-search"></i></a> ';
                    buttons += '<a rel="access" class="btn btn-primary btn-xs"><i class="fas fa-shield-alt"></i></a> ';
                    buttons += '<a rel="delete" class="btn btn-danger btn-xs"><i class="fas fa-trash-alt"></i></a> ';
                    return buttons;                   
                    
                }
            },
        ],
        initComplete: function (settings, json) {

        }
    });
    $('#data_list tbody').on('click', 'a[rel="detail"]', function() {
		var tr = $("#data_list").DataTable().cell($(this).closest('td, li')).index();
		var data = $("#data_list").DataTable().row(tr.row).data();
        console.log(data);
		$("#detalle_user").modal('show');
        $('#detail_user').find('span').html('Información del Usuario');
        $('#detail_user').find('i').removeClass().addClass('fas fa-info-circle');
		$('#image').html('<img src="'+ data.image +'" style="width: 90px; height: 90px;" class="img-circle elevation-1" alt="User Image">');
		$('#username').text(data.username);
		$('#first_name').text(data.first_name);
		$('#last_name').text(data.last_name);	
		$('#dni').text(data.dni);	
		$('#email').text(data.email);
        if(data.is_active){
            $('#active').text('Activo');
        }else{
            $('#active').text('Inactivo');
        }
		$('#fecha').text(data.date_joined);	
		$('#sesion').text(data.last_login);	
        var groups = {
            get_groups: function () 
            {
                var group = [];        
                $.each(data.groups, function (key, value) {
                    group.push(value.name);
                });			
                return group;
            },            
        }
        $('#grupo').text(groups.get_groups());

        var permisos = '';
        for (var i = 0; i < data.user_permissions.length; i++) {
            permisos += '<span class="badge badge-primary justify-content input-flat" style="font-size: 13px;">' + data.user_permissions[i].name + '</span> ';
        }
        if (data.user_permissions == ''){
            $('#perm').text('Sin Permisos');
        }else{
            $('#perm').html(permisos);
        }        
        let perms = $('#tblPermsUser').DataTable({
            responsive: false,
            autoWidth: false,
            destroy: true,
            deferRender: true,
            paging: false,
            ajax: {
                url: window.location.pathname,
                type: 'POST',
                data: {
                    'action': 'search_detail',
                    'id': data.id
                },
                dataSrc: ""
            },
            language: {
                decimal: "",
                sLengthMenu: "Mostrar _MENU_ registros",
                emptyTable: "No hay información",
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
            info: false,
            columns: [
                {"data": "id", className:"text-center"},
                {"data": "name"},
            ],            
            initComplete: function (settings, json) {
        
            }
        });

	});
    $('#data_list tbody').on('click', 'a[rel="access"]', function() {
		var tr = $("#data_list").DataTable().cell($(this).closest('td, li')).index();
		var data = $("#data_list").DataTable().row(tr.row).data();
        console.log(data);
        $("#access_users").modal('show');
        $('#access_user').find('span').html('Accesos del Usuario');
        $('#access_user').find('i').removeClass().addClass('fas fa-shield-alt');
        $('#tblAccessUsers').DataTable({
            responsive: false,
            autoWidth: false,
            destroy: true,
            deferRender: true,
            ajax: {
                url: window.location.pathname,
                type: 'POST',
                data: {
                    'action': 'search_access',
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
                search: "<button class='btn ml-5 btn-sm'><i class='fa fa-search'></i></button>",
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
               
                {"data": "date_joined"},
                {"data": "time_joined"},
                {"data": "ip_address"},
                {"data": "browser", className: "text-left"},
                {"data": "device"},
                {"data": "type.name"},
            ],
            columnDefs: [                
                {
                    targets: [-1],
                    class: 'text-center',
                    render: function (data, type, row) {
                        if (row.type.id == 'success'){
                            return '<span class="badge badge-success-border badge-pill" style="font-size: 11px;">'+ data +'</span> ';
                        }
                        return '<span class="badge badge-danger-border badge-pill" style="font-size: 11px;">'+ data +'</span> ';
                    }
                },
            ],
            initComplete: function (settings, json) {

            }
        });

        

	});
    
    $('#data_list tbody').on('click', 'a[rel="delete"]', function () {
        $('.modal-title').find('i').removeClass().addClass('fas fa-edit');
        var tr = $("#data_list").DataTable().cell($(this).parents('td, li')).index();
        var data = $("#data_list").DataTable().row(tr.row).data();
        var parameters = new FormData();
        parameters.append('action', 'delete');
        parameters.append('id', data.id);
       
        url = "/user/delete/"+data.id+"/";
        submit_with_ajax(url, 'Notificación', '¿Estas seguro de eliminar al usuario ' + '<b style="color: #304ffe;">' + data.username + '</b>?', parameters, function () {
            sweet_info( 'El Registro Ha Sido Eliminado Con Exito');
            dttUser.ajax.reload();
        });
      });

      $('#data_list tbody').on('click', 'a[rel="activar"]', function () {
        $('.modal-title').find('i').removeClass().addClass('fas fa-check-circle');
        var tr = $("#data_list").DataTable().cell($(this).parents('td, li')).index();
        var data = $("#data_list").DataTable().row(tr.row).data();
        var parameters = new FormData();
        parameters.append('action', 'activar');
        parameters.append('id', data.id);       
        url = window.location.pathname;
        submit_with_ajax(url, 'Activar Usuario', '¿Estas seguro de activar al usuario ' + '<b style="color: #304ffe;">' + data.username + '</b>?', parameters, function () {
            sweet_info( 'El Registro Ha Sido Activado Con Exito');
            dttUser.ajax.reload();
        });
      });

      $('#data_list tbody').on('click', 'a[rel="inactivar"]', function () {
        $('.modal-title').find('i').removeClass().addClass('fas fa-check-circle');
        var tr = $("#data_list").DataTable().cell($(this).parents('td, li')).index();
        var data = $("#data_list").DataTable().row(tr.row).data();
        var parameters = new FormData();
        parameters.append('action', 'inactivar');
        parameters.append('id', data.id);       
        url = window.location.pathname;
        submit_with_ajax(url, 'Inactivar Usuario', '¿Estas seguro de inactivar al usuario ' + '<b style="color: #304ffe;">' + data.username + '</b>?', parameters, function () {
            sweet_info( 'El Registro Ha Sido Inactivado Con Exito');
            dttUser.ajax.reload();
        });
      });
    

      
});
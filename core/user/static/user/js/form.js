let tblPerms;

let user =
{
    data:
    {
        first_name: '',
        last_name: '',
        dni: '',
        email: '',
        username: '',
        password: '',
        is_active: '',
        image: '',
        groups: [],
        user_permissions: []
    },
    add: function (datos) {
        this.data.user_permissions.push(datos);
    },
};

$(function () {
    $('.btnPerms').on('click', function () {
        tblPerms = $('#permsTable').DataTable({
            responsive: false,
            autoWidth: false,
            destroy: true,
            paging: false,
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
            ajax: {
                url: window.location.pathname,
                type: 'POST',
                data: {
                    'action': 'search_perms',
                },
                dataSrc: ""
            },
            order: false,
            ordering: false,
            columns: [
                { "data": "id" },
                { "data": "perms" },
            ],
            columnDefs: [
                {
                    targets: [-2],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<label class="checkbox-container"><input class="permsCheck" type="checkbox" data-id="' + row.id + '" name="permissions" value="' + row.id + '"><span class="checkmark"></span></label>';
                    }
                },
                {
                    targets: [-1],
                    orderable: false,
                    render: function (data, type, row) {
                        return data;
                    }
                },
            ],
            initComplete: function (settings, json) {
            }
        });
        $('#permissionsModal').modal('show');
    });
    let arrayPerms = [];
    let cont = 0;
    //PARA QUE LOS PERMISOS QUE ESTAN EN EL ARREGLO APAREZCAN SELECCIONADOS CUANDO SE ABRE EL MODAL
    $("#permissionsModal").on('shown.bs.modal', function () {
        $.each(user.data.user_permissions, function (index, permission) {
            $('.permsCheck[value="' + permission + '"]').prop('checked', true);
        });
        cont = user.data.user_permissions.length;
        $('#numPerms').html(cont)
    });
    $('#permissionsModal').on('hidden.bs.modal', function (e) {
        cont = 0;
        arrayPerms = [];
        $('#numPerms').html(cont)
    })
    
    $('#seleccionar').on('click', function () {
        arrayPerms = [];
        $('#permsTable tbody input[type="checkbox"]').prop('checked', true);
        $('.permsCheck:checked').each(function () {
            let rowPerm = $(this).val();
            arrayPerms.push(rowPerm)
            cont = arrayPerms.length
            $('#numPerms').html(cont)
            //console.log(cont);
        });

    });
    $('#deseleccionar').on('click', function () {
        $('#permsTable tbody input[type="checkbox"]').prop('checked', false);
        cont = 0;
        $('#numPerms').html(cont)
    });

    //PARA GUARDAR LOS ID DE LOS PERMISOS CUANDO SELECCIONO EL CHECK    
    $('#permsTable').on('change', 'input[type="checkbox"]', function () {
        var tr = $("#permsTable").DataTable().cell($(this).closest('td, li')).index();
        var idRegistro = $("#permsTable").DataTable().row(tr.row).data();

        if ($(this).is(':checked')) {
            arrayPerms.push(idRegistro);
            cont++

        } else {
            let index = arrayPerms.indexOf(idRegistro);
            if (index > -1) {
                arrayPerms.splice(index, 1);
                cont -= 1
            }
        }
        $('#numPerms').html(cont)
        // console.log(arrayPerms);
        // console.log(cont);
    });

    $('#assignPerms').on('click', function () {
        user.data.user_permissions = []
        $('.permsCheck:checked').each(function () {
            var rowData = $(this).val();
            user.data.user_permissions.push(rowData);
        });
        console.log('asdasdasdasdasd'); // [1, 2, 3, 4, 5]
        $('#permissionsModal').modal('hide');
        $('#lenghtPerm').html('Permisos Seleccionados ' + user.data.user_permissions.length)
    });
    if (user.data.user_permissions.length) {
        $('#lenghtPerm').html('Permisos Seleccionados ' + user.data.user_permissions.length)
    } else {
        $('#lenghtPerm').html('Buscar Permisos')
    }
    $('.select2').select2({
        theme: "bootstrap4",
        language: 'es',
        maximumSelectionLength: 1
    });
    //ENVIO DE FORMULARIO A TRAVÉS DE AJAX
    $('#formuser').on('submit', function (e) {
        e.preventDefault();
        user.data.first_name = $('input[name="first_name"]').val();
        user.data.last_name = $('input[name="last_name"]').val();
        user.data.dni = $('input[name="dni"]').val();
        user.data.email = $('input[name="email"]').val();
        user.data.username = $('input[name="username"]').val();
        user.data.password = $('input[name="password"]').val();
        user.data.is_active = $('#idactive').prop("checked")
        let grupo = $('select[name="groups"]').val();
        user.data.groups.push(parseInt(grupo))

        let filename = "";
        if ($('input[name="image"]').val() == '') {
            // produc_catalago.items.imagen= $imagenPrevisualizacion.src;
            filename = $imagenPrevisualizacion.src.replace(/.*(\/|\\)/, '');
            user.data.image = "users/img/" + filename;
        } else {
            filename = $('input[name="image"]').val().replace(/.*(\/|\\)/, '');
            user.data.image = "users/img/" + filename;
        }

        let parameters = new FormData();
        parameters.append('action', $('input[name="action"]').val());
        parameters.append('data', JSON.stringify(user.data));
        let url = "";
        let titulo = "";
        let text = "";

        let param_id = $('input[name="id"]').val();
        if ($('input[name="action"]').val() == 'add') {
            url = '/user/add/';
            titulo = "¿Estas seguro de crear el usuario?";
            text = "Creado";
        } else {
            url = "/user/update/" + param_id + "/";
            titulo = "¿Estas seguro de actualizar los datos del usuario?";
            text = "Modificado";
        }
        submit_with_ajax(url, 'Estimado(a) Usuario  ', titulo, parameters, function (response) {
            console.log(user.data)
            sweet_info('El Usuario Ha Sido ' + text + ' Con Exito');
            console.log(user.data.user_permissions);
            setTimeout(() => {
                location.href = '/user/list/';
            }, 1200);
        });
    });
});


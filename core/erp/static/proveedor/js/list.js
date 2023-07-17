var dttProveedor;
$(function () {
    dttProveedor = $('#data_list').DataTable({
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
            {"data": "id"},
            {"data": "full_name"},
            {"data": "documento"},
            {"data": "email"},
            {"data": "tlf"},
            {"data": "id"},
        ],
        columnDefs: [
            {
                targets: [-1],
                class: 'text-center',
                orderable: false,
                render: function (data, type, row) {
                    var buttons = '<a href="#" rel="edit" class="btn btn-warning btn-xs btnEdit"><i class="fas fa-edit"></i></a> ';
                    buttons += '<a href="#" rel="delete" class="btn btn-danger btn-xs"><i class="fas fa-trash-alt"></i></a>';
                    return buttons;
                }
            },
        ],
        initComplete: function (settings, json) {

        }
    });
    $('.btnAdd').on('click', function () {
        $('input[name="action"]').val('add');
        $('.modal-title').find('span').html('Creación de un Proveedor');
        $('.modal-title').find('i').removeClass().addClass('fas fa-plus');
        $('#empresa').focus();
        $('#myModalProveedor').modal('show');
    });

    $('#myModalProveedor').on('hidden.bs.modal', function (e) {
        $('#frmProvee').trigger('reset');
        const inputs = document.querySelectorAll('#myModalProveedor .txt_field input, #myModalProveedor .txt_field select, #myModalProveedor .txt_field textarea');
         inputs.forEach(input => input.classList.remove('input-has-text')
            );
        });
    });
    
    $("#myModalProveedor").on('shown.bs.modal', function(){
        const inputs = document.querySelectorAll('#myModalProveedor .txt_field input, #myModalProveedor .txt_field select, #myModalProveedor .txt_field textarea');
         inputs.forEach(input => { if (input.value.trim() !== '') { input.classList.add('input-has-text'); }
            input.addEventListener('input', () => { if (input.value.trim() !== '') { input.classList.add('input-has-text');
            } else { input.classList.remove('input-has-text');  }
            });
        });
    });

    $('#frmProvee').on('submit', function (e) {
        e.preventDefault();
        //var parameters = new FormData();
        //url: '{% url 'erp:product_create' %}',
        //url = "product/update/"+datos.id+"",
        //let myForm = document.querySelector('formproduc');
        let myForm = document.getElementById('frmProvee');
        let parameters = new FormData(myForm);
        //let parameters = new FormData(myForm);
        //var parameters = new FormData(form);
        let url="";
        let titulo="";
        if  ($('input[name="action"]').val() == 'add'){
            url =  '/erp/proveedor/add/';
            titulo="¿Estas seguro de crear el proveedor?";
        }else{
            url = "/erp/proveedor/update/"+param_id+"/";
            titulo="¿Estas seguro de actualizar los datos del proveedor?";
        }
    
       // var url = "/product/add/";
        submit_with_ajax(url, 'Estimado(a) Usuario  ', titulo, parameters, function () {
           $('#myModalProveedor').modal('hide');
           dttProveedor.ajax.reload();
          // $('#productos').data.reload();
         //  tblClient.ajax.reload();
        
        });
      });
$('#data_list tbody').on('click', 'a[rel="edit"]', function () {
    //$('#productos tbody').on('click', '.nombreclase', function () {
        var tr = $("#data_list").DataTable().cell($(this).parents('td, li')).index();
        var data = $("#data_list").DataTable().row(tr.row).data();
        $('.modal-title').find('i').removeClass().addClass('fas fa-edit');
      $('.modal-title').find('span').html('Edición del Proveedor:  ' + data.empresa );
      param_id=data.id;
      console.log(data)
      $('input[name="action"]').val('edit');
      $('input[name="id"]').val(data.id);
      $('input[name="empresa"]').val(data.empresa);
      $('select[name="tipo_docu"]').val(data.tipo_docu.id);
      $('input[name="documento"]').val(data.documento);
      $('input[name="ramo"]').val(data.ramo);
      $('input[name="tlf"]').val(data.tlf);
      $('input[name="ced_repre"]').val(data.ced_repre);
      $('input[name="represen"]').val(data.represen);
      $('input[name="email"]').val(data.email);
      $('textarea[name="direccion"]').val(data.direccion);
            
      $('#myModalProveedor').modal('show');      
  });
  $('#data_list tbody').on('click', 'a[rel="delete"]', function () {
    $('.modal-title').find('i').removeClass().addClass('fas fa-edit');
    var tr = $("#data_list").DataTable().cell($(this).parents('td, li')).index();
    var data = $("#data_list").DataTable().row(tr.row).data();
    var parameters = new FormData();
    parameters.append('action', 'delete');
    parameters.append('id', data.id);
   
    url = "/erp/proveedor/delete/"+data.id+"/";
    submit_with_ajax(url, 'Notificación', '¿Estas seguro de eliminar al proveedor?  ' + '<b style="color: #304ffe;">' + data.empresa + '</b>', parameters, function () {
        dttProveedor.ajax.reload();
    });
  });

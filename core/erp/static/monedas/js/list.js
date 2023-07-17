var dttMonedas;
$(function () {
    dttMonedas = $('#data_list').DataTable({
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
            {"data": "id"},
            {"data": "codigo"},
            {"data": "simbolo"},
            {"data": "moneda"},
            {"data": "pais"},
            {"data": "tasa_cambio"},
            {"data": "status"},
            {"data": "id"},
        ],
        columnDefs: [
            {
                targets: [-2],
                class: 'text-center',
                orderable: false,
                render: function (data, type, row) {
                    if(row.status == true)return '<a><i class="fa fa-check" style="color:green"><span style="display:none;">'+'activo'+'</span></i></a>'
                    if(row.status == false)return '<a><i class="fa fa-times" style="color:red"><span style="display:none;">'+'inactivo'+'</span></i></a>'
                }
            },
            {
                targets: [-1],
                class: 'text-center',
                orderable: false,
                render: function (data, type, row) {
                    var buttons = '<a rel="edit" class="btn btn-warning btn-xs btnEdit"><i class="fas fa-edit"></i></a> ';
                    buttons += '<a rel="delete" class="btn btn-danger btn-xs"><i class="fas fa-trash-alt"></i></a>';
                    return buttons;
                }
            },
        ],
        initComplete: function (settings, json) {

        }
    });
    $('.btnAdd').on('click', function () {
        $('input[name="action"]').val('add');
        $('#titlemoneda').find('span').html('Creando Nueva Moneda');
        $('#titlemoneda').find('i').removeClass().addClass('fas fa-plus');
        $('#idcod').focus();
        $('#myModalMoneda').modal('show');
    });
    
    $('#myModalMoneda').on('hidden.bs.modal', function (e) {
        $('#frmMoneda').trigger('reset');
    })
   
});
$('#frmMoneda').on('submit', function (e) {
    e.preventDefault();
    
    let myForm = document.getElementById('frmMoneda');
    let parameters = new FormData(myForm);
    let param_id= $('input[name="id"]').val()
    console.log(param_id);
    let url="";
    let titulo="";
    if  ($('input[name="action"]').val() == 'add'){
        url =  '/erp/monedas/add/';
        titulo="¿Estas seguro de crear la moneda?";
    }else{
        url = "/erp/monedas/update/"+param_id+"/";
        titulo="¿Estas seguro de actualizar la moneda?";
    }
    submit_with_ajax(url, 'Estimado usuario(a)', titulo, parameters, function (response) {
            $('#myModalMoneda').modal('hide'); 
            dttMonedas.ajax.reload();

        });
});
// $('#data_list tbody').on('click', 'a[rel="edit"]', function () {
//     //$('#productos tbody').on('click', '.nombreclase', function () {
//         var tr = $("#data_list").DataTable().cell($(this).parents('td, li')).index();
//         var data = $("#data_list").DataTable().row(tr.row).data();
//         $('.modal-title').find('i').removeClass().addClass('fas fa-edit');
//       $('.modal-title').find('span').html('Edición del Concepto:  ' + '<b style="color: #ffffff;">' + data.codigo + '</b>');
//       param_id=data.id;
//       $('input[name="action"]').val('edit');
//       $('input[name="id"]').val(data.id);
//       $('input[name="codigo"]').val(data.codigo);
//       $('input[name="moneda"]').val(data.moneda);
//       $('input[name="simbolo"]').val(data.simbolo);
//       $('input[name="pais"]').val(data.pais);
//       $('input[name="tasa_cambio"]').val(data.tasa_cambio);
//       $('#idstatus').prop("checked").val(data.status)     
//     //   $('select[name="Tipo_conc"]').val(data.tipo_conc.id);
//     //   $('#idusuario').val(data.usuario).trigger('change.select2');
            
//       $('#myModalMoneda').modal('show');      
//   });
$('#data_list tbody').on('click', 'a[rel="edit"]', function () {
    //$('#productos tbody').on('click', '.nombreclase', function () {
        var tr = $("#data_list").DataTable().cell($(this).parents('td, li')).index();
        var data = $("#data_list").DataTable().row(tr.row).data();
        $('.modal-title').find('i').removeClass().addClass('fas fa-edit');
      $('.modal-title').find('span').html('Edición de la Moneda:  ' + '<b style="color: #ffffff;">' + data.codigo + '</b>');
      param_id=data.id;
      console.log(data);
      $('input[name="action"]').val('edit');
      $('input[name="id"]').val(data.id);
      $('input[name="codigo"]').val(data.codigo);
      $('input[name="moneda"]').val(data.moneda);
      $('input[name="simbolo"]').val(data.simbolo);
      $('input[name="pais"]').val(data.pais);
      $('input[name="tasa_cambio"]').val(data.tasa_cambio);
      if (data.status == true){
        //$("#idactivo").val(1).change();
        $("#idstatus").prop('checked', 1);
      }else{
        //$("#idactivo").val(0).change();
        $("#idstatus").prop('checked', 0);
      }      
    $('#myModalMoneda').modal('show');
});
  $('#data_list tbody').on('click', 'a[rel="delete"]', function () {
    $('.modal-title').find('i').removeClass().addClass('fas fa-edit');
    var tr = $("#data_list").DataTable().cell($(this).parents('td, li')).index();
    var data = $("#data_list").DataTable().row(tr.row).data();
    var parameters = new FormData();
    parameters.append('action', 'delete');
    parameters.append('id', data.id);
   
    url = "/erp/codbien/delete/"+data.id+"/";
    submit_with_ajax(url, 'Notificación', '¿Estas seguro de eliminar el Almacen?  ' + '<b style="color: #304ffe;">' + data.codbien + '</b>', parameters, function () {
        dttCodbienes.ajax.reload();
    });
});

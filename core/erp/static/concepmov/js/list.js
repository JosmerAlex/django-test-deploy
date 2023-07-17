var dttConcepMov;
$(function () {
    dttConcepMov = $('#data_list').DataTable({
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
            {"data": "codigo"},
            {"data": "denominacion"},
            {"data": "estado.name"},
            {"data": "tipo_conc.name"},
            {"data": "id"},
        ],
        columnDefs: [
            {
                targets: [-3],
                class: 'text-center',
                orderable: false,
                render: function (data, type, row) {
                    if(row.estado.id == 'ACT')return '<span class="badge rounded-pill badge-success" style="font-size: 10px;">'+data+'</span>'
                    if(row.estado.id == 'INA')return '<span class="badge rounded-pill badge-danger" style="font-size: 10px;">'+data+'</span>'
                    
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
        $('#titleConcept').find('span').html('Creando Concepto de Movimiento');
        $('#titleConcept').find('i').removeClass().addClass('fas fa-plus');
        $('#idCod').focus();
        $('#myModalConcepMov').modal('show');
    });
    $("#myModalConcepMov").on('shown.bs.modal', function(){
        const inputs = document.querySelectorAll('#myModalConcepMov .txt_field input, #myModalConcepMov .txt_field select');
        inputs.forEach(input => { if (input.value.trim() !== '') { input.classList.add('input-has-text'); }
            input.addEventListener('input', () => { if (input.value.trim() !== '') { input.classList.add('input-has-text');
            } else { input.classList.remove('input-has-text'); }
            });
        });
    });
    $('#myModalConcepMov').on('hidden.bs.modal', function (e) {
        $('#frmConcepMov').trigger('reset');
        const inputs = document.querySelectorAll('#myModalConcepMov .txt_field input, #myModalConcepMov .txt_field select');        
         inputs.forEach(input => input.classList.remove('input-has-text'));
    })
   
});
$('#frmConcepMov').on('submit', function (e) {
    e.preventDefault();
    
    let myForm = document.getElementById('frmConcepMov');
    let parameters = new FormData(myForm);
    let param_id= $('input[name="id"]').val()
    let url="";
    let titulo="";
    if  ($('input[name="action"]').val() == 'add'){
        url =  '/erp/concepto/add/';
        titulo="¿Estas seguro de crear el Concepto?";
    }else{
        url = "/erp/concepto/update/"+param_id+"/";
        titulo="¿Estas seguro de actualizar el Concepto?";
    }
    submit_with_ajax(url, 'Estimado usuario(a)', titulo, parameters, function (response) {
            $('#myModalConcepMov').modal('hide'); 
            dttConcepMov.ajax.reload();
        });

});
$('#data_list tbody').on('click', 'a[rel="edit"]', function () {
    //$('#productos tbody').on('click', '.nombreclase', function () {
        var tr = $("#data_list").DataTable().cell($(this).parents('td, li')).index();
        var data = $("#data_list").DataTable().row(tr.row).data();
        $('.modal-title').find('i').removeClass().addClass('fas fa-edit');
      $('.modal-title').find('span').html('Edición del Concepto:  ' + '<b style="color: #ffffff;">' + data.codigo + '</b>');
      param_id=data.id;
      $('input[name="action"]').val('edit');
      $('input[name="id"]').val(data.id);
      $('input[name="codigo"]').val(data.codigo);
      $('input[name="denominacion"]').val(data.denominacion);
      $('#idestado').val(data.estado.id).trigger('change.select2');
      $('#idtipo_conc').val(data.tipo_conc.id).trigger('change.select2');
    //   $('select[name="Tipo_conc"]').val(data.tipo_conc.id);
    //   $('#idusuario').val(data.usuario).trigger('change.select2');
            
      $('#myModalConcepMov').modal('show');      
  });
  $('#data_list tbody').on('click', 'a[rel="delete"]', function () {
    var tr = $("#data_list").DataTable().cell($(this).parents('td, li')).index();
    var data = $("#data_list").DataTable().row(tr.row).data();
    var parameters = new FormData();
    parameters.append('action', 'delete');
    parameters.append('id', data.id);
   
    url = "/erp/concepto/delete/"+data.id+"/";
    submit_with_ajax(url, 'Notificación', '¿Estas seguro de eliminar el Concepto?  ' + '<b style="color: #304ffe;">' + data.denominacion + '</b>', parameters, function () {
        dttConcepMov.ajax.reload();
    });
  });

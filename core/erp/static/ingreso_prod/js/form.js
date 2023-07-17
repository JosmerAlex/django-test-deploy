var tblProducts;
var tblSearchProducts;   

var ingresos = 
{
    items: 
    {
        cod_ingreso: '',
        almacen: '',
        respon_almac: '',
        tipo_ingreso: '',
        proveedor: '',
        tipo_comprob: '',
        num_comprob: '',
        subtotal: 0.00,
        iva: 0.00,
        total: 0.00,
        fecha_ingreso: '',
        usuario: '',
        observ: '',
        estado: '',
        productos: [],
        seriales: [],        
        lotes: [] 
    },
    get_ids: function () 
    {
        var ids = [];
        $.each(this.items.productos, function (key, value) {
            ids.push(value.id);
        });
        return ids;
    },
    calcula_guia_ingreso: function () {
        var subtotalIVA = 0.00;
        var subtotal = 0.00;
        var total= 0.00;
        var costoiva=0.00;
        
        //var iva = $('#iva').val();

        $.each(this.items.productos, function (pos, dict) {
            dict.pos = pos;
            costoiva = parseFloat(dict.precio)  * parseFloat(dict.iva);
            dict.subtotal = (parseFloat(dict.precio) + costoiva) * dict.cant;
            subtotal += dict.subtotal;
            subtotalIVA= subtotalIVA + costoiva;
        });
        
        total= subtotal;
        subtotal=subtotal-subtotalIVA
        $('input[name="subtotal"]').val(subtotal.toFixed(2));
        $('input[name="ivacalc"]').val(subtotalIVA.toFixed(2));
        $('input[name="total"]').val(total.toFixed(2));
        
    },

    add: function (item) {
        this.items.productos.push(item);
        this.list();
    },

    //este metodo lo utilizo para poder listar los productos al datatable
    list: function () 
    {
        this.calcula_guia_ingreso();
        tblProducts = $('#tblProducts').DataTable({
            responsive: false,
            autoWidth: false,
            destroy: true,
            deferRender: true,            
            data: this.items.productos,
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
                  next: "<span class='fa fa-angle-double-right'></span>",
                  previous: "<span class='fa fa-angle-double-left'></span>",
                },
                buttons: {
                copy: "Copiar", 
                print: "Imprimir",
                },
            },
            order: false,
            paging: false,
            ordering: false,
            info: false,
            searching: false,
            columns: [
                {"data": "id"},
                {"data": "codigo"},
                {"data": "full_name", className: "text-left"},
                {"data": "precio"},
                {"data": "cant"},
                {"data": "iva"},
                {"data": "subtotal"},
            ],
            columnDefs: [
                {
                    targets: [0],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<a rel="deleteprod" class="btn btn-danger btn-xs btn-rounded" style="color: white;"><i class="fas fa-trash-alt"></i></a>';
                    }
                },
                {
                    targets: [-1],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return parseFloat(data).toFixed(2);
                    }
                },
                {
                    targets: [-2],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        if(row.pagaimpuesto){
                            return '<input type="text" class="form-control form-control-sm input-flat" name="iva" style="text-align: center; font-size: 11px; padding-left:4px; padding-right:4px; height: 24px;" autocomplete="off" value="' + row.iva + '">';
                        }else{
                            return '<input type="text" disabled=true class="form-control form-control-sm input-flat" name="iva" style="text-align: center; font-size: 11px; padding-left:4px; padding-right:4px; height: 24px;" autocomplete="off" value="' + row.iva + '">';
                        }
                         
                    }
                },                            
                {
                    targets: [-3],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {                        
                        return '<input type="text" class="form-control input-flat" style="font-size: 11px; height: 24px;" name="cant" autocomplete="off" id="cantidad" value="' + row.cant + '">';
                    }
                },                
                {
                    targets: [-4],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<input type="text" class="form-control input-flat" name="precio" style="font-size: 11px; height: 24px;" autocomplete="off" value="' + row.precio + '">';
                    }
                },                                
               
            ],
            rowCallback(row, data, displayNum, displayIndex, dataIndex) {
                
            },
            initComplete: function (settings, json) {

            }
        });
    },
};

//esta funcion me permite dar un mejor formato a los select2
function formatRepo(repo) {    
    if (repo.loading) {
        return repo.text;
    }
    if (!Number.isInteger(repo.id)) {
        return repo.text;
    }    
    var option = $(
        '<div class="wrapper container">' +
        '<div class="row">' +
        '<div class="col-lg-1">' +
        '<img src="' + repo.imagen + '" class="img-fluid img-thumbnail d-block mx-auto rounded">' +
        '</div>' +
        '<div class="col-lg-11 text-left shadow-sm">' +
        '<p style="margin-bottom: 0;">' +
        '<b>NOMBRE:</b> ' + repo.nombre +' / '+ repo.descripcion+ '<br>' +
        '<b>CATEGORÍA:</b>' + repo.categorias.nombre  +'<br>' +
        '</p>' +
        '</div>' +
        '</div>' +
        '</div>');
    return option;
}
$(function () {      
    $('.select2').select2({
        theme: "bootstrap4",
        language: 'es'
    }); 
    $('#fecha_ingreso').datetimepicker({
        format: 'YYYY-MM-DD',
        date: moment().format("YYYY-MM-DD"),
        locale: 'es',
       // minDate: moment().format("YYYY-MM-DD")
    });  
    $('#f_venc').datetimepicker({
        format: 'YYYY-MM-DD',
        date: moment().format("YYYY-MM-DD"),
        locale: 'es',
        // widgetPositioning: {
        //     horizontal: 'auto',
        //     vertical: 'bottom'
        //   }
    });

    $('select[name="almacen"]').on('change', function () {
        var id = $(this).val();        
        var options = '<option value="">-----------</option>';
        if (id === '') {
            $('input[name="respon_almac"]').val('');
            return false;
        }
        $.ajax({
            url: window.location.pathname,
            type: 'POST',
            data: {
                'action': 'search_responalmac',
                'id': id
            },
            dataType: 'json',
        }).done(function (data) {
            if (!data.hasOwnProperty('error')) {
               
                $('input[name="respon_almac"]').val(data[0].responsable);
                
                return true;
            }
            message_error(data.error);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert(textStatus + ': ' + errorThrown);
        }).always(function (data) {

        });
    });  

    $('.btnAddProvee').on('click', function () {
        $('input[name="action"]').val('add');
        $('.modal-title').find('span').html('Creación de un Proveedor');
        $('.modal-title').find('i').removeClass().addClass('fas fa-plus');
        $('#empresa').focus();
        $('#myModalProveedor').modal('show');
    });

    $('#myModalProveedor').on('hidden.bs.modal', function (e) {
        $('#frmProvee').trigger('reset');
    })

    $('#frmProvee').on('submit', function (e) {
        e.preventDefault();
        var parameters = new FormData(this);
        parameters.append('action', 'create_proveedor');
        submit_with_ajax(window.location.pathname, 'Notificación',
            '¿Estas seguro de crear al siguiente Proveedor?', parameters, function (response) {                
                var newOption = new Option(response.full_name, response.id, false, true);
               $('select[name="proveedor"]').append(newOption).trigger('change');
               $('#myModalProveedor').modal('hide');
            });
    });

    $('.btnAddConcep').on('click', function () {
        $('input[name="action"]').val('add');
        $('.modal-title').find('span').html('Creación de un Concepto');
        $('.modal-title').find('i').removeClass().addClass('fas fa-plus');
        $('#codigo').focus();
        $('#myModalConcepMov').modal('show');
    });

    $('#myModalConcepMov').on('hidden.bs.modal', function (e) {
        $('#frmConcepMov').trigger('reset');
    })

    $('#frmConcepMov').on('submit', function (e) {
        e.preventDefault();
        var parameters = new FormData(this);
        parameters.append('action', 'create_concepto');
        submit_with_ajax(window.location.pathname, 'Notificación',
            '¿Estas seguro de crear el siguiente Concepto?', parameters, function (response) {
                var newOption = new Option(response.full_name, response.id, false, true);                
               $('select[name="tipo_ingreso"]').append(newOption).trigger('change');
               $('#myModalConcepMov').modal('hide');               
            });
    });

    $('.btnRemoveAll').on('click', function () {
        if (ingresos.items.productos.length === 0) return false;
        alert_action('Notificación', '¿Estas seguro de eliminar todos los items de tu detalle?', function () {
            ingresos.items.productos = [];
            ingresos.list();
        }, function () {

        });
    }); 
    
    // function seriales(cant, code, name, category, id) {
    //     $('#code').html(code);
    //     $('#name').html(name);
    //     $('#category').html(category);
    //     $('#cant').html(cant);        
    //     let inputs = '';
    //     for (let i = 0; i < cant; i++) {
    //         inputs += '<tr>'
    //         inputs+='<td>'+'<input type="text"  class="form-control border-0 input-flat" style="font-size:12px; height: 28px;" name="serial-'+i+'" placeholder="Ingrese el serial">'+'</td>'            
    //         inputs+='</tr>';
    //     }       
    //     return inputs;
    // }
    // function btnSerial(idProd){
    //     $('.btnSerial').on('click', function (){                             
    //         $('#tbl_serials input').each(function(){   
    //             let seriales={};              
    //             let value = $(this).val();
    //             seriales['prod_id']=idProd;
    //             seriales['serial']=value;
    //             ingresos.items.seriales.push(seriales);
    //         });
    //         $('#myModalSerial').modal('hide');                
    //         console.log(ingresos.items.seriales);
    //     });  
    // }
    // function btnSerial(id){            
        // function btnSerial(idProd) {
        //     $('.btnSerial').on('click', function () {
        //       let serials = [];
        //       $('#tbl_serials input').each(function () {
        //         let value = $(this).val();
        //         serials.push(value);
        //       });
        //       let ingreso = {
        //         prod_id: idProd,
        //         seriales: serials
        //       };
        //       ingresos.items.seriales.push(ingreso);
          
        //       $('#myModalSerial').modal('hide');
        //       console.log(ingresos.items.seriales);
        //     });
        //   }
    // }
    
    
    // function serial(cant, code, name, category) {
    //     $('#code').html(code);
    //     $('#name').html(name);
    //     $('#category').html(category);
    //     $('#cant').html(cant);
    //     let html = '<table class="table table-sm table-bordered" style="width:100%;" id="tblSerial">';
    //     html += '<thead style="background-color: #699ac9; color: #fff;">';
    //     html += '<tr class="text-center" style="color: #fff">'
    //         if (cant==1){
    //             html += '<th class="thw" scope="col">INGRESE EL SERIAL</th>';
    //         }else{
    //             html += '<th class="thw" scope="col">INGRESE LOS SERIALES</th>';
    //         }
    //     html += '<tr>'        
    //     html += '</thead>';
    //     html += '<tbody>';
    //     for (let i = 1; i <= cant; i++) {
    //         html+='<tr>'
    //         html+='<td>'+'<input type="text" class="form-control border-0 input-flat" style="font-size:12px; height: 28px;" name="serial-'+i+'" placeholder="Ingrese el serial">'+'</td>'            
    //         html+='</tr>';
    //     }
    //     html += '</tbody>';  
    //     html += '</table>';  
    //     return html;
        
    // }   
    
    
    
    
      //FUNCIÓN QUE GENERA LOS INPUTS DE MANERA DINAMICA EN EL TABLE     
      
      function seriales(cant, code, name, category, idProd) {
        $('#code').html(code);
        $('#name').html(name);
        $('#category').html(category);
        $('#cant').html(cant);
        $('#btnAssign').html('<button type="button" class="btn btn-primary btn-block input-flat btn-sm btnSerial" data-id="' + idProd + '">Guardar</button>');
        let inputs = '';
        for (let i = 0; i < cant; i++) {
            inputs += '<tr>'
            inputs+='<td>'+'<input type="text"  class="form-control border-0 input-flat" style="font-size:12px; height: 28px;" name="serial-'+i+'" placeholder="Ingrese el serial">'+'</td>'            
            inputs+='</tr>';            
        }       
        $('.btnSerial').on('click', function () {
            let id = $(this).data('id');
            addSerial(id);
            $('#myModalSerial').modal('hide');
            
          });
        return inputs;        
      }
      //FUNCIÓN QUE AGREGA LOS DATOS AL ARRAY
      function addSerial(idProd) {
        $('#tbl_serials input').each(function () {
          let value = $(this).val();
          ingresos.items.seriales.push({ prod_id: idProd, serial: value });
        });      
        console.log(ingresos.items.seriales);
      }
      //FUNCIÓN QUE GENERA EL BOTÓN Y ENVIA LOS DATOS A LA FUNCIÓN addLotes
      function lotes(code, name, category, idProd) {
        $('#codeProd').html(code);
        $('#nameProd').html(name);
        $('#categoryProd').html(category);
        $('#btnLotes').html('<button type="button" class="btn btn-primary btn-block input-flat btn-sm btnLotes" data-id="' + idProd + '">Asignar Lote</button>');        
        $('.btnLotes').on('click', function () {
            let listLotes = []
            let dataLote = {}
            let id_prod = $(this).data('id');
            let lote = $('#id_nro').val();           
            let fecha_venc = $('#fecha_venc').val();
            dataLote['lote'] = lote;
            dataLote['fecha_venc'] = fecha_venc;
            listLotes.push(dataLote);
            console.log(fecha_venc);
            addLotes(id_prod, listLotes);
            $('#myModalLotes').modal('hide');            
          });              
      }
      $('#myModalLotes').on('hidden.bs.modal', function (e) {
        $('#frmLotes').trigger('reset');
      })
      function addLotes(idProd, lotes) {
        lotes.forEach(lote => {
            ingresos.items.lotes.push({ prod_id: idProd, nro_lote: lote.lote, fecha: lote.fecha_venc });
        });        
        console.log(ingresos.items.lotes);
      }

    //   function addSerial(idProd) {
    //     let seriales = [];
    //     $('#tbl_serials input').each(function () {
    //       let value = $(this).val();
    //       seriales.push(value);
    //     });      
    //     let ingreso = {
    //       prod_id: idProd,
    //       seriales: seriales
    //     };
    //     let index = serial.detail.findIndex(item => item.prod_id === idProd);
    //     if (index === -1) {
    //         serial.detail.push(ingreso);
    //     } else {
    //         serial.detail[index] = ingreso;
    //     }      
    //     $('#myModalSerial').modal('hide');
    //     console.log(serial.detail);
    //   }
    
    $('#tblProducts tbody').on('click', 'a[rel="deleteprod"]', function () {
            let tr = tblProducts.cell($(this).closest('td, li')).index();
            alert_action('Notificación', '¿Estas seguro de eliminar el producto de tu detalle?',
                function () {                   
                    ingresos.items.productos.splice(tr.row, 1);
                    ingresos.list();
                }, function () {
                });
        }).on('change', 'input[name="cant"]', function () {
            if ($(this).val() < 1)
            {
                message_error('La Cantidad debe se mayor a 0');
                return false; 
            } 
            if ($(this).val() == '') 
            {
                message_error('La Cantidad de Producto no puede quedar vacia'); 
                return false; 
            }
            let cant = parseInt($(this).val());
            console.log(cant);
            let tr = tblProducts.cell($(this).closest('td, li')).index();
            ingresos.items.productos[tr.row].cant = cant;
            let prod = ingresos.items.productos[tr.row];
            let code = prod.codigo;
            let id = prod.id;
            let name = prod.nombre;
            let category = prod.categorias.nombre;
            ingresos.calcula_guia_ingreso();
            $('td:eq(6)', tblProducts.row(tr.row).node()).html(ingresos.items.productos[tr.row].subtotal.toFixed(2));     
            if (prod.serie){
                $("#myModalSerial").modal('show');
                $('#serials').html(seriales(cant, code, name, category, id));                                
            }            
            if(prod.lote){
                $("#myModalLotes").modal('show');                
                lotes(code, name, category, id)                  
            }                   
              
        }).on('change', 'input[name="precio"]', function () {
            
            if ($(this).val() == '') 
            {
                message_error('El Precio no puede quedar vacio'); 
                return false; 
            }
            var precio = parseFloat($(this).val());
            var tr = tblProducts.cell($(this).closest('td, li')).index();
            ingresos.items.productos[tr.row].precio = precio;
            ingresos.calcula_guia_ingreso();
            $('td:eq(6)', tblProducts.row(tr.row).node()).html(ingresos.items.productos[tr.row].subtotal.toFixed(2));
        }).on('change', 'input[name="iva"]', function () {
            var iva = parseFloat($(this).val());
            console.log(iva);
            var tr = tblProducts.cell($(this).closest('td, li')).index();
            ingresos.items.productos[tr.row].iva = iva;
            ingresos.calcula_guia_ingreso();
            $('td:eq(6)', tblProducts.row(tr.row).node()).html(ingresos.items.productos[tr.row].subtotal.toFixed(2));
        
        }).on('change keyup', 'input[name="fecha_venc"]', function () {
            var fecha_venc = $(this).val();
            console.log(fecha_venc);
            var tr = tblProducts.cell($(this).closest('td, li')).index();
            ingresos.items.productos[tr.row].fecha_venc = fecha_venc;
            
        }).on('change keyup', 'input[name="nro_lote"]', function () {
            var nro_lote = $(this).val();
            console.log(nro_lote);
            var tr = tblProducts.cell($(this).closest('td, li')).index();
            ingresos.items.productos[tr.row].nro_lote = nro_lote;
            
        })
        
    $('.btnClearSearch').on('click', function () {
        $('input[name="search"]').val('').focus();
    });
  
    $('input[name="search"]').on('click', function () {
        $('input[name="search"]').val('').focus();
    });
    $('.btnSearchProducts').on('click', function () {
        tblSearchProducts = $('#tblSearchProducts').DataTable({
            responsive: false,
            autoWidth: false,
            destroy: true,
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
                    'action': 'search_products',
                    'ids': JSON.stringify(ingresos.get_ids()), //lo convierto a string para mandarlo a mi vista
                    'term': $('select[name="search"]').val(),
                    'idalmacen': $('#idalmacen').val()
                },
                dataSrc: ""
            },
            columns: [
                {"data": "full_name"},
                {"data": "imagen"},                
                {"data": "pagaimpuesto"},
                {"data": "lote"},
                {"data": "id", className: 'text-center'},
            ],
            columnDefs: [
                {
                    targets: [-4],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<img src="' + data + '" class="img-fluid d-block mx-auto" style="width: 20px; height: 20px;">';
                    }
                },              
                {
                    targets: [-3],
                    class: 'text-center',
                    render: function (data, type, row) {
                        if(row.pagaimpuesto == true) return '<i class="fa fa-check" style="color:#00bc8c; font-size: 14px;"></i>';
                        if(row.pagaimpuesto == false) return '<i class="fa fa-times" style="color:red"></i>';

                    }
                },
                {
                    targets: [-2],
                    class: 'text-center',
                    render: function (data, type, row) {
                        if(row.lote == true) return '<i class="fa fa-check" style="color:#00bc8c; font-size: 14px;"></i>';
                        if(row.lote == false) return '<i class="fa fa-times" style="color:red"></i>';

                    }
                },
                {
                    targets: [-1],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        var buttons = '<a rel="add" class="btn btn-info btn-xs btn-rounded"><i class="fas fa-plus"></i></a> ';
                        return buttons;
                    }
                },
            ],
            initComplete: function (settings, json) {
            }
        });
        $('#modaltitleproduc').find('span').html('Catalogo de Productos');
        $('#modaltitleproduc').find('i').removeClass().addClass('fas fa-search');
        $('#myModalSearchProducts').modal('show');
    });

    $('#tblSearchProducts tbody')
        .on('click', 'a[rel="add"]', function () {
            var tr = tblSearchProducts.cell($(this).closest('td, li')).index();
            var product = tblSearchProducts.row(tr.row).data();
            product.cant = 1;
            product.precio = 0.01;
            product.subtotal = 0.00;
            if(product.pagaimpuesto)          
            {                 
                product.iva = $('#idiva').val();               
            }
            else       
            {                 
                product.iva= 0.00;                       
            }            
            ingresos.add(product);
            tblSearchProducts.row($(this).parents('tr')).remove().draw();
        });

    // event submit
    $('#frmIngresoprod').on('submit', function (e) {
        e.preventDefault();
        let text = "";
        if (ingresos.items.productos.length === 0) {
            message_error('Debe al menos tener un item en su detalle');
            return false;
        }
        if ($('input[name="total"]').val() === '0.00') {
            message_error('Total Ingresos Vacio, debes colocar montos reales en precio y cantidad');
            return false;
        }
        if ($('input[name="precio"]').val() === '0.00') {
            message_error('Debe colocar un precio');
            return false;
        }
        if  ($('input[name="action"]').val() == 'add'){
            text = "Creado";
        }else{
            text = "Modificado";
        }   
        ingresos.items.cod_ingreso = $('input[name="cod_ingreso"]').val();
        ingresos.items.almacen = $('select[name="almacen"]').val();
        ingresos.items.respon_almac = $('input[name="respon_almac"]').val();
        ingresos.items.tipo_ingreso = $('select[name="tipo_ingreso"]').val();
        ingresos.items.proveedor =  $('select[name="proveedor"]').val();
        ingresos.items.tipo_comprob = $('select[name="tipo_comprob"]').val();
        ingresos.items.num_comprob = $('input[name="num_comprob"]').val();
        ingresos.items.fecha_ingreso = $('input[name="fecha_ingreso"]').val();
        ingresos.items.subtotal = $('input[name="subtotal"]').val();
        ingresos.items.iva = $('#idiva').val();
        ingresos.items.total = $('input[name="total"]').val();
        ingresos.items.observ = $('textarea[name="observ"]').val();
        ingresos.items.estado = $('select[name="estado"]').val();  
        var parameters = new FormData();
        parameters.append('action', $('input[name="action"]').val());
        parameters.append('ingresos', JSON.stringify(ingresos.items)); 
        submit_with_ajax(window.location.pathname, 'Notificación', '¿Estas seguro de realizar la siguiente acción?', parameters, function (response) {
        sweet_info( 'El Registro Ha Sido '+text+' Con Exito'); 
        console.log(ingresos.items.lotes);           
        setTimeout(() => {
            location.href = '/erp/ingreso/list/';
        }, 1200);             
        });    
    });

    //busqueda del select2 de procuctos
    $('select[name="search"]').select2({
        theme: "bootstrap4",
        language: 'es',
        allowClear: true,
        ajax: {
            delay: 250,
            type: 'POST',
            url: window.location.pathname,
            data: function (params) {
                var queryParameters = {
                    term: params.term,
                    action: 'search_autocomplete',
                    ids: JSON.stringify(ingresos.get_ids()),
                    idalmacen: $('#idalmacen').val()
                }
                return queryParameters;
            },
            processResults: function (data) {
                return {
                    results: data
                };
            },
        },
        placeholder: 'Ingrese una descripción',
        minimumInputLength: 1,
        templateResult: formatRepo,
    }).on('select2:select', function (e) {
        var data = e.params.data;
        if(!Number.isInteger(data.id)){
            return false;
        }
        data.cant = 1;
        data.precio = 0.00;
        data.subtotal = 0.00;

        if(data.pagaimpuesto){                 
            data.iva = $('#idiva').val();               
        }else {
            data.iva= 0.00;
        }

        if(data.lote){                 
            data.nro_lote = "";               
            data.fecha_venc = "";               
        }else {
            data.nro_lote = "Sin lote";
            data.fecha_venc = null;
        }

        ingresos.add(data);
        $(this).val('').trigger('change.select2');
    });    
     ingresos.list();
});
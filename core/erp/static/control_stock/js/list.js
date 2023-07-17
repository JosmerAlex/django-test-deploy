var dttStock;
let product =
{
    items:
    {        
        prod_id: []
        //stock_max: []
    },
};
let stock_minimo =
{
    items:
    {        
        stock_min: []
        //stock_max: []
    },
};
var stock = {
    list: function (all) {
        var parameters = {
            'action': 'searchdata',
            'almacen': $('select[name="almacenes"]').val(),    
        };
        dttStock = $('#data_stock').DataTable({
            responsive: false,
            autoWidth: true,
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
            columns: [
                {"data": "id"},
                {"data": "prod"},
                {"data": "desc"},
                {"data": "categorias"},
                {"data": "precio"},
                {"data": "stock"},
                {"data": "stock_min"},
                {"data": "stock_max"},
            ],    
            columnDefs: [
                {
                    targets: [-4],
                    class: 'text-center',
                    render: function (data, type, row) {
                        return parseFloat(data).toFixed(2)+ ' Bs.';
                    }
                },
                {
                    targets: [-3],
                    class: 'text-center',
                    render: function (data, type, row) {
                        if(row.stock >= row.stock_min)return '<span class="badge badge-success" style="font-size: 10px;">'+data+'</span>'                
                        if(row.stock == 0)return '<span class="badge badge-danger" data-toggle="tooltip" title="Sin Stock" style="font-size: 10px;">'+data+'</span>'
                        return '<span class="badge badge-warning" data-toggle="tooltip" title="Por debajo del minimo" style="font-size: 10px;">'+data+'</span>'
                    }
                }, 
                {
                    targets: [-2],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<input type="text" class="form-control form-control" style="font-size: 11px; height: 24px;" name="stock_min" autocomplete="off" value="' + row.stock_min + '">';

                    }
                }, 
                {
                    targets: [-1],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<input type="text" class="form-control form-control" style="font-size: 11px; height: 24px;" name="stock_max" autocomplete="off" value="' + row.stock_max + '">';
                    }
                },              
                ],
                rowCallback(row, data, displayNum, displayIndex, dataIndex) {
                    $(row).find('input[name="stock_min"]').TouchSpin({                                                  
                        min: 0,
                        max: 1000000,
                        buttonup_class: 'btn btn-secondary btn-xs btn-flat',
                        buttondown_class: 'btn btn-secondary btn-xs btn-flat'                               
                    });
                    $(row).find('input[name="stock_max"]').TouchSpin({                                                  
                        min: 0,
                        max: 1000000,
                        buttonup_class: 'btn btn-secondary btn-xs btn-flat',
                        buttondown_class: 'btn btn-secondary btn-xs btn-flat'                               
                    });           
                    
                },       
                initComplete: function (settings, json) {
                
            }
        });
        
    },
    
};
$(function () {    
    $('select[name="almacenes"]').on('change', function () {        
        stock.list(true);
    });
    $('#data_stock tbody').on('change', 'input[name="stock_min"]', function () {
        let tr = dttStock.cell($(this).closest('td, li')).index();
        let id = dttStock.row(tr.row).data();
        let stock_min = parseInt($(this).val());
        stock_minimo.items.stock_min[tr.row] = stock_min
        product.items.prod_id[tr.row] = id.id

        console.log(product.items);
        console.log(stock_minimo.items);
    })

    stock.list(false);    
        $('#formStock').on('submit', function (e) {
         e.preventDefault();         
         let myForm = document.getElementById('formStock');
         let parameters = new FormData(myForm);
         parameters.append('product', JSON.stringify(product.items));                
         parameters.append('stock_minimo', JSON.stringify(stock_minimo.items));                
         parameters.append('almacen', $('select[name="almacenes"]').val());        
         parameters.append('param_id', $('input[name="id"]').val());        
             
         let url="";
         let titulo="";         
         let param_id= $('input[name="id"]').val();
         console.log(param_id);
         if  ($('input[name="action"]').val() == 'edit'){
             url =  '/erp/stock/list/';
             titulo="¿Estas seguro de realizar la siguiente acción?";             
         }         
        // var url = "/product/add/";
         submit_with_ajax(url, 'Estimado(a) Usuario  ', titulo, parameters, function (response) {                 
            dttStock.ajax.reload();  
            Swal.fire({
				title: 'Notificación',
				text: 'SE GUARDARON LOS CAMBIOS EXITOSAMENTE',
				icon: 'success',				
			})
            product.items.prod_id = []
            stock_minimo.items.stock_min = []
         
         });
         
    });       
    
});

 // stock_minimo.push(stock_min);
        // let siigual=false;        
        // let prod_stock_min = {
        //     stock_min: stock_minimo
        // };           
        // $.each(control_stock.items.prod_id, function (key, value) {
        //     if (value.prod_id == id.id) {
        //         parameters.prod_id.control_stock.items.prod_id[tr.row].stock_min = stock_min
        //        // control_stock.items.prod_id[tr.row].stock_min = stock_min
        //         siigual=true;
        //      }
        // });
        // if (siigual==false){
        //     let prod = {
        //         stock_min: stock_minimo
        //     }
        //     control_stock.items.prod_id.push(prod);
        // }        
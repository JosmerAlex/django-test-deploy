var tblreportAlmac


$(function () {

    $('.btnReport').on('click', function () {  
        var parameters = {
            'action': 'search_report',
            'almacen': $('select[name="almacen"]').val(),
            'categoria': $('select[name="categoria"]').val(),
        };
        console.log(parameters);
        tblreportAlmac = $('#dtt_Report_Almacen').DataTable({
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
            order: false,
            paging: false,
            ordering: false,
            info: false,
            //searching: false,
            dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: '<span class="badge badge-success" style="font-size:11px;"><i class="fas fa-file-excel"></i> EXCEL</span>',
                    titleAttr: 'Excel',
                    className: 'btn btn-success btn-xs',                    
                },
                {
                    extend: 'print',
                    text: '<span class="badge badge-info" style="font-size:11px;"><i class="fas fa-print"></i> IMPRIMIR</span>',
                    titleAttr: 'Imprimir Archivo',
                    footer: true,
                    className: 'btn btn-info btn-xs',                    
                },
                {
                    extend: 'pdfHtml5',
                    text: '<span class="badge badge-danger" style="font-size:11px;"><i class="fas fa-file-pdf"></i> PDF</span>',
                    titleAttr: 'PDF',
                    className: 'btn btn-danger btn-xs',
                    download: 'open',
                    orientation: 'landscape',
                    pageSize: 'LEGAL',
                    customize: function (doc) {
                        doc.styles = {
                            header: {
                                fontSize: 25,
                                bold: true,
                                alignment: 'center'
                            },
                            subheader: {
                                fontSize: 13,
                                bold: true
                            },
                            quote: {
                                italics: true
                            },
                            small: {
                                fontSize: 8
                            },
                            tableHeader: {
                                bold: true,
                                fontSize: 11,
                                color: 'white',
                                fillColor: '#2d4154',
                                alignment: 'center'
                            }
                        };
                        doc.content[1].table.widths = ['18%', '22%', '20%', '7%', '10%', '10%', '5%', '8%'];
                        doc.content[1].margin = [0, 35, 0, 0];
                        doc.content[1].layout = {};
                        
    
                    }
                }
            ],
            columns: [
                {"data": "prod"},
                {"data": "desc"},
                {"data": "categorias"},
                {"data": "marca"},
                {"data": "modelo"},
                {"data": "stock", className: "text-center"},
            ],
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
                next: "Siguiente",
                previous: "Anterior",
                },
                buttons: {
                copy: "Copiar", 
                print: "Imprimir",
                },
            }, 
        
            // columnDefs: [
            //         {
            //             targets: [-4],
            //             class: 'text-center',
            //             orderable: false, 
                        
            //             render: function (data, type, row) {
                                
            //                 return (data);
            //             }
            //         },
            //     ],
            
            initComplete: function (settings, json) {
                
            
            }
        });
        if($('select[name="almacen"]').val() == ""){
            return false;
        }

       

        if($('select[name="categoria"]').val() == "")
        {
            tblreportAlmac.columns(2).visible(true);
        }else{
            tblreportAlmac.columns(2).visible(false);
        }
        
        
    }); 

    $('select[name="almacen"]').on('change', function () {
        tblreportAlmac.clear();
        tblreportAlmac.draw();
    });
    $('select[name="categoria"]').on('change', function () {
        tblreportAlmac.clear();
        tblreportAlmac.draw();
    });
//    generate_report();

    
});
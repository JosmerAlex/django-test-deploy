let produc_catalago =
{
    items:
    {
        codigo: '',
        nombre: '',
        descripcion: '',
        componentes: '',
        unida_medida: '',
        tipo_item: '',
        activo: '',
        lote: '',
        serie: '',
        categorias: '',
        marca: '',
        modelo: '',
        moneda: '',
        grupobien: '',
        subgrupobien: '',
        imagen: '',
        usuario: '',
        pagaimpuesto: '',
        inventariable: ''
    },

};

$(function () {
$('#formproduc').on('submit', function (e) {
    e.preventDefault();    
    produc_catalago.items.codigo= $('input[name="codigo"]').val();
    produc_catalago.items.nombre= $('input[name="nombre"]').val().toUpperCase();;
    produc_catalago.items.descripcion= $('textarea[name="descripcion"]').val();
    produc_catalago.items.componentes= $('textarea[name="componentes"]').val();
    produc_catalago.items.unida_medida= $('select[name="unida_medida"]').val();
    produc_catalago.items.tipo_item= $('input:radio[name=tipo_item]:checked').val();
    produc_catalago.items.activo= $('#idactivo').prop("checked")
    produc_catalago.items.pagaimpuesto= $('#idpagaimpuesto').prop("checked")
    produc_catalago.items.lote= $('#idlote').prop("checked")
    produc_catalago.items.serie= $('#idserie').prop("checked")
    produc_catalago.items.inventariable= $('#idinv').prop("checked")    
    produc_catalago.items.categorias= $('select[name="categorias"]').val();
    produc_catalago.items.marca= $('select[name="marca"]').val();
    produc_catalago.items.modelo= $('select[name="modelo"]').val();
    produc_catalago.items.moneda= $('select[name="moneda"]').val();
    produc_catalago.items.grupobien= $('select[name="grupobien"]').val();
    produc_catalago.items.subgrupobien= $('select[name="subgrupobien"]').val();    
    let filename = "";
   if  ($('input[name="imagen"]').val() == ''){
       // produc_catalago.items.imagen= $imagenPrevisualizacion.src;
        filename = $imagenPrevisualizacion.src.replace(/.*(\/|\\)/, '');
        produc_catalago.items.imagen= "producto/" + filename;
    }else{
        filename = $('input[name="imagen"]').val().replace(/.*(\/|\\)/, '');
        produc_catalago.items.imagen= "producto/" + filename;
    }

    let parameters = new FormData();
    parameters.append('action', $('input[name="action"]').val());
    parameters.append('produc_catalago', JSON.stringify(produc_catalago.items));

    let url="";
    let titulo="";
    let text = "";

    if  ($('input[name="action"]').val() == 'add'){
        url =  '/erp/product/add/';
        titulo="¿Estas seguro de crear el producto?";
        text = "Creado";
    }else{
        url = window.location.pathname;
        titulo="¿Estas seguro de actualizar los datos del producto?";
        text = "Modificado"
    }
    submit_with_ajax(url, 'Estimado(a) Usuario  ', titulo, parameters, function (response) {
    sweet_info( 'El Registro Ha Sido '+text+' Con Exito');
        setTimeout(() => {
            location.href = '/erp/product/list/';
        }, 1200);
        });
    });


    $('.btnAddCategoria').on('click', function () {
        $('input[name="action"]').val('add');
        $('#modaltitle3').find('span').html('Creando Nueva Categoría');
        $('#modaltitle3').find('i').removeClass().addClass('fas fa-plus');
        $('#idnombrecateg').focus();
        $('#modalCategory').modal('show');
        });
        $("#modalCategory").on('shown.bs.modal', function(){
            const inputs = document.querySelectorAll('#modalCategory .txt_field input');
            inputs.forEach(input => { if (input.value.trim() !== '') { input.classList.add('input-has-text'); }
                input.addEventListener('input', () => { if (input.value.trim() !== '') { input.classList.add('input-has-text');
                } else { input.classList.remove('input-has-text'); }
                });
            });
        });
    
        $('#modalCategory').on('hidden.bs.modal', function (e) {
            $('#frmCatgorias').trigger('reset');
        })
        $('#frmCatgorias').on('submit', function (e) {
            e.preventDefault();
            let myForm = document.getElementById('frmCatgorias');
            let parameters = new FormData(myForm);       
            let url="";
            let titulo="";
            if  ($('input[name="action"]').val() == 'add'){
                url =  '/erp/product/add/';
                titulo="¿Estas seguro de crear la categoria?";
            }else{
                url = "/erp/product/update/"+param_id+"/";
                titulo="¿Estas seguro de actualizar la categoria?";
            }
            parameters.append('action', 'create_Categoria');
            submit_with_ajax(url, 'Estimado usuario(a)', titulo, parameters, function (response) {
                let newOption = new Option(response.nombre, response.id, false, true);
                   $('select[name="categorias"]').append(newOption).trigger('change');
                   sweet_info( 'La Categoría Se Ha Creado Con Éxito'); 
                   $('#modalCategory').modal('hide');
                });
        });
        /////Marcas de producto/////////////////////////////////////////////////////  
       $('.btnAddMarca').on('click', function () {
        $('input[name="action"]').val('add');
        $('#titlemarca').find('span').html('Creación de una Marca');
        $('#titlemarca').find('i').removeClass().addClass('fas fa-plus');
        $('#idmarca').focus();
        $('#myModalMarcas').modal('show');
        });
    
        $('#myModalMarcas').on('hidden.bs.modal', function (e) {
            $('#frmMarcas').trigger('reset');
        })
    
        $('#frmMarcas').on('submit', function (e) {
            e.preventDefault();
            let myForm = document.getElementById('frmMarcas');
            let parameters = new FormData(myForm);
            
            let url="";
            let titulo="";
            if  ($('input[name="action"]').val() == 'add'){
                url =  '/erp/product/add/';
                titulo="¿Estas seguro de crear la Marca?";
            }else{
                url = "/erp/product/update/"+param_id+"/";
                titulo="¿Estas seguro de actualizar la Marca?";
            }
            parameters.append('action', 'create_Marca');
        
            submit_with_ajax(url, 'Estimado usuario(a)', titulo, parameters, function (response) {
                let newOption = new Option(response.marca, response.id, false, true);
                $('select[name="marca"]').append(newOption).trigger('change');
                $('#myModalMarcas').modal('hide');
                sweet_info( 'La Marca Se Ha Creado Con Éxito'); 
                });
            }); 
        ////Modelos de producto/////////////////////////////////////////////////////
        $('.btnAddModelo').on('click', function () {
            $('input[name="action"]').val('add');
            $('#titlemodelo').find('span').html('Creación de un Modelo');
            $('#titlemodelo').find('i').removeClass().addClass('fas fa-plus');
            $('#idmodelo').focus();
            $('#myModalModelos').modal('show');
        });
    
        $('#myModalModelos').on('hidden.bs.modal', function (e) {
            $('#idmarcas').val("").trigger('change.select2');
            $('#frmModelos').trigger('reset');
        })
    
        $('#frmModelos').on('submit', function (e) {
            e.preventDefault();
            let myForm = document.getElementById('frmModelos');
            let parameters = new FormData(myForm);
            
            let url="";
            let titulo="";
            if  ($('input[name="action"]').val() == 'add'){
                url =  '/erp/product/add/';
                titulo="¿Estas seguro de crear el Modelo?";
            }else{
                url = "/erp/product/update/"+param_id+"/";
                titulo="¿Estas seguro de actualizar el Modelo?";
            }
            parameters.append('action', 'create_Modelo');
        
            submit_with_ajax(url, 'Estimado usuario(a)', titulo, parameters, function (response) {
                let newOption = new Option(response.modelo, response.id, false, true);
                $('select[name="modelo"]').append(newOption).trigger('change');
                $('#myModalModelos').modal('hide');  
                sweet_info( 'El Modelo Se Ha Creado Con Éxito'); 
                });
            });
});


//Evento que se dispara cuando inicia la carga de la página
window.addEventListener('load', function(){

    //Carga imagen ajax
    showWaitLoader('mascaraAJAX');
    $('#mascaraAJAX').fadeIn(300);

    //Se quita el foco a todos los elementos SELECT
    $('select').change(function(event) {
        /* Act on the event */
        event.target.blur();
    });

    //Se almacena localmente valor del Combo Centro Aurorizado y se carga abre Cuadro de Dialogo Direciones
    $('#btnDireccion').click(function() {

        //Capturo el valor de los campos a través de su id
        var rfc = $('#txtRFC').val();
        var curp = $('#txtCURP').val();
        var nombre = $('#txtNombre').val();
        var apePat = $('#txtApePat').val();
        var apeMat = $('#txtApeMat').val();
        var dia = $('#dia').val();
        var mes = $('#mes').val();
        var ano = $('#ano').val();
        var lugarNacimiento = $('#txtLugarNacimiento').val();
        var sexo = $('#sexo').val();
        var telefono = $('#txtTelefono').val();
        var email = $('#txtEmail').val();
        var kit = $('#kit').val();
        var codigoAutorizacion = $('#txtCodigo').val();
        var metodoEnvio = $('#metodoEnvio').val();
        var centroAutorizado = $('#centroAutorizado').val();
        var paqueteria = $('#paqueteria').val();
        var metodoPago = $('#metodoPago').val();

        //VALIDAMOS QUE EL CENTRO AUTORIZADO ESTÉ SELECCIONADO PARA PODER VER SU UBICACIÓN
        if(centroAutorizado != 0){
            //Se crea una variable para almacenar cadena para el array
            var cadena = "";
            //Se guarda toda la cadena
            //Se agrega "," para utilizarlo de escape al convertirlo en array
            cadena += rfc + "\",";
            cadena += "\"" + curp + "\",";
            cadena += "\"" + nombre + "\",";
            cadena += "\"" + apePat + "\",";
            cadena += "\"" + apeMat + "\",";
            cadena += "\"" + dia + "\",";
            cadena += "\"" + mes + "\",";
            cadena += "\"" + ano + "\",";
            cadena += "\"" + lugarNacimiento + "\",";
            cadena += "\"" + sexo + "\",";
            cadena += "\"" + telefono + "\",";
            cadena += "\"" + email + "\",";
            cadena += "\"" + kit + "\",";
            //Si el Kit que se eligió es serializable se valida su Número de Serie
            if(kit == 'PAQ1000MX' || kit == 'PAQ1001MX' || kit == 'PAQ1002MX' || kit == 'PAQ1003MX' || kit == 'PAQ1004MX'){

                //Se envia un XML como parámetro con el ITEM_CODE y el SERIAL_NUMBER para verificar si es válido
                xml = '<PAGE>'+      
                         '<SERIAL_ITEMS>'+      
                          '<SERIAL_ITEM SERIAL_NUMBER="'+ codigoAutorizacion +'" ITEM_CODE="'+ kit +'"/>'+
                         '</SERIAL_ITEMS>'+
                         '</PAGE>';
                /*Devuelve conjunto de datos y carga SELECT de ESTADOS con los datos obtenidos*/
                queryData('USP_VBC_VALIDATE_SERIAL_NUMBER', ['string', depurarXML(xml)], validateSerialNumber2);

                function validateSerialNumber2(dataSet){
                    var rec = dataSet[0];
                    console.log(rec);

                    if(rec['errorCode'] == 0){//Sí errorCode es igual a 0 es exitosa la consulta
                        console.log('status = 0');
                        cadena += "\"sc0\",";
                        cadena += "\"" + codigoAutorizacion + "\",";
                    }else if(rec['errorCode'] == 1){//Sí errorCode es igual a 1 el CÓDIGO no existe
                        cadena += "\"sc1\",";
                        cadena += "\"" + codigoAutorizacion + "\",";
                    }else if(rec['errorCode'] == 2){//Sí errorCode es igual a 2 el CÓDIGO está en uso
                        cadena += "\"sc2\",";
                        cadena += "\"" + codigoAutorizacion + "\",";
                    }else if(rec['errorCode'] == 3){//Sí errorCode es igual a 3 el CÓDIGO aún no está listo
                        cadena += "\"sc3\",";
                        cadena += "\"" + codigoAutorizacion + "\",";
                    }else if(rec['errorCode'] == 4){//Sí errorCode es igual a 4 el CÓDIGO ha sido cancelado
                        cadena += "\"sc4\",";
                        cadena += "\"" + codigoAutorizacion + "\",";
                    }

                    cadena += "\"" + metodoEnvio + "\",";
                    if(metodoEnvio == 1){
                        cadena += "\"" + centroAutorizado + "\",";
                    }else if(metodoEnvio == 2){ 
                        cadena += "\"" + paqueteria + "\",";
                    }       
                    cadena += "\"" + metodoPago; 

                    //Si existe previamente ese variable local la elimina para cargarla de nuevo
                    if(localStorage.getItem('susc2Local')){
                        localStorage.removeItem('susc2Local');
                    }
                    //Se almacena localmente el valor del array en una variable local
                    localStorage.setItem('susc2Local' ,cadena);

                    console.log(localStorage.getItem('susc2Local'));

                    window.location.href = "cuadroDialogoDireccion.html?idCentroAutorizado="+centroAutorizado;
                }
            }else{
                cadena += "\"" + metodoEnvio + "\",";
                if(metodoEnvio == 1){
                    cadena += "\"" + centroAutorizado + "\",";
                }else if(metodoEnvio == 2){ 
                    cadena += "\"" + paqueteria + "\",";
                }       
                cadena += "\"" + metodoPago; 

                //Si existe previamente ese variable local la elimina para cargarla de nuevo
                if(localStorage.getItem('susc2Local')){
                    localStorage.removeItem('susc2Local');
                }
                //Se almacena localmente el valor del array en una variable local
                localStorage.setItem('susc2Local' ,cadena);
                window.location.href = "cuadroDialogoDireccion.html?idCentroAutorizado="+centroAutorizado;
            }
        }else{
            console.log("centroAutorizado: " +centroAutorizado);
            app.showNotificactionVBC("* Debe seleccionar un Centro Autorizado para poder visualizar su dirección");
        }
       
    });  

    /*Devuelve conjunto de datos y carga SELECT de KITS con los datos obtenidos*/
    queryData('USP_VBC_GET_ITEMS_KITS', ['integer', '4'], fillKits);

    function fillKits(dataSet){
        var rec = dataSet[0];
        var text = '';

        for(var idx = 0; idx < dataSet.length; idx++){
            rec = dataSet[idx];
            text += '<option value="'+ rec["itemCode"] +'">'+ rec["description"] +'</option>';
        };

        $('#kit').html(text);

        var extraer = localStorage.getItem("susc2Local");
        var ResArray = extraer.split('","');

        $('#kit').val(ResArray[12]);
        if($('#kit').val() == 'PAQ1000MX' || $('#kit').val() == 'PAQ1001MX' || $('#kit').val() == 'PAQ1002MX' ||
         $('#kit').val() == 'PAQ1003MX' || $('#kit').val() == 'PAQ1004MX'){

            $('tr#codigoAutorizacion').show(200);

            $('#txtCodigo').val(ResArray[14]);                
                            
        }

    }   

    /*Devuelve conjunto de datos y carga SELECT de METODOS DE ENVÍO con los datos obtenidos*/
    queryData('USP_VBC_GET_SHIPMENT_METHODS', ['integer', '', 'integer', '4'], fillShipmentMethods);

    function fillShipmentMethods(dataSet){
        var rec = dataSet[0];
        var text = '';

        for(var idx = 0; idx < dataSet.length; idx++){
            rec = dataSet[idx];
            text += '<option value="'+ rec["shipMethodId"] +'">'+ rec["name"] +'</option>';
        };

        $('#metodoEnvio').append(text);

        var extraer = localStorage.getItem("susc2Local");
        var ResArray = extraer.split('","'); 

        if(ResArray.length == 18){
            $('#metodoEnvio').val(ResArray[15]);

            if($('#metodoEnvio').val() == 1){
                $('tr#centroAutorizadoTr').show(200);
            }else{
                $('tr#paqueteriaTr').show(200);
            }
        }else{
            $('#metodoEnvio').val(ResArray[13]);

            if($('#metodoEnvio').val() == 1){
                $('tr#centroAutorizadoTr').show(200);
            }else{
                $('tr#paqueteriaTr').show(200);
            }
        }
    }       

    /*Devuelve conjunto de datos y carga SELECT de METODOS DE ENVÍO con los datos obtenidos*/
    queryData('USP_VBC_GET_WAREHOUSE_BY_COUNTRY', ['integer', '4'], fillWarehouses);

    function fillWarehouses(dataSet){
        var rec = dataSet[0];
        var text = '';

        for(var idx = 0; idx < dataSet.length; idx++){
            rec = dataSet[idx];
            text += '<option value="'+ rec["warehouseId"] +'">'+ rec["description"] +'</option>';
        };

        //oculta imagen ajax
        $('#mascaraAJAX').fadeOut(300);
        $('#mascaraAJAX').html('');

        $('#centroAutorizado').append(text);    

        var extraer = localStorage.getItem("susc2Local");
        var ResArray = extraer.split('","');           

        if(ResArray.length == 18){
            $('#centroAutorizado').val(ResArray[16])
        }else{
            $('#centroAutorizado').val(ResArray[14])
        }        
    }

    /*Devuelve conjunto de datos y carga SELECT de PAQUETERÍAS con los datos obtenidos*/
    queryData('USP_VBC_GET_CARRIERS', ['integer', '4'], fillCarriers);

    function fillCarriers(dataSet){
        var rec = dataSet[0];
        var text = '';

        for(var idx = 0; idx < dataSet.length; idx++){
            rec = dataSet[idx];
            text += '<option value="'+ rec["carrierId"] +'">'+ rec["description"] +'</option>';
        };

        $('#paqueteria').html(text);
    }

    /*Devuelve conjunto de datos y carga SELECT de MÉTODO DE PAGO con los datos obtenidos*/
    queryData('USP_VBC_GET_PAY_METHOD', ['integer', '1', 'integer', '4'], fillPayMethod);

    function fillPayMethod(dataSet){
        var rec = dataSet[0];
        var text = '';                

        for(var idx = 0; idx < dataSet.length; idx++){
            rec = dataSet[idx];
            if(rec['payMethodId'] != 21){
                text += '<option value="'+ rec["payMethodId"] +'">'+ rec["description"] +'</option>';
            }            
        };    

        $('#metodoPago').html(text);

        var extraer = localStorage.getItem("susc2Local");
        var ResArray = extraer.split('","');  

        if(ResArray.length == 18){
            $('#metodoPago').val(ResArray[17])
        }else{
            $('#metodoPago').val(ResArray[15])
        }     
    }

});

function fillDay(){
    var text = "";
    for(var cont = 1; cont <= 31; cont++){
        if(cont < 10){
            text += '<option value="0'+ cont +'">0'+ cont +'</option>';
        }else{
            text += '<option value="'+ cont +'">'+ cont +'</option>';
        }
    }
    $('#dia').append(text);
}

function fillMonth(){
    var text = "";
    for(var cont = 1; cont <= 12; cont++){
        if(cont < 10){
            text += '<option value="0'+ cont +'">0'+ cont +'</option>';
        }else{
            text += '<option value="'+ cont +'">'+ cont +'</option>';
        }
    }
    $('#mes').append(text);
}

function fillYear(){
    //Obtenemos el año en curso
    var date = new Date();
    var currentYear = date.getFullYear();
    var minYear = currentYear - 18;

    var text = "";
    for(var cont = minYear; cont >= 1930; cont--){
        text += '<option value="'+ cont +'">'+ cont +'</option>';                    
    }
    $('#ano').append(text);
}
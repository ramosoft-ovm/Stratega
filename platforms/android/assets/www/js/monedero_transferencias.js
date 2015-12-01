document.addEventListener('DOMContentLoaded', function() {
    //Variables glogales
    var userId = localStorage.getItem("userIdLocal");    
    //userId = 11;
    var userAlias = localStorage.getItem("usernameLocal");
    //---------------------------
    var cmbComercio = document.getElementById('cmb_comercio');
    var txtComercioDestino = document.getElementById('txt_comercio_destino');
    var txtUsuarioDestino = document.getElementById('txt_usuario_destino');
    var txtCantidad = document.getElementById('txt_cantidad');
    var txtCantidadDecimal = document.getElementById('txt_cantidad_decimal');
    var txtPassword = document.getElementById('txt_password');
    var txtConfirmarPassword = document.getElementById('txt_confirmar_password');
    var txtComentario = document.getElementById('txt_comentarios');
    var btnTransferir = document.getElementById('btn_transferir');
    //Carga imagen ajax para carrito compras catalogo
    showWaitLoader('mascaraAJAX');
    $('#mascaraAJAX').fadeIn(300);

    txtCantidadDecimal.value = '00';

    ////////////////////////////////////////////
    /******** Carga combobox Comercio *********/
    queryData("USP_VBC_GET_WALLET_TYPE_BALANCE", ['integer',userId], comercios);
    function comercios(dataSet) {
        var rec = dataSet[0];
        var recT = dataSet.length;
        for (var idx = 0; idx < recT; idx++) {
            rec = dataSet[idx];
            var options = document.createElement('option');
            options.value = rec['walletTypeId'];
            options.text = rec['description'] + ' ('+(rec['userBalance']).toFixed(2)+')';
            options.title = rec['userBalance'];
            cmbComercio.options.add(options);
        }
        //Oculta imágen AJAX
        $('#mascaraAJAX').fadeOut(300);
        $('#mascaraAJAX').html('');
    }

    //Segun la eleción del comercio a retirar, se llena el textbox de comercio destino
    cmbComercio.addEventListener('change', function(event){
        var value = cmbComercio.options[cmbComercio.selectedIndex].text;
        value = value.substring(0, value.indexOf('(')-1);
        txtComercioDestino.value = value;
        event.target.blur();
        txtUsuarioDestino.focus();
        cordova.plugins.Keyboard.show();
    }, false);

    //Valida campos
    btnTransferir.addEventListener('click', function(event) {
        //Carga imagen ajax para carrito compras catalogo
        showWaitLoader('mascaraAJAX');
        $('#mascaraAJAX').fadeIn(300);

        event.preventDefault();
        var puntos = parseFloat(cmbComercio.options[cmbComercio.selectedIndex].title);
        if (cmbComercio.value === 'Seleccione uno') {
            app.showNotificactionVBC('Debe seleccionar un comercio del cual desee retirar');
            cmbComercio.focus();
            //Oculta imágen AJAX
            $('#mascaraAJAX').fadeOut(300);
            $('#mascaraAJAX').html('');
        }
        else if (txtComercioDestino.value === '') {
            app.showNotificactionVBC('No se ha cargado un comercio destino');
            cmbComercio.focus();
            //Oculta imágen AJAX
            $('#mascaraAJAX').fadeOut(300);
            $('#mascaraAJAX').html('');
        }
        else if (txtUsuarioDestino.value === '') {
            app.showNotificactionVBC('Falta un usuario destino');
            txtUsuarioDestino.focus();
            //Oculta imágen AJAX
            $('#mascaraAJAX').fadeOut(300);
            $('#mascaraAJAX').html('');
        }
        else if (parseInt(txtUsuarioDestino.value) === userId) {
            app.showNotificactionVBC('No se pueden realizar transferencias a si mismo');
            txtUsuarioDestino.focus();
            //Oculta imágen AJAX
            $('#mascaraAJAX').fadeOut(300);
            $('#mascaraAJAX').html('');
        }
        else if (txtCantidad.value === '' || txtCantidadDecimal.value === '') {
            app.showNotificactionVBC('Falta la cantidad a transferir');
            txtCantidad.value = '';
            txtCantidadDecimal.value = '';
            txtCantidad.focus();
            //Oculta imágen AJAX
            $('#mascaraAJAX').fadeOut(300);
            $('#mascaraAJAX').html('');
        }
        else if ((txtCantidad.value+'.'+txtCantidadDecimal.value) > puntos) {
            app.showNotificactionVBC('No puede transferir más puntos de los que tiene');
            txtCantidad.value = "";
            txtCantidad.focus();
            //Oculta imágen AJAX
            $('#mascaraAJAX').fadeOut(300);
            $('#mascaraAJAX').html('');
        }
        else if (txtPassword.value === '') {
            app.showNotificactionVBC('Falta el campo contraseña');
            txtPassword.focus();
            //Oculta imágen AJAX
            $('#mascaraAJAX').fadeOut(300);
            $('#mascaraAJAX').html('');
        }
        else if (txtConfirmarPassword.value === '') {
            app.showNotificactionVBC('Falta confirmar contraseña');
            txtConfirmarPassword.focus();
            //Oculta imágen AJAX
            $('#mascaraAJAX').fadeOut(300);
            $('#mascaraAJAX').html('');
        }
        else if (txtPassword.value !== txtConfirmarPassword.value) {
            app.showNotificactionVBC('La contraseña no concuerda, vuelva a escribirla');
            txtPassword.value = '';
            txtConfirmarPassword.value = '';
            txtPassword.focus();
            //Oculta imágen AJAX
            $('#mascaraAJAX').fadeOut(300);
            $('#mascaraAJAX').html('');
        }
        else {
            ///////////////////////////////////////
            /******** Valida el password *********/
            var argumentos = [
                'integer',userId, //Usuario actual
                'st7ring', txtPassword.value, //Password
                'integer',0 //SESSION_ID
            ];
            queryData("USP_VBC_VALIDATE_PASSWORD", argumentos, validaPassword);
            function validaPassword(dataSet) {
                //-----------------------------
                var rec = dataSet[0];
                var status = rec['status'];
                if (status === 0) {
                    
                    //////////////////////////////////////////////
                    /******** Valida el usuario destino *********/
                    var argumentos = [
                        'integer',txtUsuarioDestino.value //Usuario destino
                    ];
                    queryData("USP_VBC_VALIDATE_USER", argumentos, validateUser);
                    function validateUser(dataSet) {
                        var rec = dataSet[0];
                        var error = parseInt(rec['error']);
                        if (error === 1) {
                            ///////////////////////////////////////////////////////
                            /******** Realiza la transferencia de puntos *********/
                            var argumentos = [
                                'float',  parseFloat(txtCantidad.value+'.'+txtCantidadDecimal.value), //Monto
                                'integer',cmbComercio.value, //Tipo de comercio
                                'integer',userId, //Usuario origen
                                'integer',txtUsuarioDestino.value, // Usuario Destino
                                'string', txtComentario.value //Comentarios
                            ];
                            Debug(argumentos);
                            queryData("USP_VBC_SET_WALLET_BALANCE_TRANSFERENCES", argumentos, transferencias);
                            function transferencias(dataSet) {
                                var rec = dataSet[0];
                                var error = parseInt(rec['error']);
                                if (error === 1) {
                                    app.showNotificactionVBC('Transferencia exitosa');
                                    //=============================================================//
                                    //ENVÍO DE NOTIFICACIÓN UNA VEZ QUE LA TRANSFERENCIA TUVO ÉXITO//
                                    //=============================================================//
                                    var argumentos = [
                                        'integer', txtUsuarioDestino.value //Usuario origen
                                    ];
                                    queryData("USP_VBC_GET_USER_SESSION_CODES", argumentos, getSessionCodes);
                                    function getSessionCodes(dataSet) {
                                        //variables generales del método
                                        var rec = dataSet[0];
                                        var ruta = 'http://stramovil.vbc-for-mlm.com/ovm/WS_funciones.asmx/SEND_NOTIFICATION';
                                        var mensaje = 'Usted ha recibido una transferencia de parte del Usuario '+ userAlias +' por $ '+ parseFloat((txtCantidad.value+'.'+txtCantidadDecimal.value)).toFixed(2) +' para su Monedero Electronico de '+ txtComercioDestino.value;
                                        var session_code = '';
                                        var platformString = '';
                                        var platform = 0;
                                        var user_alias = '';
                                        var current_period = 0;
                                        var counter = 0;
                                        //VALIDAMOS SI EL USUARIO TIENE DISPOSITIVOS REGISTRADOS EN DONDE RECIBA LA NOTIFICACIÓN
                                        if(typeof(rec) == 'undefined'){
                                            var parametros = {
                                                "regId" : session_code,
                                                "mensaje" : mensaje,
                                                "plataforma" : platform,
                                                "receiver_user_id" : txtUsuarioDestino.value,
                                                "sender_user_id" : userId,
                                                "period_id" : current_period,
                                                "counter" : counter
                                            };console.log(parametros);
                                            $.ajax({
                                                url: ruta,
                                                type: 'GET',
                                                data: parametros,
                                                success: function(response){
                                                    console.log('Exito '+response);
                                                    if(response == 2){
                                                        app.showNotificactionVBC("El Usuario # "+ txtUsuarioDestino.value +" no ha sido notificado debido a que no cuenta con una Sesión Móvil iniciada. Una vez que inicie Sesión, el Usuario # "+ txtUsuarioDestino.value +", podrá visualizar éste mensaje en su Historial de Notificaciones");                                                                                                            
                                                    }
                                                    //Redirecciona a welcome para ver su nuevo saldo
                                                    location.href = 'welcome.html';
                                                },
                                                error: function(response){
                                                    console.log('Error '+ response);
                                                    app.showNotificactionVBC('Ha ocurrido un error en el almacenamiento de los datos al Historial de Notificaciones');
                                                    //Redirecciona a welcome para ver su nuevo saldo
                                                    location.href = 'welcome.html';
                                                }
                                            });


                                            /*app.showNotificactionVBC("El Usuario # "+ txtUsuarioDestino.value +" no ha sido notificado debido a que no cuenta con una Sesión Móvil iniciada. Una vez que inicie Sesión, el Usuario # "+ txtUsuarioDestino.value +", podrá visualizar éste mensaje en su Historial de Notificaciones");
                                            //Redirecciona a welcome para ver su nuevo saldo
                                             location.href = 'welcome.html';*/
                                        }else{                                            
                                            for(var idx = 0; idx < dataSet.length; idx++){
                                                rec = dataSet[idx];
                                                session_code = rec['sessionCode'];
                                                platformString = rec['mobilePlatform'];
                                                current_period = rec['currentPeriod'];
                                                user_alias = rec['alias'];
                                                counter = counter +1;

                                                if(platformString == 'Android'){
                                                    platform = 1;
                                                }else if(platformString == 'IOS'){
                                                    platform = 2;
                                                }else if(platformString == 'Windows'){
                                                    platform = 3;
                                                }

                                                var parametros = {
                                                    "regId" : session_code,
                                                    "mensaje" : mensaje,
                                                    "plataforma" : platform,
                                                    "receiver_user_id" : txtUsuarioDestino.value,
                                                    "sender_user_id" : userId,
                                                    "period_id" : current_period,
                                                    "counter" : counter
                                                };console.log(parametros);
                                                $.ajax({
                                                    url: ruta,
                                                    type: 'GET',
                                                    data: parametros,
                                                    success: function(response){
                                                        console.log('Exito '+response);
                                                        if(response == 1){
                                                            app.showNotificactionVBC('El Usuario '+ user_alias +' ha sido notificado de la Transferencia por $ '+ parseFloat((txtCantidad.value+'.'+txtCantidadDecimal.value)).toFixed(2) +' a su Monedero Electronico de '+ txtComercioDestino.value);                                                      

                                                        }else{
                                                            app.showNotificactionVBC('Ha fallado el envío de la Notificación al Usuario '+ user_alias);
                                                        }
                                                        //Redirecciona a welcome para ver su nuevo saldo
                                                        location.href = 'welcome.html';
                                                    }/*,
                                                    error: function(response){
                                                        console.log('Error '+ response);
                                                        app.showNotificactionVBC('Ha ocurrido un error en el envío de la Notificación');

                                                        //Redirecciona a welcome para ver su nuevo saldo
                                                        location.href = 'welcome.html';
                                                    }*/
                                                });

                                            }
                                        }
                                    }
                                }
                                else if (error === 2) {
                                    app.showNotificactionVBC('Ocurrio un error, intenta nuevamente');
                                    location.reload();
                                    //Oculta imágen AJAX
                                    $('#mascaraAJAX').fadeOut(300);
                                    $('#mascaraAJAX').html('');
                                }
                                else if (error === 0) {
                                    app.showNotificactionVBC('Saldo Insuficiente');
                                    txtCantidad.value = '';
                                    txtCantidad.focus();
                                    //Oculta imágen AJAX
                                    $('#mascaraAJAX').fadeOut(300);
                                    $('#mascaraAJAX').html('');
                                };
                            }
                        }
                        else if (error === 0) {
                            app.showNotificactionVBC('El ID de usuario que ingresaste no existe, digita uno correcto');
                            txtUsuarioDestino.value = '';
                            txtUsuarioDestino.focus();
                            //Oculta imágen AJAX
                            $('#mascaraAJAX').fadeOut(300);
                            $('#mascaraAJAX').html('');
                        }
                    }
                }
                else if (status === 1) {
                    app.showNotificactionVBC('Usuario inexistente');
                    //Oculta imágen AJAX
                    $('#mascaraAJAX').fadeOut(300);
                    $('#mascaraAJAX').html('');
                }
                else if (status === 2) {
                    app.showNotificactionVBC('El password es incorrecto');
                    //Oculta imágen AJAX
                    $('#mascaraAJAX').fadeOut(300);
                    $('#mascaraAJAX').html('');
                }
                else if (status === 3) {
                    app.showNotificactionVBC('No activo');
                    //Oculta imágen AJAX
                    $('#mascaraAJAX').fadeOut(300);
                    $('#mascaraAJAX').html('');
                }
                else if (status === 5) {
                    app.showNotificactionVBC('Oficina bloqueada');
                    //Oculta imágen AJAX
                    $('#mascaraAJAX').fadeOut(300);
                    $('#mascaraAJAX').html('');
                };
            }
        }
    }, false);
    
    //Eventos para responder a tecla enter del teclado
    txtUsuarioDestino.addEventListener('keypress', function(event) {
        if (event.which === 13) {
            txtCantidad.focus();
            cordova.plugins.Keyboard.show();
        }
        var code = (event.which) ? event.which : event.keyCode;
        if(code === 8)
        {
            //Borrar
            return true;
        }
        else if(code>=48 && code<=57)
        {
            //Is número
            return true;
        }
        else {
            event.preventDefault();
        }
    }, false);
    txtCantidad.addEventListener('keypress', function(event) {
        if (event.which === 13) {
            txtPassword.focus();
            cordova.plugins.Keyboard.show();
        };
        var code = (event.which) ? event.which : event.keyCode;
        if(code === 8)
        {
            //Borrar
            return true;
        }
        else if(code>=48 && code<=57)
        {
            //Is número
            return true;
        }
        else
        {
            event.preventDefault();
        };
    }, false);
    txtCantidadDecimal.addEventListener('keypress', function(event) {
        if (txtCantidadDecimal.value.length > 1) {
            event.preventDefault();
            Debug('dentro');
        }
        if (event.which === 13) {
            txtPassword.focus();
            cordova.plugins.Keyboard.show();
        };
        var code = (event.which) ? event.which : event.keyCode;
        if(code === 8)
        {
            //Borrar
            return true;
        }
        else if(code>=48 && code<=57)
        {
            //Is número
            return true;
        }
        else
        {
            event.preventDefault();
        };
    },false);
    txtPassword.addEventListener('keypress', function(event) {
        if (event.which === 13) {
            txtConfirmarPassword.focus();
            cordova.plugins.Keyboard.show();
        };
    }, false);
    txtConfirmarPassword.addEventListener('keypress', function(event) {
        if (event.which === 13) {
            txtComentario.focus();
            cordova.plugins.Keyboard.show();
        };
    },false);
    txtComentario.addEventListener('keypress', function(event) {
        if (event.which === 13) {
            txtComentario.blur();
        };
    }, false);
});
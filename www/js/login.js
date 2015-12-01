$(function(){
    //Pulsación de tecla enter
    //
    $('#username').keypress(function(event) {
        if (event.which === 13) {
            $('#password').focus();
            cordova.plugins.Keyboard.show();
        };
    });
    $('#password').keypress(function(event) {
        if (event.which === 13) {
            $('#saveSettings').focus();
            $('#saveSettings').trigger('click');
        };
    });
    $('#txtUserId').keypress(function(event) {
        if (event.which === 13) {
            $('#txtUserId').blur();
        };
    });
    //=========================================//
    //COMPRUEBA QUE LA SESIÓN NO HAYA EXPIRADO//
    //=========================================//
    var regIdLocal = localStorage.getItem("regIdLocal");
    var userIdLocal = localStorage.getItem("userIdLocal");
    queryData("USP_VBC_SET_UPDATE_EXPIRATION_DATE_OF_MOBILE_SESSION", ['integer',userIdLocal,'string',regIdLocal], updateExpirationDate);
    function updateExpirationDate(dataSet) {
        var rec = dataSet[0];
        if(rec['error'] == 0){
            //Comprueba si hay variables locales definidas
            if (localStorage.getItem("isCBCheckedLocal")) {
                //Si existen los datos de usuario almacenados localmente redirecciona a la página de inicio 
                window.setTimeout(function(){ location.href ="welcome.html";},1750);
            }else{
                localStorage.clear();
            }
        }
        else if(rec['error'] == 1)
        {            
            if (localStorage.getItem("isCBCheckedLocal")){
                alert('Su sesión ha expirado. Es necesario que vuelva ingresar sus credenciales');
                localStorage.clear();    
            }
        }
    }
    //=======================================//
    //TERMINA COMPROBACIÓN DE SESIÓN EXPIRADA//
    //=======================================//

    //Proceso de logueo remoto
    //
    $("#saveSettings").click(function(){
        //Valida que el SESSION_CODE esté cargado y por lo tanto el registro a GCM sea exitoso
        if (document.getElementById('regId').value != "") {
            //Valida que los campos Usuario y Contraseña no estén vacíos
            if (document.getElementById('username').value != "" && document.getElementById('password').value != "") {
                //Variables extraídas del Formulario
                var username = document.getElementById('username').value;
                var password = document.getElementById('password').value;
                var regId = document.getElementById('regId').value;
                //Número aleatorio para establecer el SESSION_ID
                var min = 100000000;
                var max = 999999999;      
                var sessionId = aleatorio(min,max);
                //Almacenamos en una variable temporal el estado del checkBox
                var isCBChecked = false;
                if(document.getElementById('save').checked){
                    isCBChecked = true;
                }else{
                    isCBChecked = false;
                }
                 //variables extraidas del servidor
                var userIdRemoto;
                var usernameRemoto;
                var sessionStatusRemoto;
                var nameRemoto;
                //variables otras                
                var acceso = false;

                /*Si coincide con los datos enviados,  permite el inicio de sesión */
                queryData('USP_VBC_VALIDATE_PASSWORD', ['string', username, 'string', password, 'string', sessionId], validateUser);
                //Valida el STATUS de acceso 
                function validateUser(dataSet){
                    var rec = dataSet[0];
                    console.log(rec['status']);

                    //Si el status es igual a 0 significa que el usuario y el passsword son correctos y continúa con la validación
                    if(rec['status'] == 0){
                        userIdRemoto = rec['custid'];
                        usernameRemoto = rec['nickname'];
                        //sessionStatusRemoto = rec['status'];
                        nameRemoto = rec['customerName'];

                        acceso = true;

                        //Una vez que el acceso es verdadero se procede a guardar el SESSION_CODE del usuario para Notificaciones
                        if(acceso){
                            //Elimina las variables locales por posibles intentos fallidos
                            localStorage.clear();
                            //Extrae información acerca del Sistema Operativo
                            var so = '';
                            var navInfo = window.navigator.appVersion.toLowerCase();
                            if(navInfo.indexOf('android') !== -1) {
                                so = 'Android';
                            }
                            else if (navInfo.indexOf('mac') !== -1) {
                                so = 'IOS'
                            }
                            else if (navInfo.indexOf('win') !== -1) {
                                so = 'Windows';
                            }
                            //Almacena el SESSION_CODE al usuario correspondiente
                            queryData('USP_VBC_SET_MOBILE_SESSION', ['string', regId, 'string', so, 'integer', userIdRemoto], validateRegister);
                            function validateRegister(dataSet){
                                var rec = dataSet[0];
                                //Sí el status es igual a 0 la inserción fue exitosa y si es igual a 1 el SESSION_CODE ya existía
                                if(rec['status'] == 0 || rec['status'] == 1){
                                    //Sí el checkbox esta seleccionado se almacena su estado para redirección automática
                                    if(document.getElementById('save').checked){
                                        localStorage.setItem("isCBCheckedLocal", isCBChecked);
                                    }
                                    localStorage.setItem("nameLocal", nameRemoto);
                                    localStorage.setItem("usernameLocal", usernameRemoto);
                                    localStorage.setItem("regIdLocal", regId);
                                    localStorage.setItem("userIdLocal", userIdRemoto);
                                    localStorage.setItem("sessionIdLocal", sessionId);
                                    //localStorage.setItem("sessionStatusLocal", sessionStatusRemoto);

                                    location.href = "welcome.html";
                                }else{
                                    alert('Error en el inicio de sesión, intente de nuevo');
                                }
                            }
                        }
                    }else if(rec['status'] == 1){
                        alert('Usuario Inexistente');
                    }else if(rec['status'] == 2){

                        //Cuenta Los intentos erroneos de cada usuario
                        //Si los intentos son mayor a 3, bloquea la cuenta
                        var intentos = 0;
                        if (window.localStorage.getItem('intentos'+username)) {
                            intentos = parseInt(localStorage.getItem('intentos'+username));
                            //Si tiene mas de 3 intentos, lo bloquea
                            if (intentos > 1) {
                                var argumentos = [
                                    'integer', username, //Nombre de usuario
                                    'integer', 4, //Status => 4 Suspendido
                                    'integer', '', //Operador
                                    'string', 'Bloqueado por ' + (intentos+1) + ' intentos fallidos' //Descripción
                                ];
                                //Verifica si lo que capturó es un userID o un nickName
                                if (isNaN(username)) {
                                    //Si capturó un nickName, extrae primero su UserID para poder bloquearlo.
                                    queryData('USP_VBC_GET_USER_ID', ['string',username], getUserId);
                                    function getUserId(dataSet) {
                                        var rec = dataSet[0];
                                        console.log(rec);
                                        argumentos[1] = rec['userId'];
                                        queryData('USP_VBC_UPDATE_STATUS', argumentos, updateStatus);
                                        function updateStatus(dataSet) {
                                            var rec = dataSet[0];
                                            var status = parseInt(rec['error']);
                                            if (status === 0) {
                                                alert('Tu cuenta ha sido bloqueada por exceder el límite de intentos fallidos, comunícate con el Administrador para desbloquearla.');
                                                localStorage.removeItem('intentos'+username);
                                            };
                                        }
                                    }
                                }
                                else {
                                    //Si capturó un UserID, ejecuta el bloqueo directamente
                                    queryData('USP_VBC_UPDATE_STATUS', argumentos, updateStatus);
                                    function updateStatus(dataSet) {
                                        var rec = dataSet[0];
                                        var status = parseInt(rec['error']);
                                        if (status === 0) {
                                            alert('Tu cuenta ha sido bloqueada por exceder el límite de intentos fallidos, comunícate con el Administrador para desbloquearla.');
                                            localStorage.removeItem('intentos'+username);
                                        };
                                    }
                                }
                            }
                        }
                        //Si el usuario se equivoca en la contraseña, contabiliza los intentos
                        if (window.localStorage.getItem('intentos'+username)) {
                            intentos = intentos + 1;
                            localStorage.setItem('intentos'+username,intentos);
                        }
                        else {
                            localStorage.setItem('intentos'+username,1);
                        }
                        alert('El password es Incorrecto ('+localStorage.getItem('intentos'+username)+')');
                        document.getElementById('password').value = '';
                    }else if(rec['status'] == 3){
                        alert('El Usuario aún no es activado');
                    }else if(rec['status'] == 4){
                        alert('Ésta cuenta ya está en uso');
                    }else if(rec['status'] == 5){
                        alert('Su Oficina Virtual está bloqueda');
                    }
                }                
            } else {
                alert('Los campos Usuario y Contraseña no pueden estar vacíos');
                //alert('Debes llenar los campos Usuario y Contraseña');
            }
        } else {
            alert('Esperando SESSION_CODE de su dispositivo para que pueda recibir Notificaciones a su Oficina Virtual Móvil')
            //alert('Esperando regId');
        }
    });/*TERMINA ACCIÓN DE BOTÓN*/

    //============================================//
    //EJECUTA ACCIÓN DE RECUPERACIÓN DE CONTRASEÑA//
    //============================================//
    $('#sendMail').click(function(event) {
        event.preventDefault();
        /*Obtenemos el Número de Usuario para recuperar contraseña*/
        var userId = $('#txtUserId').val();
        //Validamos que el campo con el UserId no esté vacío
        if(!userId == ''){
            /*Se obtiene la contraseña y el correo electrónico del usuario para ser enviados vía EMAIL*/
            queryData('USP_VBC_GET_PASSWORD', ['integer', userId, 'integer', 0], getPassword);        
            function getPassword(dataSet){
                var rec = dataSet[0]; console.log(rec);
                var ruta = 'http://stramovil.vbc-for-mlm.com/ovm/WS_funciones.asmx/SEND_MAIL_PASSWORD';
                //Validamos que el Número de usuario exista
                if(typeof(rec) == 'undefined'){
                    $('#txtUserId').val("");
                    alert('El Número de Usuario que usted digitó no existe');
                    //alert('userid no existe');
                }else if(!rec['email'] == ''){                    
                    var parametros = {
                        "EMAIL" : rec['email'],
                        "PASSWORD" : rec['password']
                      };
                    $.ajax({
                        url: ruta,
                        type: 'POST',
                        data: parametros,
                        success: function(response){
                            console.log('Exito '+response);
                            if(response == "1"){                        
                                $('#txtUserId').val("");
                                $('.linkform').trigger('click');
                                alert('El envío de la contraseña al correo '+ rec['email'] +' ha sido exitoso');
                            }else{
                                alert('El envío de la contraseña ha fallado, intente nuevamente');
                            }
                        },
                        error: function(response){
                            console.log('Error '+ response);
                            alert('Ha ocurrido un error en el envío de la contraseña');
                        }
                    });
                }
            }
        }else{
            alert('El campo del Número de Usuario no puede estar vacío');
        }
        
    });

});

//Genera número aleatorio para el SESSION_ID
function aleatorio(inferior,superior){ 
    var numPosibilidades = superior - inferior 
    var aleat = Math.random() * numPosibilidades 
    aleat = Math.round(aleat) 
    return parseInt(inferior) + aleat 
}
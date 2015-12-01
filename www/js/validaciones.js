function ValidaRfc(rfcStr) {
	var strCorrecta;
	strCorrecta = rfcStr;

	var valid = /^([A-Z,Ñ,&]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[A-Z|\d]{3})$/;

	var validRfc=new RegExp(valid);
	var matchArray=strCorrecta.match(validRfc);
	if (matchArray==null) {
		return false;
	}
	else
	{
		return true;
	}
	
}

function ValidaCurp(curpStr) {
	var strCorrecta;
	strCorrecta = curpStr;	
	
	var valid = '[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$';
	
	var validCurp=new RegExp(valid);
	var matchArray=strCorrecta.match(validCurp);
	if (matchArray==null) {		
		return false;
	}
	else
	{
		return true;
	}
	
}

function ValidaTelefono(telefonoStr){
	var strCorrecta;
	strCorrecta = telefonoStr;

	var valid = /^\d*$/;;

	var validTelefono = new RegExp(valid);
	var matchArray = strCorrecta.match(validTelefono);
	if(matchArray == null){
		return false;
	}else{
		return true;
	}
}

function ValidaEmail(emailStr) {
	var strCorrecta;
	strCorrecta = emailStr;	
	
	var valid = "^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$";
	var validEmail=new RegExp(valid);
	var matchArray=strCorrecta.match(validEmail);
	if (matchArray==null) {
		return false;
	}
	else
	{
		return true;
	}
	
}

function ValidaEmails(email2){
	var emailUno = $('#txtEmail').val();

	if(email2 != emailUno){
		return false;
	}else{
		return true;
	}
}

function ValidaCP(cpStr){
	var strCorrecta;
	strCorrecta = cpStr;

	var valid = /^\d{5}$/;

	var validCP = new RegExp(valid);
	var matchArray = strCorrecta.match(validCP);
	if(matchArray == null){
		return false;
	}else{
		return true;
	}
}

function ValidaAlias(aliasStr){
	var strCorrecta;
	strCorrecta = aliasStr;

	var valid = "^[A-Za-z0-9]{0,12}$";
	var validAlias = new RegExp(valid);
	var matchArray = strCorrecta.match(validAlias);
	if(matchArray == null){
		return false;
	}else{
		return true;
	}
}

function ValidaContraseña(passwordStr){
	var strCorrecta;
	strCorrecta = passwordStr;

	var valid = "^[A-Za-z0-9]{8,12}$";
	var validPassword = new RegExp(valid);
	var matchArray = strCorrecta.match(validPassword);
	if(matchArray == null){
		return false;
	}else{
		return true;
	}
}

function ValidaContraseña2(password2){
	var passwordUno = $('#txtPassword').val();

	if(password2 != passwordUno){
		return false;
	}else{
		return true;
	}
}

function ValidaCamposVacios(){
	var rfc = $('#txtRFC').val();
	var curp = $('#txtCURP').val();
	var nombre = $('#txtNombre').val();
	var apePat = $('#txtApePat').val();
	var apeMat = $('#txtApeMat').val();
	var dia = $('#dia').val();
	var mes = $('#mes').val();
	var ano = $('#ano').val();
	var lugarNacimiento = $('#txtLugarNacimiento').val();
	var telefono = $('#txtTelefono').val();
	var email = $('#txtEmail').val();
	var emailConfirm = $('#txtConfirmEmail').val();
	var codigo = $('#txtCodigo').val();
	var metodoEnvio = $('#metodoEnvio').val();
	var centroAutorizado = $('#centroAutorizado').val();
	var kit = $('#kit').val();

	if(nombre == "" || apePat == "" || apeMat == "" || dia == "dia" || mes == "mes" || ano == "ano" || 
		lugarNacimiento == "" || telefono == "" || metodoEnvio == "" || rfc == "" || curp == "" || email == "" || 
		emailConfirm == ""){
		//alert("Campos Vacíos");
		app.showNotificactionVBC("Campos Vacíos");
		//app.showNotificactionVBC('Campos Vacíos');
	}else if(!ValidaEmails(emailConfirm)){
		return false;
		app.showNotificactionVBC("* CONFIRMACIÓN EMAIL INVÁLIDO: El correo electrónico no coincide con la confirmación");
		alert("Confirmación Erronea");
	}else if(!ValidaEmail(email)){
		return false;
		app.showNotificactionVBC("* EMAIL INVÁLIDO: El correo Electrónico debe contener un @ y un punto");
	}else if(!ValidaTelefono(telefono)){
		return false;
		app.showNotificactionVBC("* TELÉFONO INVÁLIDO: El Número de Teléfono debe contener 10 dígitos");
	}else if(!ValidaCurp(curp)){
		return false;
		app.showNotificactionVBC("* CURP INVÁLIDO: El CURP debe contener 18 caracteres");
	}else if(!ValidaRfc(rfc)){
		return false;
		app.showNotificactionVBC("* RFC INVÁLIDO: El RFC debe contener 13 caracteres");
	}else{
		return true;
		//window.location.href = "suscriptores3.html";
	}
}

function ValidaCamposVacios2(){
	var calle = $('#txtCalle').val();
	var num = $('#txtNum').val();
	var colonia = $('#txtColonia').val();
	var estado = $('#estado').val();
	var ciudad = $('#txtCiudad').val();
	var cp = $('#txtCP').val();

	if(calle == "" || num == "" || colonia == "" || estado == "estado" || ciudad == "" || cp == ""){
		//alert("Campos Vacíos");
		app.showNotificactionVBC('Campos Vacíos');
	}else if(!ValidaCP(cp)){
		app.showNotificactionVBC("* CÓDIGO POSTAL INVÁLIDO: El código Postal debe contener 5 dígitos");
	}
	else{
		window.location.href = "suscriptores4.html";
	}
}



function ValidaCamposVacios3(){
	var alias = $('#txtAlias').val();
	var password = $('#txtPassword').val();
	var passwordConfirm = $('#txtPasswordConfirm').val();

	if(alias == "" || password == "" || passwordConfirm == ""){
		app.showNotificactionVBC('Campos Vacíos');
		return false;
	}else if(!ValidaContraseña2(passwordConfirm)){
		app.showNotificactionVBC('* CONFIRMACIÓN DE CONTRASEÑA INVÁLIDA: La contraseña no coincide con la confirmación');
		return false;
	}else if(!ValidaContraseña(password)){
		app.showNotificactionVBC('* CONTRASEÑA INVÁLIDA: La contraseña solo puede contener números y letras y no debe ser menor que 8 ni mayor que 12 caracteres');
		return false;
	}else if(!ValidaAlias(alias)){
		app.showNotificactionVBC('* ALIAS INVÁLIDO: El Alias es muy largo o contiene caracteres no válidos');
		return false;
	}else{
		return true;
	}

}

//Una vez validado que no haya campos vacíos y que cada uno de los valores sea correcto, se procede a validar que el CURP y el RFC no
//se encuentren previamente almacenados en la Base de Datos 
function validatePersonalInfo(){

    //Carga imagen ajax
    showWaitLoader('mascaraAJAX');
    $('#mascaraAJAX').fadeIn(300);

    if(ValidaCamposVacios()){
        var rfc = $('#txtRFC').val();
        var curp = $('#txtCURP').val();
        /*Devuelve '1' si el RFC no está disponible y 0 si aún no está siendo utilizado por otro usuario*/
        queryData('USP_VBC_VALIDATE_RFC', ['string', rfc], getIsRFCAvailable);
        function getIsRFCAvailable(dataSet){
            var rec = dataSet[0];console.log(rec);


            if(rec['error'] == 1){
                app.showNotificactionVBC('El RFC ha sido capturado anteriormente, favor de ingresar otro diferente');
            }else if(rec['error'] == 0){

            	//Devuelve '1' si el CURP no está disponible y 0 si aún no está siendo utilizado por otro usuario
            	queryData('USP_VBC_VALIDATE_CURP', ['string', curp], getIsCURPAvailable);
		        function getIsCURPAvailable(dataSet1){
		            var rec1 = dataSet1[0];console.log(rec1);

		            if(rec1['error'] == 1){
		            	app.showNotificactionVBC('El CURP ha sido capturado anteriormente, favor de ingresar otro diferente');
		            }else if(rec1['error'] == 0){
		            	window.location.href = "suscriptores3.html";
		            }
		            //oculta imagen ajax
		            $('#mascaraAJAX').fadeOut(300);
		            $('#mascaraAJAX').html('');
		        }
		                
            }
            //oculta imagen ajax
            $('#mascaraAJAX').fadeOut(300);
            $('#mascaraAJAX').html(''); 
        }                    
    }else{
        //oculta imagen ajax
        $('#mascaraAJAX').fadeOut(300);
        $('#mascaraAJAX').html(''); 
    }              
}
function Mail(newSponsorName, newSponsorId, newSponsorEmail, newSponsorAlias, newSponsorPassword, newSponsorOrderId, newSponsorOrderDetails){
	that = this;	
	that.sponsorId = localStorage.getItem("userIdLocal");
	//that.sponsorId = 37;
	that.sponsorName = localStorage.getItem("nameLocal");
	that.newSponsorName = newSponsorName;
	that.newSponsorId = newSponsorId;
	that.newSponsorEmail = newSponsorEmail;
	that.newSponsorAlias = newSponsorAlias;
	that.newSponsorPassword = newSponsorPassword;
	that.newSponsorOrderId = newSponsorOrderId;
	that.newSponsorOrderDetails = newSponsorOrderDetails;

	that.itemCode = that.newSponsorOrderDetails['itemCode'];
	that.itemDescription = that.newSponsorOrderDetails['description'];
	that.itemVolume = that.newSponsorOrderDetails['volume'];
	that.itemPrice = that.newSponsorOrderDetails['itemPrice'];
	that.initKitCode = that.newSponsorOrderDetails['initKitCode'];
	that.initKitDescription = that.newSponsorOrderDetails['initKitDescription'];
	that.initKitVolume = that.newSponsorOrderDetails['initKitVolume'];
	that.initKitPrice = that.newSponsorOrderDetails['initKitPrice'];
	that.subtotal = that.newSponsorOrderDetails['subtotal'];
	that.montoPorEnvio = that.newSponsorOrderDetails['montoPorEnvio'];
	that.impuestoTotal = that.newSponsorOrderDetails['impuestoTotal'];
	that.granTotal = that.newSponsorOrderDetails['granTotal'];
	that.reference = that.newSponsorOrderDetails['reference'];
	that.totalPuntos = that.newSponsorOrderDetails['totalPuntos'];
}

Mail.prototype.executeSponsorMail = function(){
	queryData('USP_VBC_GET_USER_PROFILE_INFO', ['integer', that.sponsorId], that.sendSponsorMail);
}

Mail.prototype.sendSponsorMail = function(dataSet){
	var rec = dataSet[0];

	var ruta = 'http://stramovil.vbc-for-mlm.com/ovm/WS_funciones.asmx/SEND_MAIL_GENERAL';	
	var sponsorMail = rec['email'];
	var parametros = {
        "to" : sponsorMail,
        "subject" : 'Un nuevo afiliado se ha inscrito a tu red!!!',
        "subject2" : 'Bienvenido a SmartNetworks',
        "sponsorName" : that.sponsorName,
        "newSponsorName" : that.newSponsorName,
        "newSponsorId" : that.newSponsorId,
        "newSponsorEmail" : that.newSponsorEmail,
        "newSponsorAlias" : that.newSponsorAlias,
        "newSponsorPassword" : that.newSponsorPassword,
        "newSponsorOrderId" : that.newSponsorOrderId.toString(),
        "itemCode" : that.itemCode,
        "itemDescription" : that.itemDescription,
        "itemVolume" : that.itemVolume,
        "itemPrice" : that.itemPrice,
        "initKitCode" : that.initKitCode,
        "initKitDescription" : that.initKitDescription,
        "initKitVolume" : that.initKitVolume,
        "initKitPrice" : that.initKitPrice,
        "subtotal" : that.subtotal,
        "montoPorEnvio" : that.montoPorEnvio,
        "impuestoTotal" : that.impuestoTotal,
        "granTotal" : that.granTotal,
        "reference" : that.reference,
        "totalPuntos": that.totalPuntos
      };console.log(parametros);
    $.ajax({
        url: ruta,
        type: 'POST',
        data: parametros,
        success: function(response){
            console.log('Exito '+response);
            if(response == "1"){                        
                console.log(response);
                that.goToEnd();
            }else{
            	console.log(response);
            	that.goToEnd();
            }
        }
    });	
}

Mail.prototype.goToEnd = function(){
	location.href="suscriptores6.html?granTotal="+that.granTotal+"&reference="+that.reference+"&numOrden="+that.newSponsorOrderId+"&nombre="+that.newSponsorName+"&newUserId="+that.newSponsorId+"&newUserAlias="+that.newSponsorAlias+"&newUserPassword="+that.newSponsorPassword+"&orderFlag=deposito&itemCode="+that.itemCode+"&description="+that.itemDescription+"&itemPrice="+that.itemPrice+"&initKitCode="+that.initKitCode+"&initKitDescription="+that.initKitDescription+"&initKitPrice="+that.initKitPrice+"&subtotal="+that.subtotal+"&montoXenvio="+that.montoPorEnvio+"&impuestoTotal="+that.impuestoTotal;
}
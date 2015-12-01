document.addEventListener('DOMContentLoaded', function(){

	var userId = localStorage.getItem("userIdLocal");
	userId = 12;
    var tipo  = "";
    var valor = 0;

    var db = window.openDatabase("ovm", "1.0", "Base de datos OVM", 200000);
    //db.transaction(limpiar);    


    /*Devuelve el Número de Notificaciones no leídas*/
    queryData('USP_VBC_GET_USER_NOTIFICATIONS_HIST', ['integer', userId, 'integer', 0, 'integer', 2], getNotificationsCount);
    function getNotificationsCount(dataSet){
        var rec = dataSet[0];
        var counter = 0;
        console.log(rec);
        for(var idx = 0; idx < dataSet.length; idx++){
            rec = dataSet[idx];
            counter = counter +1;
        }

        $('table tbody tr:nth-child(1) td a').prepend('<span>'+counter+'</span>');
        $('table tbody tr:nth-child(1) td a span').addClass('count');

        saveDatos(db, "notificaciones", counter);
    }

    /*Devuelve los saldos por cada comercio en el Monedero Electrónico*/
    queryData('USP_VBC_GET_WALLET_TYPE_BALANCE', ['integer', userId], getWalletBalances);
    function getWalletBalances(dataSet){
        var rec = dataSet[0];
        var auxArray = [];

        for(var idx = 0; idx < dataSet.length; idx++){
            rec = dataSet[idx];
            var completeBalance = (rec['userBalance']).toFixed(2);
            var splitBalance = completeBalance.split('.');

            auxArray.push(splitBalance);

        }
        saveDatos(db, "comencio tipo 1", auxArray[0][0] + "." + auxArray[0][1]);

        $('table tbody tr:nth-child(2) td a').append('<span>'+auxArray[0][0]+'</span>.'+auxArray[0][1]);
        $('table tbody tr:nth-child(2) td a span').addClass('count');

        saveDatos(db, "supermercado", auxArray[1][0] + "." + auxArray[1][1]);

        $('table tbody tr:nth-child(3) td a').append('<span>'+auxArray[1][0]+'</span>.'+auxArray[1][1]);
        $('table tbody tr:nth-child(3) td a span').addClass('count');

        saveDatos(db, "gasolineras", auxArray[2][0] + "." + auxArray[2][1]);

        $('table tbody tr:nth-child(4) td a').append('<span>'+auxArray[2][0]+'</span>.'+auxArray[2][1]);
        $('table tbody tr:nth-child(4) td a span').addClass('count');

        saveDatos(db, "otros comercios", auxArray[3][0] + "." + auxArray[3][1]);

        $('table tbody tr:nth-child(5) td a').append('<span>'+auxArray[3][0]+'</span>.'+auxArray[3][1]);
        $('table tbody tr:nth-child(5) td a span').addClass('count');
    }

    /*Devuelve el tipo de Usuario*/
    queryData('USP_VBC_GET_DASHBOARD', ['integer', userId], getPersonalVolume);
    function getPersonalVolume(dataSet){
        var rec = dataSet[0];

        
        $('table tbody tr:nth-child(6) td a').prepend('<span>'+rec['personalVolume']+'</span>');
        $('table tbody tr:nth-child(6) td a span').addClass('count');

        saveDatos(db, "volumen personal", rec['personalVolume']);
    }

    /*Devuelve el tipo de Usuario*/
    queryData('USP_VBC_GET_USER_TYPE', ['integer', userId], getUserType);
    function getUserType(dataSet){
        var rec = dataSet[0];

        
        $('table tbody tr:nth-child(9) td a').prepend('<span>'+rec['descriptionType']+'</span>');

        saveDatos(db, "tipo de usuario", rec['descriptionType']);
    }

	/*Devuelve los últimos inscritos del usuario que esperan por ser agregados a la RED*/
    queryData('USP_VBC_GET_WAITING_ROOM', ['integer', userId], getWaitingRoom);
    function getWaitingRoom(dataSet){
        var rec = dataSet[0];
        var cont = 0; //console.log(rec);         
        
        //==========VALIDAMOS EL OBJETO QUE NOS DEVUELVE EL QUERYDATA=================//

        if(typeof(rec) == 'undefined'){//Si el objeto viene como undefined, significa que no tiene sala de espera
            //console.log('1');
            cont = 0;
        	$('table tbody tr:nth-child(8) td a').attr('href', '#');
        }else if(rec['dataField0'] == 0){//Si el objeto viene con el item dataField0, significa que éste usuario aún no es agregado a la red del patrocinador
            //console.log('2');
            cont = 0;
            $('table tbody tr:nth-child(8) td a').attr('href', '#');
        }else{//Si el objeto viene cargado con los datos de nuevos RIR'S , significa que el usuario tiene una sala de espera de 'x' miembros
            //console.log('3');
            for(var idx = 0; idx < dataSet.length; idx++){
                rec = dataSet[idx];                
                cont = cont+1;                
            }
        }

        console.log(cont);//Imprimimos contador para pruebas
        $('table tbody tr:nth-child(8) td a').prepend('<span>'+cont+'</span>');
        $('table tbody tr:nth-child(8) td a span').addClass('count'); 
    }

    /*Devuelve la cantidad de miembros que pertencen a la red del usuario */
    queryData('USP_VBC_GET_MATRIX_VIEWER', ['integer',userId,'integer','0','integer','0','integer','18','integer','1'], getMembersCount);
    function getMembersCount(dataSet){
    	var rec = dataSet[0];
    	var cont = 0; 

        //================VALIDAMOS EL OBJETO QUE DEVUELVE EL QUERYDATA===============// 

        if(typeof(rec) == 'undefined'){
            $('table tbody tr:nth-child(7) td a').attr('href', '#');
        }else{
            for(var idx = 0; idx < dataSet.length; idx++){
                rec = dataSet[idx];
                cont = cont+1;
            }
            cont = cont - 1;
            if(cont == 0){//Si el contador es = a 1, significa que el único registro que devuelve el objeto es del mismo usuario, por lo tanto el contador se iguala a 0
                cont = 0;
                $('table tbody tr:nth-child(7) td a').attr('href', '#');
            }
        }

        $('table tbody tr:nth-child(7) td a').prepend('<span>'+cont+'</span>');
        $('table tbody tr:nth-child(7) td a span').addClass('count');

        $('#contenedor').fadeIn(300);
        counter();
        
        //oculta imagen ajax
        $('#mascaraAJAX').fadeOut(300);
        $('#mascaraAJAX').html('');

        saveDatos(db, "visor de arbol", cont);
    }

});

//Contador para digitos del panel de control
function counter(){
	//Contador animado para números
    $('.count').each(function () {
        $(this).prop('Counter',0).animate({
            Counter: $(this).text()
        }, {
            duration: 2000,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
    });
}

function limpiar(tx) {
    tx.executeSql("DROP TABLE IF EXISTS panel_de_control");
}

function selectPanel(tx) {
    tx.executeSql("SELECT * FROM panel_de_control", [], querySuccess, errorCB);
}
function errorCB(err) {
    //
}

function saveDatos(db, tipo, valor) {
    db.transaction(selectPanel, function(tx, result, tipo, valor) {
        if (result.rows.length >= 8) {
            tx.executeSql('UPDATE panel_de_control SET valor="'+valor+'" WHERE tipo="'+tipo+'"');
            //Mostrar
            var resultNum = result.rows.length;
            var text = "";
            for (var i = 0; i < resultNum; i++) {
                text = text + "tipo: " + result.rows.item(i).tipo + "; Valor: " + result.rows.item(i).valor + "\n";
            };
            alert(text);
        }
        else {
            //Guardar
            tx.executeSql('INSERT INTO panel_de_control(tipo, valor) VALUES("'+tipo+'","'+valor+'")');
        }
    });
}
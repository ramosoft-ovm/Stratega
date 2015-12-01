document.addEventListener('DOMContentLoaded',function() {
    //OBTENEMOS EL USERID LOCAL
    var userId =  localStorage.getItem('userIdLocal');
    //userId = 11;
    //SE ExTRAEN VARIABLES QUE VIENEN POR GET
    var period_id = getByURL()['period_id'];   

	var args = [
		'integer', 5, //@PN_FLAG
		'integer', 0 //@PN_ERROR
	];
	/*Devuelve los periodos*/
    queryData('USP_VBC_GET_PERIODS', args, getPeriods);
    function getPeriods(dataSet){
        var rec = dataSet[0];
        var text = '';

        for(var idx = 0; idx < dataSet.length; idx++){
            rec = dataSet[idx];
            if(rec['periodId'] == period_id){
                text += '<option value="'+ rec["periodId"] +'" selected>'+ rec["description"] +'</option>';
            }
            else{
                text += '<option value="'+ rec["periodId"] +'">'+ rec["description"] +'</option>';
            }
        }

        document.getElementById('periodo').innerHTML += text;

        //===================================//
        //CARGA DE HISTORIAL DE NOTIFIACIONES//
        //===================================//
        var args = [
            'integer', userId, //@PN_USER_ID
            'integer', document.getElementById('periodo').value, //@PN_PERIOD_ID
            'integer',  1  //@PN_FLAG
        ];
        queryData('USP_VBC_GET_USER_NOTIFICATIONS_HIST', args, getUserHist);
        function getUserHist(dataSet){
            var rec = dataSet[0];
            var text = '';

            if(typeof(rec) == 'undefined'){
                text += '<tr>';
                text += '<th class="notFound">';
                text += '<span>NO SE ENCONTRARON NOTIFICACIONES EN ESTE PERIODO</span>';
                text += '</th>';
                text += '</tr>';
            }else{
                //Se crea array asociativo para poder definir el estilo del span dependiento el status del empleado
                var status = new Array();
                var auxStatus = '';
                var sender_alias = '';
                var date_full = '';
                var day = '';
                var month = '';
                var year = '';
                var date = '';
                var hour = '';
                var notification_id = 0;
                var sender_user_id = 0;
                var description = '';
                var params = '';
                status[0] = 'notChecked';
                status[1] = 'checked';

                for(var idx = 0; idx < dataSet.length; idx++){
                    rec = dataSet[idx];
                    auxStatus = status[rec['notificationStatus']];
                    sender_alias = rec['senderAlias'];
                    date_full = rec['dateCreated'];
                    year = date_full.substr(0, 4);
                    month = date_full.substr(5, 2);
                    day = date_full.substr(8, 2);
                    date = day +' - '+ month +' - '+ year;
                    hour = date_full.substr(11, 5);
                    notification_id = rec['notificationId'];
                    sender_user_id = rec['senderUserId'];
                    description = rec['description'];

                    params = 'notificaciones_detalles.html?notification_id='+notification_id+'&sender_user_id='+sender_user_id+'&sender_alias='+sender_alias+'&description='+description+'&date='+date+'&hour='+hour+'&period_id='+periodo.value;

                    text += '<tr>';
                    text += '<th class="'+ auxStatus +'">';
                    text += '<span>Notificación de '+ sender_alias +'</span><span>Hora: '+ hour +'</span><br><br><span>Fecha: '+ date +'</span><a class="btnDetails" href="'+params+'"><span class="icon-eye iconDetails"></span> Ver detalles</a>';
                    text += '</th>';
                    text += '</tr>'; 
                } 
            }    
            document.querySelector('table#notificaciones tbody').innerHTML = text;               
            //oculta imagen ajax
            $('#mascaraAJAX').fadeOut(300);
            $('#mascaraAJAX').html('');
        }              
    }
    
    //===============================================================//
    //EVENTO QUE SE EJECUTA AL CAMBIAR EL VALOR DEL COMBO DE PERIODOS//
    //===============================================================//
    var periodo = document.getElementById('periodo');
    periodo.addEventListener('change', function(){
        //Carga imagen ajax
        showWaitLoader('mascaraAJAX');
        $('#mascaraAJAX').fadeIn(300);
        event.target.blur();
        var args = [
            'integer', userId, //@PN_USER_ID
            'integer', periodo.value, //@PN_PERIOD_ID
            'integer',  1  //@PN_FLAG
        ];
        queryData('USP_VBC_GET_USER_NOTIFICATIONS_HIST', args, getUserHist2);
        function getUserHist2(dataSet){
            var rec = dataSet[0];
            var text = '';

            if(typeof(rec) == 'undefined'){
                text += '<tr>';
                text += '<th class="notFound">';
                text += '<span>NO SE ENCONTRARON NOTIFICACIONES EN ESTE PERIODO</span>';
                text += '</th>';
                text += '</tr>';
            }else{
                //Se crea array asociativo para poder definir el estilo del span dependiento el status del empleado
                var status = new Array();
                var auxStatus = '';
                var sender_alias = '';
                var date_full = '';
                var day = '';
                var month = '';
                var year = '';
                var date = '';
                var hour = '';
                var notification_id = 0;
                var sender_user_id = 0;
                var description = '';
                var params = '';
                status[0] = 'notChecked';
                status[1] = 'checked';

                for(var idx = 0; idx < dataSet.length; idx++){
                    rec = dataSet[idx]; console.log(rec);
                    auxStatus = status[rec['notificationStatus']];
                    sender_alias = rec['senderAlias'];
                    date_full = rec['dateCreated'];
                    year = date_full.substr(0, 4);
                    month = date_full.substr(5, 2);
                    day = date_full.substr(8, 2);
                    date = day +' - '+ month +' - '+ year;
                    hour = date_full.substr(11, 5);
                    notification_id = rec['notificationId'];
                    sender_user_id = rec['senderUserId'];
                    description = rec['description'];

                    params = 'notificaciones_detalles.html?notification_id='+notification_id+'&sender_user_id='+sender_user_id+'&sender_alias='+sender_alias+'&description='+description+'&date='+date+'&hour='+hour+'&period_id='+periodo.value;

                    text += '<tr>';
                    text += '<th class="'+ auxStatus +'">';
                    text += '<span>Notificación de '+ sender_alias +'</span><span>Hora: '+ hour +'</span><br><br><span>Fecha: '+ date +'</span><a class="btnDetails" href="'+params+'"><span class="icon-eye iconDetails"></span> Ver detalles</a>';
                    text += '</th>';
                    text += '</tr>'; 
                }
            }
            document.querySelector('table#notificaciones tbody').innerHTML = text;
            //oculta imagen ajax
            $('#mascaraAJAX').fadeOut(300);
            $('#mascaraAJAX').html('');
        }
    });

    

    //=======================================//
    //EVENTO OCULTAR O MOSTRAR NOTIFICACIONES//
    //=======================================//
    var btnNotChecked = document.getElementById('btnNotChecked');
    var btnChecked = document.getElementById('btnChecked');

    btnNotChecked.addEventListener('click', function(){
        if($('th.notChecked').is(':hidden')){
            $('#btnNotChecked').html('<span class="icon-eye-minus icon"></span> Ocultar');
            $('th.notChecked').show(500); 
        }else{
            $('#btnNotChecked').html('<span class="icon-eye-plus icon"></span> Mostrar');
            $('th.notChecked').hide(500);
        }        
    });

    btnChecked.addEventListener('click', function(){
        if($('th.checked').is(':hidden')){
            $('#btnChecked').html('<span class="icon-eye-minus icon"></span> Ocultar');
            $('th.checked').show(500); 
        }else{
            $('#btnChecked').html('<span class="icon-eye-plus icon"></span> Mostrar');
            $('th.checked').hide(500);
        }        
    });
});
function eliminarCredenciales() {

    var userIdLocal = localStorage.getItem("userIdLocal");
    var regIdLocal = localStorage.getItem("regIdLocal");


    /*Elimina SESSION_CODE de usuario cuando cierrar sesión para evitar que siga recibiendo notificaciones*/
    queryData('USP_VBC_SET_DELETE_MOBILE_SESSION', ['string', regIdLocal, 'integer', userIdLocal], deleteMobileSession);
    function deleteMobileSession(dataSet){
      var rec = dataSet[0];

      if(rec['status'] == 0){
        //SE ELIMINAN VARIABLES LOCALES DE SESIÓN
        localStorage.clear();

        location.href = "login.html";
      }else{
        alert("Error en la BD");
      }
    }
    
}
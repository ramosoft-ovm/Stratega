///////////////////////////////////////////////////////
/*************** Extrae variables GET ****************/
function getByURL() {
    var url = location.search.replace("?", "");
        var encontrada = 0;
        while(encontrada == 0) {
            if (url.indexOf("%20") >= 0 || url.indexOf("á") >= 0 || url.indexOf("é") >= 0 || url.indexOf("í") >= 0 || url.indexOf("ó") >= 0 || url.indexOf("ú") >= 0 || url.indexOf("Á") >= 0 || url.indexOf("É") >= 0 || url.indexOf("Í") >= 0 || url.indexOf("Ó") >= 0 || url.indexOf("Ú") >= 0) {
                url = url.replace("%20"," ");
                url = url.replace("%C3%A1","a");
                url = url.replace("%C3%A9","e");
                url = url.replace("%C3%AD","i");
                url = url.replace("%C3%B3","o");
                url = url.replace("%C3%BA","u");
                url = url.replace("%C3%81","A;");
                url = url.replace("%C3%89","E");
                url = url.replace("%C3%8D","I");
                url = url.replace("%C3%93","O");
                url = url.replace("%C3%9A","U");
                url = url.replace("%C3%91","Ñ");
                url = url.replace("%C3%B1","ñ");
            } else {
                encontrada = 1;
            }
        }
    var arrUrl = url.split("&");
    var urlObject = {};
    for (var i = 0; i<arrUrl.length; i++) {
        var x= arrUrl[i].split("=");
        urlObject[x[0]]=x[1];
    }
    return urlObject;
}
///////////////////////////////////////////////////////
/************* Elimina >< de un string ***************/
function depurarXML(xml) {
    var encontrada = 0;
    while(encontrada == 0) {
        if (xml.indexOf("<") >= 0 || xml.indexOf(">") >= 0) {
            xml = xml.replace("<","&lt;");
            xml = xml.replace(">","&gt;");
        } else {
            encontrada = 1;
        }
    }
    return xml;
}

///////////////////////////////////////////////////////////////
/*****Extrae información sobre que Sistema Operativo usa******/
function getOS() {
    var navInfo = window.navigator.appVersion.toLowerCase();
    var os = 0;
    if(navInfo.indexOf('android') !== -1) {
        os = 1; //ANDROID
    }
    else if (navInfo.indexOf('mac') !== -1) {
        os = 2 //IOS
    }
    else if (navInfo.indexOf('win') !== -1) {
        os = 3; //WINDOWS
    };
    return os;
}

function setDates(today ,dias) {
    if (dias) {
        var tomorrow = new Date(today);
        tomorrow.setMinutes(tomorrow.getMinutes()+dias);
        return tomorrow;
    }
    else {
        var today = new Date();
        return today;
    }
}
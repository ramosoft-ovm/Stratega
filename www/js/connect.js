//=====================================================================================//
// EL SIGUIENTE CÓDIGO ES UNA IMPLEMENTACIÓN BÁSICA PARA LLAMAR EL WEBSERVICE VIA SOAP //
//=====================================================================================//
    //Clase auxiliar para generar clases basadas en un modelo OOP
    var Class = function(model){
        // Invoca al método de inicialización
        var instance = function(){this.setup.apply(this, arguments);};  
        // Hereda las propiedades del modelo al prototipo
        for(var method in model){instance.prototype[method] = model[method];};
        // Valída el inicializador
        if (!instance.prototype.setup) instance.prototype.setup = function(){};
        // Regresa la nueva clase creada
        return instance;
    };
    // Generación de Clase cliente SOAP WSCall
    var WSCall = Class({
        // Método de inicialización (constructor) de la nueva clase
        setup:function(soapURL, callBack){
            this.soapEndPoint = soapURL; // Recibe el SOAP endpoint 
            this.callBack = callBack||function(){}; // Recibe la funcion CallBack para ejecutarse al regreso de la llamada
            // Agregamos los nameSapces necesarios
            this.addNameSpace('http://www.w3.org/2001/XMLSchema-instance', 'xsi');
            this.addNameSpace('http://www.w3.org/2001/XMLSchema', 'xsd');
            this.addNameSpace('http://www.w3.org/2003/05/soap-envelope', 'soap');
        },
        // Agrega un elemento al XML de la petición (no aplica para XML complejos)
        addArgument:function(name, value, dataType){this._arguments[name] = {name:name, value:value, type:(dataType||'string')};},
        //Elimina argumentos de solicitudes ya realizadas
        removeArgument: function() {var i = 0;for(var argName in this._arguments){delete this._arguments['arg'+i];i++;}},
        // Agrega un nameSpace a la petición
        addNameSpace:function(uri, prefix){this._nameSpaces[prefix] = uri;},
        // Agrega un valor de encabezado
        addHeader:function(name, value){this._headers[name] = value;},
        // Construye el XML de la petición SOAP basado en los valores provistos
        buildXML:function(methodName, URI, prefix){
            // Agrega el nameSpace al encabezado
            if(URI && prefix) this.addNameSpace(URI, prefix);
            // Añade los nameSpaces al stream XML
            var xml = '<?xml version="1.0" encoding="utf-8"?><soap:Envelope';
            for(var nspace in this._nameSpaces){xml += ' xmlns:'+nspace+'="'+this._nameSpaces[nspace]+'"';};
            xml += '>';
            // Añade los datos del encabezado
            xml += '<soap:Header>';
            for(var header in this._headers){xml += '<'+header+'>'+this._headers[header]+'</'+header+'>';};
            xml += '</soap:Header>';
            // Añade el cuerpo de la petición
            xml += '<soap:Body>';
            var mtd = '';
            if(URI && prefix) {mtd = ' xmlns:'+prefix+'="'+URI+'"'};
            if(prefix) prefix = prefix+':';
            mtd = '<'+prefix+methodName+mtd+'>';
            for(var argName in this._arguments){
                var arg = this._arguments[argName];
                mtd += '<'+prefix+arg.name+' xsi:type="xsd:'+arg.type.toLowerCase()+'">'+arg.value+'</'+prefix+arg.name+'>';
            };
            mtd += '</'+prefix+methodName+'>';
            // Cierra el envolvente de la petición SOAP
            xml += mtd+'</soap:Body></soap:Envelope>';
            return xml;
        },
        // Colecciones privadas para los elementos de encabezado argumentos y namespaces
        _arguments:{},_nameSpaces:{},_headers:{},
        // Metodo de invocación del metodo SOAP
        invoke:function(methodName, URI, prefix){
            var This = this;
            // Obtiene el cuerpo de la peticion XML
            var xml = this.buildXML(methodName, URI, prefix);
            console.log(xml);
            // Obtiene una instancia del objeto HTTP
            var http = (function(){if(window.XMLHttpRequest) return new XMLHttpRequest();return new ActiveXObject('Microsoft.XmlHttp');})();
            // Eliminamos los reusltados de alguna petición previa
            delete this.responseXML;
            // Establecemos la peticion HTTP
            http.open('POST', this.soapEndPoint, true);
            // Agregamos un manejador de eventos para monitorear la respuesta del servidor
            http.onreadystatechange = function(){
                //TODO:Agregar manejador de errores
                //TODO: Obtener el fault info respectivo
                if(http.readyState == 4){ // Respueta del server HTTP completada
                    if(http.status = 200){ // El server respondio positivamente (Sin error)
                        var SOAP_REQUEST = 'Request', SOAP_RESPONSE = 'Response', SOAP_REPLY = 'Reply';
                        if(http.responseXML){ // La respuesta viene en formato XML (SOAP válido)
                            var xml = http.responseXML;
                            var methodResp = methodName;
                            // Las siguientes lineas aislan la respuesta SOAP y la asignan a la propiedad responseXML
                            This.responseXML = xml.getElementsByTagName(methodName + SOAP_RESPONSE)[0]; // Primer intento de filtrado
                            if(!This.responseXML){ // El primer intento no fue exitoso, Segundo intento
                    		    var delta = (methodName.length - SOAP_REQUEST.length);
                                if(methodName.lastIndexOf(SOAP_REQUEST) == delta){
                                    var alias = methodName.substr(0, (methodName.length - SOAP_REQUEST.length));
                                    This.responseXML = xml.getElementsByTagName(alias+SOAP_RESPONSE)[0];
                                };
                            };
                            // Tercer intento de resultado
                            if(!This.responseXML) This.responseXML = xml.getElementsByTagName(methodName+SOAP_REPLY)[0];
                            if(!This.responseXML){ // Ultimo intento asumiendo un nodo de respuesta unico
                                This.responseXML = xml.getElementsByTagName('Body')[0];
                                This.responseXML = This.responseXML.childNodes[0];
                            };
                        };
                        // Llamamos a la función de callBack con el texto de la respuesta
                        This.callBack(http.responseText);
                    }else{};
                };
            };
            // Agregamos el encabezado para indicar el tipo de data stream enviado
            http.setRequestHeader('Content-type', 'text/xml');
            // Ejecutamos la peticion HTTP
            http.send(xml);
        }
    });
//=====================================================================================//
//                  FIN DEL CÓDIGO PARA LA CREACIÓN DEL CLIENTE SOAP                   //
//=====================================================================================//

//=====================================================================================//
// Las siguientes lineas hacen uso de la clase WSCall() para obtener el dataSet        //
//=====================================================================================//
    //function queryData(){
    //var domain = "http://mexrednatura.vbc-for-mlm.com";
    var domain = "http://stramovil.vbc-for-mlm.com";
    function queryData(storedProcedure, parameters, method, tableSet){
        // Se crea la instancia del componente WSCAll, se proporciona el SOAP EndPoint 
        // y una funcion de CallBack que será ejecutada al regresar la respuesta del servidor
        //var soap = new WSCall('http://movil.vbc-for-mlm.com/rs_app_endpoint.asp', function(text){
        var soap = new WSCall(domain+'/rs_app_endpoint.asp', function(text){
            // En este punto, el servidor ha regresado su respuesta y si esta fue exitosa
            // existirá una proppiedad llamada responseXML que contendra la respuesta SOAP
            // Obtenemos el dataSet JSON de la respuesta
            if(soap.responseXML){
                // Evaluamos el valor de /response/@code
                var resp = soap.responseXML.getElementsByTagName('response')[0];
                if(resp.getAttribute('code') == '0'){// Si /response/@code es 0 (cero) la operación fue exitosa
                    // Convertimos el stream json a una variable javascript 
                    var json = eval('('+soap.responseXML.getElementsByTagName('dataSet')[0].childNodes[0].nodeValue+')');
                    //TODO:Implementar el codigo propio de la aplicación
                    
                    switch(tableSet){
                        case 1:
                            method(json.dataSet1);
                            break;
                        case 2:
                            method(json.dataSet2);

                            break;
                        case 3:
                            method(json.dataSet3);

                            break;
                        default:
                            method(json.dataSet);
                            break;
                    }
                } else {
                    //TODO:Implementar el codigo propio de la aplicación
                    alert(resp.getAttribute('message'));
                }
                //TODO:Implementar el codigo propio de la aplicación
            } else console.log("Fallo en la ejecución del método");
        });
        // Agregamos el namespace base
        // Agregamos las credenciales de acceso
        soap.addHeader('appId', 'VBCVO');
        soap.addHeader('apiKey', 'uZyA9ICJVVEYtOCI');
        
        //Elimina argumentos de solicitudes ya realizadas
        soap.removeArgument();
        // Llamada SQL con sus argumentos (argName, argValue, dataType)
        soap.addArgument('sql', storedProcedure);
        var cont = 0;
        if (parameters != '') {
            for (var i = 0; i < parameters.length; i++) {
                soap.addArgument('arg'+cont,  parameters[i+1], parameters[i]);
                i+=1;cont+=1;
            }
        }
        //soap.addArgument('arg0',  0, 'integer');
        // Invokamos el metodo con su namespace respectivo
        //showWaitLoader(); //Mostramos la animacion de espera....
        soap.invoke('dataRequest', 'http://api.ramosoft.com/namespace/', 'rs');
    }

function showWaitLoader(id){
    var div = document.getElementById(id);
    div.innerHTML = '<div id="img"><img src="data:image/gif;base64,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" /></div>';
}
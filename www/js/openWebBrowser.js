//========================================================================//
//SE ABRE EL PDF DEL CONTRATO CON EL NAVEGADOR AUXILIAR PARA LA APLICACIÓN//
//========================================================================//

var btnOpenContract = document.getElementById('btnOpenContract');
btnOpenContract.addEventListener('click', function(){
  /*if(getOS() == 1){alert('Android');
    var ref = window.open('https://docs.google.com/viewer?url=http://stramovil.vbc-for-mlm.com/doc/SMARTNETWORKS%20CONTRATO%20PARA%20AFLIAR%20MIEMBROS.pdf', '_blank', 'location=no');
  }else if(getOs() == 2){alert('iOS');
    var ref = window.open('https://docs.google.com/viewer?url=http://stramovil.vbc-for-mlm.com/doc/SMARTNETWORKS%20CONTRATO%20PARA%20AFLIAR%20MIEMBROS.pdf', '_blank', 'location=yes');
  }*/
  var ref = window.open('https://docs.google.com/viewer?url=http://stramovil.vbc-for-mlm.com/doc/SMARTNETWORKS%20CONTRATO%20PARA%20AFLIAR%20MIEMBROS.pdf', '_blank', 'location=yes');
});

//===================================================================================//
//SE ABRE EL PDF DEL AVISO DE PRIVACIDAD CON EL NAVEGADOR AUXILIAR PARA LA APLICACIÓN//
//===================================================================================//

var btnOpenPrivacy = document.getElementById('btnOpenPrivacy');
btnOpenPrivacy.addEventListener('click', function(){
  /*if(getOs() == 1){alert('Android');
    var ref = window.open('https://docs.google.com/viewer?url=http://stramovil.vbc-for-mlm.com/doc/SmartNetworks%20aviso%20Privacidad.pdf', '_blank', 'location=no');
  }else if(getOS() == 2){alert('iOS');
    var ref = window.open('https://docs.google.com/viewer?url=http://stramovil.vbc-for-mlm.com/doc/SmartNetworks%20aviso%20Privacidad.pdf', '_blank', 'location=yes');
  }*/
  var ref = window.open('https://docs.google.com/viewer?url=http://stramovil.vbc-for-mlm.com/doc/SmartNetworks%20aviso%20Privacidad.pdf', '_blank', 'location=yes');
});

//================================================================================//
//SE ABRE EL NAVEGADOR AUXILIAR PARA CONSULTA DE RFC SI EL USUARIO ASÍ LO REQUIERE//
//================================================================================//

var btnCheckRFC = document.getElementById('btnCheckRFC');
btnCheckRFC.addEventListener('click', function(){
  /*if(getOs() == 1){alert('Android');
    var ref = window.open('http://www.curpyrfc.com.mx/t-www.tramitanet.gob.mx-curp', '_blank', 'location=no');
  }else if(getOS() == 2){alert('iOS');
    var ref = window.open('http://www.curpyrfc.com.mx/t-www.tramitanet.gob.mx-curp', '_blank', 'location=yes');
  }*/
  var ref = window.open('http://www.curpyrfc.com.mx/t-www.tramitanet.gob.mx-curp', '_blank', 'location=yes');
});

//=================================================================================//
//SE ABRE EL NAVEGADOR AUXILIAR PARA CONSULTA DE CURP SI EL USUARIO ASÍ LO REQUIERE//
//=================================================================================//

var btnCheckCurp = document.getElementById('btnCheckCurp');
btnCheckCurp.addEventListener('click', function(){
  /*if(getOs() == 1){alert('Android');
    var ref = window.open('http://consultas.curp.gob.mx/CurpSP/', 'location=no');
  }else if(getOS() == 2){alert('iOS');
    var ref = window.open('http://consultas.curp.gob.mx/CurpSP/', '_blank', 'location=yes');
  }*/
  var ref = window.open('http://consultas.curp.gob.mx/CurpSP/', '_blank', 'location=yes');
});
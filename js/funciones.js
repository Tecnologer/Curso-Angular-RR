var app=angular.module('curso',[]);

app.controller('controladorBody',['$scope','funciones','$http',function($scope,funciones,$http){
	$scope.ciudades=[];
	$scope.nb_estado='';
	$scope.nb_ciudad='';
	$scope.sn_editar=false;

	funciones.listarDB().success(function(data){

			if(data.ISOK)
			{
				$scope.ciudades=queryToJson(data.QUERY);
				$scope.nb_estado='';
				$scope.nb_ciudad='';
			}
			else
				alert(data.MSG);
		});

	$scope.guadarDB=function(){
		funciones.guadarDB($scope.nb_estado,$scope.nb_ciudad).success(function(data){

			if(data.ISOK)
			{
				$scope.ciudades=queryToJson(data.QUERY);
				$scope.nb_estado='';
				$scope.nb_ciudad='';
			}
			else
				alert(data.MSG);
		});
	};

	$scope.guardar=function(){
		var serv=funciones.guardar($scope.ciudades,$scope.nb_estado,$scope.nb_ciudad);

		if(serv.isOk)
		{
			$scope.ciudades=serv.ciudades;
			$scope.nb_estado='';
			$scope.nb_ciudad='';
		}
	};

	$scope.editar=function(ciudad){
		$scope.sn_editar=true;
		$scope.nb_estado=ciudad.nb_estado;
		$scope.nb_ciudad=ciudad.nb_ciudad;
		idCiudad=ciudad.id_ciudad;
	};

	$scope.guardarEdicion=function(){
		var serv=funciones.editar($scope.ciudades,idCiudad,$scope.nb_estado,$scope.nb_ciudad);

		if(serv.isOk)
		{
			$scope.ciudades=serv.ciudades;
			$scope.nb_estado='';
			$scope.nb_ciudad='';
			$scope.sn_editar=false;
		}
	};

	$scope.eliminar=function(ciudad){
		if(confirm('Estas seguro?, seguro seguro'))
			$scope.ciudades=funciones.eliminar($scope.ciudades,ciudad);
	};

	$scope.eliminarDB=function(ciudad){
		if(confirm('Estas seguro?, seguro seguro'))
			funciones.eliminarDB(ciudad.ID_CIUDAD).success(function(data){
				if(data.ISOK)
				{
					$scope.ciudades=queryToJson(data.QUERY);
					$scope.nb_estado='';
					$scope.nb_ciudad='';
				}
				else
					alert(data.MSG);
			});
	};
}]);

app.service('funciones',['$http',function($http){
	var retorno={};
	retorno.guardar=function(ciudades,nb_estado,nb_ciudad){
		var isOk=false;
		if(nb_estado!='')
		{
			if(nb_ciudad!='')
			{
				id_ciudad=ciudades.length+1;
				ciudades.push({id_ciudad: id_ciudad, nb_estado: nb_estado, nb_ciudad: nb_ciudad});
				isOk=true;				
			}
			else
			{
				alert("El nombre de la ciudad es requerido");
			}
		}
		else
		{
			alert("El nombre del estado es requerido");
		}

		return {isOk: isOk, ciudades: ciudades};
	};

	retorno.editar=function(ciudades,id_ciudad,nb_estado,nb_ciudad){
		var isOk=false;
		if(nb_estado!='')
		{
			if(nb_ciudad!='')
			{
				ciudades[id_ciudad-1].nb_estado=nb_estado;
				ciudades[id_ciudad-1].nb_ciudad=nb_ciudad;
				isOk=true;				
			}
			else
			{
				alert("El nombre de la ciudad es requerido");
			}
		}
		else
		{
			alert("El nombre del estado es requerido");
		}

		return {isOk: isOk, ciudades: ciudades};
	};

	retorno.eliminar=function(ciudades,ciudad){
		var ind=ciudades.indexOf(ciudad);
		if(ind>=0)
			ciudades.splice(ind,1);

		return ciudades;
	};

	retorno.guadarDB=function(nb_estado,nb_ciudad){
		var params='nb_estado='+nb_estado+'&nb_ciudad='+nb_ciudad;
		return $http({url: 'ciudades.cfc?method=agregar&'+params,method:'POST'});
	};

	retorno.eliminarDB=function(id_ciudad){
		return $http({url: 'ciudades.cfc?method=eliminar&id_ciudad='+id_ciudad,method:'POST'});
	};

	retorno.listarDB=function(){
		return $http({url: 'ciudades.cfc?method=listar',method:'POST'});
	};


	return retorno;
}]);


function queryToJson(query)
{
	var arreglo=[];
	for(var i=0;i<query.DATA.length;i++)
	{
		var ciudad={};
		for(var j=0;j<query.COLUMNS.length;j++)
		{
			ciudad[query.COLUMNS[j]]=query.DATA[i][j];
		}

		arreglo.push(ciudad);
	}

	return arreglo;
}
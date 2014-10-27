<cfcomponent>
	<cffunction name="agregar" access="remote" returnformat="JSON">
		<cfargument name="nb_estado" type="string" required="true">
		<cfargument name="nb_ciudad" type="string" required="true">

		<cfset var Local.result=structNew()>
		<cftransaction>
			<cftry>				
					<cfquery datasource="cnx_test" name="ciudad">
						select IFNULL(max(id_ciudad)+1,1) as nextID from ciudades
					</cfquery>

					<cfquery datasource="cnx_test">
						insert into ciudades (id_ciudad,nb_estado,nb_ciudad) values (#ciudad.nextID#,'#arguments.nb_estado#','#arguments.nb_ciudad#')
					</cfquery>

					<cfquery datasource="cnx_test" name="Local.ciudades">
						select * from ciudades
					</cfquery>

					<cfset Local.result.ISOK=true>
					<cfset Local.result.QUERY=Local.ciudades>

				<cfcatch type="any">
					<cftransaction action="rollback">
					<cfset Local.result.ISOK=false>
					<cfset Local.result.MSG=cfcatch.detail>
				</cfcatch>
			</cftry>
		</cftransaction>

		<cfreturn Local.result>
	</cffunction>

	<cffunction name="eliminar" access="remote" returnformat="JSON">
		<cfargument name="id_ciudad" type="string" required="true">

		<cfset var Local.result=structNew()>
		<cftransaction>
			<cftry>				

					<cfquery datasource="cnx_test">
						DELETE FROM `ciudades` WHERE id_ciudad=#arguments.id_ciudad#
					</cfquery>

					<cfquery datasource="cnx_test" name="Local.ciudades">
						select * from ciudades
					</cfquery>

					<cfset Local.result.ISOK=true>
					<cfset Local.result.QUERY=Local.ciudades>

				<cfcatch type="any">
					<cftransaction action="rollback">
					<cfset Local.result.ISOK=false>
					<cfset Local.result.MSG=cfcatch.detail>
				</cfcatch>
			</cftry>
		</cftransaction>

		<cfreturn Local.result>
	</cffunction>

	<cffunction name="listar" access="remote" returnformat="JSON">

		<cfset var Local.result=structNew()>
		<cftransaction>
			<cftry>				

					<cfquery datasource="cnx_test" name="Local.ciudades">
						select * from ciudades
					</cfquery>

					<cfset Local.result.ISOK=true>
					<cfset Local.result.QUERY=Local.ciudades>

				<cfcatch type="any">
					<cftransaction action="rollback">
					<cfset Local.result.ISOK=false>
					<cfset Local.result.MSG=cfcatch.detail>
				</cfcatch>
			</cftry>
		</cftransaction>

		<cfreturn Local.result>
	</cffunction>
</cfcomponent>
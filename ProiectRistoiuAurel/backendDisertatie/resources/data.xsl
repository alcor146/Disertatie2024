<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
 <xsl:output method="html" indent="yes" version="4.01"
  doctype-system="http://www.w3.org/TR/html4/strict.dtd"
  doctype-public="-//W3C//DTD HTML 4.01//EN"/>

 <xsl:template match="/">
 <link rel="stylesheet" type="text/css" href="data.css"/>
	<html>
		<body>
			<h1 >Bike rentals</h1>
				<table border="1" class="center">
					<tr>
                        <th style="text-align:center">ID</th>
						<th style="text-align:center">Name</th>
						<th style="text-align:center">Social Security Number</th>
                        <th style="text-align:center">Security Series</th>
                        <th style="text-align:center">Security Number</th>
                        <th style="text-align:center">Phone Number</th>
                        <th style="text-align:center">Date</th>
                        <th style="text-align:center">Number of Hours</th>
                        <th style="text-align:center">bykeType</th>
                        <th style="text-align:center">numberOfBykes</th>
					</tr>
                    <xsl:for-each select="rentals/rental">
                        <tr>	
                            <td style="text-align:center"><xsl:value-of select="@id"/></td>
                            <td style="text-align:center"><xsl:value-of select="clientInformation/name"/></td>
                            <td style="text-align:center"><xsl:value-of select="clientInformation/SSN"/></td>
                            <td style="text-align:center"><xsl:value-of select="clientInformation/securitySeries"/></td>
                            <td style="text-align:center"><xsl:value-of select="clientInformation/securityNumber"/></td>
                            <td style="text-align:center"><xsl:value-of select="clientInformation/phoneNumber"/></td>
                            <td style="text-align:center"><xsl:value-of select="rentalDetails/date"/></td>
                            <td style="text-align:center"><xsl:value-of select="rentalDetails/numberOfHours"/></td>
                            <td style="text-align:center"><xsl:value-of select="rentalDetails/bikeDetails/bykeType"/></td>
                            <td style="text-align:center"><xsl:value-of select="rentalDetails/bikeDetails/numberOfBykes"/></td>
                        </tr>
                    </xsl:for-each>	
				</table>
		</body>
	</html>
 </xsl:template> 
</xsl:stylesheet>
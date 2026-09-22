# The Deryneia icon workflow to populate the KB
# Prepare the input data
We started with the [xmind representation of Deryneia](xmind/Deryneia-xmind.xmind) provided by S. Hermon, CyI.
Available also as [pdf file](xmind/Deryneia-xmind.pdf) 

We used a local installation of SYNTHESIS, a cultural information management system (https://www.ics.forth.gr/isl/synthesis-core) developed by FORTH, to input as much information as possible from the xmind representation.

Installation: http://139.91.183.118:8088/synthesis_echoes/
Credentials: 	Username: admin
Password: admin@9803

The export of SYNTHESIS is an xml representation. The files are available in [XML input files](XMLinput/).

# Map the input data to the HDTO

The XML files were used as input in the 3M Mapping Memory Manager (https://www.ics.forth.gr/isl/x3ml-toolkit)

Installation: https://demos.isl.ics.forth.gr/3m/ 
Users can register to get access to the mapping:
HRID: 486597 ECHOES OFFICIAL Derynia A.296
This mapping uses the official HDTO definition HDT v1.1 and its RDFS implementation [HDT_v1.1.rdf](../../rdfs/HDT_v1.1.rdf) 

Mapping HRID: 486597 ECHOES OFFICIAL Derynia A.296 consists of 10 mappings. 
1. Select Mappings 1-5 (Physical properties) only and produce rdf. The result is available in [Deryneia-PhysProperties.rdf](ingest/Deryneia-PhysProperties.rdf)
2. Select Mapping 6 (Examinations) only and produce rdf. Split this rdf into two files, with the two examinations. The results are available in [Deryneia-FTIR.rdf](ingest/Deryneia-FTIR.rdf) and [Deryneia-MA-XRF.rdf](ingest/Deryneia-MA-XRF.rdf)
3. Select Mapping 7 (Conservations) only and produce rdf. The result is available in [Deryneia-Conservation.rdf](ingest/Deryneia-Conservation.rdf)
4. Select Mapping 9 and 10 (Valuation, Heritage Declaration Event) only and produce rdf. The result is available in [Deryneia-Valuation.rdf](ingest/Deryneia-Valuation.rdf)


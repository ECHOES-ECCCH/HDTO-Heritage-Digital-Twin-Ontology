# About

This file has been manually created in order to provide a summary of the rdf encoding changes between HDTO versions.

## [HDTO v1.2](http://isl.ics.forth.gr/ontology/echoes/1.2/) changes compared to [HDTO v1.1](http://isl.ics.forth.gr/ontology/echoes/1.1/)

1. `HP21_is_3D_representation_output_of`
    * Range: `HC1_Heritage_Entity` changed to `S15_Observable_Entity`

2. `HP21i_has_3D_representation`
    * Domain: `HC1_Heritage_Entity` changed to `S15_Observable_Entity`

3. `HP22_represents`
    * subPropertyOf: `P138_represents` changed to subPropertyOf: `P70_documents`

4. `HP22i_has_digital_representation`
    * subPropertyOf: `P138i_has_representation` changed to subPropertyOf: `P70i_is_documented_in`

5. New Properties:
    * `HP29i_is_digital_object_part_of`
        * domain: `D1_Digital_Object`
        *  range: `HC14_Volatile_Digital_Object`
        * subPropertyOf: `P106i_forms_part_of`
		* (addition of inverse property name for `HP29_has_digital_object_part`)
		

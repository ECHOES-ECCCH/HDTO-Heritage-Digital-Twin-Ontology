# About

This file has been manually created in order to provide a summary of the changes in class and property declarations between HDTO versions.

## [HDTO v1.2](http://isl.ics.forth.gr/ontology/echoes/1.2/) changes compared to [HDTO v1.1](http://isl.ics.forth.gr/ontology/echoes/1.1/)

1. Property `HP21 is 3D representation output of (has 3D representation)` change of the **range** specification (add scope note adjustment):
   - Previous value: `HC14 Volatile Digital Object`. `HP29 has digital object part`: `D1 Digital Object`
   - New value: `HC14 Volatile Digital Object`. `HP29 has digital object part (is digital object part of)`: `D1 Digital Object`

2. Property: `HP22 represents (has digital representation)` change of the **subpropertyOf** specification:
   - Previous value: `HP22 represents (has digital representation)`. `rdfs:subPropertyOf`: `crm:P70 documents (is documented in)`
   - New value: `HP22 represents (has digital representation)`. `rdfs:subPropertyOf`: `crm:P138 represents (has representation)`
 
 3. Property `HP29 has digital object part (is digital object part of)` addition of an **inverse property name**:
    - Previous value: `HC1 Heritage Entity`
    - New value: `crmsci:S15 Observable Entity`

 4. Property `HP30 added content (content was added by)` change of the **quantification** specification:
    - Previous value: `many to many, necessary (1,n:0,n)`
    - New value: `many to many (0,n:0,n)`

 5. Property `HP33 contains (is proposition set of)` change of the **quantification** specification:
    - Previous value: `one to many, necessary (1,n:0,1)`
    - New value: `one to many (0,n:0,1)`


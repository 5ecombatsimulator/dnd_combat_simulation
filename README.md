# dnd_combat_simulation

# Setup

<ol>
  <li>Clone repo to local</li>
  <li>Create any local python environment you want to run for this (I'm using anaconda)</li>
  <li>Run "pip install -r reqs.txt"</li>
  <li>Run "python3 manage.py migrate"</li>
  <li>Run "python3 manage.py shell" and then "from test_data.dice import gen_dice; gen_dice()"</li>
  <li>Exit shell and go to https://github.com/ceryliae/DnDAppFiles/blob/master/Bestiary/Monster%20Manual%20Bestiary.xml and download that file to a new directory: xml_data/data</li>
  <li>Back to the django shell and run "from xml_data.convert_source_monsters_xml import *; parse_file("PATH_TO_XML_DATA/DATA_ON_LOCAL/Monster Manual Bestiary.xml")</li>
  <li>In a separate bash shell: cd into frontend directory and run yarn install then yarn start</li> 
  <li>Again, in a separate bash shell, be at top level directory and run "python3 manage.py runserver"</li>
  <li>Head to localhost:3000/simulation to view app</li>
</ol>

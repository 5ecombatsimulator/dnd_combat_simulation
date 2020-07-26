# D&D 5e Combat Simulator

## Version 0.1

# Setup
### Requirements to run locally:
<ol>
  <li>Docker: https://www.docker.com/products/docker-desktop</li>
</ol>

### Steps to set up
<ol>
  <li>Clone repo to local</li>
  <li>cd into directory</li>
  <li>Run: "docker-compose build" - this should build both the frontend and backend environments for you. </li>
  <li>Run: "docker-compose run api migrate"</li>
  <li>Go to: https://github.com/ceryliae/DnDAppFiles/blob/master/Bestiary/Monster%20Manual%20Bestiary.xml and download that file. Put it in the xml_data/data directory</li>
  <li>Run "docker-compose run api shell"</li>
  <li>Inside the shell for the api container, run: "from xml_data.convert_source_monsters_xml import *; parse_file('Monster Manual Bestiary.xml')"</li>
  <li>Run "docker-compose up"</li>
  <li>Head to localhost:3000/ to view the app!</li>
</ol>

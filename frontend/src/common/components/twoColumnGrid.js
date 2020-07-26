import React  from 'react';
import "react-table/react-table.css";
import { Grid } from 'semantic-ui-react'

const TwoColumnGrid = ({col1Content, col2Content}) => (
  <div>
    <Grid>
      <Grid.Column className="eight wide">
        {col1Content}
      </Grid.Column>
      <Grid.Column className="eight wide">
        {col2Content}
      </Grid.Column>
    </Grid>
  </div>
);

export default TwoColumnGrid
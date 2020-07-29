import React  from 'react';
import "react-table/react-table.css";
import "../../styles/textStyles.css"
import { Grid } from 'semantic-ui-react'


const InformationPageReact = () => {
  return (
    <div>
      <Grid className="eight wide">
        <Grid.Row>
          <Grid.Column className="sixteen wide text-left">
            <h1>Welcome to D&D 5e Combat Simulator v0.1</h1>
            <h3>Have you ever wondered...</h3>
            <ul>
              <li>Can a hobgoblin kill a bugbear?</li>
              <li>How many goblins does it take to beat an Ancient Red Dragon?</li>
              <li>What are the chances my players will survive this battle?</li>
              <li>Is there a chance this combat drags on for more than 10 rounds?</li>
            </ul>
            <h3>If so, then this tool is for you!</h3>
            <h2>What is this?</h2>
            <p>
              D&D Combat Simulator allows the user to input two opposing sides of a combat and then
              simulates D&D combat in theater of the mind style. To get an understanding
              of all the different ways that combat might turn out, it will simulate hundreds
              of battles. Then, it will report out the results about who wins most, how often
              they win and how many rounds the battle took on average when each side won.
            </p>
            <h2>How do I use it?</h2>
            <p>Head over to the battle simulator tab marked with the crossed swords.
              Once there, you can click on each combatant from the list or search
              for one you're looking for. Once you've selected one or more combatants for
              each side, press 'Fight!' and you'll get your results shortly.
            </p>
            <p>
              If you want to add in any of your own players, you'll need to
              head over to the combatant creation screen and put them in. You can also create
              unique actions for them in the action creation screen. It's
              a little tedious now, but we're looking to make big improvements
              in the future!
            </p>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column className="ui raised segment seven wide" style={{backgroundColor:"#f2f2f2"}}>
            <h2 style={{textAlign: "center"}}>FAQs</h2>
            <h3 className="text-left">Can I save my combatants?</h3>
            <p className="text-left">
              Currently, you can save a unique series of letters and numbers that will let you easily
              import them again in the future! We're also looking into building account
              features in the future so your character can be more easily saved and
              possibly even allow you to import them from elsewhere.
            </p>
          </Grid.Column>
          <Grid.Column className="two wide"/>
          <Grid.Column className="ui raised segment seven wide" style={{backgroundColor:"#f2f2f2"}}>
            <h2>Contributing</h2>
            <h3>Where can I contribute?</h3>
            <p>If you'd like to contribute code to the project, you can open a pull request here: <a href="https://github.com/adumit/dnd_combat_simulation">https://github.com/adumit/dnd_combat_simulation</a></p>
            <h3>Contributing to the server costs</h3>
            <p>If you'd like to buy us a coffee, go here: <a href="https://www.buymeacoffee.com/5ecombatsim">https://www.buymeacoffee.com/5ecombatsim</a></p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  )
}

export default InformationPageReact
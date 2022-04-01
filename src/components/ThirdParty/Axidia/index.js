import React from 'react'
import {AuthConsumer} from 'context/AuthContext'
import {Link} from '@material-ui/core'
import image from './Axidia_Flyer.jpg'
import {withStyles} from '@material-ui/core/styles'


const styles = () => ({
  Paper: {
    textAlign: 'center',
    marginTop: 70,
  },
  image: {
    maxWidth: 1100,
    width: '100%',
  }
});

function Axidia({classes}) {
  return (
    <div className={classes.Paper}>
      <AuthConsumer>
        {({user}) => (
          <Link href={'/api/v1/3rdpartyapp/' + user.categories.thirdPartyApps.modules.axidia.id + '?redirect=http://axidia.com/'} target="_blank" rel="noopener noreferrer"><img src={image} className={classes.image} alt="axidia"/></Link>
        )}
      </AuthConsumer>
    </div>
  )
}

export default withStyles(styles)(Axidia);
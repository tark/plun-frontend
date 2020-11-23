import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import './main.css';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import {useHistory} from 'react-router-dom';
import OrganizationsList from './OrganizationsList';
import Loader from '../components/loader';
import {fetchProfile} from '../../services/profile_service';
import Plans from './Plans';
import {errorSelectors} from '../../store/slices/error_slice';
import {setError} from '../../store/slices/error_slice';
import {profileSelectors} from '../../store/slices/profile_slice';

export default function Main(props: any) {

  const dispatch = useDispatch()

  const profile = useSelector(profileSelectors.profile)
  const unauthorized = useSelector(profileSelectors.unauthorized)
  const history = useHistory()
  const error = useSelector(errorSelectors.error) ?? ''

  useEffect(() => {
    if (!profile) {
      dispatch(fetchProfile())
    }
  }, [])

  useEffect(() => {
    if (unauthorized) {
      // unauthorized is not our problem
      // let's [Home.tsx] fix it
      history.push('/login')
    }
  }, [unauthorized])

  const handleErrorClose = () => {
    dispatch(setError(null))
  }

  console.log(`Main - id - ${process.env.REACT_APP_AZURE_APP_ID}`)
  console.log(`Main - secret 1 - ${process.env.REACT_APP_AZURE_APP_SECRET}`)
  console.log(`Main - secret 2 - ${process.env.REACT_APP_AZURE_CLIENT_SECRET}`)
  console.log(`Main - callback url - ${process.env.REACT_APP_AZURE_CALLBACK_URL}`)
  console.log(`Main - ----`)

  return <div className='main'>
    <Drawer
      className='drawer'
      variant="permanent"
      classes={{paper: 'drawerPaper'}}
      anchor="left">

      <List>

        {!profile && <Loader/>}

        {profile && <ListItem button disableGutters key={profile.name}>
          <ListItemText primary={profile.name}/>
        </ListItem>}

        <Divider/>

        {!profile && <Loader/>}

        {profile && <OrganizationsList/>}

      </List>

    </Drawer>

    <Plans/>

    <Snackbar
      open={!!error}
      autoHideDuration={6000}
      onClose={handleErrorClose}>
      <Alert
        onClose={handleErrorClose}
        severity="error">
        {error}
      </Alert>
    </Snackbar>

  </div>
}



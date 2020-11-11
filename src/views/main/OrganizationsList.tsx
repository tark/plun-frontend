import React, {useEffect} from 'react'
import './main.css';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import BusinessIcon from '@material-ui/icons/Business';
import Divider from '@material-ui/core/Divider';
import {useDispatch, useSelector} from 'react-redux';
import ProjectsList from './ProjectsList';
import Loader from '../components/loader';
import {fetchOrganizations} from '../../services/profile_service';
import {profileSelectors, selectOrganization} from '../../store/slices/profile_slice';

export default function OrganizationsList(props: any) {

  const dispatch = useDispatch()
  const organizations = useSelector(profileSelectors.organizations)
  const organizationsLoading = useSelector(profileSelectors.organizationsLoading)
  const selectedOrganization = useSelector(profileSelectors.selectedOrganization)

  useEffect(() => {
    dispatch(fetchOrganizations())
  }, [])

  useEffect(() => {
    if (organizations) {
      dispatch(selectOrganization(organizations[0]))
    }
  }, [organizations])

  return (
    <div>

      {organizationsLoading && <Loader/>}

      {organizations && !organizations.length && (
        <div>No projects for this organization</div>
      )}

      {organizations && organizations.length && organizations.map(o => (
        <div key={o.id}>
          <List>
            <ListItem
              button
              key='project'
              selected={selectedOrganization?.azureId === o.azureId}
              onClick={() => dispatch(selectOrganization(o))}>
              <ListItemIcon><BusinessIcon/></ListItemIcon>
              <ListItemText primary={o.name}/>
            </ListItem>
            <ProjectsList organization={o}/>
          </List>
          <Divider/>
        </div>
      ))}

    </div>
  )

}

import React, {useEffect} from 'react'
import './main.css';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import {useDispatch, useSelector} from 'react-redux';
import {makeStyles} from '@material-ui/styles';
import {Skeleton} from '@material-ui/lab';
import ProjectsList from './ProjectsList';
import {fetchOrganizations} from '../../services/profile_service';
import {profileSelectors, selectOrganization} from '../../store/slices/profile_slice';

const useStyles = makeStyles({
  selected: {
    backgroundColor: 'red',
  },
  root: {
    color: '#000',
  },
});

export default function OrganizationsList(props: any) {

  const classes = useStyles();
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

      {organizationsLoading && <div className='line-skeleton-container'>
        <Skeleton className='line-skeleton'/>
      </div>}

      {organizations && !organizations.length && (
        <div>No projects for this organization</div>
      )}

      {organizations && organizations.length && organizations.map(o => (
        <div key={o.id}>
          <List
            disablePadding>
            <ListItem
              key='organization'
              classes={{
                selected: classes.selected,
                root: classes.root,
              }}>
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

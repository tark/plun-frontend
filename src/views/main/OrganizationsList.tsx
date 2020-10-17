import {object, string, func} from 'prop-types'
import React, {useEffect, useState} from 'react'
import './main.css';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import BusinessIcon from '@material-ui/icons/Business';
import Divider from '@material-ui/core/Divider';
import {getOrganizations} from '../../api/plun_api';
import ProjectsList from './ProjectsList';
import Loader from '../components/loader';
import {Organization, Project} from '../../api/models/models';

interface OrganizationsListProps {
  token: string;
  onChangeOrganization: Function;
  onChangeProject: Function;
}

export default function OrganizationsList(props: OrganizationsListProps) {

  const [organizations, setOrganizations] = useState<Array<Organization>>()
  const [fetchingOrganizations, setFetchingOrganizations] = useState(false)
  const [selectedOrganization, setSelectedOrganization] = useState<Organization>()

  const {token, onChangeOrganization, onChangeProject} = props

  useEffect(() => {
    fetchOrganizations().then()
  }, [token])

  const fetchOrganizations = async () => {
    setFetchingOrganizations(true)
    const orgs = await getOrganizations(token)
    setOrganizations(orgs)
    selectOrganization(orgs[0])
    setFetchingOrganizations(false)
  }

  const selectOrganization = (o: Organization) => {
    setSelectedOrganization(o)
    if (onChangeOrganization) {
      onChangeOrganization(o)
    }
  }

  const onProjectSelected = (p: Project) => {
    if (onChangeProject) {
      onChangeProject(p)
    }
  }

  return (
    <div>

      {fetchingOrganizations && <Loader/>}

      {organizations && !organizations.length && (
        <div>No projects for this organization</div>
      )}

      {organizations && organizations.length && organizations.map(o => (
        <div>
          <List>
            <ListItem
              button
              key='project'
              selected={selectedOrganization?.azureId === o.azureId}
              onClick={() => selectOrganization(o)}>
              <ListItemIcon><BusinessIcon/></ListItemIcon>
              <ListItemText primary={o.name}/>
            </ListItem>
            <ProjectsList
              organization={o}
              token={token}
              onChange={onProjectSelected}
            />
          </List>
          <Divider/>
        </div>
      ))}

    </div>
  )

}

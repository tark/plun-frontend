import React, {useEffect} from 'react'
import './main.css';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {useDispatch, useSelector} from 'react-redux';
import Loader from '../components/loader';
import {Organization} from '../../api/models/models';
import {profileSelectors, selectProject} from '../../store/slices/profile_slice';
import {fetchProjects} from '../../services/profile_service';

interface ProjectsListProps {
  organization: Organization;
}

export default function ProjectsList(props: ProjectsListProps) {
  const dispatch = useDispatch()
  const projects = useSelector(profileSelectors.projects)
  const projectsLoading = useSelector(profileSelectors.projectsLoading)
  const selectedOrganization = useSelector(profileSelectors.selectedOrganization)
  const selectedProject = useSelector(profileSelectors.selectedProject)
  const {organization} = props

  useEffect(() => {
    dispatch(fetchProjects(organization.name))
  }, [])


  useEffect(() => {
    // once projects is loaded and our organization is the selected - we will select
    // first projects from the given
    if (projects && organization.id === selectedOrganization?.id) {
      dispatch(selectProject(projects[0]))
    }
  }, [projects])


  return (
    <div>

      {projectsLoading && <Loader/>}

      {projects && !projects.length && (
        <div>No projects for this organization</div>
      )}

      {projects && projects.length && projects.map(p => (
        <List key={p.id}>
          <ListItem
            button
            key={`${p.id}-item`}
            onClick={(e) => dispatch(selectProject(p))}
            selected={selectedProject?.azureId === p.azureId}
          >
            <ListItemIcon/>
            <ListItemText primary={p.name}/>
          </ListItem>
        </List>
      ))}

    </div>
  )

}



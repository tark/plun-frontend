import React, {useEffect} from 'react'
import './main.css';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {useDispatch, useSelector} from 'react-redux';
import {makeStyles} from '@material-ui/styles';
import {Skeleton} from '@material-ui/lab';
import {Organization} from '../../api/models/models';
import {profileSelectors, selectProject} from '../../store/slices/profile_slice';
import {fetchProjects} from '../../services/profile_service';

interface ProjectsListProps {
  organization: Organization;
}

const useStyles = makeStyles({
  selected: {
    fontWeight: 'bold',
  },
});

export default function ProjectsList(props: ProjectsListProps) {
  const classes = useStyles();
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

      {projectsLoading && <div className='line-skeleton-container'>
        <Skeleton className='line-skeleton'/>
      </div>}

      {projects && !projects.length && (
        <div>No projects for this organization</div>
      )}

      {projects && projects.length && projects.map(p => (
        <List key={p.id} disablePadding>
          <ListItem
            button
            key={`${p.id}-item`}
            onClick={(e) => dispatch(selectProject(p))}
            selected={selectedProject?.azureId === p.azureId}
            classes={{
              selected: classes.selected,
            }}
          >
            <ListItemText
              disableTypography
              primary={<div className='pl-4'>{p.name}</div>}
            />
          </ListItem>
        </List>
      ))}

    </div>
  )

}



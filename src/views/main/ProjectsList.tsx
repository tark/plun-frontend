import {object, string, func} from 'prop-types'
import React, {useEffect, useState} from 'react'
import './main.css';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {getProjects} from '../../api/plun_api';
import Loader from '../components/loader';
import {Organization, Project} from '../../api/models/models';


interface ProjectsListProps {
  token: string;
  organization: Organization;
  onChange: Function;
}

export default function ProjectsList(props: ProjectsListProps) {

  const [projects, setProjects] = useState<Array<Project>>()
  const [fetchingProjects, setFetchingProjects] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project>()

  const {token, organization, onChange} = props

  useEffect(() => {
    fetchProjects().then()
  }, [token, organization])

  const fetchProjects = async () => {
    console.log(`fetchProjects - ${organization.name}`)
    setFetchingProjects(true)
    const myProjects = await getProjects(organization.name, token);
    setProjects(myProjects);
    selectProject(myProjects[0]);
    setFetchingProjects(false)
  }

  const selectProject = (p: Project) => {
    setSelectedProject(p)
    if (onChange) {
      onChange(p)
    }
  }

  return (
    <div>

      {fetchingProjects && <Loader/>}

      {projects && !projects.length && (
        <div>No projects for this organization</div>
      )}

      {projects && projects.length && projects.map(p => (
        <List key={p.id}>
          <ListItem
            button
            key={`${p.id}-item`}
            onClick={(e) => selectProject(p)}
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



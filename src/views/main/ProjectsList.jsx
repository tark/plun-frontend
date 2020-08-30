import {object, string, func} from 'prop-types'
import React, {useEffect, useState} from 'react'
import './main.css';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CircularProgress from '@material-ui/core/CircularProgress';
import {getProjects} from '../../api/plun_api';
import Loader from "../components/loader";

export default function ProjectsList(props) {

  const [projects, setProjects] = useState(null)
  const [fetchingProjects, setFetchingProjects] = useState(false)
  const [selectedProject, setSelectedProject] = useState(false)

  const {token, organization, onChange} = props

  useEffect(() => {
    fetchProjects().then()
  }, [token, organization])

  const fetchProjects = async () => {
    console.log(`fetchProjects - ${organization.name}, ${token}`)
    setFetchingProjects(true)
    const myProjects = await getProjects(organization.name, token);
    setProjects(myProjects);
    selectProject(myProjects[0]);
    setFetchingProjects(false)
  }

  const selectProject = (p) => {
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
        <List>
          <ListItem
            button
            key='project'
            click={() => selectProject(p)}
            selected={selectedProject.azureId === p.azureId}
          >
            <ListItemIcon/>
            <ListItemText primary={p.name}/>
          </ListItem>
        </List>
      ))}

    </div>
  )

}

ProjectsList.propTypes = {
  token: string,
  organization: object,
  onChange: func,
}


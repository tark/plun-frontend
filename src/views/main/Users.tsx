import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {usersSelectors} from '../../store/slices/users_slice';
import './users.css';
import {profileSelectors} from '../../store/slices/profile_slice';
import {fetchUsers} from '../../services/users_service';

export default function Users() {

  const users = useSelector(usersSelectors.users)
  const selectedOrganization = useSelector(profileSelectors.selectedOrganization)
  const selectedProject = useSelector(profileSelectors.selectedProject)
  const dispatch = useDispatch()

  useEffect(() => {
    if (selectedOrganization && selectedProject) {
      dispatch(fetchUsers({
        organizationName: selectedOrganization.name,
        projectName: selectedProject.name,
      }))
    }
  }, [selectedOrganization, selectedProject])

  return <div className='users'>
    {users && users.map(u => <div className='user_name'>{u.name}</div>)}
  </div>

}
